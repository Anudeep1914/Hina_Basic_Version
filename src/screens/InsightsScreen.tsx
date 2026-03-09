import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, AlertCircle, Award } from 'lucide-react'

function InsightsScreen() {
  const [stats, setStats] = useState({ screenTime: 0, tasksCompleted: 0, pomodorosDone: 0, habitsCompleted: 0 })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    if (window.hina) {
      const data = await window.hina.getTodayStats()
      setStats(data)
    }
  }

  const insights = [
    {
      type: 'positive',
      icon: Award,
      color: 'green',
      title: 'Great start!',
      message: `You've completed ${stats.tasksCompleted} tasks today. Keep up the momentum!`
    },
    {
      type: 'info',
      icon: TrendingUp,
      color: 'blue',
      title: 'Peak productivity',
      message: 'Your most productive hours are typically between 9 AM - 11 AM'
    },
    {
      type: 'warning',
      icon: AlertCircle,
      color: 'orange',
      title: 'Habit reminder',
      message: 'You have 2 habits pending for today. Don\'t break your streak!'
    }
  ]

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Smart Insights</h1>

      {/* Weekly Summary Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-bg-card border border-border rounded-lg p-6">
          <div className="text-text-secondary text-sm mb-2">Tasks Done</div>
          <div className="text-3xl font-bold text-text-primary mb-2">{stats.tasksCompleted}</div>
          <div className="flex items-center gap-1 text-green text-sm">
            <TrendingUp size={14} />
            <span>+15% vs last week</span>
          </div>
        </div>
        <div className="bg-bg-card border border-border rounded-lg p-6">
          <div className="text-text-secondary text-sm mb-2">Focus Time</div>
          <div className="text-3xl font-bold text-text-primary mb-2">{stats.pomodorosDone * 25}m</div>
          <div className="flex items-center gap-1 text-green text-sm">
            <TrendingUp size={14} />
            <span>+8% vs last week</span>
          </div>
        </div>
        <div className="bg-bg-card border border-border rounded-lg p-6">
          <div className="text-text-secondary text-sm mb-2">Habits Kept</div>
          <div className="text-3xl font-bold text-text-primary mb-2">{Math.round((stats.habitsCompleted / 7) * 100)}%</div>
          <div className="flex items-center gap-1 text-red text-sm">
            <TrendingDown size={14} />
            <span>-5% vs last week</span>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Hina's Observations</h2>
        {insights.map((insight, i) => {
          const Icon = insight.icon
          return (
            <div
              key={i}
              className={`bg-bg-card border-l-4 border rounded-lg p-6 ${
                insight.color === 'green' ? 'border-l-green' :
                insight.color === 'blue' ? 'border-l-blue' :
                insight.color === 'orange' ? 'border-l-orange' :
                'border-l-hina-pink'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <Icon size={24} className={`text-${insight.color} flex-shrink-0 mt-1`} />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">{insight.title}</h3>
                    <p className="text-text-secondary">{insight.message}</p>
                  </div>
                </div>
                <button className="text-text-muted hover:text-text-primary">×</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InsightsScreen
