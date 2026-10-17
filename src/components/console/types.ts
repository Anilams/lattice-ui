export type DeviceStatus = 'online' | 'warning' | 'offline'
export type DeviceKind = 'gateway' | 'switch' | 'ap' | 'client' | 'camera' | 'server'

export type Device = {
  id: string
  name: string
  model: string
  kind: DeviceKind
  status: DeviceStatus
  ip: string
  mac: string
  uplink: string
  parent: string
  port?: string
  clients: number
  uptime: string
  firmware: string
  memory: number
  cpu: number
  location: string
  band?: string
  channel?: string
  width?: string
  ssid?: string
  txRate?: string
  rxRate?: string
  channelUtilization?: number
}

export type Wan = {
  id: 'primary' | 'secondary'
  name: string
  isp: string
  color: 'cyan' | 'violet'
  ip: string
  gateway: string
  latency: number
  jitter: number
  loss: number
  usage: string
  speed: string
  status: 'online' | 'warning'
}

export type Range = '1h' | '1d' | '1w' | '1m'

export type TrafficPoint = {
  t: number
  download: number
  upload: number
}

export type TopologyNode = {
  id: string
  label: string
  sublabel: string
  x: number
  y: number
  kind: DeviceKind
  status: DeviceStatus
  meta: string
}

export type ActivityItem = {
  id: string
  time: string
  title: string
  detail: string
  tone: 'online' | 'warning' | 'info' | 'neutral'
}

export type DevicePort = {
  number: number
  label: string
  connected: boolean
  speed?: string
  poe?: boolean
}

export type DeviceTraffic = {
  download: number[]
  upload: number[]
}

export type DeviceEvent = {
  time: string
  title: string
  detail: string
}
