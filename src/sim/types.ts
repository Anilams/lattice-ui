import type { ActivityItem, Device, DevicePort, LogLine, Range, TopologyNode, TrafficPoint } from '@/components/console/types'

export type ConnectionState = 'live' | 'paused' | 'degraded' | 'offline'
export type Scenario = 'normal' | 'ap-offline' | 'wan-degraded'
export type { LogLine, LogLevel } from '@/components/console/types'

export type LogEntry = LogLine & { deviceId?: string }

export type Alert = {
  id: string
  severity: 'info' | 'warning' | 'critical'
  title: string
  detail: string
  deviceId?: string
  createdAt: string
  status: 'open' | 'acked' | 'resolved'
}

export type CommandRecord = {
  id: string
  label: string
  status: 'pending' | 'success' | 'error'
  startedAt: string
}

export type SimStats = {
  wanUp: number
  wanTotal: number
  clients: number
  devicesOnline: number
  devicesTotal: number
  alertsOpen: number
}

export type SimState = {
  connection: ConnectionState
  paused: boolean
  speed: 1 | 2 | 4
  scenario: Scenario
  devices: Device[]
  ports: Record<string, DevicePort[]>
  traffic: Record<Range, TrafficPoint[]>
  latency: number[]
  clients: number
  stats: SimStats
  alerts: Alert[]
  logs: LogEntry[]
  activities: ActivityItem[]
  commands: CommandRecord[]
  topology: TopologyNode[]
  lastUpdated: number
  tick: number
}
