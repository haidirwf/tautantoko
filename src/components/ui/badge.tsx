import * as React from 'react'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'
import {
  MessageCircle,
  Check,
  Package,
  Truck,
  CheckCheck,
  XCircle,
  type LucideIcon,
} from 'lucide-react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'dark'
  status?: OrderStatus
  showIcon?: boolean
}

export function Badge({
  className,
  variant = 'default',
  status,
  showIcon = true,
  children,
  ...props
}: BadgeProps) {
  if (status) {
    const statusConfig: Record<
      OrderStatus,
      { label: string; badge: string; icon: LucideIcon; iconColor: string }
    > = {
      PENDING_WA: {
        label: 'Menunggu WA',
        badge: 'bg-[#faf4ed] text-[#8c4327] border border-[#cc785c]/25',
        icon: MessageCircle,
        iconColor: 'text-[#cc785c]',
      },
      PAID: {
        label: 'Sudah Bayar',
        badge: 'bg-[#edf7ee] text-[#1e612f] border border-[#2e7d32]/20',
        icon: Check,
        iconColor: 'text-[#2e7d32]',
      },
      PROCESSING: {
        label: 'Diproses',
        badge: 'bg-[#eff6ff] text-[#1d4ed8] border border-[#2563eb]/20',
        icon: Package,
        iconColor: 'text-[#2563eb]',
      },
      SHIPPED: {
        label: 'Dikirim',
        badge: 'bg-[#f5f3ff] text-[#6d28d9] border border-[#7c3aed]/20',
        icon: Truck,
        iconColor: 'text-[#7c3aed]',
      },
      COMPLETED: {
        label: 'Selesai',
        badge: 'bg-[#edf7ee] text-[#1e612f] border border-[#2e7d32]/20',
        icon: CheckCheck,
        iconColor: 'text-[#2e7d32]',
      },
      CANCELLED: {
        label: 'Dibatalkan',
        badge: 'bg-[#f5f5f4] text-[#78716c] border border-[#78716c]/20',
        icon: XCircle,
        iconColor: 'text-[#a8a29e]',
      },
    }

    const current = statusConfig[status]
    const Icon = current?.icon

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium tracking-tight whitespace-nowrap shadow-2xs select-none transition-colors shrink-0',
          current?.badge,
          className
        )}
        {...props}
      >
        {showIcon && Icon && <Icon className={cn('size-3 shrink-0', current.iconColor)} />}
        <span>{children || current?.label}</span>
      </span>
    )
  }

  const variants = {
    default: 'bg-[#faf8f5] text-[#141413] border border-[#e8e2d9]',
    secondary: 'bg-[#f2eee9] text-[#706c64] border border-[#e8e2d9]',
    outline: 'bg-transparent text-[#141413] border border-[#e8e2d9]',
    dark: 'bg-[#141413] text-[#faf8f5] border border-[#2a2723]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium tracking-tight border shadow-2xs whitespace-nowrap select-none shrink-0',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

