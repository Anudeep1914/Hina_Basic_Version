import { create } from 'zustand'

interface PomodoroStore {
  isRunning: boolean
  timeLeft: number
  currentTaskId: number | null
  todayCount: number
  start: (taskId?: number) => void
  pause: () => void
  reset: () => void
  tick: () => void
}

export const usePomodoroStore = create<PomodoroStore>((set) => ({
  isRunning: false,
  timeLeft: 1500,
  currentTaskId: null,
  todayCount: 0,
  start: (taskId) => {
    set({ isRunning: true, currentTaskId: taskId || null })
  },
  pause: () => {
    set({ isRunning: false })
  },
  reset: () => {
    set({ isRunning: false, timeLeft: 1500, currentTaskId: null })
  },
  tick: () => {
    set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) }))
  }
}))
