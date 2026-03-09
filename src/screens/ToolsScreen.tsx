import { useState } from 'react'
import PomodoroTimer from '../components/PomodoroTimer'

function ToolsScreen() {
  const [notes, setNotes] = useState('')
  const quotes = [
    "The secret of getting ahead is getting started.",
    "Focus on being productive instead of busy.",
    "You don't have to be great to start, but you have to start to be great.",
    "The way to get started is to quit talking and begin doing."
  ]
  const dailyQuote = quotes[new Date().getDate() % quotes.length]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tools</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Notes */}
        <div className="bg-bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Jot down your thoughts..."
            className="w-full h-48 bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary resize-none focus:outline-none focus:border-hina-pink"
          />
          <p className="text-xs text-text-muted mt-2">Auto-saves as you type</p>
        </div>

        {/* Pomodoro Timer */}
        <div className="bg-bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Pomodoro Timer</h3>
          <PomodoroTimer />
        </div>

        {/* Daily Quote */}
        <div className="bg-bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Quote</h3>
          <p className="text-text-primary italic text-lg">"{dailyQuote}"</p>
        </div>

        {/* Focus Music */}
        <div className="bg-bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Focus Music</h3>
          <div className="space-y-2">
            <a
              href="https://lofi.cafe"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-bg-input border border-border rounded-lg text-text-primary hover:border-hina-pink transition-colors"
            >
              🎵 Lofi Cafe
            </a>
            <a
              href="https://www.brain.fm"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-bg-input border border-border rounded-lg text-text-primary hover:border-hina-pink transition-colors"
            >
              🧠 Brain.fm
            </a>
            <a
              href="https://www.noisli.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-bg-input border border-border rounded-lg text-text-primary hover:border-hina-pink transition-colors"
            >
              🌊 Noisli
            </a>
          </div>
        </div>

        {/* File Renamer - Coming Soon */}
        <div className="bg-bg-card border border-border rounded-lg p-6 opacity-60">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">File Renamer</h3>
            <span className="text-xs px-2 py-1 bg-hina-purple/20 text-hina-purple rounded">COMING SOON</span>
          </div>
          <p className="text-text-secondary text-sm">Batch rename files with patterns</p>
        </div>

        {/* Screenshot Tool - Coming Soon */}
        <div className="bg-bg-card border border-border rounded-lg p-6 opacity-60">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Screenshot Tool</h3>
            <span className="text-xs px-2 py-1 bg-hina-purple/20 text-hina-purple rounded">COMING SOON</span>
          </div>
          <p className="text-text-secondary text-sm">Capture and annotate screenshots</p>
        </div>
      </div>
    </div>
  )
}

export default ToolsScreen
