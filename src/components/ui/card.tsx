import * as React from 'react'
import { cn } from '@/lib/utils'

export function Card({
  className,
  variant = 'cream',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: 'cream' | 'dark' | 'canvas' }) {
  const variants = {
    cream: 'bg-surface-card border border-hairline text-ink',
    dark: 'bg-surface-dark border border-[#2b2824] text-on-dark shadow-md',
    canvas: 'bg-canvas border border-hairline text-ink',
  }

  return (
    <div
      className={cn('rounded-lg overflow-hidden', variants[variant], className)}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 sm:p-6 pb-2', className)} {...props} />
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-medium text-lg leading-tight tracking-tight', className)}
      {...props}
    />
  )
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-muted mt-1', className)}
      {...props}
    />
  )
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 sm:p-6 pt-2', className)} {...props} />
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-5 sm:p-6 pt-0 flex items-center', className)}
      {...props}
    />
  )
}
