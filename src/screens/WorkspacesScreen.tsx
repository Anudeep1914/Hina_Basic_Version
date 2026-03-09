import { useEffect, useState } from 'react'
import { Plus, Play, Trash2 } from 'lucide-react'
import type { Workspace } from '../types'

function WorkspacesScreen() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    icon: '⊞',
    color: '#FF6B9D',
    description: '',
    items: []
  })

  useEffect(() => {
    loadWorkspaces()
  }, [])

  const loadWorkspaces = async () => {
    if (window.hina) {
      const allWorkspaces = await window.hina.getWorkspaces()
      setWorkspaces(allWorkspaces)
      if (allWorkspaces.length > 0 && !activeWorkspace) {
        setActiveWorkspace(allWorkspaces[0])
      }
    }
  }

  const handleAddWorkspace = async () => {
    if (!newWorkspace.name.trim() || !window.hina) return

    await window.hina.addWorkspace(newWorkspace)
    await loadWorkspaces()
    setShowAddForm(false)
    setNewWorkspace({
      name: '',
      icon: '⊞',
      color: '#FF6B9D',
      description: '',
      items: []
    })
  }

  const handleLaunchWorkspace = async (id: number) => {
    if (!window.hina) return
    await window.hina.launchWorkspace(id)
  }

  const handleDeleteWorkspace = async (id: number) => {
    if (!window.hina) return
    await window.hina.deleteWorkspace(id)
    await loadWorkspaces()
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-hina-pink text-white rounded-lg hover:bg-hina-pink/80 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          New Workspace
        </button>
      </div>

      {/* Add Workspace Form */}
      {showAddForm && (
        <div className="bg-bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Workspace</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Name</label>
              <input
                type="text"
                value={newWorkspace.name}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                placeholder="Workspace name"
                className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Description</label>
              <textarea
                value={newWorkspace.description}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                placeholder="What is this workspace for?"
                className="w-full bg-bg-input border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-hina-pink"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddWorkspace}
                className="px-6 py-2 bg-hina-pink text-white rounded-lg hover:bg-hina-pink/80 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-bg-input border border-border text-text-primary rounded-lg hover:border-hina-pink transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workspace Tabs */}
      {workspaces.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => setActiveWorkspace(ws)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeWorkspace?.id === ws.id
                  ? 'bg-hina-pink text-white'
                  : 'bg-bg-card border border-border text-text-secondary hover:border-hina-pink'
              }`}
            >
              {ws.icon} {ws.name} {ws.items.length > 0 && `(${ws.items.length})`}
            </button>
          ))}
        </div>
      )}

      {/* Active Workspace Panel */}
      {activeWorkspace && (
        <div className="bg-bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold mb-2">{activeWorkspace.icon} {activeWorkspace.name}</h2>
              <p className="text-text-secondary">{activeWorkspace.description}</p>
              {activeWorkspace.last_launched && (
                <p className="text-xs text-text-muted mt-1">
                  Last launched: {new Date(activeWorkspace.last_launched).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLaunchWorkspace(activeWorkspace.id)}
                className="px-6 py-2 bg-green text-white rounded-lg hover:bg-green/80 transition-colors flex items-center gap-2"
              >
                <Play size={18} />
                Launch
              </button>
              <button
                onClick={() => handleDeleteWorkspace(activeWorkspace.id)}
                className="px-4 py-2 bg-red/20 text-red border border-red rounded-lg hover:bg-red/30 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeWorkspace.items.map((item, index) => (
              <div key={index} className="bg-bg-input border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-2xl">{item.type === 'URL' ? '🌐' : item.type === 'APP' ? '📱' : '📁'}</div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    item.type === 'URL' ? 'bg-blue/20 text-blue' :
                    item.type === 'APP' ? 'bg-green/20 text-green' :
                    'bg-orange/20 text-orange'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <h4 className="font-medium text-text-primary mb-1">{item.name}</h4>
                <p className="text-xs text-text-muted truncate">{item.detail}</p>
              </div>
            ))}
            <button className="bg-bg-input border-2 border-dashed border-border rounded-lg p-4 hover:border-hina-pink transition-colors flex flex-col items-center justify-center text-text-muted">
              <Plus size={24} className="mb-2" />
              <span className="text-sm">Add Item</span>
            </button>
          </div>
        </div>
      )}

      {workspaces.length === 0 && !showAddForm && (
        <div className="bg-bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-text-secondary mb-4">No workspaces yet. Create one to organize your apps and links!</p>
        </div>
      )}
    </div>
  )
}

export default WorkspacesScreen
