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
      PENDING_WA: 'bg-[#fae7e0] text-[#cc785c] border-[#f2cfc2] font-medium',
      PAID: 'bg-[#e6f4ea] text-[#137333] border-[#ceead6] font-medium',
      PROCESSING: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd] font-medium',
      SHIPPED: 'bg-[#ede9fe] text-[#6d28d9] border-[#ddd6fe] font-medium',
      COMPLETED: 'bg-[#e6f4ea] text-[#137333] border-[#ceead6] font-semibold',
      CANCELLED: 'bg-[#fce8e6] text-[#c5221f] border-[#fad2cf] font-medium',
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
