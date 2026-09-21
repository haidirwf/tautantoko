import React from 'react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  subtext?: string
  trend?: {
    text: string
    isPositive?: boolean
  }
  icon?: React.ReactNode
}

export function MetricCard({
  label,
  value,
  subtext,
  trend,
  icon,
}: MetricCardProps) {
  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-surface-card border border-hairline shadow-2xs flex flex-col justify-between transition-all hover:shadow-sm">
      <div className="flex items-start justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-muted">
          {label}
        </span>
        {icon && (
          <div className="size-9 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-primary shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="font-serif text-3xl sm:text-4xl font-normal text-ink tracking-tight">
          {value}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                trend.isPositive
                  ? 'bg-status-success/15 text-[#1e6f32] border-[#5db872]/30'
                  : 'bg-status-amber/15 text-[#a8651a] border-[#e8a55a]/30'
              )}
            >
              {trend.text}
            </span>
          )}
          {subtext && (
            <span className="text-xs text-muted truncate">{subtext}</span>
          )}
        </div>
      </div>
    </div>
  )
}
