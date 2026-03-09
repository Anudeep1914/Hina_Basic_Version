import { create } from 'zustand'
import type { Habit, HabitLog } from '../types'

interface HabitStore {
  habits: Habit[]
  logs: HabitLog[]
  fetchHabits: () => Promise<void>
  fetchLogs: () => Promise<void>
  markDone: (habitId: number) => Promise<void>
  addHabit: (habit: Omit<Habit, 'id'>) => Promise<void>
}

export const useHabitStore = create<HabitStore>((set) => ({
  habits: [],
  logs: [],
  fetchHabits: async () => {
    // Will be implemented later
  },
  fetchLogs: async () => {
    // Will be implemented later
  },
  markDone: async (habitId) => {
    // Will be implemented later
  },
  addHabit: async (habit) => {
    // Will be implemented later
  }
}))
