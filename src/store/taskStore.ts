import { create } from 'zustand'
import type { Task } from '../types'

interface TaskStore {
  tasks: Task[]
  loading: boolean
  fetchTasks: () => Promise<void>
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  completeTask: (id: number) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  fetchTasks: async () => {
    set({ loading: true })
    // Will be implemented later
    set({ loading: false })
  },
  addTask: async (task) => {
    // Will be implemented later
  },
  updateTask: async (id, updates) => {
    // Will be implemented later
  },
  deleteTask: async (id) => {
    // Will be implemented later
  },
  completeTask: async (id) => {
    // Will be implemented later
  }
}))
