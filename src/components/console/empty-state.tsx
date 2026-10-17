import * as React from 'react'
import { PackageOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex min-h-[240px] flex-col items-center justify-center px-6 py-10 text-center', className)}>
      <div className="flex size-10 items-center justify-center rounded-[var(--lat-radius-lg)] border border-line bg-raised text-faint">
        {icon ?? <PackageOpen className="size-4" />}
      </div>
      <div className="mt-3 text-[var(--lat-text-sm)] font-medium text-ink">{title}</div>
      {description ? <div className="mt-1 max-w-[40ch] text-[var(--lat-text-xs)] leading-4 text-faint">{description}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
