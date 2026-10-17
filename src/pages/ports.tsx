import * as React from 'react'
import { Cable, RefreshCw, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { InlineNotice } from '@/components/ui/inline-notice'
import { useToast } from '@/components/ui/toast'
import { PageBody, PageHeader } from '@/components/console/page'
import { PortMatrix } from '@/components/console/port-matrix'
import { DeviceGlyph } from '@/components/console/device-glyph'
import { DeviceStatusBadge } from '@/components/console/device-status-badge'
import { LiveValue } from '@/components/console/live-value'
import { useControlPlane, useSimulationState } from '@/sim/provider'
import { cn } from '@/lib/utils'

export function PortsPage() {
  const store = useControlPlane()
  const state = useSimulationState()
  const { toast } = useToast()
  const [deviceId, setDeviceId] = React.useState('workshop-sw')
  const [portNumber, setPortNumber] = React.useState<number | null>(1)
  React.useEffect(() => {
    if (state.scenario === 'ap-offline') setDeviceId('hall-ap')
  }, [state.scenario])
  const device = state.devices.find((item) => item.id === deviceId) ?? state.devices[0]
  const ports = state.ports[device?.id] ?? []
  const port = ports.find((item) => item.number === portNumber) ?? ports[0]
  const incident = state.scenario !== 'normal'

  const toggle = async () => {
    if (!device || !port) return
    const ok = await store.togglePort(device.id, port.number)
    toast({
      title: ok ? (port.connected ? '端口已禁用' : '端口已启用') : '端口操作失败',
      description: ok ? '端口状态和日志已经更新。' : '请稍后重试。',
      tone: ok ? 'success' : 'danger',
    })
  }

  const recover = async () => {
    const ok = await store.recoverIncident()
    toast({ title: ok ? '网络已恢复' : '恢复失败', tone: ok ? 'success' : 'danger' })
  }

  return (
    <PageBody>
      <PageHeader
        title="端口"
        description="端口矩阵、PoE 与链路状态。端口数据由演示运行时实时更新。"
        meta={<Badge tone={incident ? 'warning' : 'success'} dot>{incident ? '故障中' : '运行正常'}</Badge>}
        actions={
          incident ? (
            <Button variant="primary" onClick={recover}>
              <RefreshCw className="size-3.5" />
              恢复网络
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => { store.injectApFailure('hall-ap'); toast({ title: '已注入 AP 离线', tone: 'warning' }) }}>
              <WifiOff className="size-3.5" />
              注入故障
            </Button>
          )
        }
      />

      {incident ? (
        <InlineNotice tone="warning" title="东厅 AP 端口链路 down" className="mb-3">
          从故障 AP 的端口或拓扑节点进入详情，执行恢复后会同步端口状态。
        </InlineNotice>
      ) : null}

      <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
        {state.devices
          .filter((item) => ['gateway', 'switch', 'ap'].includes(item.kind))
          .map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setDeviceId(item.id)
                setPortNumber(null)
              }}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-[var(--lat-radius-sm)] border px-2.5 py-1.5 text-[10px] transition-colors',
                item.id === device?.id ? 'border-action/50 bg-action-soft text-ink' : 'border-line bg-surface text-muted hover:bg-hover hover:text-ink',
              )}
            >
              <DeviceGlyph kind={item.kind} status={item.status} size="sm" />
              {item.name}
              <DeviceStatusBadge status={item.status} />
            </button>
          ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_310px]">
        <Panel>
          <PanelHeader
            title={<span className="flex items-center gap-2"><Cable className="size-3.5 text-faint" />{device?.name ?? '端口'} · 端口矩阵</span>}
            description={device ? device.model + ' · ' + device.ip : '未选择设备'}
            actions={<Badge tone="neutral">{ports.filter((item) => item.connected).length} / {ports.length} 已连接</Badge>}
          />
          <div className="p-3">
            <PortMatrix ports={ports} selected={port?.number} onSelect={(item) => setPortNumber(item.number)} />
          </div>
        </Panel>

        <Panel className="self-start">
          <PanelHeader title="端口详情" description={port ? '端口 ' + String(port.number).padStart(2, '0') : '未选择端口'} />
          {port ? (
            <div className="space-y-3 p-3.5 text-[10px]">
              <div className="flex items-center gap-2.5">
                <span className={cn('size-2 rounded-full', port.connected ? 'bg-success' : port.status === 'disabled' ? 'bg-warning' : 'bg-danger')} />
                <span className="text-[12px] text-ink">{port.label || '未连接'}</span>
                <Badge tone={port.connected ? 'success' : port.status === 'disabled' ? 'warning' : 'danger'}>{port.connected ? '已连接' : port.status === 'disabled' ? '已禁用' : '未连接'}</Badge>
              </div>
              <div className="space-y-2 border-y border-line py-3">
                <Row label="速率" value={port.speed ?? '—'} />
                <Row label="PoE" value={port.poe ? '已启用' : '—'} />
                <Row label="利用率" value={typeof port.utilization === 'number' ? <LiveValue value={port.utilization} suffix="%" /> : '—'} />
                <Row label="设备" value={device?.name ?? '—'} />
              </div>
              <Button variant={port.connected ? 'danger' : 'primary'} size="sm" className="w-full" onClick={toggle}>
                {port.connected ? '禁用端口' : '启用端口'}
              </Button>
            </div>
          ) : (
            <div className="px-3.5 py-10 text-center text-[10px] text-faint">选择一个端口查看详情。</div>
          )}
        </Panel>
      </div>
    </PageBody>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-faint">{label}</span>
      <span className="text-right text-muted">{value}</span>
    </div>
  )
}
