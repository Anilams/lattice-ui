import * as React from 'react'
import { Expand, Radio } from 'lucide-react'
import type { TopologyNode } from './types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { IconButton } from '@/components/ui/icon-button'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { StatusDot } from '@/components/ui/status-dot'
import { DeviceGlyph } from './device-glyph'
import { EmptyState } from './empty-state'

const width = 600
const height = 330

export function TopologyMap({
  nodes,
  links,
  className,
}: {
  nodes: TopologyNode[]
  links: Array<[string, string]>
  className?: string
}) {
  const [activeId, setActiveId] = React.useState<string>('gw')
  if (!nodes.length) {
    return (
      <Panel className={className}>
        <PanelHeader title="网络拓扑" description="暂无节点" />
        <EmptyState
          title="暂无拓扑数据"
          description="传入 nodes 和 links 后，这里会显示可键盘选择的网络节点。"
        />
      </Panel>
    )
  }
  const active = nodes.find((node) => node.id === activeId) ?? nodes[0]
  const connected = new Set<string>()
  links.forEach(([a, b]) => {
    if (a === activeId) connected.add(b)
    if (b === activeId) connected.add(a)
  })

  return (
    <Panel className={className}>
      <PanelHeader
        title={
          <span className="flex items-center gap-2">
            网络拓扑
            <Badge tone="success" dot>
              实时
            </Badge>
          </span>
        }
        description="6 个节点 · 10 GbE 骨干"
        actions={
          <>
            <span className="hidden items-center gap-1 text-[9px] text-faint sm:flex">
              <Radio className="size-3" />
              2.4 / 5 GHz
            </span>
            <IconButton label="放大拓扑图" size="sm">
              <Expand className="size-3.5" />
            </IconButton>
          </>
        }
      />
      <div className="p-3">
        <div className="relative mx-auto aspect-[600/330] w-full max-w-[620px]">
          <svg
            viewBox={'0 0 ' + width + ' ' + height}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {links.map(([fromId, toId]) => {
              const from = nodes.find((node) => node.id === fromId)
              const to = nodes.find((node) => node.id === toId)
              if (!from || !to) return null
              const isActive = fromId === activeId || toId === activeId
              const midY = (from.y + to.y) / 2
              return (
                <path
                  key={fromId + '-' + toId}
                  d={'M ' + from.x + ' ' + from.y + ' C ' + from.x + ' ' + midY + ' ' + to.x + ' ' + midY + ' ' + to.x + ' ' + to.y}
                  fill="none"
                  stroke={isActive ? 'var(--lat-action)' : 'var(--lat-line-strong)'}
                  strokeWidth="1.2"
                  strokeDasharray={isActive ? undefined : '2 4'}
                  vectorEffect="non-scaling-stroke"
                  className="transition-[stroke] duration-200"
                  opacity={isActive ? 0.85 : 0.65}
                />
              )
            })}
            <circle cx={nodes.find((node) => node.id === 'wan')?.x ?? 300} cy="34" r="2.5" fill="var(--lat-success)" />
          </svg>

          {nodes.map((node) => {
            const isActive = node.id === activeId
            return (
              <button
                key={node.id}
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => setActiveId(node.id)}
                onFocus={() => setActiveId(node.id)}
                onClick={() => setActiveId(node.id)}
                className={cn(
                  'absolute flex w-[96px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[var(--lat-radius-md)] border bg-surface px-2 py-1.5 text-left shadow-[var(--lat-shadow-sm)] transition-[border-color,background-color,box-shadow] duration-[var(--lat-duration-fast)] sm:w-[124px] sm:gap-2.5 sm:px-2.5 sm:py-2',
                  isActive
                    ? 'border-action/70 bg-selected shadow-[0_0_0_1px_var(--lat-action-soft)]'
                    : 'border-line hover:border-line-strong hover:bg-hover',
                )}
                style={{ left: (node.x / width) * 100 + '%', top: (node.y / height) * 100 + '%' }}
              >
                <DeviceGlyph kind={node.kind} status={node.status} size="sm" className="hidden sm:inline-flex" />
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-[10px] font-medium leading-3 text-ink sm:text-[11px]">
                    <StatusDot
                      status={node.status === 'online' ? 'online' : node.status === 'warning' ? 'warning' : 'offline'}
                      className="sm:hidden"
                    />
                    <span className="truncate">{node.label}</span>
                  </span>
                  <span className="mt-0.5 hidden truncate text-[9px] leading-3 text-faint sm:block">{node.sublabel}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-2 flex min-h-7 items-center justify-between gap-3 border-t border-line-faint pt-2 text-[10px]">
          <span className="min-w-0 truncate">
            <span className="text-faint">已选 </span>
            <span className="text-ink">{active.label}</span>
            <span className="mx-1.5 text-line-strong">/</span>
            <span className="lat-data text-muted">{active.meta}</span>
          </span>
          <span className="hidden shrink-0 items-center gap-2 text-faint md:flex">
            <span className="flex items-center gap-1">
              <StatusDot status="online" />
              在线
            </span>
            <span className="flex items-center gap-1">
              <StatusDot status="warning" />
              注意
            </span>
          </span>
        </div>
      </div>
    </Panel>
  )
}
