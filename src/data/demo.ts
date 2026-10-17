import type {
  ActivityItem,
  Device,
  DeviceEvent,
  DeviceKind,
  DevicePort,
  DeviceStatus,
  DeviceTraffic,
  Range,
  TopologyNode,
  TrafficPoint,
  Wan,
} from '@/components/console/types'

export type {
  ActivityItem,
  Device,
  DeviceEvent,
  DeviceKind,
  DevicePort,
  DeviceStatus,
  DeviceTraffic,
  Range,
  TopologyNode,
  TrafficPoint,
  Wan,
} from '@/components/console/types'

export const devices: Device[] = [
  {
    id: 'core-gw',
    name: '核心网关',
    model: 'Core GW-10',
    kind: 'gateway',
    status: 'online',
    ip: '192.168.10.1',
    mac: '00:1a:2b:3c:4d:01',
    uplink: '10 GbE',
    parent: '—',
    clients: 28,
    uptime: '38 天 06 小时',
    firmware: '4.8.2',
    memory: 42,
    cpu: 18,
    location: '机房 A',
  },
  {
    id: 'workshop-sw',
    name: '工坊交换机',
    model: 'Edge SW-24P',
    kind: 'switch',
    status: 'online',
    ip: '192.168.10.2',
    mac: '00:1a:2b:3c:4d:02',
    uplink: 'SFP+ 10 GbE',
    parent: '核心网关',
    port: '端口 10',
    clients: 17,
    uptime: '38 天 06 小时',
    firmware: '2.9.4',
    memory: 36,
    cpu: 12,
    location: '机房 A',
  },
  {
    id: 'hall-ap',
    name: '东厅 AP',
    model: 'Hall AP-6E',
    kind: 'ap',
    status: 'online',
    ip: '192.168.10.21',
    mac: '00:1a:2b:3c:4d:21',
    uplink: 'GbE',
    parent: '工坊交换机',
    port: '端口 3',
    clients: 9,
    uptime: '12 天 14 小时',
    firmware: '6.8.1',
    memory: 48,
    cpu: 21,
    channelUtilization: 48,
    location: '东厅',
    band: '5 GHz',
    channel: '36',
    width: '80 MHz',
    ssid: 'Northstar',
    txRate: '2.4 Gbps',
    rxRate: '1.8 Gbps',
  },
  {
    id: 'west-ap',
    name: '西廊 AP',
    model: 'Hall AP-6',
    kind: 'ap',
    status: 'online',
    ip: '192.168.10.22',
    mac: '00:1a:2b:3c:4d:22',
    uplink: 'GbE',
    parent: '工坊交换机',
    port: '端口 4',
    clients: 6,
    uptime: '12 天 14 小时',
    firmware: '6.8.1',
    memory: 44,
    cpu: 17,
    channelUtilization: 36,
    location: '西廊',
    band: '5 GHz',
    channel: '44',
    width: '80 MHz',
    ssid: 'Northstar',
    txRate: '1.9 Gbps',
    rxRate: '1.2 Gbps',
  },
  {
    id: 'lab-ap',
    name: '实验室 AP',
    model: 'Hall AP-6',
    kind: 'ap',
    status: 'warning',
    ip: '192.168.10.23',
    mac: '00:1a:2b:3c:4d:23',
    uplink: 'GbE',
    parent: '工坊交换机',
    port: '端口 5',
    clients: 4,
    uptime: '3 天 02 小时',
    firmware: '6.7.9',
    memory: 71,
    cpu: 34,
    channelUtilization: 71,
    location: '实验室',
    band: '2.4 GHz',
    channel: '6',
    width: '20 MHz',
    ssid: 'Northstar-IoT',
    txRate: '286 Mbps',
    rxRate: '144 Mbps',
  },
  {
    id: 'south-cam',
    name: '北门摄像头',
    model: 'View Cam-4K',
    kind: 'camera',
    status: 'online',
    ip: '192.168.10.31',
    mac: '00:1a:2b:3c:4d:31',
    uplink: 'GbE',
    parent: '工坊交换机',
    port: '端口 12',
    clients: 0,
    uptime: '21 天 08 小时',
    firmware: '4.2.0',
    memory: 52,
    cpu: 26,
    location: '北门',
  },
  {
    id: 'render-node',
    name: '渲染节点',
    model: 'Server R2',
    kind: 'server',
    status: 'warning',
    ip: '192.168.10.41',
    mac: '00:1a:2b:3c:4d:41',
    uplink: '10 GbE',
    parent: '工坊交换机',
    port: '端口 22',
    clients: 0,
    uptime: '6 天 11 小时',
    firmware: 'Ubuntu 24.04',
    memory: 83,
    cpu: 64,
    location: '机房 A',
  },
  {
    id: 'old-ap',
    name: '旧仓库 AP',
    model: 'Hall AP-6',
    kind: 'ap',
    status: 'offline',
    ip: '192.168.10.24',
    mac: '00:1a:2b:3c:4d:24',
    uplink: 'GbE',
    parent: '工坊交换机',
    port: '端口 9',
    clients: 0,
    uptime: '—',
    firmware: '6.7.9',
    memory: 0,
    cpu: 0,
    location: '旧仓库',
  },
]

export const wans: Wan[] = [
  {
    id: 'primary',
    name: '北星光纤',
    isp: 'Northstar Fiber',
    color: 'cyan',
    ip: '203.0.113.24',
    gateway: '203.0.113.1',
    latency: 12,
    jitter: 1.8,
    loss: 0,
    usage: '842 GB',
    speed: '1 Gbps',
    status: 'online',
  },
  {
    id: 'secondary',
    name: '海港专线',
    isp: 'Meridian Transit',
    color: 'violet',
    ip: '198.51.100.62',
    gateway: '198.51.100.1',
    latency: 19,
    jitter: 3.2,
    loss: 0.04,
    usage: '216 GB',
    speed: '500 Mbps',
    status: 'online',
  },
]

