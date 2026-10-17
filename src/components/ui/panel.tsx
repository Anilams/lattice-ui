import * as React from 'react'
import { cn } from '@/lib/utils'
import { panelBase } from './control'

export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(panelBase, className)} {...props} />
}

export function PanelHeader({
  title,
  description,
  icon,
  actions,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex min-h-11 items-center gap-3 border-b border-line px-3.5 py-2.5', className)}>
      {icon ? <span className="shrink-0 text-faint">{icon}</span> : null}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[var(--lat-text-sm)] font-medium text-ink">{title}</div>
        {description ? <div className="mt-0.5 text-[var(--lat-text-xs)] text-faint">{description}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
    </div>
  )
}
