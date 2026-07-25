import type { ReactNode } from 'react'

interface PaperBackgroundProps {
  children: ReactNode
  className?: string
}

export function PaperBackground({ children, className = '' }: PaperBackgroundProps) {
  return (
    <div className={`paper-texture min-h-svh ${className}`}>{children}</div>
  )
}
