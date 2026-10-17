import * as React from 'react'
import { Activity, Cable, Power, RefreshCw, X } from 'lucide-react'
import type { Device, DeviceEvent, DevicePort, DeviceTraffic } from './types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { InlineNotice } from '@/components/ui/inline-notice'
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { DeviceGlyph } from './device-glyph'
import { DeviceStatusBadge } from './device-status-badge'
import { Sparkline } from './sparkline'

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })
  React.useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export type DeviceDetailPanelProps = {
  device: Device | null
  open: boolean
  onClose: () => void
  ports?: DevicePort[]
  events?: DeviceEvent[]
  traffic?: DeviceTraffic
  demoMode?: boolean
  onRestart?: () => void | Promise<void>
}

export function DeviceDetailPanel({
  device,
  open,
  onClose,
  ports,
  events,
  traffic,
  demoMode = false,
  onRestart,
}: DeviceDetailPanelProps) {
  const desktop = useMediaQuery('(min-width: 1280px)')
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const onCloseRef = React.useRef(onClose)
  onCloseRef.current = onClose

  React.useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
  }, [open])

  if (!open || !device) return null

  const header = (
    <div className="flex items-start gap-3">
      <DeviceGlyph kind={device.kind} status={device.status} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h2 className="truncate text-[var(--lat-text-md)] font-semibold text-ink">{device.name}</h2>
          <DeviceStatusBadge status={device.status} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[10px] text-faint">
          <span>{device.model}</span>
          <span className="text-line-strong">/</span>
          <span>{device.location}</span>
          <span className="text-line-strong">/</span>
          <span className="lat-data">{device.ip}</span>
        </div>
      </div>
    </div>
  )

  const body = (
    <DeviceDetailContent
      device={device}
      onClose={() => onCloseRef.current()}
      ports={ports}
      events={events}
      traffic={traffic}
      demoMode={demoMode}
      onRestart={onRestart}
    />
  )

  if (desktop) {
    return (
      <aside
        aria-label={device.name + ' 设备详情'}
        className="lat-sheet-content fixed bottom-0 right-0 top-[var(--lat-topbar-height)] z-30 flex w-[430px] flex-col border-l border-line bg-surface shadow-[var(--lat-shadow-overlay)]"
        data-state={open ? 'open' : 'closed'}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !event.defaultPrevented) {
            event.stopPropagation()
            onCloseRef.current()
          }
        }}
      >
        <div className="flex items-start gap-3 border-b border-line px-4 py-3.5">
          {header}
          <IconButton ref={closeRef} label="关闭设备详情" size="sm" onClick={() => onCloseRef.current()} className="shrink-0">
            <X className="size-3.5" />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{body}</div>
      </aside>
    )
  }

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onCloseRef.current()}>
      <SheetContent side="right" className="p-0">
        <SheetHeader>
          <SheetTitle>{device.name}</SheetTitle>
          <SheetDescription>
            {device.model} · {device.location}
          </SheetDescription>
        </SheetHeader>
        <SheetBody>{body}</SheetBody>
      </SheetContent>
    </Sheet>
  )
}

