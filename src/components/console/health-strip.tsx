import * as React from 'react'
import { Activity, CircleCheck, Radio, Router, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusDot } from '@/components/ui/status-dot'

type Segment = {
  label: string
  value: React.ReactNode
  detail: string
  status?: 'online' | 'warning' | 'offline' | 'neutral'
  icon: React.ReactNode
}

export function HealthStrip({
  segments,
  className,
}: {
  segments: Segment[]
  className?: string
}) {
  return (
    <div className={cn('grid overflow-hidden rounded-[var(--lat-radius-lg)] border border-line bg-surface sm:grid-cols-2 xl:grid-cols-4', className)}>
      {segments.map((segment, index) => (
        <div
          key={segment.label}
          className={cn(
            'flex min-h-[72px] items-center gap-3 px-3.5 py-3',
            index > 0 && 'border-t border-line sm:border-l sm:border-t-0',
            index === 2 && 'sm:border-l-0 sm:border-t xl:border-l xl:border-t-0',
            index === 3 && 'sm:border-t xl:border-t-0',
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-[var(--lat-radius-sm)] border border-line bg-raised text-muted">
            {segment.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[var(--lat-text-2xs)] uppercase tracking-[0.08em] text-faint">
              {segment.label}
              {segment.status ? <StatusDot status={segment.status} /> : null}
            </div>
            <div className="mt-0.5 flex items-baseline gap-2.5">
              <span className="text-[var(--lat-text-xl)] font-medium leading-6 tracking-[-0.02em] text-ink">
                {segment.value}
              </span>
              <span className="h-2.5 w-px shrink-0 self-center bg-line-strong" aria-hidden="true" />
              <span className="truncate text-[var(--lat-text-xs)] text-muted">{segment.detail}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const healthIcons = {
  activity: <Activity className="size-4" />,
  radio: <Radio className="size-4" />,
  router: <Router className="size-4" />,
  shield: <ShieldCheck className="size-4" />,
  check: <CircleCheck className="size-4" />,
}
