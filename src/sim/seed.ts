import { activities, devices, topologyNodes } from '@/data/demo'
import type { Device, DevicePort, Range, TopologyNode, TrafficPoint } from '@/components/console/types'
import type { Alert, LogEntry, SimState } from './types'

export const rangeSpec: Record<Range, { count: number; stepMs: number }> = {
  '1h': { count: 60, stepMs: 60_000 },
  '1d': { count: 96, stepMs: 900_000 },
  '1w': { count: 84, stepMs: 7_200_000 },
  '1m': { count: 90, stepMs: 28_800_000 },
}

function clockLabel(date = new Date()) {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function makeSeries(range: Range, factor = 1, end = Date.now()): TrafficPoint[] {
  const spec = rangeSpec[range]
  const seed = range === '1h' ? 1 : range === '1d' ? 2 : range === '1w' ? 3 : 4
  return Array.from({ length: spec.count }, (_, index) => {
    const x = index / Math.max(spec.count - 1, 1)
    const wave = Math.sin((x * 7 + seed) * Math.PI) * 16 + Math.sin(x * 31 + 1.4) * 5
    const noise = Math.sin(index * 12.9898 + seed * 78.233) * 4
    const spike = index === Math.floor(spec.count * 0.46) ? 26 : index === Math.floor(spec.count * 0.83) ? 14 : 0
    return {
      t: end - (spec.count - 1 - index) * spec.stepMs,
      download: Math.max(4, (38 + wave + noise + spike) * factor),
      upload: Math.max(1.5, (8 + Math.sin(x * 11 + 0.8) * 3 + noise * 0.2) * factor),
    }
  }).map((point) => ({
    ...point,
    download: Number(point.download.toFixed(1)),
    upload: Number(point.upload.toFixed(1)),
  }))
}

export function makePorts(device: Device): DevicePort[] {
  const count = device.kind === 'switch' ? 8 : device.kind === 'gateway' ? 4 : 2
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1
    const connected = number <= (device.kind === 'switch' ? 5 : 1)
    return {
      number,
      label: number === 1 ? device.parent : connected ? '客户端设备' : '空闲',
      connected,
      speed: connected ? (number === 1 ? device.uplink : '1 Gbps') : undefined,
      poe: connected && number > 1,
      utilization: connected ? 12 + ((device.name.length * number * 7) % 62) : 0,
      status: connected ? 'up' : 'down',
    }
  })
}

function topologyFor(devicesState: Device[]): TopologyNode[] {
  return topologyNodes.map((node) => {
    const device = devicesState.find((item) => item.name === node.label)
    return device ? { ...node, status: device.status, meta: device.ip + ' · ' + device.status } : node
  })
}

export function createInitialState(): SimState {
  const clonedDevices = devices.map((device) => ({
    ...device,
    status: device.id === 'old-ap' || device.id === 'lab-ap' ? 'online' : device.status,
  }))
  const ports = Object.fromEntries(clonedDevices.map((device) => [device.id, makePorts(device)]))
  const initialLogs: LogEntry[] = [
    { id: 'log-nat', time: clockLabel(), level: 'warn', source: 'WAN1', message: '上游 NAT 已检测到，部分入站连接可能受限' },
    { id: 'log-backup', time: '09:56', level: 'success', source: 'Controller', message: '配置备份完成 · 2026.10.17-1' },
    { id: 'log-firmware', time: '09:20', level: 'info', source: 'lab-ap', message: '固件 6.7.9 可更新到 6.8.1', deviceId: 'lab-ap' },
  ]
  const initialAlerts: Alert[] = []
  const stats = {
    wanUp: 2,
    wanTotal: 2,
    clients: 28,
    devicesOnline: clonedDevices.filter((device) => device.status !== 'offline').length,
    devicesTotal: clonedDevices.length,
    alertsOpen: initialAlerts.filter((alert) => alert.status === 'open').length,
  }

  return {
    connection: 'live',
    paused: false,
    speed: 1,
    scenario: 'normal',
    devices: clonedDevices,
    ports,
    traffic: {
      '1h': makeSeries('1h'),
      '1d': makeSeries('1d'),
      '1w': makeSeries('1w'),
      '1m': makeSeries('1m'),
    },
    latency: Array.from({ length: 60 }, (_, index) => 12 + Math.round(Math.abs(Math.sin(index / 4)) * 3)),
    clients: 28,
    stats,
    alerts: initialAlerts,
    logs: initialLogs,
    activities: activities.map((item) => ({ ...item })),
    commands: [],
    topology: topologyFor(clonedDevices),
    lastUpdated: Date.now(),
    tick: 0,
  }
}
