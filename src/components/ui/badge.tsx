import * as React from 'react'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'dark' | 'dot'
  status?: OrderStatus
}

export function Badge({ className, variant = 'default', status, children, ...props }: BadgeProps) {
  if (status) {
    const statusConfig: Record<
      OrderStatus,
      { label: string; badge: string; dot: string }
    > = {
      PENDING_WA: {
        label: 'Menunggu WA',
        badge: 'bg-[#fff8f5] text-[#9a3c1e] border-[#f5d0c2]',
        dot: 'bg-[#cc785c]',
      },
      PAID: {
        label: 'Sudah Bayar',
        badge: 'bg-[#f4fbf6] text-[#137333] border-[#ceead6]',
        dot: 'bg-[#1e8e3e]',
      },
      PROCESSING: {
        label: 'Diproses',
        badge: 'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]',
        dot: 'bg-[#0284c7]',
      },
      SHIPPED: {
        label: 'Dikirim',
        badge: 'bg-[#faf5ff] text-[#6d28d9] border-[#e9d5ff]',
        dot: 'bg-[#7c3aed]',
      },
      COMPLETED: {
        label: 'Selesai',
        badge: 'bg-[#f4fbf6] text-[#137333] border-[#ceead6]',
        dot: 'bg-[#1e8e3e]',
      },
      CANCELLED: {
        label: 'Dibatalkan',
        badge: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
        dot: 'bg-[#dc2626]',
      },
    }

    const current = statusConfig[status]

    if (variant === 'dot') {
      return (
        <span
          className={cn('inline-flex items-center gap-1.5 text-xs font-medium text-[#141413]', className)}
          {...props}
        >
          <span className={cn('size-2 rounded-full shrink-0', current.dot)} />
          {children || current.label}
        </span>
      )
    }

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border tracking-normal shadow-2xs',
          current.badge,
          className
        )}
        {...props}
      >
        <span className={cn('size-1.5 rounded-full shrink-0', current.dot)} />
        {children || current.label}
      </span>
    )
  }

  const variants = {
    default: 'bg-surface-card text-ink border border-hairline',
    secondary: 'bg-canvas text-muted border border-hairline',
    outline: 'bg-transparent text-ink border border-hairline',
    dark: 'bg-surface-dark-elevated text-on-dark border border-[#38342f]',
    dot: 'bg-transparent text-ink border-0',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border shadow-2xs',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
