import { useEffect, useState } from 'react'

interface CircularProgressProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  showPercentage?: boolean
}

function CircularProgress({
  progress,
  size = 200,
  strokeWidth = 8,
  label,
  sublabel,
  showPercentage = true,
}: CircularProgressProps) {
  const [offset, setOffset] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const progressOffset = circumference - (progress / 100) * circumference
    setOffset(progressOffset)
  }, [progress, circumference])

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: 'drop-shadow(0 0 20px rgba(255, 107, 157, 0.3))' }}
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B9D" />
            <stop offset="50%" stopColor="#B57BFF" />
            <stop offset="100%" stopColor="#4FC3F7" />
          </linearGradient>
          <filter id="progressGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#progressGlow)"
          className="transition-all duration-500 ease-out"
        />

        {/* Inner glow circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth - 5}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <div className="text-5xl font-bold gradient-text mb-2 animate-pulse-scale">
            {label}
          </div>
        )}
        {showPercentage && (
          <div className="text-sm text-text-secondary">
            {Math.round(progress)}%
          </div>
        )}
        {sublabel && (
          <div className="text-xs text-text-muted mt-1">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  )
}

export default CircularProgress
