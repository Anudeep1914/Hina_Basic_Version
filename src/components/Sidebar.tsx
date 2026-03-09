import { Link, useLocation } from 'react-router-dom'
import { Circle, BarChart3, Flame, Grid, Mic, Wrench, Sparkles, Settings } from 'lucide-react'
import HinaAvatar from './HinaAvatar'

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
    <div className="w-[200px] glass-strong border-r border-border flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg opacity-50 pointer-events-none" />

      {/* Logo and face */}
      <div className="p-4 border-b border-border relative z-10">
        <div className="flex flex-col items-center mb-3">
          <HinaAvatar size={60} mood="happy" />
        </div>
        <div className="gradient-text font-bold text-xl mb-2 text-center">Hina</div>
        <div className="text-text-secondary text-xs text-center">12:00 PM</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 relative z-10">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-300 transform ${
                isActive
                  ? 'bg-gradient-to-r from-hina-pink/20 to-hina-purple/20 text-hina-pink border-l-2 border-hina-pink translate-x-1'
                  : 'text-text-secondary hover:bg-bg-card hover:text-text-primary hover:translate-x-1'
              }`}
            >
              <Icon size={18} className={isActive ? 'animate-pulse-scale' : ''} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs px-1.5 py-0.5 bg-hina-purple/20 text-hina-purple rounded animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Robot status */}
      <div className="p-4 border-t border-border relative z-10">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
          <div className="w-2 h-2 bg-red rounded-full animate-pulse"></div>
          <span>Disconnected</span>
        </div>
        <Link
          to="/settings"
          className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-bg-card hover:text-text-primary rounded transition-all duration-300 btn-3d"
        >
          <Settings size={16} />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
