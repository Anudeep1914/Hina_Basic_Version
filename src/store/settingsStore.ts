import { create } from 'zustand'

interface SettingsStore {
  settings: Record<string, string>
  fetchSettings: () => Promise<void>
  setSetting: (key: string, value: string) => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {},
  fetchSettings: async () => {
    // Will be implemented later
  },
  setSetting: async (key, value) => {
    // Will be implemented later
  }
}))
