import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Gauge, RefreshCw, TriangleAlert } from 'lucide-react'
import type { Range, Wan } from '@/data/demo'
import { clients, topologyLinks, wans } from '@/data/demo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { Switch } from '@/components/ui/switch'
import { InlineNotice } from '@/components/ui/inline-notice'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import { DeviceGlyph } from '@/components/console/device-glyph'
import { PageBody, PageHeader } from '@/components/console/page'
import { HealthStrip, healthIcons } from '@/components/console/health-strip'
import { TrafficPanel } from '@/components/console/traffic-panel'
import { TopologyMap } from '@/components/console/topology-map'
import { ActivityFeed } from '@/components/console/activity-feed'
import { Sparkline } from '@/components/console/sparkline'
import { LiveValue } from '@/components/console/live-value'
import { useControlPlane, useSimulationState } from '@/sim/provider'
import { cn } from '@/lib/utils'

export function DashboardPage() {
  const navigate = useNavigate()
  const store = useControlPlane()
  const state = useSimulationState()
  const { toast } = useToast()
  const [range, setRange] = React.useState<Range>('1h')
  const [wan, setWan] = React.useState<'primary' | 'secondary'>('primary')
  const [failover, setFailover] = React.useState(true)
  const [natOpen, setNatOpen] = React.useState(false)
  const [speedOpen, setSpeedOpen] = React.useState(false)
  const [testing, setTesting] = React.useState(false)
  const [result, setResult] = React.useState<{ download: number; upload: number; latency: number } | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const incident = state.scenario !== 'normal'
  const openAlert = state.alerts.find((alert) => alert.status === 'open')
  const traffic = state.traffic[range]
  const deviceHealthy = state.stats.devicesOnline === state.stats.devicesTotal
  const healthy = !incident && state.stats.alertsOpen === 0 && deviceHealthy

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const runSpeedTest = () => {
    setTesting(true)
    setResult(null)
    timer.current = setTimeout(() => {
      setTesting(false)
      setResult({ download: 842.6, upload: 317.8, latency: 12 })
      setSpeedOpen(true)
      toast({ title: '速度测试完成', description: '北星光纤 · 演示结果', tone: 'success' })
    }, 1200)
  }

  const inject = () => {
    store.injectApFailure('hall-ap')
    toast({ title: '已注入 AP 离线', description: '健康条、图表、设备与告警同步变化。', tone: 'warning' })
  }

  const recover = async () => {
    const ok = await store.recoverIncident()
    toast({
      title: ok ? '网络已恢复' : '恢复失败',
      description: ok ? '设备、端口和告警已经同步。' : '请重试恢复命令。',
      tone: ok ? 'success' : 'danger',
    })
  }

  return (
    <PageBody>
      <PageHeader
        title="概览"
        description={'北辰实验室 · ' + state.stats.devicesOnline + ' 台设备在线、' + state.stats.clients + ' 个客户端、' + state.stats.alertsOpen + ' 个开放告警。'}
        meta={
          <Badge tone={healthy ? 'success' : 'warning'} dot>
            {incident ? '需要处理' : state.stats.alertsOpen ? '有告警' : '运行正常'}
          </Badge>
        }
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
              <Button variant="secondary" onClick={inject}>
                <TriangleAlert className="size-3.5" />
                注入故障
              </Button>
            )}
            <Button variant="primary" onClick={runSpeedTest} loading={testing}>
              {testing ? '测试中…' : '速度测试'}
            </Button>
          </>
        }
      />

      {incident ? (
        <InlineNotice
          tone="danger"
          title={openAlert?.title ?? '网络故障'}
          action={
            <Button variant="link" size="sm" className="h-auto text-[10px]" onClick={recover}>
              恢复
            </Button>
          }
          className="mb-3"
        >
          {openAlert?.detail ?? '故障已注入。打开拓扑、端口或设备详情查看证据。'}
        </InlineNotice>
      ) : (
        <InlineNotice
          tone="warning"
          title="在 WAN1 上检测到上游 NAT"
          action={
            <Button variant="link" size="sm" className="h-auto text-[10px]" onClick={() => setNatOpen(true)}>
              了解更多
            </Button>
          }
          className="mb-3"
        >
          部分入站连接可能受限。演示数据不会修改任何网络配置。
        </InlineNotice>
      )}

      <HealthStrip
        segments={[
          {
            label: '互联网',
            value: <><LiveValue value={state.stats.wanUp} /> / {state.stats.wanTotal}</>,
            detail: incident && state.scenario === 'wan-degraded' ? 'WAN1 降级' : '1 Gbps 主链路',
            status: state.scenario === 'wan-degraded' ? 'warning' : 'online',
            icon: healthIcons.router,
          },
          {
            label: '无线客户端',
            value: <LiveValue value={state.stats.clients} />,
            detail: '5 个 AP · 98% 信号',
            status: incident ? 'warning' : 'online',
            icon: healthIcons.radio,
          },
          {
            label: '设备',
            value: <><LiveValue value={state.stats.devicesOnline} /> / {state.stats.devicesTotal}</>,
            detail: deviceHealthy ? '全部在线' : '1 台离线',
            status: deviceHealthy ? 'online' : 'warning',
            icon: healthIcons.check,
          },
          {
            label: '安全',
            value: <LiveValue value={state.stats.alertsOpen} />,
            detail: state.stats.alertsOpen ? '开放告警' : '过去 24 小时无告警',
            status: state.stats.alertsOpen ? 'warning' : 'online',
            icon: healthIcons.shield,
          },
        ]}
        className="mb-3"
      />

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.58fr)_minmax(300px,1fr)]">
        <div className="min-w-0 space-y-3">
          <TrafficPanel
            data={traffic}
            range={range}
            onRangeChange={setRange}
            wans={wans}
            selectedWan={wan}
            onSelectWan={setWan}
            paused={state.paused}
            onTogglePause={() => store.setPaused(!state.paused)}
            lastUpdated={state.lastUpdated}
          />
          <TopologyMap nodes={state.topology} links={topologyLinks} />
        </div>
        <div className="min-w-0 space-y-3">
          <UplinkPanel selected={wan} onSelect={setWan} failover={failover} onFailoverChange={setFailover} />
          <ActivityFeed items={state.activities} />
          <ClientPanel />
        </div>
      </div>

      <Dialog open={natOpen} onOpenChange={setNatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>上游 NAT 检测</DialogTitle>
            <DialogDescription>
              控制器在 WAN1 的上游检测到地址转换，意味着外部设备直接访问内部服务时可能受限。
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-[var(--lat-radius-md)] border border-line bg-raised p-3 text-[var(--lat-text-xs)] leading-5 text-muted">
            <div className="flex items-center justify-between border-b border-line pb-2"><span>接口</span><span className="lat-data text-ink">WAN1</span></div>
            <div className="flex items-center justify-between border-b border-line py-2"><span>检测结果</span><span className="text-warning">上游 NAT 存在</span></div>
            <div className="flex items-center justify-between pt-2"><span>建议</span><span className="text-right text-ink">需要入站服务时配置端口转发</span></div>
          </div>
          <DialogFooter><Button onClick={() => setNatOpen(false)}>知道了</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={speedOpen} onOpenChange={setSpeedOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>速度测试完成</DialogTitle>
            <DialogDescription>北星光纤 · 203.0.113.24 · 演示结果</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 divide-x divide-line rounded-[var(--lat-radius-md)] border border-line">
            {[
              ['下载', result?.download.toFixed(1) ?? '—', 'Mbps'],
              ['上传', result?.upload.toFixed(1) ?? '—', 'Mbps'],
              ['延迟', result?.latency != null ? String(result.latency) : '—', 'ms'],
            ].map(([label, value, unit]) => (
              <div key={label} className="px-3 py-4">
                <div className="text-[10px] text-faint">{label}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="lat-data text-[var(--lat-text-2xl)] text-ink">{value}</span>
                  <span className="text-[9px] text-faint">{unit}</span>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter><Button onClick={() => setSpeedOpen(false)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageBody>
  )
}

function UplinkPanel({
  selected,
  onSelect,
  failover,
  onFailoverChange,
}: {
  selected: 'primary' | 'secondary'
  onSelect: (id: 'primary' | 'secondary') => void
  failover: boolean
  onFailoverChange: (value: boolean) => void
}) {
  return (
    <Panel>
      <PanelHeader title="上行链路" description="按延迟与使用量排序" actions={<Badge tone="success" dot>2 条在线</Badge>} />
      <div>
        {wans.map((item) => (
          <WanRow key={item.id} wan={item} selected={selected === item.id} onSelect={() => onSelect(item.id)} />
        ))}
      </div>
      <div className="border-t border-line px-3.5 py-2.5">
        <Switch label="自动故障转移" description="主链路中断时切换到海港专线" checked={failover} onCheckedChange={onFailoverChange} />
      </div>
    </Panel>
  )
}

function WanRow({ wan, selected, onSelect }: { wan: Wan; selected: boolean; onSelect: () => void }) {
  const [values] = React.useState(() =>
    wan.id === 'primary' ? [14, 19, 16, 24, 21, 29, 25, 23, 31, 28, 36, 32] : [7, 10, 8, 13, 11, 16, 14, 18, 15, 19, 17, 22],
  )
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn('block w-full border-b border-line-faint px-3.5 py-2.5 text-left transition-colors last:border-b-0 hover:bg-hover', selected && 'bg-selected')}
    >
      <div className="flex items-center gap-2">
        <span className={cn('size-1.5 shrink-0 rounded-full', wan.color === 'cyan' ? 'bg-series-1' : 'bg-series-2')} />
        <span className="min-w-0 flex-1 text-[var(--lat-text-xs)] font-medium text-ink">{wan.name}</span>
        <span className="text-[9px] text-faint">{wan.isp}</span>
        {selected ? <span className="size-1.5 rounded-full bg-action" aria-hidden="true" /> : null}
      </div>
      <div className="mt-1.5 grid grid-cols-[1fr_92px] items-end gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[9px] text-faint">
            <span className="lat-data">{wan.ip}</span><span className="text-line-strong">/</span><span>{wan.speed}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-muted"><Gauge className="size-2.5" /><span className="lat-data">{wan.latency} ms</span></span>
            <span className="text-faint">抖动 {wan.jitter} ms</span><span className="text-faint">丢包 {wan.loss}%</span>
          </div>
        </div>
        <div className="w-full">
          <Sparkline values={values} color={wan.color === 'cyan' ? 'series-1' : 'series-2'} height={24} />
          <div className="mt-0.5 text-right text-[9px] text-faint">本月 {wan.usage}</div>
        </div>
      </div>
    </button>
  )
}

function ClientPanel() {
  return (
    <Panel>
      <PanelHeader title="热门客户端" description="过去 24 小时" actions={<Button variant="ghost" size="sm" className="h-6 gap-1 px-1.5 text-[10px]">全部<ArrowRight className="size-3" /></Button>} />
      <div>
        {clients.map((client) => (
          <div key={client.id} className="flex items-center gap-2.5 border-b border-line-faint px-3.5 py-2 last:border-b-0">
            <DeviceGlyph kind={client.kind} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px] text-ink">{client.name}</div>
              <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-raised"><div className="h-full rounded-full bg-action/60" style={{ width: client.percent + '%' }} /></div>
            </div>
            <span className="lat-data shrink-0 text-[9px] text-faint">{client.usage}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}
