import { useEffect, useState } from 'react'
import { Check, Clock, Trash2, Plus } from 'lucide-react'
import type { Task } from '../types'

function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [activeTab, setActiveTab] = useState<'tasks' | 'focus' | 'history'>('tasks')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    if (window.hina) {
      const allTasks = await window.hina.getTasks()
      setTasks(allTasks)
    }
    setLoading(false)
  }

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !window.hina) return

    const newTask = await window.hina.addTask({
      title: newTaskTitle,
      priority: 'medium'
    })
    setTasks([newTask, ...tasks])
    setNewTaskTitle('')
  }

  const handleCompleteTask = async (id: number) => {
    if (!window.hina) return

    await window.hina.completeTask(id)
    setTasks(tasks.map(t => t.id === id ? { ...t, done: true, completed_at: new Date().toISOString() } : t))

    // Send to robot
    window.hina.sendToRobot({ cmd: 'task_complete' })
  }

  const handleDeleteTask = async (id: number) => {
    if (!window.hina) return

    await window.hina.deleteTask(id)
    setTasks(tasks.filter(t => t.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  const todoTasks = tasks.filter(t => !t.done)
  const completedTasks = tasks.filter(t => t.done)

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tasks</h1>
        <p className="text-text-secondary">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-border">
        <button
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
            activeTab === 'tasks'
              ? 'text-hina-pink'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
          {activeTab === 'tasks' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-hina-pink"></div>
          )}
        </button>
        <button
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
            activeTab === 'focus'
              ? 'text-hina-pink'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('focus')}
        >
          Focus
          {activeTab === 'focus' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-hina-pink"></div>
          )}
        </button>
        <button
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
            activeTab === 'history'
              ? 'text-hina-pink'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('history')}
        >
          History
          {activeTab === 'history' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-hina-pink"></div>
          )}
        </button>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="max-w-3xl">
          {/* Add task input */}
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="+ Add a task..."
              className="flex-1 bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-hina-pink transition-colors"
            />
            <button
              onClick={handleAddTask}
              className="px-6 py-3 bg-hina-pink text-white rounded-lg hover:bg-hina-pink/80 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </button>
          </div>

          {/* TO DO Section */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-text-secondary mb-4 uppercase">
              TO DO ({todoTasks.length})
            </h2>
            <div className="space-y-2">
              {todoTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-bg-card border border-border rounded-lg p-4 hover:border-hina-pink/30 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="w-5 h-5 rounded-full border-2 border-text-muted hover:border-hina-pink transition-colors flex-shrink-0 mt-0.5"
                    ></button>
                    <div className="flex-1">
                      <h3 className="text-text-primary font-medium mb-2">{task.title}</h3>
                      <div className="flex items-center gap-4 text-xs">
                        {task.time_worked > 0 && (
                          <span className="text-blue flex items-center gap-1">
                            <Clock size={12} />
                            {Math.floor(task.time_worked / 60)}m
                          </span>
                        )}
                        {task.priority && (
                          <span className={`px-2 py-0.5 rounded ${
                            task.priority === 'high' ? 'bg-red/20 text-red' :
                            task.priority === 'medium' ? 'bg-orange/20 text-orange' :
                            'bg-green/20 text-green'
                          }`}>
                            {task.priority}
                          </span>
                        )}
                        {task.deadline && (
                          <span className="text-orange">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {todoTasks.length === 0 && (
                <p className="text-text-muted text-center py-8">No tasks yet. Add one above!</p>
              )}
            </div>
          </div>

          {/* COMPLETED Section */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-text-secondary mb-4 uppercase">
                COMPLETED ({completedTasks.length})
              </h2>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-bg-card border border-border rounded-lg p-4 opacity-60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={14} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-text-secondary line-through">{task.title}</h3>
                        {task.completed_at && (
                          <p className="text-xs text-text-muted mt-1">
                            Completed {new Date(task.completed_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-text-muted hover:text-red transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Focus Tab */}
      {activeTab === 'focus' && (
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <svg width="80" height="80" className="mx-auto mb-4">
              <circle cx="40" cy="40" r="38" fill="none" stroke="#FF6B9D" strokeWidth="2" />
              <circle cx="30" cy="35" r="3" fill="#FF6B9D" />
              <circle cx="50" cy="35" r="3" fill="#FF6B9D" />
              <path d="M 30 45 Q 40 50 50 45" fill="none" stroke="#FF6B9D" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-6xl font-bold mb-8">25:00</div>
          <select className="mb-6 bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink">
            <option>No task selected</option>
            {todoTasks.map(task => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-hina-pink text-white rounded-lg hover:bg-hina-pink/80 transition-colors font-medium">
              Start Pomodoro
            </button>
            <button className="px-6 py-3 bg-bg-card border border-border text-text-primary rounded-lg hover:border-hina-pink transition-colors">
              Short Break
            </button>
            <button className="px-6 py-3 bg-bg-card border border-border text-text-primary rounded-lg hover:border-hina-pink transition-colors">
              Long Break
            </button>
          </div>
          <p className="text-text-muted mt-6">Today's pomodoros: 0</p>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="max-w-3xl">
          <div className="bg-bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-text-secondary">No history yet. Complete some tasks to see them here!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TasksScreen
