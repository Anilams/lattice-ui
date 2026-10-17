import * as React from 'react'
import { cn } from '@/lib/utils'

export function Sparkline({
  values,
  color = 'series-1',
  className,
  height = 26,
}: {
  values: number[]
  color?: 'series-1' | 'series-2' | 'success' | 'warning'
  className?: string
  height?: number
}) {
  const id = React.useId().replace(/:/g, '')
  const width = 120
  if (!values.length) {
    return <div className={cn('text-[9px] text-faint', className)}>暂无数据</div>
  }
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = Math.max(max - min, 1)
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width
    const y = height - 3 - ((value - min) / range) * (height - 6)
    return [x, y] as const
  })
  const line = points
    .map(([x, y], index) => {
      if (index === 0) return 'M' + x + ' ' + y
      const [px, py] = points[index - 1]
      const mx = (px + x) / 2
      return 'C' + mx + ' ' + py + ' ' + mx + ' ' + y + ' ' + x + ' ' + y
    })
    .join(' ')
  const area = line + ' L ' + width + ' ' + height + ' L 0 ' + height + ' Z'
  const colorVar = 'var(--lat-' + color + ')'

  return (
    <svg
      viewBox={'0 0 ' + width + ' ' + height}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('w-full', className)}
      style={{ height }}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={colorVar} stopOpacity="0.28" />
          <stop offset="100%" stopColor={colorVar} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={'url(#' + id + ')'} />
      <path d={line} fill="none" stroke={colorVar} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
