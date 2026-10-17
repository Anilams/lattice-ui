import * as React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {
  Activity,
  Cable,
  LayoutDashboard,
  Network,
  Router,
  ScrollText,
  Settings,
  SwatchBook,
} from 'lucide-react'
import { AppShell, type NavSection, type RailItem } from '@/components/console/app-shell'
import { DemoControls } from '@/components/console/demo-controls'
import { ToastProvider } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SimulationProvider, useSimulationState } from '@/sim/provider'
import { DashboardPage } from '@/pages/dashboard'
import { TopologyPage } from '@/pages/topology'
import { DevicesPage } from '@/pages/devices'
import { PortsPage } from '@/pages/ports'
import { LogsPage } from '@/pages/logs'
import { SettingsPage } from '@/pages/settings'
import { FoundationsPage } from '@/pages/foundations'

type Theme = 'dark' | 'light'
type Density = 'compact' | 'roomy'

const rail: RailItem[] = [
  { to: '/', label: '概览', icon: LayoutDashboard },
  { to: '/topology', label: '拓扑', icon: Network },
  { to: '/devices', label: '设备', icon: Router },
  { to: '/ports', label: '端口', icon: Cable },
  { to: '/logs', label: '日志与告警', icon: ScrollText },
  { to: '/settings', label: '设置', icon: Settings },
  { to: '/foundations', label: '设计基础', icon: SwatchBook },
]

const nav: NavSection[] = [
  {
    label: '监控',
    items: [
      { to: '/', label: '概览', icon: Activity, end: true },
      { to: '/topology', label: '拓扑', icon: Network },
      { to: '/devices', label: '设备', icon: Router, badge: '8' },
      { to: '/ports', label: '端口', icon: Cable },
    ],
  },
  {
    label: '可观测',
    items: [
      { to: '/logs', label: '日志与告警', icon: ScrollText, badge: 'LIVE' },
      { to: '/clients', label: '客户端', icon: Activity, disabled: true, badge: 'v0.3', title: '客户端管理将在 v0.3 提供' },
      { to: '/radios', label: '无线 / 频谱', icon: Network, disabled: true, badge: 'v0.3', title: '频谱分析将在 v0.3 提供' },
      { to: '/insights', label: '洞察 / 流量', icon: Activity, disabled: true, badge: 'v0.3', title: '流量洞察将在 v0.3 提供' },
    ],
  },
  {
    label: '系统',
    items: [
      { to: '/settings', label: '站点设置', icon: Settings },
      { to: '/foundations', label: '设计基础', icon: SwatchBook },
    ],
  },
]

function readPreference<T extends string>(key: string, fallback: T, allowed: T[]): T {
  try {
    const value = window.localStorage.getItem(key)
    return value && allowed.includes(value as T) ? (value as T) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [theme, setTheme] = React.useState<Theme>(() => readPreference('lattice-theme', 'dark', ['dark', 'light']))
  const [density, setDensity] = React.useState<Density>(() => readPreference('lattice-density', 'compact', ['compact', 'roomy']))

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    root.dataset.density = density
    try {
      window.localStorage.setItem('lattice-theme', theme)
      window.localStorage.setItem('lattice-density', density)
    } catch {
      // Preferences still apply for the current session.
    }
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', theme === 'dark' ? '#131416' : '#f4f5f7')
  }, [theme, density])

  return (
    <TooltipProvider>
      <ToastProvider>
        <SimulationProvider>
          <AppContent
            theme={theme}
            density={density}
            onToggleTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
            onToggleDensity={() => setDensity((value) => (value === 'compact' ? 'roomy' : 'compact'))}
          />
        </SimulationProvider>
      </ToastProvider>
    </TooltipProvider>
  )
}

function AppContent({
  theme,
  density,
  onToggleTheme,
  onToggleDensity,
}: {
  theme: Theme
  density: Density
  onToggleTheme: () => void
  onToggleDensity: () => void
}) {
  const state = useSimulationState()
  const notifications = state.alerts
    .filter((alert) => alert.status === 'open')
    .map((alert) => ({
      id: alert.id,
      title: alert.title,
      detail: alert.detail + ' · ' + alert.createdAt,
      tone: alert.severity === 'critical' ? ('offline' as const) : alert.severity === 'warning' ? ('warning' as const) : ('info' as const),
    }))

  return (
    <AppShell
      rail={rail}
      nav={nav}
      theme={theme}
      density={density}
      notifications={notifications}
      demoControls={<DemoControls />}
      onToggleTheme={onToggleTheme}
      onToggleDensity={onToggleDensity}
    >
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/topology" element={<TopologyPage />} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/ports" element={<PortsPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/foundations" element={<FoundationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
