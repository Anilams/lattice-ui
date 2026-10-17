import type { Device, DevicePort, Range } from '@/components/console/types'
import { createInitialState, makePorts, makeSeries, rangeSpec } from './seed'
import type { Alert, CommandRecord, LogEntry, LogLevel, SimState } from './types'

const ranges: Range[] = ['1h', '1d', '1w', '1m']
const runtimeLogs = [
  ['客户端连接', '2 个客户端接入 Northstar · 5 GHz', 'online'],
  ['配置同步', '设备配置与控制器同步完成', 'online'],
  ['客户端漫游', '客户端从东厅 AP 漫游到西廊 AP', 'info'],
  ['备份完成', '配置快照已写入本地存储', 'online'],
] as const

let sequence = 0
const uid = (prefix: string) => prefix + '-' + Date.now() + '-' + ++sequence

function clockLabel() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export class ControlPlane {
  private state: SimState = createInitialState()
  private listeners = new Set<() => void>()
  private timer: ReturnType<typeof setInterval> | null = null
  private generation = 0

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getSnapshot = () => this.state

  start() {
    if (this.timer) return
    this.schedule()
  }

  stop() {
    if (!this.timer) return
    clearInterval(this.timer)
    this.timer = null
  }

  private schedule() {
    if (this.timer) clearInterval(this.timer)
    this.timer = setInterval(() => this.tick(), 1000 / this.state.speed)
  }

  private emit() {
    this.listeners.forEach((listener) => listener())
  }

  private update(updater: (state: SimState) => SimState) {
    this.state = updater(this.state)
    this.emit()
  }

  private log(level: LogLevel, source: string, message: string, deviceId?: string) {
    const entry: LogEntry = { id: uid('log'), time: clockLabel(), level, source, message, deviceId }
    this.update((state) => ({ ...state, logs: [entry, ...state.logs].slice(0, 120) }))
  }

  private activity(title: string, detail: string, tone: 'online' | 'warning' | 'info' | 'neutral') {
    this.update((state) => ({
      ...state,
      activities: [{ id: uid('activity'), time: clockLabel().slice(0, 5), title, detail, tone }, ...state.activities].slice(0, 8),
    }))
  }

  private stats(state: SimState): SimState['stats'] {
    return {
      wanUp: state.scenario === 'wan-degraded' ? 1 : 2,
      wanTotal: 2,
      clients: state.clients,
      devicesOnline: state.devices.filter((device) => device.status !== 'offline').length,
      devicesTotal: state.devices.length,
      alertsOpen: state.alerts.filter((alert) => alert.status === 'open').length,
    }
  }

  private nextTraffic(state: SimState) {
    const factor = state.scenario === 'ap-offline' ? 0.56 : state.scenario === 'wan-degraded' ? 0.72 : 1
    const next = { ...state.traffic }
    for (const range of ranges) {
      const current = state.traffic[range]
      const last = current[current.length - 1]
      const spec = rangeSpec[range]
      const n = current.length
      const x = (state.tick + 1) / 10
      const wave = Math.sin(x * 2.4 + n * 0.17) * 7 + Math.sin(x * 7.1 + 1.2) * 3
      next[range] = [
        ...current.slice(1),
        {
          t: last.t + spec.stepMs,
          download: Number(Math.max(4, (39 + wave + (state.tick % 11) * 0.8) * factor).toFixed(1)),
          upload: Number(Math.max(1.5, (8.4 + Math.sin(x * 5.2) * 2.6) * factor).toFixed(1)),
        },
      ]
    }
    return next
  }

  private recompute(state: SimState): SimState {
    return { ...state, stats: this.stats(state) }
  }

  tick() {
    if (this.state.paused) return
    const tick = this.state.tick + 1
    const degraded = this.state.scenario !== 'normal'
    const traffic = this.nextTraffic(this.state)
    const latencyValue = degraded ? 76 + (tick % 7) * 3 : 12 + Math.round(Math.abs(Math.sin(tick / 4)) * 3)
    const latency = [...this.state.latency.slice(1), latencyValue]
    const clients = clamp(
      this.state.clients + (tick % 5 === 0 ? (tick % 10 === 0 ? 1 : -1) : 0),
      20,
      36,
    )
    const ports = Object.fromEntries(
      Object.entries(this.state.ports).map(([id, list]) => [
        id,
        list.map((port) =>
          port.connected
            ? {
                ...port,
                utilization: clamp(
                  (port.utilization ?? 20) + Math.round(Math.sin(tick / 3 + port.number) * 4),
                  8,
                  92,
                ),
              }
            : port,
        ),
      ]),
    )
    let logs = this.state.logs
    let activities = this.state.activities
    if (tick % 7 === 0) {
      const [title, detail, tone] = runtimeLogs[tick % runtimeLogs.length]
      const entry: LogEntry = {
        id: uid('log'),
        time: clockLabel(),
        level: 'info',
        source: 'Northstar',
        message: detail,
      }
      logs = [entry, ...logs].slice(0, 120)
      activities = [
        { id: uid('activity'), time: clockLabel().slice(0, 5), title, detail, tone },
        ...activities,
      ].slice(0, 8)
    }
    this.update((state) =>
      this.recompute({
        ...state,
        tick,
        traffic,
        ports,
        latency,
        clients,
        logs,
        activities,
        connection: degraded ? 'degraded' : 'live',
        lastUpdated: Date.now(),
      }),
    )
  }

  setPaused(paused: boolean) {
    this.update((state) => this.recompute({
      ...state,
      paused,
      connection: paused ? 'paused' : state.scenario === 'normal' ? 'live' : 'degraded',
    }))
  }

  setSpeed(speed: 1 | 2 | 4) {
    this.update((state) => ({ ...state, speed }))
    this.schedule()
  }

  injectApFailure(deviceId = 'hall-ap') {
    const device = this.state.devices.find((item) => item.id === deviceId)
    if (!device) return
    const alert: Alert = {
      id: uid('alert'),
      severity: 'critical',
      title: device.name + ' 离线',
      detail: '设备心跳中断 · ' + (device.port ?? '端口未知'),
      deviceId,
      createdAt: clockLabel().slice(0, 5),
      status: 'open',
    }
    const ports = { ...this.state.ports }
    ports[deviceId] = (ports[deviceId] ?? []).map((port) => ({
      ...port,
      connected: false,
      status: 'down',
      utilization: 0,
    }))
    const devices = this.state.devices.map((item) =>
      item.id === deviceId ? { ...item, status: 'offline' as const, clients: 0 } : item,
    )
    this.update((state) => this.recompute({
      ...state,
      scenario: 'ap-offline',
      connection: 'degraded',
      devices,
      ports,
      topology: state.topology.map((node) =>
        node.label === device.name ? { ...node, status: 'offline' as const, sublabel: '心跳中断' } : node,
      ),
      alerts: [alert, ...state.alerts],
      clients: Math.max(12, state.clients - 4),
      logs: [
        { id: uid('log'), time: clockLabel(), level: 'error' as const, source: device.name, message: '设备心跳中断 · 端口链路 down', deviceId },
        ...state.logs,
      ].slice(0, 120),
      activities: [
        { id: uid('activity'), time: clockLabel().slice(0, 5), title: device.name + ' 离线', detail: '告警已创建 · 客户端数下降', tone: 'warning' as const },
        ...state.activities,
      ].slice(0, 8),
    }))
  }

  injectWanDegradation() {
    const alert: Alert = {
      id: uid('alert'),
      severity: 'warning',
      title: 'WAN1 延迟升高',
      detail: '主链路抖动 38 ms · 自动故障转移待命',
      createdAt: clockLabel().slice(0, 5),
      status: 'open',
    }
    this.update((state) => this.recompute({
      ...state,
      scenario: 'wan-degraded',
      connection: 'degraded',
      alerts: [alert, ...state.alerts],
      latency: [...state.latency.slice(1), 92],
      logs: [
        { id: uid('log'), time: clockLabel(), level: 'warn' as const, source: 'WAN1', message: '延迟超过阈值 · 自动故障转移待命' },
        ...state.logs,
      ].slice(0, 120),
    }))
  }

  async restartDevice(deviceId: string) {
    return this.runCommand('重启 ' + deviceId, () => {
      this.update((state) => this.recompute({
        ...state,
        devices: state.devices.map((device) => (device.id === deviceId ? { ...device, status: 'online' } : device)),
        connection: 'live',
      }))
    }, 1100)
  }

  async updateFirmware(deviceId: string) {
    return this.runCommand('更新固件 ' + deviceId, () => {
      this.update((state) => this.recompute({
        ...state,
        devices: state.devices.map((device) =>
          device.id === deviceId ? { ...device, firmware: device.firmware + ' → 6.8.1' } : device,
        ),
      }))
    }, 1200)
  }

  async togglePort(deviceId: string, portNumber: number) {
    return this.runCommand('切换端口 ' + portNumber, () => {
      this.update((state) => this.recompute({
        ...state,
        ports: {
          ...state.ports,
          [deviceId]: (state.ports[deviceId] ?? []).map((port) =>
            port.number === portNumber
              ? { ...port, connected: !port.connected, status: port.connected ? 'disabled' : 'up', utilization: port.connected ? 0 : 24 }
              : port,
          ),
        },
      }))
    }, 850)
  }

  async recoverIncident() {
    return this.runCommand('恢复网络', () => {
      this.update((state) => {
        const devices = state.devices.map((device) => ({ ...device, status: device.status === 'offline' ? 'online' as const : device.status, clients: device.clients || 4 }))
        const ports = Object.fromEntries(
          Object.entries(state.ports).map(([id, list]) => [
            id,
            list.map((port) => ({ ...port, connected: true, status: 'up' as const, utilization: Math.max(12, port.utilization ?? 12) })),
          ]),
        )
        return this.recompute({
          ...state,
          scenario: 'normal',
          connection: 'live',
          devices,
          ports,
          clients: 28,
          alerts: state.alerts.map((alert) => (alert.status === 'open' ? { ...alert, status: 'resolved' as const } : alert)),
          topology: state.topology.map((node) => ({ ...node, status: 'online' as const, sublabel: '已恢复' })),
          logs: [
            { id: uid('log'), time: clockLabel(), level: 'success' as const, source: 'Controller', message: '恢复命令完成 · 设备重新上线' },
            ...state.logs,
          ].slice(0, 120),
          activities: [
            { id: uid('activity'), time: clockLabel().slice(0, 5), title: '网络已恢复', detail: '设备、端口和告警状态同步恢复', tone: 'online' as const },
            ...state.activities,
          ].slice(0, 8),
        })
      })
    }, 1400)
  }

  async restartDevices(ids: string[]) {
    return this.runCommand('批量重启 ' + ids.length + ' 台设备', () => {
      this.update((state) => this.recompute({
        ...state,
        devices: state.devices.map((device) => (ids.includes(device.id) ? { ...device, status: 'online' } : device)),
      }))
    }, 1200)
  }

  ackAlert(id: string) {
    this.update((state) => this.recompute({
      ...state,
      alerts: state.alerts.map((alert) => (alert.id === id ? { ...alert, status: 'acked' } : alert)),
    }))
    this.log('info', 'Alerts', '告警已确认 · ' + id)
  }

  private async runCommand(label: string, work: () => void | Promise<void>, delay: number) {
    const id = uid('command')
    const generation = this.generation
    const command: CommandRecord = { id, label, status: 'pending', startedAt: clockLabel() }
    this.update((state) => ({ ...state, commands: [command, ...state.commands].slice(0, 20) }))
    this.log('info', 'Command', label + ' 已提交')
    await new Promise((resolve) => setTimeout(resolve, delay))
    if (generation !== this.generation) return false
    try {
      await work()
      this.update((state) => ({
        ...state,
        commands: state.commands.map((item) => (item.id === id ? { ...item, status: 'success' } : item)),
      }))
      this.log('success', 'Command', label + ' 完成')
      return true
    } catch {
      this.update((state) => ({
        ...state,
        commands: state.commands.map((item) => (item.id === id ? { ...item, status: 'error' } : item)),
      }))
      this.log('error', 'Command', label + ' 失败')
      return false
    }
  }

  reset() {
    this.generation += 1
    this.state = createInitialState()
    this.emit()
    this.schedule()
  }
}
