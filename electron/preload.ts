import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('hina', {
  // Tasks
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  addTask: (task: any) => ipcRenderer.invoke('add-task', task),
  updateTask: (id: number, updates: any) => ipcRenderer.invoke('update-task', id, updates),
  deleteTask: (id: number) => ipcRenderer.invoke('delete-task', id),
  completeTask: (id: number) => ipcRenderer.invoke('complete-task', id),

  // Pomodoros
  startPomodoro: (taskId?: number) => ipcRenderer.invoke('start-pomodoro', taskId),
  endPomodoro: (id: number, completed: boolean) => ipcRenderer.invoke('end-pomodoro', id, completed),
  getTodayPomodoros: () => ipcRenderer.invoke('get-today-pomodoros'),

  // Habits
  getHabits: () => ipcRenderer.invoke('get-habits'),
  addHabit: (habit: any) => ipcRenderer.invoke('add-habit', habit),
  updateHabit: (id: number, updates: any) => ipcRenderer.invoke('update-habit', id, updates),
  deleteHabit: (id: number) => ipcRenderer.invoke('delete-habit', id),
  logHabit: (habitId: number, date: string, done: boolean) => ipcRenderer.invoke('log-habit', habitId, date, done),
  getHabitLogs: (habitId: number, days: number) => ipcRenderer.invoke('get-habit-logs', habitId, days),
  getWeeklyHabitGrid: () => ipcRenderer.invoke('get-weekly-habit-grid'),

  // App Usage
  getAppUsage: (date: string) => ipcRenderer.invoke('get-app-usage', date),
  getWeeklyAppUsage: () => ipcRenderer.invoke('get-weekly-app-usage'),
  logAppUsage: (appName: string, minutes: number) => ipcRenderer.invoke('log-app-usage', appName, minutes),

  // Workspaces
  getWorkspaces: () => ipcRenderer.invoke('get-workspaces'),
  addWorkspace: (ws: any) => ipcRenderer.invoke('add-workspace', ws),
  updateWorkspace: (id: number, updates: any) => ipcRenderer.invoke('update-workspace', id, updates),
  deleteWorkspace: (id: number) => ipcRenderer.invoke('delete-workspace', id),
  launchWorkspace: (id: number) => ipcRenderer.invoke('launch-workspace', id),

  // Stats
  getTodayStats: () => ipcRenderer.invoke('get-today-stats'),
  getWeekStats: () => ipcRenderer.invoke('get-week-stats'),
  getActivityLog: (date: string) => ipcRenderer.invoke('get-activity-log', date),

  // Settings
  getSetting: (key: string) => ipcRenderer.invoke('get-setting', key),
  setSetting: (key: string, value: string) => ipcRenderer.invoke('set-setting', key, value),
  getAllSettings: () => ipcRenderer.invoke('get-all-settings'),

  // Robot
  sendToRobot: (cmd: any) => ipcRenderer.invoke('send-to-robot', cmd),
  getRobotStatus: () => ipcRenderer.invoke('get-robot-status'),

  // Window controls
  minimize: () => ipcRenderer.invoke('minimize'),
  maximize: () => ipcRenderer.invoke('maximize'),
  close: () => ipcRenderer.invoke('close')
})
