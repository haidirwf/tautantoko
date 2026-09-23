import { useEffect, useState } from 'react'

interface TopProgressBarProps {
  isLoading: boolean
}

/**
 * TopProgressBar renders a slim, premium progress line animation
 * sliding from left to right at the topmost edge of the viewport.
 * Used during fetching instead of bulky spinning circular loaders.
 */
export function TopProgressBar({ isLoading }: TopProgressBarProps) {
  const [visible, setVisible] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setVisible(true)
    } else {
      const timer = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!visible) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-[3px] z-[99999] pointer-events-none overflow-hidden bg-[#e8e2d9]/30 transition-opacity duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      <div className="animate-top-loader bg-gradient-to-r from-transparent via-[#cc785c] to-[#e59278] shadow-[0_0_12px_rgba(204,120,92,0.9)]">
        {/* Luminous leading head glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-[5px] bg-white/90 blur-[0.5px] rounded-full shadow-[0_0_8px_#ffffff]" />
      </div>
    </div>
  )
}
