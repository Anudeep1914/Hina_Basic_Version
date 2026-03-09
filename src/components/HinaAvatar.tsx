import { useState, useEffect } from 'react'

interface HinaAvatarProps {
  size?: number
  mood?: 'happy' | 'focused' | 'celebrating' | 'sleeping'
}

function HinaAvatar({ size = 80, mood = 'happy' }: HinaAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 200)
    }, 3000)

    return () => clearInterval(blinkInterval)
  }, [])

  const getMoodStyles = () => {
    switch (mood) {
      case 'focused':
        return {
          eyeY: 38,
          mouthPath: 'M 30 48 Q 40 46 50 48',
        }
      case 'celebrating':
        return {
          eyeY: 35,
          mouthPath: 'M 28 45 Q 40 52 52 45',
        }
      case 'sleeping':
        return {
          eyeY: 40,
          mouthPath: 'M 35 48 Q 40 50 45 48',
        }
      default:
        return {
          eyeY: 35,
          mouthPath: 'M 30 45 Q 40 50 50 45',
        }
    }
  }

  const styles = getMoodStyles()

  return (
    <div className="relative animate-float">
      <svg
        width={size}
        height={size}
        className="drop-shadow-lg transition-all duration-300"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(255, 107, 157, 0.3))' }}
      >
        <defs>
          <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B9D" />
            <stop offset="100%" stopColor="#B57BFF" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Face circle with gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.45}
          fill="none"
          stroke="url(#faceGradient)"
          strokeWidth="3"
          filter="url(#glow)"
          className="animate-pulse-scale"
        />

        {/* Inner face glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.4}
          fill="rgba(255, 107, 157, 0.05)"
        />

        {/* Eyes */}
        {!isBlinking ? (
          <>
            <circle
              cx={size * 0.35}
              cy={styles.eyeY}
              r="3.5"
              fill="url(#faceGradient)"
              className="transition-all duration-200"
            />
            <circle
              cx={size * 0.65}
              cy={styles.eyeY}
              r="3.5"
              fill="url(#faceGradient)"
              className="transition-all duration-200"
            />

            {/* Eye sparkles */}
            <circle cx={size * 0.37} cy={styles.eyeY - 2} r="1" fill="#fff" opacity="0.8" />
            <circle cx={size * 0.67} cy={styles.eyeY - 2} r="1" fill="#fff" opacity="0.8" />
          </>
        ) : (
          <>
            <line
              x1={size * 0.32}
              y1={styles.eyeY}
              x2={size * 0.38}
              y2={styles.eyeY}
              stroke="url(#faceGradient)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1={size * 0.62}
              y1={styles.eyeY}
              x2={size * 0.68}
              y2={styles.eyeY}
              stroke="url(#faceGradient)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Smile */}
        <path
          d={styles.mouthPath}
          fill="none"
          stroke="url(#faceGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-300"
        />

        {/* Blush marks */}
        {mood === 'happy' || mood === 'celebrating' ? (
          <>
            <circle cx={size * 0.25} cy={size * 0.52} r="4" fill="#FF6B9D" opacity="0.2" />
            <circle cx={size * 0.75} cy={size * 0.52} r="4" fill="#FF6B9D" opacity="0.2" />
          </>
        ) : null}
      </svg>

      {/* Decorative particles around the face */}
      {mood === 'celebrating' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-hina-pink animate-pulse" style={{ animation: 'float 2s ease-in-out infinite' }} />
          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-hina-purple animate-pulse" style={{ animation: 'float 2.5s ease-in-out infinite' }} />
          <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-blue animate-pulse" style={{ animation: 'float 3s ease-in-out infinite' }} />
          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-orange animate-pulse" style={{ animation: 'float 2.2s ease-in-out infinite' }} />
        </div>
      )}
    </div>
  )
}

export default HinaAvatar
