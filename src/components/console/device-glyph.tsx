import { Camera, Laptop, Network, Router, Server, Wifi } from 'lucide-react'
import type { DeviceKind, DeviceStatus } from './types'
import { cn } from '@/lib/utils'
import { StatusDot } from '@/components/ui/status-dot'

const glyphs = {
  gateway: Router,
  switch: Network,
  ap: Wifi,
  client: Laptop,
  camera: Camera,
  server: Server,
}

export function DeviceGlyph({
  kind,
  status = 'online',
  size = 'md',
  className,
}: {
  kind: DeviceKind
  status?: DeviceStatus
  size?: 'sm' | 'md'
  className?: string
}) {
  const Icon = glyphs[kind]
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-[var(--lat-radius-sm)] border border-line bg-raised text-muted',
        size === 'sm' ? 'size-6' : 'size-8',
        className,
      )}
      aria-hidden="true"
    >
      <Icon className={size === 'sm' ? 'size-3.5' : 'size-4'} />
      <StatusDot
        status={status === 'online' ? 'online' : status === 'warning' ? 'warning' : 'offline'}
        className="absolute -bottom-0.5 -right-0.5 ring-2 ring-[var(--lat-surface)]"
      />
    </span>
  )
}
