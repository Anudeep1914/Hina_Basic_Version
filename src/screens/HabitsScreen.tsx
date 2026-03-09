import { useEffect, useState } from 'react'
import { Plus, Check, Clock, X, RefreshCw } from 'lucide-react'
import type { Habit, HabitLog } from '../types'

function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<Record<number, HabitLog[]>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: '⭐',
    color: '#FF6B9D',
    frequency: 'daily',
    time: '',
    goal: 30
  })

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = async () => {
    if (window.hina) {
      const allHabits = await window.hina.getHabits()
      setHabits(allHabits)

      // Load logs for each habit
      const logs: Record<number, HabitLog[]> = {}
      for (const habit of allHabits) {
        const habitLogs = await window.hina.getHabitLogs(habit.id, 7)
        logs[habit.id] = habitLogs
      }
      setHabitLogs(logs)
    }
  }

  const handleAddHabit = async () => {
    if (!newHabit.name.trim() || !window.hina) return

    await window.hina.addHabit(newHabit)
    await loadHabits()
    setShowAddForm(false)
    setNewHabit({
      name: '',
      icon: '⭐',
      color: '#FF6B9D',
      frequency: 'daily',
      time: '',
      goal: 30
    })
  }

  const handleMarkDone = async (habitId: number) => {
    if (!window.hina) return

    const today = new Date().toISOString().split('T')[0]
    await window.hina.logHabit(habitId, today, true)
    await loadHabits()
  }

  const todayLogs = Object.values(habitLogs).flat().filter(log => {
    const today = new Date().toISOString().split('T')[0]
    return log.date === today && log.done
  })

  const activeHabits = habits.filter(h => {
    const today = new Date().toISOString().split('T')[0]
    const todayLog = habitLogs[h.id]?.find(log => log.date === today)
    return !todayLog || !todayLog.done
  })

  const completedHabits = habits.filter(h => {
    const today = new Date().toISOString().split('T')[0]
    const todayLog = habitLogs[h.id]?.find(log => log.date === today)
    return todayLog && todayLog.done
  })

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Habits & Reminders</h1>
          <p className="text-hina-pink font-semibold mt-1 animate-pulse">
            {todayLogs.length}/{habits.length} done today
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-hina-pink to-hina-purple text-white rounded-lg transition-all duration-300 flex items-center gap-2 btn-3d"
        >
          <Plus size={18} />
          Add Habit
        </button>
      </div>

      {/* Add Habit Form */}
      {showAddForm && (
        <div className="glass border border-border rounded-lg p-6 mb-6 card-3d animate-slide-in-up">
          <h3 className="text-lg font-semibold mb-4">Add New Habit</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Name</label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                placeholder="Habit name"
                className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Icon (emoji)</label>
              <input
                type="text"
                value={newHabit.icon}
                onChange={(e) => setNewHabit({ ...newHabit, icon: e.target.value })}
                placeholder="⭐"
                className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Frequency</label>
              <select
                value={newHabit.frequency}
                onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink"
              >
                <option value="daily">Daily</option>
                <option value="every 30m">Every 30 minutes</option>
                <option value="every 90m">Every 90 minutes</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Time (optional)</label>
              <input
                type="time"
                value={newHabit.time}
                onChange={(e) => setNewHabit({ ...newHabit, time: e.target.value })}
                className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddHabit}
              className="px-6 py-2 bg-hina-pink text-white rounded-lg hover:bg-hina-pink/80 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-bg-input border border-border text-text-primary rounded-lg hover:border-hina-pink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Habits */}
      {activeHabits.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-secondary mb-4 uppercase">Active</h2>
          <div className="space-y-3">
            {activeHabits.map((habit) => (
              <div
                key={habit.id}
                className="glass border border-border rounded-lg p-4 transition-all duration-300 card-3d animate-slide-in-up"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 animate-pulse-scale"
                    style={{ backgroundColor: habit.color + '20' }}
                  >
                    {habit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-text-primary">{habit.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-text-secondary mt-1">
                      <span>{habit.frequency}</span>
                      {habit.time && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {habit.time}
                        </span>
                      )}
                      <span className="text-orange">{habit.streak}🔥 streak</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkDone(habit.id)}
                      className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 btn-3d"
                      style={{ backgroundColor: habit.color }}
                    >
                      ✓ Did it
                    </button>
                    <button className="px-3 py-2 glass border border-border text-text-muted rounded-lg hover:border-hina-pink transition-all duration-300 hover:scale-110">
                      ⏰
                    </button>
                    <button className="px-3 py-2 glass border border-border text-text-muted rounded-lg hover:border-hina-pink transition-all duration-300 hover:scale-110">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Habits */}
      {completedHabits.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-secondary mb-4 uppercase">Completed Today</h2>
          <div className="space-y-3">
            {completedHabits.map((habit) => (
              <div
                key={habit.id}
                className="bg-bg-card border border-border rounded-lg p-4 opacity-60"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green/20 flex items-center justify-center flex-shrink-0">
                    <Check size={24} className="text-green" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-text-secondary">{habit.name}</h3>
                    <p className="text-sm text-green mt-1">✓ Done</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Grid */}
      <div>
        <h2 className="text-sm font-semibold text-text-secondary mb-4 uppercase">Weekly Progress</h2>
        <div className="glass border border-border rounded-lg p-6 card-3d">
          <div className="grid grid-cols-8 gap-2 text-xs text-text-secondary mb-2">
            <div></div>
            <div className="text-center">Mon</div>
            <div className="text-center">Tue</div>
            <div className="text-center">Wed</div>
            <div className="text-center">Thu</div>
            <div className="text-center">Fri</div>
            <div className="text-center">Sat</div>
            <div className="text-center">Sun</div>
          </div>
          {habits.map((habit) => (
            <div key={habit.id} className="grid grid-cols-8 gap-2 py-2 border-t border-border">
              <div className="text-sm text-text-primary truncate">{habit.name}</div>
              {[...Array(7)].map((_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - i))
                const dateStr = date.toISOString().split('T')[0]
                const log = habitLogs[habit.id]?.find(l => l.date === dateStr)
                const isToday = dateStr === new Date().toISOString().split('T')[0]

                return (
                  <div
                    key={i}
                    className={`h-8 rounded flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                      log && log.done
                        ? 'bg-gradient-to-br from-green/40 to-green/20 animate-pulse-scale'
                        : isToday
                        ? 'glass border border-hina-pink animate-glow'
                        : 'bg-bg-input hover:bg-bg-card'
                    }`}
                  >
                    {log && log.done && <Check size={14} className="text-green" />}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HabitsScreen
