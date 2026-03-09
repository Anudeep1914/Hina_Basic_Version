import { useEffect, useState } from 'react'

function StatsScreen() {
  const [stats, setStats] = useState({ screenTime: 0, tasksCompleted: 0, pomodorosDone: 0, habitsCompleted: 0 })
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')

  useEffect(() => {
    loadStats()
  }, [viewMode])

  const loadStats = async () => {
    if (window.hina) {
      const data = viewMode === 'day'
        ? await window.hina.getTodayStats()
        : await window.hina.getWeekStats()
      setStats(data)
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="p-6">
      {/* Header with toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stats</h1>
        <div className="flex gap-2 bg-bg-card border border-border rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded ${viewMode === 'day' ? 'bg-hina-pink text-white' : 'text-text-secondary'}`}
            onClick={() => setViewMode('day')}
          >
            Day
          </button>
          <button
            className={`px-4 py-2 rounded ${viewMode === 'week' ? 'bg-hina-pink text-white' : 'text-text-secondary'}`}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass border border-border rounded-lg p-6 card-3d animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-text-secondary text-sm mb-2">Screen Time</div>
          <div className="text-3xl font-bold gradient-text mb-1">{formatTime(stats.screenTime)}</div>
          <div className="text-xs text-text-muted">+0% vs yesterday</div>
        </div>
        <div className="glass border border-border rounded-lg p-6 card-3d animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-text-secondary text-sm mb-2">Tasks Completed</div>
          <div className="text-3xl font-bold text-green mb-1">{stats.tasksCompleted}</div>
          <div className="text-xs text-text-muted">Great job!</div>
        </div>
        <div className="glass border border-border rounded-lg p-6 card-3d animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="text-text-secondary text-sm mb-2">Pomodoros</div>
          <div className="text-3xl font-bold text-hina-pink mb-1">{stats.pomodorosDone}</div>
          <div className="text-xs text-text-muted">Focus sessions</div>
        </div>
        <div className="glass border border-border rounded-lg p-6 card-3d animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-text-secondary text-sm mb-2">Habits Done</div>
          <div className="text-3xl font-bold text-orange mb-1">{stats.habitsCompleted}</div>
          <div className="text-xs text-text-muted">Keep it up!</div>
        </div>
      </div>

      {/* Hourly Activity Chart Placeholder */}
      <div className="glass border border-border rounded-lg p-6 mb-6 card-3d">
        <h2 className="text-lg font-semibold mb-4 gradient-text">Hourly Activity</h2>
        <div className="h-48 flex items-end gap-2">
          {[...Array(14)].map((_, i) => {
            const height = Math.random() * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div
                  className="w-full bg-gradient-to-t from-hina-pink to-hina-purple rounded-t transition-all duration-300 hover:from-hina-purple hover:to-blue"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-text-muted mt-2">{8 + i}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="glass border border-border rounded-lg p-6 card-3d">
        <h2 className="text-lg font-semibold mb-4 gradient-text">Activity Log</h2>
        <div className="text-text-muted text-center py-8">No activity recorded yet</div>
      </div>
    </div>
  )
}

export default StatsScreen
