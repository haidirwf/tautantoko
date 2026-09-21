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
  variant?: 'dark' | 'cream'
}

export function MetricCard({
  label,
  value,
  subtext,
  trend,
  icon,
  variant = 'dark',
}: MetricCardProps) {
  if (variant === 'cream') {
    return (
      <div className="p-6 rounded-xl bg-surface-card border border-hairline flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted uppercase tracking-wider font-mono">
            {label}
          </span>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
        <div className="mt-4">
          <div className="font-serif text-3xl sm:text-4xl font-normal text-ink tracking-display">
            {value}
          </div>
          {subtext && <p className="text-xs text-muted mt-1">{subtext}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-7 rounded-xl bg-surface-dark border border-[#2b2824] shadow-md flex flex-col justify-between text-on-dark relative overflow-hidden group">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-60" />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-normal text-on-dark-soft uppercase tracking-wider font-mono">
            {label}
          </span>
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-surface-dark-elevated border border-[#38342f] text-primary">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="font-serif text-3xl sm:text-4xl font-normal text-on-dark tracking-display-tight">
          {value}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium',
                trend.isPositive
                  ? 'bg-status-success/15 text-status-success border border-status-success/30'
                  : 'bg-status-amber/15 text-status-amber border border-status-amber/30'
              )}
            >
              {trend.text}
            </span>
          )}
          {subtext && (
            <span className="text-xs text-on-dark-soft truncate">{subtext}</span>
          )}
        </div>
      </div>
    </div>
  )
}
