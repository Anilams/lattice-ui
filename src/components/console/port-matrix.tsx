import * as React from 'react'
import type { DevicePort } from './types'
import { cn } from '@/lib/utils'
import { LiveValue } from './live-value'

export function PortMatrix({
  ports,
  selected,
  onSelect,
  className,
}: {
  ports: DevicePort[]
  selected?: number | null
  onSelect?: (port: DevicePort) => void
  className?: string
}) {
  if (!ports.length) {
    return (
      <div className={cn('rounded-[var(--lat-radius-lg)] border border-line bg-surface p-8 text-center text-[10px] text-faint', className)}>
        未提供端口数据
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-4', className)} aria-label="端口矩阵">
      {ports.map((port) => {
        const active = port.connected && port.status !== 'disabled'
        return (
          <button
            key={port.number}
            type="button"
            aria-pressed={selected === port.number}
            aria-label={
              '端口 ' + port.number + '，' + (active ? '已连接 ' + (port.label || '') : '未连接')
            }
            onClick={() => onSelect?.(port)}
            className={cn(
              'group relative overflow-hidden rounded-[var(--lat-radius-md)] border bg-surface p-2.5 text-left transition-[border-color,background-color,box-shadow] duration-[var(--lat-duration-base)] ease-[var(--lat-ease-out)] hover:border-line-strong hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/35',
              selected === port.number ? 'border-action/70 bg-selected' : 'border-line',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="lat-data text-[10px] text-faint">{String(port.number).padStart(2, '0')}</span>
              <span className="flex items-center gap-1 text-[8px] text-faint">
                {port.poe ? 'PoE' : ''}
                <span className={cn('size-1.5 rounded-full', active ? 'bg-success' : port.status === 'disabled' ? 'bg-warning' : 'bg-line-strong')} />
              </span>
            </div>
            <div className={cn('mt-2 truncate text-[11px]', active ? 'text-ink' : 'text-faint')}>
              {active ? port.label || '已连接' : port.status === 'disabled' ? '已禁用' : '未连接'}
            </div>
            <div className="mt-0.5 flex items-center justify-between gap-2 text-[9px]">
              <span className="lat-data text-muted">{active ? port.speed ?? '1 Gbps' : '—'}</span>
              {active && typeof port.utilization === 'number' ? (
                <LiveValue value={port.utilization} suffix="%" className="text-faint" />
              ) : null}
            </div>
            {active && typeof port.utilization === 'number' ? (
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-raised">
                <div
                  className={cn(
                    'h-full rounded-full transition-[width] duration-[var(--lat-duration-panel)] ease-[var(--lat-ease-out)]',
                    port.utilization > 70 ? 'bg-warning' : 'bg-action',
                  )}
                  style={{ width: Math.max(2, Math.min(100, port.utilization)) + '%' }}
                />
              </div>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
