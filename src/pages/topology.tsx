import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, RefreshCw, TriangleAlert } from 'lucide-react'
import { topologyLinks } from '@/data/demo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { InlineNotice } from '@/components/ui/inline-notice'
import { useToast } from '@/components/ui/toast'
import { PageBody, PageHeader } from '@/components/console/page'
import { TopologyWorkbench } from '@/components/console/topology-workbench'
import { DeviceGlyph } from '@/components/console/device-glyph'
import { DeviceStatusBadge } from '@/components/console/device-status-badge'
import { LiveValue } from '@/components/console/live-value'
import { useControlPlane, useSimulationState } from '@/sim/provider'

export function TopologyPage() {
  const navigate = useNavigate()
  const store = useControlPlane()
  const state = useSimulationState()
  const { toast } = useToast()
  const [selectedId, setSelectedId] = React.useState('ap1')
  const selected = state.topology.find((node) => node.id === selectedId) ?? state.topology[0]
  const device = selected ? state.devices.find((item) => item.name === selected.label) : undefined
  const incident = state.scenario !== 'normal'

  const recover = async () => {
    const ok = await store.recoverIncident()
    toast({
      title: ok ? '网络已恢复' : '恢复失败',
      description: ok ? '拓扑、设备和告警已经同步。' : '请重试。',
      tone: ok ? 'success' : 'danger',
    })
  }

  const restart = async () => {
    if (!device) return
    const ok = await store.restartDevice(device.id)
    toast({ title: ok ? '重启命令已发送' : '重启失败', tone: ok ? 'success' : 'danger' })
  }

  return (
    <PageBody>
      <PageHeader
        title="拓扑"
        description="北辰实验室 · 实时节点、链路和故障定位。拖动画布，使用 +/- 缩放。"
        meta={<Badge tone={incident ? 'warning' : 'success'} dot>{incident ? '故障中' : '运行正常'}</Badge>}
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate('/devices')}>
              设备清单
              <ArrowRight className="size-3.5" />
            </Button>
            {incident ? (
              <Button variant="primary" onClick={recover}>
                <RefreshCw className="size-3.5" />
                恢复网络
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => { store.injectApFailure('hall-ap'); toast({ title: '已注入 AP 离线', tone: 'warning' }) }}>
                <TriangleAlert className="size-3.5" />
                注入故障
              </Button>
            )}
          </>
        }
      />

      {incident ? (
        <InlineNotice tone="warning" title="故障定位：东厅 AP 心跳中断" className="mb-3">
          <span className="flex flex-wrap items-center gap-2">
            端口链路 down，客户端数下降。可以从拓扑节点进入设备详情，或直接恢复网络。
            <Button variant="link" size="sm" className="h-auto px-0 text-[10px]" onClick={recover}>恢复</Button>
          </span>
        </InlineNotice>
      ) : null}

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <TopologyWorkbench
          nodes={state.topology}
          links={topologyLinks}
          selectedId={selected?.id}
          onSelect={(node) => setSelectedId(node.id)}
        />
        <Panel className="self-start">
          <PanelHeader
            title="节点详情"
            description={selected ? selected.label : '未选择节点'}
            actions={selected ? <Badge tone={selected.status === 'online' ? 'success' : selected.status === 'warning' ? 'warning' : 'danger'} dot>{selected.status}</Badge> : null}
          />
          {selected ? (
            <div className="space-y-4 p-3.5">
              <div className="flex items-center gap-2.5">
                <DeviceGlyph kind={selected.kind} status={selected.status} />
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-ink">{selected.label}</div>
                  <div className="mt-0.5 text-[10px] text-faint">{selected.sublabel}</div>
                </div>
              </div>
              <div className="space-y-2 border-y border-line py-3 text-[10px]">
                <Row label="地址" value={selected.meta} mono />
                <Row label="角色" value={selected.kind} />
                <Row label="客户端" value={device ? <LiveValue value={device.clients} /> : '—'} />
                <Row label="上行" value={device?.uplink ?? '—'} mono />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  disabled={!device}
                  onClick={() => device && navigate('/devices?device=' + device.id)}
                >
                  打开设备
                </Button>
                <Button variant="primary" size="sm" className="flex-1" disabled={!device} onClick={restart}>
                  重启
                </Button>
              </div>
              {device ? <DeviceStatusBadge status={device.status} /> : null}
            </div>
          ) : (
            <div className="px-3.5 py-10 text-center text-[10px] text-faint">选择一个拓扑节点查看详情。</div>
          )}
        </Panel>
      </div>
    </PageBody>
  )
}

function Row({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-faint">{label}</span>
      <span className={mono ? 'lat-data text-right text-muted' : 'text-right text-muted'}>{value}</span>
    </div>
  )
}
