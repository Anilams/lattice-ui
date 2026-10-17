import { MoreHorizontal } from 'lucide-react'
import type { ActivityItem } from './types'
import { cn } from '@/lib/utils'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { IconButton } from '@/components/ui/icon-button'
import { StatusDot } from '@/components/ui/status-dot'

const toneMap: Record<string, 'online' | 'warning' | 'info' | 'neutral'> = {
  online: 'online',
  warning: 'warning',
  info: 'info',
  neutral: 'neutral',
}

export function ActivityFeed({ items, className }: { items: ActivityItem[]; className?: string }) {
  return (
    <Panel className={cn('flex min-h-0 flex-col', className)}>
      <PanelHeader
        title="最近活动"
        actions={
          <IconButton label="活动菜单" size="sm">
            <MoreHorizontal className="size-3.5" />
          </IconButton>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {items.length ? items.map((activity) => (
          <div key={activity.id} className="flex gap-2.5 border-b border-line-faint px-3.5 py-2.5 last:border-b-0">
            <span className="lat-data mt-0.5 w-8 shrink-0 text-[10px] tabular-nums text-faint">{activity.time}</span>
            <StatusDot status={toneMap[activity.tone]} className="mt-1.5" />
            <div className="min-w-0">
              <div className="truncate text-[var(--lat-text-xs)] leading-4 text-ink">{activity.title}</div>
              <div className="mt-0.5 truncate text-[10px] text-faint">{activity.detail}</div>
            </div>
          </div>
        )) : (
          <div className="px-3.5 py-8 text-center text-[10px] text-faint">暂无活动记录</div>
        )}
      </div>
      <div className="border-t border-line px-3.5 py-2">
        <button className="text-[10px] text-action hover:text-action-hover">查看全部活动</button>
      </div>
    </Panel>
  )
}
