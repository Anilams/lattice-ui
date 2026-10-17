import * as React from 'react'
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

type NoticeTone = 'info' | 'success' | 'warning' | 'danger'

const toneClass: Record<NoticeTone, string> = {
  info: 'border-info/25 bg-info-soft text-info',
  success: 'border-success/25 bg-success-soft text-success',
  warning: 'border-warning/30 bg-warning-soft text-warning',
  danger: 'border-danger/30 bg-danger-soft text-danger',
}

const Icon = ({ tone }: { tone: NoticeTone }) => {
  const props = { className: 'size-4 shrink-0', 'aria-hidden': true } as const
  if (tone === 'success') return <CircleCheck {...props} />
  if (tone === 'warning') return <TriangleAlert {...props} />
  if (tone === 'danger') return <CircleX {...props} />
  return <Info {...props} />
}

export function InlineNotice({
  tone = 'info',
  title,
  children,
  action,
  className,
}: {
  tone?: NoticeTone
  title?: string
  children: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start gap-2.5 rounded-[var(--lat-radius-md)] border px-3 py-2.5', toneClass[tone], className)}>
      <span className="mt-0.5">
        <Icon tone={tone} />
      </span>
      <div className="min-w-0 flex-1">
        {title ? <div className="text-[var(--lat-text-sm)] font-medium text-ink">{title}</div> : null}
        <div className={cn('text-[var(--lat-text-xs)] leading-4 text-muted', title && 'mt-0.5')}>{children}</div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
