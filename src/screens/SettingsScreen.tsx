import { useEffect, useState } from 'react'

declare global {
  interface Window {
    hina: {
      getSetting: (key: string) => Promise<string>
      setSetting: (key: string, value: string) => Promise<void>
      getAllSettings: () => Promise<Record<string, string>>
      getTasks: () => Promise<any[]>
      addTask: (task: any) => Promise<any>
      updateTask: (id: number, updates: any) => Promise<any>
      deleteTask: (id: number) => Promise<void>
      completeTask: (id: number) => Promise<any>
      getHabits: () => Promise<any[]>
      addHabit: (habit: any) => Promise<any>
      updateHabit: (id: number, updates: any) => Promise<any>
      deleteHabit: (id: number) => Promise<void>
      logHabit: (habitId: number, date: string, done: boolean) => Promise<void>
      getHabitLogs: (habitId: number, days: number) => Promise<any[]>
      getWeeklyHabitGrid: () => Promise<any[]>
      startPomodoro: (taskId?: number) => Promise<any>
      endPomodoro: (id: number, completed: boolean) => Promise<void>
      getTodayPomodoros: () => Promise<any[]>
      getWorkspaces: () => Promise<any[]>
      addWorkspace: (ws: any) => Promise<any>
      updateWorkspace: (id: number, updates: any) => Promise<any>
      deleteWorkspace: (id: number) => Promise<void>
      launchWorkspace: (id: number) => Promise<void>
      getTodayStats: () => Promise<any>
      getWeekStats: () => Promise<any>
      sendToRobot: (cmd: any) => Promise<void>
      getRobotStatus: () => Promise<string>
    }
  }
}

function SettingsScreen() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    if (window.hina) {
      const allSettings = await window.hina.getAllSettings()
      setSettings(allSettings)
    }
    setLoading(false)
  }

  const handleChange = async (key: string, value: string) => {
    if (window.hina) {
      await window.hina.setSetting(key, value)
      setSettings(prev => ({ ...prev, [key]: value }))
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <p className="text-text-secondary">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* HINA Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-hina-pink mb-4">HINA</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Your name</label>
            <input
              type="text"
              value={settings.user_name || ''}
              onChange={(e) => handleChange('user_name', e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Hina's display name</label>
            <input
              type="text"
              value={settings.hina_name || 'Hina'}
              onChange={(e) => handleChange('hina_name', e.target.value)}
              placeholder="Hina"
              className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Theme</label>
            <select
              value={settings.theme || 'dark'}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink transition-colors"
            >
              <option value="dark">Dark</option>
              <option value="light" disabled>Light (coming soon)</option>
            </select>
          </div>
        </div>
      </section>

      {/* ROBOT CONNECTION Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-hina-pink mb-4">ROBOT CONNECTION</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Robot IP address</label>
            <input
              type="text"
              value={settings.robot_ip || ''}
              onChange={(e) => handleChange('robot_ip', e.target.value)}
              placeholder="192.168.1.100"
              className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink transition-colors"
            />
            <p className="text-xs text-text-muted mt-1">Enter the IP address of your ESP32 robot</p>
          </div>
          <button className="px-4 py-2 bg-hina-purple text-white rounded-lg hover:bg-hina-purple/80 transition-colors">
            Test Connection
          </button>
        </div>
      </section>

      {/* POMODORO Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-hina-pink mb-4">POMODORO</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Work duration (minutes)</label>
            <input
              type="number"
              value={Math.floor(parseInt(settings.pomodoro_duration || '1500') / 60)}
              onChange={(e) => handleChange('pomodoro_duration', (parseInt(e.target.value) * 60).toString())}
              className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Short break (minutes)</label>
            <input
              type="number"
              value={Math.floor(parseInt(settings.short_break || '300') / 60)}
              onChange={(e) => handleChange('short_break', (parseInt(e.target.value) * 60).toString())}
              className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Long break (minutes)</label>
            <input
              type="number"
              value={Math.floor(parseInt(settings.long_break || '900') / 60)}
              onChange={(e) => handleChange('long_break', (parseInt(e.target.value) * 60).toString())}
              className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink transition-colors"
            />
          </div>
        </div>
      </section>

      {/* DATA Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-hina-pink mb-4">DATA</h2>
        <div className="space-y-3">
          <button className="w-full px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/80 transition-colors text-left">
            Export all data (JSON)
          </button>
          <button className="w-full px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange/80 transition-colors text-left">
            Clear completed tasks
          </button>
          <button className="w-full px-4 py-2 bg-red text-white rounded-lg hover:bg-red/80 transition-colors text-left">
            Reset all data
          </button>
        </div>
      </section>

      {/* ABOUT Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-hina-pink mb-4">ABOUT</h2>
        <div className="bg-bg-card border border-border rounded-lg p-4 space-y-2">
          <p className="text-sm text-text-secondary">Version: <span className="text-text-primary">0.1.0</span></p>
          <p className="text-sm text-text-secondary">
            GitHub: <a href="https://github.com/Anudeep1914/Hina_Basic_Version" className="text-hina-pink hover:underline">Hina Repository</a>
          </p>
          <p className="text-sm text-text-secondary">Built with ♥ by Hina team</p>
        </div>
      </section>
    </div>
  )
}

export default SettingsScreen
