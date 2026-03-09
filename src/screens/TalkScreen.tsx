import HinaFace from '../components/HinaFace'

function TalkScreen() {
  return (
    <div className="p-6 flex items-center justify-center min-h-[calc(100vh-52px)]">
      <div className="max-w-2xl text-center">
        {/* Hina Face with pulse animation */}
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-hina-pink/20 rounded-full animate-ping"></div>
          <div className="relative">
            <HinaFace />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Talk to Hina</h1>
        <p className="text-text-secondary mb-8">Voice interaction coming soon...</p>

        {/* Example commands */}
        <div className="bg-bg-card border border-border rounded-lg p-6 mb-6 text-left">
          <h3 className="text-lg font-semibold mb-4">Example commands</h3>
          <div className="space-y-2">
            {[
              '"Add a task"',
              '"Start a timer"',
              '"What did I work on today?"',
              '"Remind me to drink water"',
              '"How am I doing this week?"'
            ].map((cmd, i) => (
              <div key={i} className="px-4 py-2 bg-bg-input rounded-lg text-text-secondary">
                {cmd}
              </div>
            ))}
          </div>
        </div>

        <button className="px-8 py-3 bg-hina-purple text-white rounded-lg hover:bg-hina-purple/80 transition-colors">
          Notify me when ready
        </button>
      </div>
    </div>
  )
}

export default TalkScreen
