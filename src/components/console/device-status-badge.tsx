import type { DeviceStatus } from './types'
import { Badge } from '@/components/ui/badge'

const labels: Record<DeviceStatus, string> = {
  online: '在线',
  warning: '注意',
  offline: '离线',
}

export function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <Badge tone={status === 'online' ? 'success' : status === 'warning' ? 'warning' : 'danger'} dot>
      {labels[status]}
    </Badge>
  )
}
