import * as React from 'react'
import { useAnimatedNumber } from '@/hooks/use-motion'
import { cn } from '@/lib/utils'

export function LiveValue({
  value,
  decimals = 0,
  suffix,
  className,
}: {
  value: number
  decimals?: number
  suffix?: string
  className?: string
}) {
  const animated = useAnimatedNumber(value)
  const formatted = new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(animated)

  return (
    <span className={cn('lat-tabular', className)}>
      {formatted}
      {suffix ? <span className="ml-0.5 text-[0.7em] font-normal text-muted">{suffix}</span> : null}
    </span>
  )
}