export const rangeLabels: Record<Range, string> = {
  '1h': '1 小时',
  '1d': '1 天',
  '1w': '1 周',
  '1m': '1 月',
}

const rangeSpec: Record<Range, { count: number; stepMs: number; label: (i: number, n: number) => string; seed: number }> = {
  '1h': { count: 60, stepMs: 60_000, label: (i) => String(15 + Math.floor(i / 4)).padStart(2, '0') + ':00', seed: 1 },
  '1d': { count: 96, stepMs: 900_000, label: (i) => String(Math.floor(i / 4)).padStart(2, '0') + ':00', seed: 2 },
  '1w': {
    count: 84,
    stepMs: 7_200_000,
    label: (i) => ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][Math.floor(i / 12)],
    seed: 3,
  },
  '1m': {
    count: 90,
    stepMs: 28_800_000,
    label: (i) => String(Math.min(30, Math.floor(i / 3) + 1)) + '日',
    seed: 4,
  },
}

export function makeTraffic(range: Range, wan: 'primary' | 'secondary'): TrafficPoint[] {
  const spec = rangeSpec[range]
  const base = wan === 'primary' ? 1 : 0.58
  const end = Date.now()
  return Array.from({ length: spec.count }, (_, i) => {
    const x = i / spec.count
    const wave = Math.sin((x * 7 + spec.seed) * Math.PI) * 18 + Math.sin(x * 31 + 1.4) * 7
    const noise = Math.sin(i * 12.9898 + spec.seed * 78.233) * 6
    const spike = i === Math.floor(spec.count * 0.46) ? 34 : i === Math.floor(spec.count * 0.83) ? 18 : 0
    const download = Math.max(4, (42 + wave + noise + spike) * base)
    const upload = Math.max(1.5, (9 + Math.sin(x * 11 + 0.8) * 4 + noise * 0.25) * base)
    return {
      t: end - (spec.count - 1 - i) * spec.stepMs,
      download: Number(download.toFixed(1)),
      upload: Number(upload.toFixed(1)),
    }
  })
}

export function trafficLabel(range: Range, index: number): string {
  return rangeSpec[range].label(index, rangeSpec[range].count)
}

export const activities: ActivityItem[] = [
  {
    id: 'a1',
    time: '10:42',
    title: '东厅 AP 接入 4 个新客户端',
    detail: 'Northstar · 5 GHz',
    tone: 'online' as const,
  },
  {
    id: 'a2',
    time: '10:18',
    title: '北门摄像头短暂离线后恢复',
    detail: '中断 46 秒 · PoE 端口 12',
    tone: 'warning' as const,
  },
  {
    id: 'a3',
    time: '09:56',
    title: '核心网关完成配置备份',
    detail: '备份版本 2026.10.17-1',
    tone: 'online' as const,
  },
  {
    id: 'a4',
    time: '09:20',
    title: '管理证书将在 12 天后到期',
    detail: '需要更新 · 系统设置',
    tone: 'info' as const,
  },
]

export const clients = [
  { id: 'c1', name: 'MacBook Pro · 设计', kind: 'client' as const, usage: '18.4 GB', percent: 74 },
  { id: 'c2', name: 'NAS · 归档', kind: 'server' as const, usage: '12.1 GB', percent: 61 },
  { id: 'c3', name: 'iPhone · 林', kind: 'client' as const, usage: '6.8 GB', percent: 42 },
  { id: 'c4', name: 'iPad · 会议', kind: 'client' as const, usage: '3.2 GB', percent: 26 },
]

export const topologyNodes: TopologyNode[] = [
  { id: 'wan', label: '北星光纤', sublabel: 'WAN1 · 12 ms', x: 300, y: 34, kind: 'gateway', status: 'online', meta: '203.0.113.24 · 1 Gbps' },
  { id: 'gw', label: '核心网关', sublabel: 'Core GW-10', x: 300, y: 106, kind: 'gateway', status: 'online', meta: '192.168.10.1 · 10 GbE' },
  { id: 'sw', label: '工坊交换机', sublabel: 'Edge SW-24P', x: 300, y: 188, kind: 'switch', status: 'online', meta: '192.168.10.2 · 24 PoE' },
  { id: 'ap1', label: '东厅 AP', sublabel: '9 客户端', x: 126, y: 264, kind: 'ap', status: 'online', meta: '192.168.10.21 · 5 GHz' },
  { id: 'ap2', label: '西廊 AP', sublabel: '6 客户端', x: 300, y: 264, kind: 'ap', status: 'online', meta: '192.168.10.22 · 5 GHz' },
  { id: 'ap3', label: '实验室 AP', sublabel: '4 客户端', x: 474, y: 264, kind: 'ap', status: 'warning', meta: '192.168.10.23 · 固件待更新' },
]

export const topologyLinks: Array<[string, string]> = [
  ['wan', 'gw'],
  ['gw', 'sw'],
  ['sw', 'ap1'],
  ['sw', 'ap2'],
  ['sw', 'ap3'],
]

export const deviceKindLabel: Record<DeviceKind, string> = {
  gateway: 'Gateway',
  switch: 'Switch',
  ap: 'Access Point',
  client: 'Client',
  camera: 'Camera',
  server: 'Server',
}
