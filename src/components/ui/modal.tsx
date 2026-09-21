import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  surface?: 'cream' | 'dark' | 'canvas'
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  surface = 'canvas',
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth]

  const surfaceClass = {
    canvas: 'bg-canvas text-ink border-hairline',
    cream: 'bg-surface-card text-ink border-hairline',
    dark: 'bg-surface-dark text-on-dark border-[#2b2824]',
  }[surface]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full rounded-xl border shadow-xl transition-all animate-in zoom-in-95 max-h-[90vh] flex flex-col',
          surfaceClass,
          maxWClass
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-inherit">
          <div>
            {title && (
              <h3 className="font-serif text-xl font-medium tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className={cn('text-xs mt-1', surface === 'dark' ? 'text-on-dark-soft' : 'text-muted')}>
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-full transition-colors',
              surface === 'dark'
                ? 'hover:bg-surface-dark-elevated text-on-dark-soft hover:text-on-dark'
                : 'hover:bg-surface-card text-muted hover:text-ink'
            )}
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
