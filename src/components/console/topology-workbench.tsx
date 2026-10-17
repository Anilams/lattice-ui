import * as React from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import type { TopologyNode } from './types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { IconButton } from '@/components/ui/icon-button'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { DeviceGlyph } from './device-glyph'

export function TopologyWorkbench({
  nodes,
  links,
  selectedId,
  onSelect,
  className,
}: {
  nodes: TopologyNode[]
  links: Array<[string, string]>
  selectedId?: string | null
  onSelect?: (node: TopologyNode) => void
  className?: string
}) {
  const [scale, setScale] = React.useState(1)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const drag = React.useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)

  if (!nodes.length) {
    return (
      <Panel className={className}>
        <PanelHeader title="网络拓扑" description="暂无节点" />
        <div className="px-4 py-12 text-center text-[10px] text-faint">暂无拓扑数据</div>
      </Panel>
    )
  }

  const connected = new Set<string>()
  links.forEach(([from, to]) => {
    if (from === selectedId) connected.add(to)
    if (to === selectedId) connected.add(from)
  })

  return (
    <Panel className={cn('overflow-hidden', className)}>
      <PanelHeader
        title={<span className="flex items-center gap-2">网络拓扑 <Badge tone="success" dot>实时</Badge></span>}
        description="拖动画布 · 选择节点查看详情"
        actions={
          <div className="flex items-center gap-0.5">
            <IconButton label="缩小" size="sm" onClick={() => setScale((value) => Math.max(0.6, value - 0.15))}>
              <Minus className="size-3.5" />
            </IconButton>
            <span className="w-9 text-center text-[9px] tabular-nums text-faint">{Math.round(scale * 100)}%</span>
            <IconButton label="放大" size="sm" onClick={() => setScale((value) => Math.min(1.8, value + 0.15))}>
              <Plus className="size-3.5" />
            </IconButton>
            <IconButton
              label="重置视图"
              size="sm"
              onClick={() => {
                setScale(1)
                setOffset({ x: 0, y: 0 })
              }}
            >
              <RotateCcw className="size-3.5" />
            </IconButton>
          </div>
        }
      />
      <div
        className="relative h-[300px] cursor-grab overflow-hidden bg-sunken/30 active:cursor-grabbing sm:h-[420px]"
        onPointerDown={(event) => {
          drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!drag.current) return
          setOffset({
            x: drag.current.ox + event.clientX - drag.current.x,
            y: drag.current.oy + event.clientY - drag.current.y,
          })
        }}
        onPointerUp={() => {
          drag.current = null
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: 'translate(' + offset.x + 'px, ' + offset.y + 'px) scale(' + scale + ')' }}
        >
          <svg viewBox="0 0 600 330" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            {links.map(([fromId, toId]) => {
              const from = nodes.find((node) => node.id === fromId)
              const to = nodes.find((node) => node.id === toId)
              if (!from || !to) return null
              const active = fromId === selectedId || toId === selectedId
              const midY = (from.y + to.y) / 2
              return (
                <path
                  key={fromId + '-' + toId}
                  d={'M ' + from.x + ' ' + from.y + ' C ' + from.x + ' ' + midY + ' ' + to.x + ' ' + midY + ' ' + to.x + ' ' + to.y}
                  fill="none"
                  stroke={active ? 'var(--lat-action)' : 'var(--lat-line-strong)'}
                  strokeWidth={active ? '1.5' : '1'}
                  strokeDasharray={active ? '4 6' : '2 5'}
                  vectorEffect="non-scaling-stroke"
                  className={active ? 'lat-topology-link' : undefined}
                  opacity={active ? 0.9 : 0.55}
                />
              )
            })}
          </svg>
          {nodes.map((node) => {
            const active = node.id === selectedId
            return (
              <button
                key={node.id}
                type="button"
                aria-pressed={active}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onSelect?.(node)}
                className={cn(
                  'absolute flex w-[112px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[var(--lat-radius-md)] border bg-surface px-2 py-1.5 text-left shadow-[var(--lat-shadow-sm)] transition-[border-color,background-color,box-shadow] duration-[var(--lat-duration-base)] sm:w-[132px] sm:gap-2.5 sm:px-2.5 sm:py-2',
                  active ? 'border-action/70 bg-selected' : 'border-line hover:border-line-strong hover:bg-hover',
                )}
                style={{ left: (node.x / 600) * 100 + '%', top: (node.y / 330) * 100 + '%' }}
              >
                <DeviceGlyph kind={node.kind} status={node.status} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-medium leading-3 text-ink sm:text-[11px]">{node.label}</span>
                  <span className="mt-0.5 block truncate text-[9px] leading-3 text-faint">{node.sublabel}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="pointer-events-none absolute bottom-2 left-3 flex items-center gap-3 text-[9px] text-faint">
          <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-success" />在线</span>
          <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-danger" />离线</span>
          <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-warning" />注意</span>
          {selectedId ? <span className="text-action">{connected.size} 条关联链路</span> : null}
        </div>
      </div>
    </Panel>
  )
}
