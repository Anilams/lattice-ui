import * as React from 'react'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  actions,
  meta,
  className,
}: {
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
  meta?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-5 flex flex-wrap items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[var(--lat-text-2xl)] font-semibold leading-8 tracking-[-0.025em] text-ink">
            {title}
          </h1>
          {meta}
        </div>
        {description ? (
          <div className="mt-1 max-w-[70ch] text-[var(--lat-text-sm)] leading-5 text-muted">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function PageBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1440px] p-[var(--lat-content-pad)]', className)}
      {...props}
    />
  )
}

export function Toolbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2',
        className,
      )}
      {...props}
    />
  )
}
