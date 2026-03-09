import { create } from 'zustand'
import type { Workspace } from '../types'

interface WorkspaceStore {
  workspaces: Workspace[]
  activeId: number | null
  fetchWorkspaces: () => Promise<void>
  setActive: (id: number) => void
  addWorkspace: (ws: Omit<Workspace, 'id'>) => Promise<void>
  launchWorkspace: (id: number) => Promise<void>
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  activeId: null,
  fetchWorkspaces: async () => {
    // Will be implemented later
  },
  setActive: (id) => {
    set({ activeId: id })
  },
  addWorkspace: async (ws) => {
    // Will be implemented later
  },
  launchWorkspace: async (id) => {
    // Will be implemented later
  }
}))
