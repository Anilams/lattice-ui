import * as React from 'react'
import type { Range, TrafficPoint } from './types'
import { cn } from '@/lib/utils'
import { useAnimatedNumber, useAnimatedSeries } from '@/hooks/use-motion'

const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'numeric',
  day: 'numeric',
})

function trafficLabel(range: Range, point: TrafficPoint | undefined, index: number, total: number) {
  if (point && point.t > 1_000_000_000_000) {
    return (range === '1w' || range === '1m' ? dateFormatter : timeFormatter).format(new Date(point.t))
  }
  const x = index / Math.max(total - 1, 1)
  if (range === '1h') return String(Math.min(23, 15 + Math.floor(x * 9))).padStart(2, '0') + ':00'
  if (range === '1d') return String(Math.min(23, Math.floor(x * 24))).padStart(2, '0') + ':00'
  if (range === '1w') return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][Math.min(6, Math.floor(x * 7))]
  return String(Math.min(30, Math.floor(x * 30) + 1)) + '日'
}

function smoothPath(
  values: number[],
  width: number,
  height: number,
  max: number,
) {
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width
    const y = height - (value / max) * height
    return [x, y] as const
  })
  return points
    .map(([x, y], index) => {
      if (index === 0) return 'M' + x.toFixed(2) + ' ' + y.toFixed(2)
      const [px, py] = points[index - 1]
      const mx = (px + x) / 2
      return 'C' + mx.toFixed(2) + ' ' + py.toFixed(2) + ' ' + mx.toFixed(2) + ' ' + y.toFixed(2) + ' ' + x.toFixed(2) + ' ' + y.toFixed(2)
    })
    .join(' ')
}