function DeviceDetailContent({
  device,
  onClose,
  ports,
  events,
  traffic,
  demoMode,
  onRestart,
}: {
  device: Device
  onClose: () => void
  ports?: DevicePort[]
  events?: DeviceEvent[]
  traffic?: DeviceTraffic
  demoMode: boolean
  onRestart?: () => void | Promise<void>
}) {
  const [tab, setTab] = React.useState('overview')
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [restarting, setRestarting] = React.useState(false)
  const [restartNote, setRestartNote] = React.useState('')
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const canRestart = demoMode || Boolean(onRestart)

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const runRestart = async () => {
    setConfirmOpen(false)
    setRestarting(true)
    setRestartNote('')
    try {
      if (onRestart) {
        await onRestart()
        setRestartNote('重启请求已发送。')
      } else if (demoMode) {
        await new Promise<void>((resolve) => {
          timer.current = setTimeout(resolve, 900)
        })
        setRestartNote('演示模式：未向真实设备发送重启命令。')
      }
    } catch (error) {
      setRestartNote(error instanceof Error ? error.message : '重启失败，请稍后重试。')
    } finally {
      setRestarting(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-line px-4">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              概览
            </TabsTrigger>
            <TabsTrigger value="ports" className="flex-1">
              端口
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">
              活动
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0 flex-1 outline-none">
          {traffic ? (
            <div className="grid grid-cols-2 border-b border-line">
              <div className="border-r border-line px-4 py-3">
                <div className="text-[10px] text-faint">下行速率</div>
                <div className="mt-0.5 lat-data text-[var(--lat-text-md)] text-ink">{device.rxRate ?? '—'}</div>
                <Sparkline values={traffic.download} color="series-1" className="mt-2" height={22} />
              </div>
              <div className="px-4 py-3">
                <div className="text-[10px] text-faint">上行速率</div>
                <div className="mt-0.5 lat-data text-[var(--lat-text-md)] text-ink">{device.txRate ?? '—'}</div>
                <Sparkline values={traffic.upload} color="series-2" className="mt-2" height={22} />
              </div>
            </div>
          ) : (
            <div className="border-b border-line px-4 py-3 text-[10px] text-faint">此设备未提供速率历史。</div>
          )}

          <div className="space-y-0">
            <DetailSection title="连接">
              <DetailRow label="父设备" value={device.parent} />
              <DetailRow label="端口" value={device.port ?? '—'} />
              <DetailRow label="上行链路" value={device.uplink} mono />
              <DetailRow label="客户端" value={String(device.clients)} />
            </DetailSection>

            {device.kind === 'ap' ? (
              <DetailSection title="无线">
                <DetailRow label="频道" value={(device.channel ?? '—') + ' · ' + (device.band ?? '')} mono />
                <DetailRow label="信道宽度" value={device.width ?? '—'} mono />
                <DetailRow label="SSID" value={device.ssid ?? '—'} />
                {typeof device.channelUtilization === 'number' ? (
                  <div className="mt-2.5">
                    <Meter
                      label="信道利用率"
                      value={device.channelUtilization}
                      tone={device.channelUtilization > 70 ? 'warning' : 'action'}
                    />
                  </div>
                ) : (
                  <DetailRow label="信道利用率" value="—" />
                )}
              </DetailSection>
            ) : null}

            <DetailSection title="系统">
              <DetailRow label="固件" value={device.firmware} mono />
              <DetailRow label="运行时间" value={device.uptime} />
              <DetailRow label="MAC 地址" value={device.mac} mono />
              <div className="mt-3 grid grid-cols-2 gap-4">
                <Meter label="CPU" value={device.cpu} tone={device.cpu > 70 ? 'warning' : 'action'} />
                <Meter label="内存" value={device.memory} tone={device.memory > 70 ? 'warning' : 'action'} />
              </div>
            </DetailSection>
          </div>
        </TabsContent>

        <TabsContent value="ports" className="mt-0 flex-1 outline-none">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <div className="text-[10px] text-faint">
              {ports?.length ? ports.length + ' 个端口 · 由调用方提供' : '未提供端口数据'}
            </div>
            {ports?.length ? (
              <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[10px]">
                <Cable className="size-3" />
                端口管理器
              </Button>
            ) : null}
          </div>
          {ports?.length ? (
            <div>
              {ports.map((port) => (
                <div
                  key={port.number}
                  className="grid grid-cols-[34px_1fr_62px_44px] items-center border-b border-line-faint px-4 py-2 text-[10px] last:border-b-0"
                >
                  <span className="lat-data text-faint">{String(port.number).padStart(2, '0')}</span>
                  <span className={cn('flex items-center gap-1.5', port.connected ? 'text-ink' : 'text-faint')}>
                    <span className={cn('size-1.5 rounded-full', port.connected ? 'bg-success' : 'bg-line-strong')} />
                    {port.connected ? port.label : '未连接'}
                  </span>
                  <span className="lat-data text-right text-muted">{port.speed ?? '—'}</span>
                  <span className="text-right text-faint">{port.poe ? 'PoE' : '—'}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyDetail text="此设备未提供端口列表。调用方可以通过 ports 属性传入端口数据。" />
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-0 flex-1 outline-none">
          {events?.length ? (
            events.map((event) => (
              <div key={event.time + event.title} className="flex gap-3 border-b border-line-faint px-4 py-3 last:border-b-0">
                <span className="lat-data w-16 shrink-0 text-[9px] text-faint">{event.time}</span>
                <div>
                  <div className="text-[11px] text-ink">{event.title}</div>
                  <div className="mt-0.5 text-[10px] text-faint">{event.detail}</div>
                </div>
              </div>
            ))
          ) : (
            <EmptyDetail text="此设备未提供活动记录。调用方可以通过 events 属性传入数据。" />
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-auto border-t border-line bg-surface px-4 py-3">
        {restartNote ? (
          <InlineNotice tone="info" className="mb-2 px-2 py-1.5">
            {restartNote}
          </InlineNotice>
        ) : null}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setConfirmOpen(true)}
            loading={restarting}
            disabled={!canRestart}
            title={canRestart ? undefined : '调用方未提供重启回调'}
          >
            <RefreshCw className="size-3" />
            重启
          </Button>
          <Button variant="primary" size="sm" className="flex-1" onClick={onClose}>
            完成
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[9px] text-faint">
          <span className="flex items-center gap-1">
            <Activity className="size-2.5" />
            {demoMode ? '演示数据' : '设备详情'}
          </span>
          <span className="lat-data">{device.mac}</span>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重启 {device.name}？</DialogTitle>
            <DialogDescription>
              {demoMode
                ? '设备会在约 2 分钟内暂时离线。当前是演示界面，确认后不会向真实设备发送命令。'
                : '设备会在约 2 分钟内暂时离线。请确认当前没有正在进行的配置任务。'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              取消
            </Button>
            <Button variant="danger" onClick={runRestart} loading={restarting} disabled={!canRestart}>
              <Power className="size-3.5" />
              确认重启
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmptyDetail({ text }: { text: string }) {
  return <div className="px-4 py-8 text-center text-[10px] leading-5 text-faint">{text}</div>
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line px-4 py-3.5 last:border-b-0">
      <h3 className="mb-2 text-[10px] font-medium uppercase tracking-[0.08em] text-faint">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-[11px]">
      <span className="shrink-0 text-faint">{label}</span>
      <span className={cn('min-w-0 truncate text-right text-muted', mono && 'lat-data text-[10px]')}>{value}</span>
    </div>
  )
}

function Meter({ label, value, tone }: { label: string; value: number; tone: 'action' | 'warning' }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[9px]">
        <span className="text-faint">{label}</span>
        <span className="lat-data text-muted">{value}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-raised">
        <div
          className={cn('h-full rounded-full', tone === 'warning' ? 'bg-warning' : 'bg-action')}
          style={{ width: Math.max(2, Math.min(100, value)) + '%' }}
        />
      </div>
    </div>
  )
}
