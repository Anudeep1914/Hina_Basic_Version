import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

const userDataPath = app.getPath('userData')
const dbPath = path.join(userDataPath, 'hina.db')

// Ensure directory exists
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true })
}

const db = new Database(dbPath)

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL')

// Initialize database schema
export function initDatabase() {
  // Tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER DEFAULT 0,
      time_worked INTEGER DEFAULT 0,
      deadline TEXT,
      workspace_id INTEGER,
      priority TEXT DEFAULT 'medium',
      created_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT
    )
  `)

  // Pomodoros table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pomodoros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER,
      started_at TEXT,
      ended_at TEXT,
      duration INTEGER,
      completed INTEGER DEFAULT 0
    )
  `)

  // Habits table
  db.exec(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '⭐',
      color TEXT DEFAULT '#FF6B9D',
      frequency TEXT DEFAULT 'daily',
      time TEXT,
      streak INTEGER DEFAULT 0,
      goal INTEGER DEFAULT 30,
      created_at TEXT DEFAULT (datetime('now')),
      active INTEGER DEFAULT 1
    )
  `)

  // Habit logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      done INTEGER DEFAULT 0,
      done_at TEXT,
      UNIQUE(habit_id, date)
    )
  `)

  // App usage table
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_name TEXT NOT NULL,
      date TEXT NOT NULL,
      minutes INTEGER DEFAULT 0,
      UNIQUE(app_name, date)
    )
  `)

  // Workspaces table
  db.exec(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '⊞',
      color TEXT DEFAULT '#FF6B9D',
      description TEXT,
      items TEXT DEFAULT '[]',
      last_launched TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  // Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at TEXT DEFAULT (datetime('now')),
      ended_at TEXT,
      tasks_done INTEGER DEFAULT 0,
      pomodoros_done INTEGER DEFAULT 0
    )
  `)

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `)

  // Insert default settings if not exists
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number }
  if (settingsCount.count === 0) {
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)')
    insertSetting.run('hina_name', 'Hina')
    insertSetting.run('theme', 'dark')
    insertSetting.run('robot_ip', '')
    insertSetting.run('pomodoro_duration', '1500')
    insertSetting.run('short_break', '300')
    insertSetting.run('long_break', '900')
    insertSetting.run('user_name', '')
  }

  // Insert seed data if tables are empty
  const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number }
  if (taskCount.count === 0) {
    const insertTask = db.prepare('INSERT INTO tasks (title, done, priority) VALUES (?, ?, ?)')
    insertTask.run('Set up Hina dashboard', 1, 'medium')
    insertTask.run('Try your first Pomodoro', 0, 'high')
    insertTask.run('Add your daily habits', 0, 'medium')
  }

  const habitCount = db.prepare('SELECT COUNT(*) as count FROM habits').get() as { count: number }
  if (habitCount.count === 0) {
    const insertHabit = db.prepare('INSERT INTO habits (name, icon, color, frequency, time) VALUES (?, ?, ?, ?, ?)')
    insertHabit.run('Drink water', '💧', '#4FC3F7', 'every 30m', '')
    insertHabit.run('Take a break', '☕', '#FFA726', 'every 90m', '')
    insertHabit.run('End of day review', '📝', '#B57BFF', 'daily', '18:00')
  }

  const workspaceCount = db.prepare('SELECT COUNT(*) as count FROM workspaces').get() as { count: number }
  if (workspaceCount.count === 0) {
    const insertWorkspace = db.prepare('INSERT INTO workspaces (name, icon, description, items) VALUES (?, ?, ?, ?)')
    insertWorkspace.run('Coding', '💻', 'Development workspace', JSON.stringify([
      { type: 'URL', name: 'GitHub', detail: 'github.com', path: 'https://github.com' },
      { type: 'URL', name: 'Stack Overflow', detail: 'stackoverflow.com', path: 'https://stackoverflow.com' }
    ]))
    insertWorkspace.run('Research', '📚', 'Research workspace', JSON.stringify([
      { type: 'URL', name: 'Google Scholar', detail: 'scholar.google.com', path: 'https://scholar.google.com' }
    ]))
  }

  console.log('Database initialized at:', dbPath)
}

export default db
