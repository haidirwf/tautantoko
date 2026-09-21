import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 select-none'

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-active active:bg-primary-active/90 shadow-sm',
      secondary: 'bg-surface-card text-ink hover:bg-surface-soft active:bg-hairline border border-hairline',
      dark: 'bg-surface-dark-elevated text-on-dark hover:bg-[#322f2b] active:bg-surface-dark border border-[#38342f]',
      outline: 'bg-transparent text-ink border border-hairline hover:bg-surface-card',
      ghost: 'bg-transparent text-ink hover:bg-surface-card/60',
      danger: 'bg-status-error/10 text-status-error hover:bg-status-error/20 border border-status-error/20',
    }

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-sm gap-1.5',
      md: 'h-10 px-4 py-2 text-sm rounded-md gap-2',
      lg: 'h-12 px-6 text-base rounded-md gap-2.5',
      icon: 'size-10 rounded-md',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
