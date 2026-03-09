import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'
import { WebSocketServer, WebSocket } from 'ws'
import db, { initDatabase } from './database'

let mainWindow: BrowserWindow | null = null
let wss: WebSocketServer | null = null
let robotClient: WebSocket | null = null
let dashboardClient: WebSocket | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    minWidth: 900,
    height: 700,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0A0A10',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

function startWebSocketServer() {
  wss = new WebSocketServer({ port: 8765 })

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected')

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString())

        // Identify client type
        if (data.type === 'dashboard') {
          dashboardClient = ws
          console.log('Dashboard connected')
        } else if (data.type === 'robot') {
          robotClient = ws
          console.log('Robot connected')
        }

        // Bridge messages between dashboard and robot
        if (ws === dashboardClient && robotClient && robotClient.readyState === WebSocket.OPEN) {
          robotClient.send(JSON.stringify(data))
        } else if (ws === robotClient && dashboardClient && dashboardClient.readyState === WebSocket.OPEN) {
          dashboardClient.send(JSON.stringify(data))
        }
      } catch (error) {
        console.error('WebSocket message error:', error)
      }
    })

    ws.on('close', () => {
      if (ws === robotClient) {
        robotClient = null
        console.log('Robot disconnected')
      } else if (ws === dashboardClient) {
        dashboardClient = null
        console.log('Dashboard disconnected')
      }
    })
  })

  console.log('WebSocket server started on port 8765')
}

