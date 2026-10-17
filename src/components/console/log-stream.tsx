import * as React from 'react'
import type { LogLine } from './types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const levelMeta: Record<LogLine['level'], { label: string; tone: 'info' | 'success' | 'warning' | 'danger' }> = {
  info: { label: 'INFO', tone: 'info' },
  success: { label: 'OK', tone: 'success' },
  warn: { label: 'WARN', tone: 'warning' },
  error: { label: 'ERROR', tone: 'danger' },
}

export function LogStream({
  logs,
  paused = false,
  autoScroll = true,
  className,
}: {
  logs: LogLine[]
  paused?: boolean
  autoScroll?: boolean
  className?: string
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!paused && autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs, paused, autoScroll])

  if (!logs.length) {
    return <div className={cn('px-4 py-10 text-center text-[10px] text-faint', className)}>暂无日志。注入故障后会生成事件。</div>
  }

  return (
    <div ref={containerRef} className={cn('min-h-0 overflow-y-auto', className)}>
      <div role="log" aria-live={paused ? 'off' : 'polite'} aria-label="网络日志">
        {logs.map((line) => {
          const meta = levelMeta[line.level]
          return (
            <div
              key={line.id}
              className="grid grid-cols-[48px_52px_72px_1fr] items-baseline gap-2 border-b border-line-faint px-3 py-1.5 text-[10px] last:border-b-0 md:grid-cols-[58px_58px_96px_1fr] md:px-4"
            >
              <span className="lat-data truncate text-[9px] text-faint">{line.time}</span>
              <Badge tone={meta.tone} className="w-fit px-1 py-0 text-[8px]">{meta.label}</Badge>
              <span className="truncate text-faint">{line.source}</span>
              <span className="min-w-0 truncate text-muted" title={line.message}>{line.message}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
