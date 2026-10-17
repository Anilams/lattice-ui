import * as React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {
  Activity,
  LayoutDashboard,
  Router,
  Settings,
  SwatchBook,
} from 'lucide-react'
import { AppShell, type NavSection, type RailItem } from '@/components/console/app-shell'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DashboardPage } from '@/pages/dashboard'
import { DevicesPage } from '@/pages/devices'
import { SettingsPage } from '@/pages/settings'
import { FoundationsPage } from '@/pages/foundations'

type Theme = 'dark' | 'light'
type Density = 'compact' | 'roomy'

const rail: RailItem[] = [
  { to: '/', label: '概览', icon: LayoutDashboard },
  { to: '/devices', label: '设备', icon: Router },
  { to: '/settings', label: '设置', icon: Settings },
  { to: '/foundations', label: '设计基础', icon: SwatchBook },
]

const nav: NavSection[] = [
  {
    label: '监控',
    items: [
      { to: '/', label: '概览', icon: Activity, end: true },
      { to: '/devices', label: '设备', icon: Router, badge: '8' },
    ],
  },
  {
    label: '配置',
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
  const [theme, setTheme] = React.useState<Theme>(() =>
    readPreference('lattice-theme', 'dark', ['dark', 'light']),
  )
  const [density, setDensity] = React.useState<Density>(() =>
    readPreference('lattice-density', 'compact', ['compact', 'roomy']),
  )

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
      <AppShell
        rail={rail}
        nav={nav}
        theme={theme}
        density={density}
        onToggleTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
        onToggleDensity={() => setDensity((value) => (value === 'compact' ? 'roomy' : 'compact'))}
      >
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/foundations" element={<FoundationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </TooltipProvider>
  )
}
