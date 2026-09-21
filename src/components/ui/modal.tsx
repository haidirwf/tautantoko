import * as React from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
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

  const maxWClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth]

  const surfaceClass = {
    canvas: 'bg-white text-[#141413] border-[#e8e2d9]',
    cream: 'bg-white text-[#141413] border-[#e8e2d9]',
    dark: 'bg-[#181715] text-[#faf9f5] border-[#2b2824]',
  }[surface]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={cn(
              'relative w-full rounded-2xl border shadow-xl max-h-[90vh] flex flex-col z-10 overflow-hidden',
              surfaceClass,
              maxWClass
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 pb-3.5 border-b border-inherit">
              <div>
                {title && (
                  <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-tight">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className={cn('text-xs mt-1', surface === 'dark' ? 'text-[#9bb0d1]' : 'text-muted')}>
                    {description}
                  </p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClose}
                className={cn(
                  'p-1.5 rounded-full transition-colors',
                  surface === 'dark'
                    ? 'hover:bg-[#1b2238] text-[#9bb0d1] hover:text-white'
                    : 'hover:bg-surface-card text-muted hover:text-ink'
                )}
                aria-label="Tutup"
              >
                <X className="size-4" />
              </motion.button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
