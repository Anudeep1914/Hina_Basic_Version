export interface Task {
  id: number
  title: string
  done: boolean
  time_worked: number
  deadline: string | null
  workspace_id: number | null
  priority: 'low' | 'medium' | 'high'
  created_at: string
  completed_at: string | null
}

export interface Pomodoro {
  id: number
  task_id: number | null
  started_at: string
  ended_at: string | null
  duration: number
  completed: boolean
}

export interface Habit {
  id: number
  name: string
  icon: string
  color: string
  frequency: string
  time: string
  streak: number
  goal: number
  active: boolean
}

export interface HabitLog {
  id: number
  habit_id: number
  date: string
  done: boolean
  done_at: string | null
}

export interface Workspace {
  id: number
  name: string
  icon: string
  color: string
  description: string
  items: WorkspaceItem[]
  last_launched: string | null
}

export interface WorkspaceItem {
  type: 'APP' | 'URL' | 'FOLDER'
  name: string
  detail: string
  path: string
}

export interface AppUsage {
  app_name: string
  date: string
  minutes: number
}

export interface TodayStats {
  screenTime: number
  tasksCompleted: number
  pomodorosDone: number
  habitsCompleted: number
}

export interface ActivityEntry {
  time: string
  type: string
  name: string
  duration: number
}
