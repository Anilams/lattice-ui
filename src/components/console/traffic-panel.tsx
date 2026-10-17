import * as React from 'react'
import { Activity, ChevronDown, Pause, Play } from 'lucide-react'
import type { Range, TrafficPoint, Wan } from './types'
import { cn } from '@/lib/utils'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { TrafficChart } from './traffic-chart'

const rangeLabels: Record<Range, string> = {
  '1h': '1 小时',
  '1d': '1 天',
  '1w': '1 周',
  '1m': '1 月',
}

export function TrafficPanel({
  data,
  range,
  onRangeChange,
  wans,
  selectedWan,
  onSelectWan,
  paused = false,
  onTogglePause,
  lastUpdated,
  className,
}: {
  data: TrafficPoint[]
  range: Range
  onRangeChange: (range: Range) => void
  wans: Wan[]
  selectedWan: 'primary' | 'secondary'
  onSelectWan: (id: 'primary' | 'secondary') => void
  paused?: boolean
  onTogglePause?: () => void
  lastUpdated?: number
  className?: string
}) {
  const [visible, setVisible] = React.useState({ download: true, upload: true })
  const wan = wans.find((item) => item.id === selectedWan)
  const simulatedAt = data[data.length - 1]?.t

  return (
    <Panel className={className}>
      <PanelHeader
        title={
          <span className="flex items-center gap-2">
            互联网活动
            <span className="rounded-full border border-line px-1.5 py-0.5 text-[9px] font-normal text-faint">
              {wan?.name ?? '未选择链路'}
            </span>
            <span className="rounded-full border border-line px-1.5 py-0.5 text-[9px] font-normal text-faint">模拟</span>
          </span>
        }
        actions={
          <>
            {onTogglePause ? (
              <Button variant="ghost" size="sm" className="h-7 gap-1 px-1.5 text-[10px]" onClick={onTogglePause}>
                {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
                {paused ? '继续' : '暂停'}
              </Button>
            ) : null}
            <Tabs value={range} onValueChange={(value) => onRangeChange(value as Range)}>
              <TabsList variant="segmented">
                {(Object.keys(rangeLabels) as Range[]).map((key) => (
                  <TabsTrigger key={key} value={key} className="px-2 text-[10px]">
                    {rangeLabels[key]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-faint px-3.5 py-2">
        <div className="flex items-center gap-1">
          <SeriesToggle
            label="下载"
            color="series-1"
            active={visible.download}
            onToggle={() => setVisible((state) => ({ ...state, download: !state.download }))}
          />
          <SeriesToggle
            label="上传"
            color="series-2"
            active={visible.upload}
            onToggle={() => setVisible((state) => ({ ...state, upload: !state.upload }))}
          />
        </div>
        <div className="flex items-center gap-2 text-[10px] text-faint">
          <span className="flex items-center gap-1">
            <Activity className={cn('size-3', paused ? 'text-warning' : 'text-success')} />
            <span className="tabular-nums text-muted">{paused ? '已暂停' : '实时'}</span>
            {(simulatedAt ?? lastUpdated) ? <span className="hidden text-faint sm:inline">· 模拟 {new Date((simulatedAt ?? lastUpdated)!).toLocaleTimeString('zh-CN', { hour12: false })}</span> : null}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 px-1.5 text-[10px]"
            onClick={() => onSelectWan(selectedWan === 'primary' ? 'secondary' : 'primary')}
            disabled={!wans.length}
          >
            切换线路
            <ChevronDown className="size-3" />
          </Button>
        </div>
      </div>
      <div className="px-3.5 pb-3 pt-3">
        <TrafficChart data={data} range={range} visible={visible} />
      </div>
    </Panel>
  )
}

function SeriesToggle({
  label,
  color,
  active,
  onToggle,
}: {
  label: string
  color: 'series-1' | 'series-2'
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={cn(
        'flex items-center gap-1.5 rounded-[var(--lat-radius-sm)] px-1.5 py-1 text-[10px] transition-opacity hover:bg-hover',
        active ? 'text-muted' : 'text-faint opacity-55',
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          color === 'series-1' ? 'bg-series-1' : 'bg-series-2',
          !active && 'bg-faint',
        )}
      />
      {label}
    </button>
  )
}
