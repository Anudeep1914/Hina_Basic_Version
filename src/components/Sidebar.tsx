import { Link, useLocation } from 'react-router-dom'
import { Circle, BarChart3, Flame, Grid, Mic, Wrench, Sparkles, Settings } from 'lucide-react'

function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Circle, label: 'Tasks' },
    { path: '/stats', icon: BarChart3, label: 'Stats' },
    { path: '/habits', icon: Flame, label: 'Habits & Reminders' },
    { path: '/workspaces', icon: Grid, label: 'Workspaces' },
    { path: '/talk', icon: Mic, label: 'Talk', badge: 'soon' },
    { path: '/tools', icon: Wrench, label: 'Tools' },
    { path: '/insights', icon: Sparkles, label: 'Smart Insights' }
  ]

  return (
    <div className="w-[200px] bg-bg-secondary border-r border-border flex flex-col">
      {/* Logo and face */}
      <div className="p-4 border-b border-border">
        <div className="text-hina-pink font-bold text-xl mb-2">Hina</div>
        <div className="text-text-secondary text-xs">12:00 PM</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-hina-pink/10 text-hina-pink border-l-2 border-hina-pink'
                  : 'text-text-secondary hover:bg-bg-card hover:text-text-primary'
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs px-1.5 py-0.5 bg-hina-purple/20 text-hina-purple rounded">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Robot status */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
          <div className="w-2 h-2 bg-red rounded-full"></div>
          <span>Disconnected</span>
        </div>
        <Link
          to="/settings"
          className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-bg-card hover:text-text-primary rounded transition-colors"
        >
          <Settings size={16} />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
