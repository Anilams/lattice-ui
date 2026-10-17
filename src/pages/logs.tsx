import * as React from 'react'
import { Download, Pause, Play, Search, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/toast'
import { PageBody, PageHeader } from '@/components/console/page'
import { LogStream } from '@/components/console/log-stream'
import { useControlPlane, useSimulationState } from '@/sim/provider'
import { cn } from '@/lib/utils'

const levels = ['info', 'success', 'warn', 'error'] as const

export function LogsPage() {
  const store = useControlPlane()
  const state = useSimulationState()
  const { toast } = useToast()
  const [tab, setTab] = React.useState('logs')
  const [search, setSearch] = React.useState('')
  const [selectedLevels, setSelectedLevels] = React.useState<string[]>([])
  const [paused, setPaused] = React.useState(false)

  const filteredLogs = state.logs.filter((line) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [line.message, line.source, line.time].some((value) => value.toLowerCase().includes(query))
    const matchesLevel = !selectedLevels.length || selectedLevels.includes(line.level)
    return matchesSearch && matchesLevel
  })

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'lattice-logs.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageBody>
      <PageHeader
        title="日志与告警"
        description="实时日志 tail、级别筛选和告警确认。所有事件来自本地模拟运行时。"
        meta={<Badge tone={state.alerts.some((alert) => alert.status === 'open') ? 'warning' : 'success'} dot>{state.alerts.filter((alert) => alert.status === 'open').length} 个开放告警</Badge>}
        actions={
          <>
            <Button variant="secondary" onClick={exportLogs}>
              <Download className="size-3.5" />
              导出
            </Button>
            <Button variant={paused ? 'primary' : 'secondary'} onClick={() => setPaused((value) => !value)}>
              {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              {paused ? '继续 tail' : '暂停 tail'}
            </Button>
          </>
        }
      />

      <Panel className="overflow-hidden">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
            <TabsList>
              <TabsTrigger value="logs">日志 <span className="text-[9px] text-faint">{filteredLogs.length}</span></TabsTrigger>
              <TabsTrigger value="alerts">告警 <span className="text-[9px] text-faint">{state.alerts.length}</span></TabsTrigger>
            </TabsList>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="搜索日志"
                aria-label="搜索日志"
                leading={<Search className="size-3.5" />}
                containerClassName="w-[180px]"
              />
              <div className="flex items-center gap-1">
                {levels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-pressed={selectedLevels.includes(level)}
                    onClick={() =>
                      setSelectedLevels((current) =>
                        current.includes(level) ? current.filter((item) => item !== level) : [...current, level],
                      )
                    }
                    className={cn(
                      'rounded-full border px-1.5 py-0.5 text-[8px] uppercase',
                      selectedLevels.includes(level) ? 'border-action/40 bg-action-soft text-action' : 'border-line text-faint hover:text-ink',
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <TabsContent value="logs" className="mt-0">
            <div className="h-[520px]">
              <LogStream logs={filteredLogs} paused={paused} autoScroll={!paused} className="h-full" />
            </div>
            <div className="flex items-center justify-between border-t border-line px-3 py-2 text-[9px] text-faint">
              <span>{paused ? 'tail 已暂停' : '实时 tail'} · 更新 {new Date(state.lastUpdated).toLocaleTimeString('zh-CN', { hour12: false })}</span>
              <span className="lat-data">tick {state.tick}</span>
            </div>
          </TabsContent>
          <TabsContent value="alerts" className="mt-0">
            {state.alerts.length ? (
              <div>
                {state.alerts.map((alert) => (
                  <div key={alert.id} className="flex flex-wrap items-center gap-2 border-b border-line-faint px-3 py-3 last:border-b-0">
                    <ShieldAlert className={cn('size-3.5', alert.severity === 'critical' ? 'text-danger' : alert.severity === 'warning' ? 'text-warning' : 'text-info')} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-ink">{alert.title}</div>
                      <div className="mt-0.5 text-[9px] text-faint">{alert.detail} · {alert.createdAt}</div>
                    </div>
                    <Badge tone={alert.status === 'resolved' ? 'success' : alert.status === 'acked' ? 'neutral' : alert.severity === 'critical' ? 'danger' : 'warning'}>
                      {alert.status}
                    </Badge>
                    {alert.status === 'open' ? (
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px]" onClick={() => { store.ackAlert(alert.id); toast({ title: '告警已确认', tone: 'success' }) }}>
                        确认
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center text-[10px] text-faint">当前没有告警。</div>
            )}
          </TabsContent>
        </Tabs>
      </Panel>
    </PageBody>
  )
}