export function TrafficChart({
  data,
  range,
  visible = { download: true, upload: true },
  className,
}: {
  data: TrafficPoint[]
  range: Range
  visible?: { download: boolean; upload: boolean }
  className?: string
}) {
  const [hover, setHover] = React.useState<number | null>(null)
  const id = React.useId().replace(/:/g, '')
  const width = 1000
  const height = 210
  const downloadTargets = React.useMemo(() => data.map((point) => point.download), [data])
  const uploadTargets = React.useMemo(() => data.map((point) => point.upload), [data])
  const downloadValues = useAnimatedSeries(downloadTargets, 850)
  const uploadValues = useAnimatedSeries(uploadTargets, 850)
  const targetMax = Math.max(
    30,
    Math.ceil(Math.max(...data.map((point) => Math.max(point.download, point.upload)), 1) / 30) * 30,
  )
  const animatedMax = useAnimatedNumber(targetMax)
  const max = Math.max(30, Math.round(animatedMax / 30) * 30)
  if (!data.length) {
    return (
      <div className="flex h-[210px] items-center justify-center text-[10px] text-faint">
        暂无流量数据
      </div>
    )
  }
  const ticks = [1, 0.75, 0.5, 0.25, 0]
  const downloadPath = smoothPath(downloadValues, width, height, max)
  const uploadPath = smoothPath(uploadValues, width, height, max)
  const downloadArea = downloadPath + ' L ' + width + ' ' + height + ' L 0 ' + height + ' Z'
  const uploadArea = uploadPath + ' L ' + width + ' ' + height + ' L 0 ' + height + ' Z'
  const hoverPoint = hover === null ? null : data[hover]
  const hoverX = hover === null ? 0 : (hover / Math.max(data.length - 1, 1)) * 100

  return (
    <div className={cn('select-none', className)}>
      <div className="flex gap-2">
        <div className="flex h-[210px] w-9 flex-col justify-between pb-5 pt-1 text-right text-[9px] tabular-nums text-faint">
          {ticks.map((tick) => (
            <span key={tick}>{Math.round(max * tick)}</span>
          ))}
        </div>
        <div
          role="group"
          tabIndex={0}
          aria-label="互联网吞吐量图表。使用左右方向键查看数据点。"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault()
              setHover((current) => Math.min(data.length - 1, (current ?? -1) + 1))
            }
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              setHover((current) => Math.max(0, (current ?? data.length) - 1))
            }
            if (event.key === 'Escape') setHover(null)
          }}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
            setHover(Math.round(ratio * (data.length - 1)))
          }}
          onPointerLeave={() => setHover(null)}
          className="relative min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-action/35"
        >
          <svg
            viewBox={'0 0 ' + width + ' ' + height}
            preserveAspectRatio="none"
            className="h-[210px] w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={id + '-dl'} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--lat-series-1)" stopOpacity="0.24" />
                <stop offset="100%" stopColor="var(--lat-series-1)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={id + '-ul'} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--lat-series-2)" stopOpacity="0.16" />
                <stop offset="100%" stopColor="var(--lat-series-2)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {ticks.map((tick) => (
              <line
                key={tick}
                x1="0"
                x2={width}
                y1={height - height * tick}
                y2={height - height * tick}
                stroke="var(--lat-grid)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {visible.download ? (
              <>
                <path d={downloadArea} fill={'url(#' + id + '-dl)'} />
                <path
                  d={downloadPath}
                  fill="none"
                  stroke="var(--lat-series-1)"
                  strokeWidth="1.6"
                  vectorEffect="non-scaling-stroke"
                  style={{ animation: 'lat-chart-reveal 420ms var(--lat-ease-out)' }}
                />
              </>
            ) : null}
            {visible.upload ? (
              <>
                <path d={uploadArea} fill={'url(#' + id + '-ul)'} />
                <path
                  d={uploadPath}
                  fill="none"
                  stroke="var(--lat-series-2)"
                  strokeWidth="1.4"
                  strokeDasharray="3 3"
                  vectorEffect="non-scaling-stroke"
                  style={{ animation: 'lat-chart-reveal 520ms var(--lat-ease-out)' }}
                />
              </>
            ) : null}
            {hoverPoint ? (
              <line
                x1={(hover! / Math.max(data.length - 1, 1)) * width}
                x2={(hover! / Math.max(data.length - 1, 1)) * width}
                y1="0"
                y2={height}
                stroke="var(--lat-line-strong)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="2 3"
              />
            ) : null}
          </svg>

          {hoverPoint ? (
            <>
              {visible.download ? (
                <span
                  className="pointer-events-none absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-series-1 ring-2 ring-[var(--lat-surface)]"
                  style={{
                    left: hoverX + '%',
                    top: (1 - hoverPoint.download / max) * 100 + '%',
                  }}
                />
              ) : null}
              {visible.upload ? (
                <span
                  className="pointer-events-none absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-series-2 ring-2 ring-[var(--lat-surface)]"
                  style={{
                    left: hoverX + '%',
                    top: (1 - hoverPoint.upload / max) * 100 + '%',
                  }}
                />
              ) : null}
            </>
          ) : null}

          <div className="pointer-events-none mt-1 grid grid-cols-6 text-[9px] text-faint">
            {Array.from({ length: 6 }, (_, index) => {
              const pointIndex = Math.round((index / 5) * (data.length - 1))
              return (
                <span key={index} className={index === 5 ? 'text-right' : index === 0 ? 'text-left' : 'text-center'}>
                  {trafficLabel(range, data[pointIndex], pointIndex, data.length)}
                </span>
              )
            })}
          </div>

          {hoverPoint ? (
            <div
              role="status"
              className="pointer-events-none absolute top-2 z-10 min-w-32 rounded-[var(--lat-radius-sm)] border border-line-strong bg-overlay px-2 py-1.5 shadow-[var(--lat-shadow-panel)]"
              style={{
                left: hoverX + '%',
                transform: hoverX > 68 ? 'translateX(calc(-100% - 8px))' : 'translateX(8px)',
              }}
            >
              <div className="mb-1 text-[9px] text-faint">{trafficLabel(range, hoverPoint, hover!, data.length)}</div>
              {visible.download ? (
                <div className="flex items-center justify-between gap-4 text-[10px]">
                  <span className="flex items-center gap-1.5 text-muted">
                    <span className="size-1 rounded-full bg-series-1" />
                    下载
                  </span>
                  <span className="lat-data text-ink">{hoverPoint.download.toFixed(1)} Mbps</span>
                </div>
              ) : null}
              {visible.upload ? (
                <div className="mt-0.5 flex items-center justify-between gap-4 text-[10px]">
                  <span className="flex items-center gap-1.5 text-muted">
                    <span className="size-1 rounded-full bg-series-2" />
                    上传
                  </span>
                  <span className="lat-data text-ink">{hoverPoint.upload.toFixed(1)} Mbps</span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <p className="sr-only">
        当前显示 {data.length} 个数据点。下载峰值约 {Math.max(...data.map((p) => p.download)).toFixed(1)} Mbps，上传峰值约{' '}
        {Math.max(...data.map((p) => p.upload)).toFixed(1)} Mbps。
      </p>
    </div>
  )
}