app.whenReady().then(() => {
  initDatabase()
  createWindow()
  startWebSocketServer()
  registerIPCHandlers()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function registerIPCHandlers() {
  // Window controls
  ipcMain.handle('minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.handle('maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.handle('close', () => {
    mainWindow?.close()
  })

  // Tasks
  ipcMain.handle('get-tasks', () => {
    return db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all()
  })

  ipcMain.handle('add-task', (_, task) => {
    const result = db.prepare(`
      INSERT INTO tasks (title, priority, deadline, workspace_id)
      VALUES (?, ?, ?, ?)
    `).run(task.title, task.priority || 'medium', task.deadline, task.workspace_id)
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid)
  })

  ipcMain.handle('update-task', (_, id, updates) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ')
    const values = Object.values(updates)
    db.prepare(`UPDATE tasks SET ${fields} WHERE id = ?`).run(...values, id)
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
  })

  ipcMain.handle('delete-task', (_, id) => {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
  })

  ipcMain.handle('complete-task', (_, id) => {
    db.prepare(`
      UPDATE tasks SET done = 1, completed_at = datetime('now')
      WHERE id = ?
    `).run(id)
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
  })

  // Pomodoros
  ipcMain.handle('start-pomodoro', (_, taskId) => {
    const result = db.prepare(`
      INSERT INTO pomodoros (task_id, started_at, duration)
      VALUES (?, datetime('now'), 1500)
    `).run(taskId)
    return db.prepare('SELECT * FROM pomodoros WHERE id = ?').get(result.lastInsertRowid)
  })

  ipcMain.handle('end-pomodoro', (_, id, completed) => {
    db.prepare(`
      UPDATE pomodoros SET ended_at = datetime('now'), completed = ?
      WHERE id = ?
    `).run(completed ? 1 : 0, id)
  })

  ipcMain.handle('get-today-pomodoros', () => {
    return db.prepare(`
      SELECT * FROM pomodoros
      WHERE date(started_at) = date('now')
      ORDER BY started_at DESC
    `).all()
  })

  // Habits
  ipcMain.handle('get-habits', () => {
    return db.prepare('SELECT * FROM habits WHERE active = 1 ORDER BY created_at').all()
  })

  ipcMain.handle('add-habit', (_, habit) => {
    const result = db.prepare(`
      INSERT INTO habits (name, icon, color, frequency, time, goal)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(habit.name, habit.icon, habit.color, habit.frequency, habit.time, habit.goal || 30)
    return db.prepare('SELECT * FROM habits WHERE id = ?').get(result.lastInsertRowid)
  })

  ipcMain.handle('update-habit', (_, id, updates) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ')
    const values = Object.values(updates)
    db.prepare(`UPDATE habits SET ${fields} WHERE id = ?`).run(...values, id)
    return db.prepare('SELECT * FROM habits WHERE id = ?').get(id)
  })

  ipcMain.handle('delete-habit', (_, id) => {
    db.prepare('UPDATE habits SET active = 0 WHERE id = ?').run(id)
  })

  ipcMain.handle('log-habit', (_, habitId, date, done) => {
    db.prepare(`
      INSERT OR REPLACE INTO habit_logs (habit_id, date, done, done_at)
      VALUES (?, ?, ?, datetime('now'))
    `).run(habitId, date, done ? 1 : 0)

    // Update streak
    if (done) {
      const habit = db.prepare('SELECT streak FROM habits WHERE id = ?').get(habitId) as any
      db.prepare('UPDATE habits SET streak = ? WHERE id = ?').run((habit?.streak || 0) + 1, habitId)
    }
  })

  ipcMain.handle('get-habit-logs', (_, habitId, days) => {
    return db.prepare(`
      SELECT * FROM habit_logs
      WHERE habit_id = ?
      AND date >= date('now', '-' || ? || ' days')
      ORDER BY date DESC
    `).all(habitId, days)
  })

  ipcMain.handle('get-weekly-habit-grid', () => {
    const habits = db.prepare('SELECT * FROM habits WHERE active = 1').all()
    return habits.map((habit: any) => {
      const logs = db.prepare(`
        SELECT * FROM habit_logs
        WHERE habit_id = ?
        AND date >= date('now', '-7 days')
        ORDER BY date
      `).all(habit.id)
      return { habit, logs }
    })
  })

  // Workspaces
  ipcMain.handle('get-workspaces', () => {
    const workspaces = db.prepare('SELECT * FROM workspaces ORDER BY created_at').all()
    return workspaces.map((ws: any) => ({
      ...ws,
      items: JSON.parse(ws.items || '[]')
    }))
  })

  ipcMain.handle('add-workspace', (_, ws) => {
    const result = db.prepare(`
      INSERT INTO workspaces (name, icon, color, description, items)
      VALUES (?, ?, ?, ?, ?)
    `).run(ws.name, ws.icon, ws.color, ws.description, JSON.stringify(ws.items || []))
    const workspace = db.prepare('SELECT * FROM workspaces WHERE id = ?').get(result.lastInsertRowid) as any
    return { ...workspace, items: JSON.parse(workspace.items || '[]') }
  })

  ipcMain.handle('update-workspace', (_, id, updates) => {
    if (updates.items) {
      updates.items = JSON.stringify(updates.items)
    }
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ')
    const values = Object.values(updates)
    db.prepare(`UPDATE workspaces SET ${fields} WHERE id = ?`).run(...values, id)
    const workspace = db.prepare('SELECT * FROM workspaces WHERE id = ?').get(id) as any
    return { ...workspace, items: JSON.parse(workspace.items || '[]') }
  })

  ipcMain.handle('delete-workspace', (_, id) => {
    db.prepare('DELETE FROM workspaces WHERE id = ?').run(id)
  })

  ipcMain.handle('launch-workspace', (_, id) => {
    const workspace = db.prepare('SELECT * FROM workspaces WHERE id = ?').get(id) as any
    if (workspace) {
      const items = JSON.parse(workspace.items || '[]')
      items.forEach((item: any) => {
        shell.openExternal(item.path)
      })
      db.prepare('UPDATE workspaces SET last_launched = datetime("now") WHERE id = ?').run(id)
    }
  })

  // Stats
  ipcMain.handle('get-today-stats', () => {
    const tasksCompleted = db.prepare(`
      SELECT COUNT(*) as count FROM tasks
      WHERE date(completed_at) = date('now')
    `).get() as any

    const pomodorosDone = db.prepare(`
      SELECT COUNT(*) as count FROM pomodoros
      WHERE date(started_at) = date('now') AND completed = 1
    `).get() as any

    const habitsCompleted = db.prepare(`
      SELECT COUNT(*) as count FROM habit_logs
      WHERE date = date('now') AND done = 1
    `).get() as any

    return {
      screenTime: 0,
      tasksCompleted: tasksCompleted.count,
      pomodorosDone: pomodorosDone.count,
      habitsCompleted: habitsCompleted.count
    }
  })

  ipcMain.handle('get-week-stats', () => {
    // Similar to today stats but for the week
    return {
      screenTime: 0,
      tasksCompleted: 0,
      pomodorosDone: 0,
      habitsCompleted: 0
    }
  })

  ipcMain.handle('get-activity-log', (_, date) => {
    // Return activity entries for a specific date
    return []
  })

  // App Usage
  ipcMain.handle('get-app-usage', (_, date) => {
    return db.prepare('SELECT * FROM app_usage WHERE date = ?').all(date)
  })

  ipcMain.handle('get-weekly-app-usage', () => {
    return db.prepare(`
      SELECT * FROM app_usage
      WHERE date >= date('now', '-7 days')
      ORDER BY date, minutes DESC
    `).all()
  })

  ipcMain.handle('log-app-usage', (_, appName, minutes) => {
    db.prepare(`
      INSERT OR REPLACE INTO app_usage (app_name, date, minutes)
      VALUES (?, date('now'), ?)
    `).run(appName, minutes)
  })

  // Settings
  ipcMain.handle('get-setting', (_, key) => {
    const result = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as any
    return result?.value
  })

  ipcMain.handle('set-setting', (_, key, value) => {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value)
  })

  ipcMain.handle('get-all-settings', () => {
    const rows = db.prepare('SELECT * FROM settings').all() as any[]
    const settings: Record<string, string> = {}
    rows.forEach(row => {
      settings[row.key] = row.value
    })
    return settings
  })

  // Robot
  ipcMain.handle('send-to-robot', (_, cmd) => {
    if (robotClient && robotClient.readyState === WebSocket.OPEN) {
      robotClient.send(JSON.stringify(cmd))
    }
  })

  ipcMain.handle('get-robot-status', () => {
    return robotClient && robotClient.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'
  })
}
