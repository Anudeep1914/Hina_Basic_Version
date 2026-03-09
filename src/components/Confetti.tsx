import { useEffect, useState } from 'react'

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

function Confetti({ active, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    color: string
    delay: number
    duration: number
  }>>([])

  useEffect(() => {
    if (active) {
      const colors = ['#FF6B9D', '#B57BFF', '#4CAF50', '#4FC3F7', '#FFA726']
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3,
        duration: 2 + Math.random() * 2,
      }))
      setParticles(newParticles)

      setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 4000)
    }
  }, [active, onComplete])

  if (!active || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti absolute top-0"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
