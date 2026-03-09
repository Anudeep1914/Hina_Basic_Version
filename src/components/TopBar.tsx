function TopBar() {
  return (
    <div className="h-[52px] glass-strong border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red rounded-full animate-pulse"></div>
        <span className="text-sm text-text-secondary">Hina · Disconnected</span>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105">
          <span className="text-text-muted">Pomodoros:</span>
          <span className="gradient-text font-semibold">0</span>
        </div>
        <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105">
          <span className="text-text-muted">Tasks:</span>
          <span className="text-green font-semibold">0</span>
        </div>
        <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105">
          <span className="text-text-muted">Streak:</span>
          <span className="text-orange font-semibold">0🔥</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar
