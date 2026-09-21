import * as React from 'react'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'dark'
  status?: OrderStatus
}

export function Badge({ className, variant = 'default', status, children, ...props }: BadgeProps) {
  if (status) {
    const statusStyles: Record<OrderStatus, string> = {
      PENDING_WA: 'bg-[#efe9de] text-status-amber border-[#e8a55a]/40 font-medium',
      PAID: 'bg-[#5db872]/15 text-[#1e6f32] border-[#5db872]/30 font-medium',
      PROCESSING: 'bg-[#5db8a6]/15 text-[#145d50] border-[#5db8a6]/30 font-medium',
      SHIPPED: 'bg-[#5db8a6]/25 text-[#0d4f43] border-[#5db8a6]/50 font-medium',
      COMPLETED: 'bg-[#5db872]/20 text-[#135424] border-[#5db872]/40 font-semibold',
      CANCELLED: 'bg-status-error/15 text-status-error border-status-error/30 font-medium',
    }

    const statusLabels: Record<OrderStatus, string> = {
      PENDING_WA: 'Menunggu WA',
      PAID: 'Sudah Bayar',
      PROCESSING: 'Diproses',
      SHIPPED: 'Dikirim',
      COMPLETED: 'Selesai',
      CANCELLED: 'Dibatalkan',
    }

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border tracking-tight',
          statusStyles[status],
          className
        )}
        {...props}
      >
        <span className="size-1.5 rounded-full bg-current opacity-80" />
        {children || statusLabels[status]}
      </span>
    )
  }

  const variants = {
    default: 'bg-surface-card text-ink border border-hairline',
    secondary: 'bg-canvas text-muted border border-hairline',
    outline: 'bg-transparent text-ink border border-hairline',
    dark: 'bg-surface-dark-elevated text-on-dark border border-[#38342f]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
