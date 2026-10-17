import * as React from 'react'
import { FlaskConical, Pause, Play, RotateCcw, TriangleAlert, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusDot } from '@/components/ui/status-dot'
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useToast } from '@/components/ui/toast'
import { useControlPlane, useSimulationState } from '@/sim/provider'

export function DemoControls() {
  const store = useControlPlane()
  const state = useSimulationState()
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const live = state.connection === 'live'
  const health = state.connection === 'degraded' || state.connection === 'offline' ? 'warning' : live ? 'online' : 'neutral'

  const injectAp = () => {
    store.injectApFailure('hall-ap')
    toast({ title: '已注入 AP 离线', description: '东厅 AP 心跳中断，告警和指标已同步。', tone: 'warning' })
  }
  const injectWan = () => {
    store.injectWanDegradation()
    toast({ title: '已注入 WAN 拥塞', description: 'WAN1 延迟升高，自动故障转移待命。', tone: 'warning' })
  }
  const recover = async () => {
    const ok = await store.recoverIncident()
    toast({
      title: ok ? '网络已恢复' : '恢复失败',
      description: ok ? '设备、端口、告警和指标已经同步。' : '请重试恢复命令。',
      tone: ok ? 'success' : 'danger',
    })
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="gap-1.5 text-[10px]" onClick={() => setOpen(true)} aria-label="打开演示控制">
        <FlaskConical className="size-3.5" />
        <span className="hidden xl:inline">演示</span>
        <StatusDot status={health} pulse={live} />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="p-0">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2"><FlaskConical className="size-4 text-action" />演示控制</SheetTitle>
            <SheetDescription>本地模拟运行时，不会连接真实控制器。</SheetDescription>
          </SheetHeader>
          <SheetBody className="p-4">
            <div className="grid grid-cols-2 gap-2 rounded-[var(--lat-radius-md)] border border-line bg-raised p-3 text-[10px]">
              <span className="text-faint">连接</span>
              <span className="text-right text-ink">{state.connection}</span>
              <span className="text-faint">场景</span>
              <span className="text-right text-ink">{state.scenario === 'normal' ? '正常' : state.scenario === 'ap-offline' ? 'AP 离线' : 'WAN 拥塞'}</span>
              <span className="text-faint">模拟时钟</span>
              <span className="lat-data text-right text-ink">tick {state.tick}</span>
              <span className="text-faint">模拟时间</span>
              <span className="lat-data text-right text-ink">{new Date(state.traffic['1h'][state.traffic['1h'].length - 1]?.t ?? state.lastUpdated).toLocaleTimeString('zh-CN', { hour12: false })}</span>
              <span className="text-faint">真实采集</span>
              <span className="lat-data text-right text-ink">{new Date(state.lastUpdated).toLocaleTimeString('zh-CN', { hour12: false })}</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button
                variant={state.paused ? 'primary' : 'secondary'}
                size="sm"
                className="flex-1"
                onClick={() => {
                  store.setPaused(!state.paused)
                  toast({ title: state.paused ? '已继续采样' : '已暂停采样', tone: 'info' })
                }}
              >
                {state.paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                {state.paused ? '继续' : '暂停'}
              </Button>
              <div className="flex items-center rounded-[var(--lat-radius-sm)] border border-line bg-raised p-0.5">
                {([1, 2, 4] as const).map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    aria-pressed={state.speed === speed}
                    onClick={() => store.setSpeed(speed)}
                    className={
                      'h-6 rounded-[var(--lat-radius-xs)] px-2 text-[10px] ' +
                      (state.speed === speed ? 'bg-surface text-ink shadow-[var(--lat-shadow-sm)]' : 'text-faint hover:text-ink')
                    }
                  >
                    {speed}×
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 text-[9px] font-medium uppercase tracking-[0.08em] text-faint">故障注入</div>
            <div className="mt-2 space-y-2">
              <Button variant="secondary" size="sm" className="w-full justify-start" onClick={injectAp}>
                <WifiOff className="size-3.5 text-danger" />
                注入东厅 AP 离线
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start" onClick={injectWan}>
                <TriangleAlert className="size-3.5 text-warning" />
                注入 WAN1 拥塞
              </Button>
              <Button variant="primary" size="sm" className="w-full justify-start" onClick={recover}>
                <RotateCcw className="size-3.5" />
                恢复全部并清除告警
              </Button>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-[9px] font-medium uppercase tracking-[0.08em] text-faint">命令记录</div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-1.5 text-[10px]"
                onClick={() => {
                  store.reset()
                  toast({ title: '演示已重置', description: '数据、告警和命令记录回到初始状态。', tone: 'info' })
                }}
              >
                <RotateCcw className="size-3" />
                重置
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {state.commands.length ? state.commands.slice(0, 5).map((command) => (
                <div key={command.id} className="flex items-center justify-between gap-2 rounded-[var(--lat-radius-sm)] border border-line-faint px-2 py-1.5 text-[10px]">
                  <span className="min-w-0 truncate text-muted">{command.label}</span>
                  <Badge tone={command.status === 'success' ? 'success' : command.status === 'error' ? 'danger' : 'warning'} className="shrink-0 px-1 py-0 text-[8px]">
                    {command.status}
                  </Badge>
                </div>
              )) : <div className="px-2 py-3 text-[10px] text-faint">执行恢复或端口操作后，命令会出现在这里。</div>}
            </div>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </>
  )
}
