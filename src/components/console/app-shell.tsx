import * as React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Command,
  LayoutDashboard,
  Menu,
  Moon,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  SwatchBook,
  Wifi,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LatticeMark, Wordmark } from './brand'
import { IconButton } from '@/components/ui/icon-button'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { StatusDot } from '@/components/ui/status-dot'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export type RailItem = {
  to: string
  label: string
  icon: LucideIcon
}

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  badge?: string
  end?: boolean
  disabled?: boolean
  title?: string
}

export type NavSection = {
  label?: string
  items: NavItem[]
}

export type ShellSite = {
  id?: string
  label: string
}

export type ShellNotification = {
  id: string
  title: string
  detail: string
  tone: 'online' | 'warning' | 'offline' | 'info' | 'neutral'
}

type Theme = 'dark' | 'light'
type Density = 'compact' | 'roomy'

const defaultSites: ShellSite[] = [
  { id: 'northstar', label: '北辰实验室' },
  { id: 'harbor', label: '海港办公室' },
]

const defaultNotifications: ShellNotification[] = [
  { id: 'nat', title: '上游 NAT 已检测到', detail: 'WAN1 · 6 分钟前', tone: 'warning' },
  { id: 'firmware', title: '东厅 AP 固件可更新', detail: '网络 · 1 小时前', tone: 'info' },
]

const productItems = [
  { label: 'Network', icon: Wifi, active: true, disabled: false },
  { label: 'Protect', icon: ShieldCheck, active: false, disabled: true },
  { label: 'Access', icon: Command, active: false, disabled: true },
]

export function AppShell({
  rail,
  nav,
  children,
  theme,
  density,
  onToggleTheme,
  onToggleDensity,
  sites = defaultSites,
  notifications = defaultNotifications,
  demoControls,
}: {
  rail: RailItem[]
  nav: NavSection[]
  children: React.ReactNode
  theme: Theme
  density: Density
  onToggleTheme: () => void
  onToggleDensity: () => void
  sites?: ShellSite[]
  notifications?: ShellNotification[]
  demoControls?: React.ReactNode
}) {
  const [navVisible, setNavVisible] = React.useState(true)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [site, setSite] = React.useState(sites[0]?.label ?? '未命名站点')
  const location = useLocation()
  const navigate = useNavigate()
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)

  const closeMobile = React.useCallback(() => {
    setMobileOpen(false)
    requestAnimationFrame(() => menuButtonRef.current?.focus())
  }, [])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const navLinks = React.useMemo(
    () =>
      nav.flatMap((section) =>
        section.items.map((item) => ({ ...item, section: section.label ?? '导航' })),
      ),
    [nav],
  )

  const currentTitle =
    navLinks.find((item) => (item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)))
      ?.label ?? '概览'

  const navContent = (mobile = false) => (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-11 items-center justify-between border-b border-line px-3">
        <div className="flex items-center gap-2">
          <span className="text-[var(--lat-text-2xs)] font-medium uppercase tracking-[0.12em] text-faint">
            {mobile ? 'Workspace' : 'Network'}
          </span>
          <span className="size-1 rounded-full bg-line-strong" aria-hidden="true" />
          <span className="text-[var(--lat-text-2xs)] text-faint">Console</span>
        </div>
        {mobile ? (
          <IconButton label="关闭导航" size="sm" onClick={closeMobile}>
            <X className="size-3.5" />
          </IconButton>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton label="收起导航栏" size="sm" onClick={() => setNavVisible((v) => !v)}>
                <PanelLeftClose className="size-3.5" />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent side="right">收起导航栏</TooltipContent>
          </Tooltip>
        )}
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3" aria-label="主导航">
        {nav.map((section) => (
          <div key={section.label ?? section.items[0]?.label} className="mb-4 last:mb-0">
            {section.label ? (
              <div className="mb-1 px-2 text-[var(--lat-text-2xs)] font-medium text-faint">
                {section.label}
              </div>
            ) : null}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                if (item.disabled) {
                  return (
                    <span
                      key={item.to}
                      aria-disabled="true"
                      title={item.title ?? '将在后续版本提供'}
                      className="flex h-10 cursor-not-allowed items-center gap-2 rounded-[var(--lat-radius-sm)] px-2 text-[var(--lat-text-sm)] text-faint opacity-55 lg:h-[30px]"
                    >
                      <Icon className="size-3.5 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.badge ? <Badge tone="neutral" className="px-1 py-0 text-[8px]">{item.badge}</Badge> : null}
                    </span>
                  )
                }
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => mobile && closeMobile()}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-2 rounded-[var(--lat-radius-sm)] px-2 text-[var(--lat-text-sm)] text-muted transition-colors hover:bg-hover hover:text-ink',
                        mobile ? 'h-10' : 'h-[30px]',
                        isActive && 'bg-selected text-ink',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            'absolute -left-0.5 h-3 w-0.5 rounded-full bg-action opacity-0 transition-opacity',
                            isActive && 'opacity-100',
                          )}
                          aria-hidden="true"
                        />
                        <Icon className={cn('size-3.5 shrink-0', isActive ? 'text-action' : 'text-faint')} />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.badge ? (
                          <Badge tone={isActive ? 'action' : 'neutral'} className="px-1 py-0 text-[9px]">
                            {item.badge}
                          </Badge>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-line p-2">
        <NavLink
          to="/foundations"
          onClick={() => mobile && closeMobile()}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-[var(--lat-radius-sm)] px-2 py-1.5 text-[var(--lat-text-xs)] text-muted hover:bg-hover hover:text-ink',
              isActive && 'bg-selected text-ink',
            )
          }
        >
          <SwatchBook className="size-3.5 text-faint" />
          设计基础
        </NavLink>
        <div className="mt-2 flex items-center justify-between px-2 text-[10px] text-faint">
          <span>Lattice 0.2</span>
          <span className="flex items-center gap-1">
            <StatusDot status="online" pulse />
            本地预览
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas text-ink">
      <header className="relative z-[var(--lat-z-sticky)] flex h-[var(--lat-topbar-height)] shrink-0 items-center border-b border-line bg-shell">
        <div className="flex h-full w-auto shrink-0 items-center gap-2 border-r border-line px-3 md:w-[calc(var(--lat-rail-width)+var(--lat-nav-width))]">
          <div className="flex items-center gap-2 md:hidden">
            <IconButton ref={menuButtonRef} label="打开导航" variant="ghost" onClick={() => setMobileOpen(true)}>
              <Menu className="size-4" />
            </IconButton>
          </div>
          <div className="flex items-center gap-2 md:gap-2.5">
            <LatticeMark />
            <Wordmark compact />
          </div>
          <span className="mx-1 hidden h-4 w-px bg-line-strong md:block" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden min-w-0 items-center gap-1 rounded-[var(--lat-radius-sm)] px-1 py-1 text-[var(--lat-text-xs)] text-muted hover:bg-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/35 md:flex">
                <span className="truncate">{site}</span>
                <ChevronDown className="size-3 shrink-0 text-faint" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>站点</DropdownMenuLabel>
              {sites.map((item) => (
                <DropdownMenuItem key={item.id ?? item.label} onSelect={() => setSite(item.label)}>
                  <span className="flex size-5 items-center justify-center rounded-[var(--lat-radius-sm)] bg-raised text-[9px] text-muted">
                    {item.label.slice(0, 1)}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {site === item.label ? <Check className="size-3 text-action" /> : null}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] text-faint">
                <StatusDot status="online" />
                演示数据集 · 虚构设备
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden h-full items-center gap-0.5 px-2 lg:flex" aria-label="产品模块">
          {productItems.map((product) => (
            <button
              key={product.label}
              type="button"
              aria-current={product.active ? 'page' : undefined}
              disabled={product.disabled}
              title={product.active ? product.label : product.label + ' 模块不在本演示范围'}
              className={cn(
                'flex h-8 items-center gap-1.5 rounded-[var(--lat-radius-sm)] px-2 text-[var(--lat-text-xs)] transition-colors',
                product.active
                  ? 'bg-action-soft text-action'
                  : 'text-faint hover:bg-hover hover:text-muted',
              )}
            >
              <product.icon className="size-3.5" />
              <span className="hidden xl:inline">{product.label}</span>
            </button>
          ))}
        </div>

        <div className="pointer-events-none flex min-w-0 flex-1 items-center justify-center">
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.22em] text-faint lg:block">
            {currentTitle}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 px-2">
          {demoControls}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden gap-1.5 text-faint sm:flex"
                onClick={() => setCommandOpen(true)}
              >
                <Search className="size-3.5" />
                <span className="hidden xl:inline">搜索</span>
                <kbd className="ml-1 hidden rounded border border-line px-1 py-0.5 text-[9px] text-faint xl:inline">
                  ⌘K
                </kbd>
              </Button>
            </TooltipTrigger>
            <TooltipContent>搜索与导航</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton label="通知" size="sm" className="relative">
                <Bell className="size-3.5" />
                {notifications.length ? (
                  <span className="absolute right-0.5 top-0.5 flex size-3 items-center justify-center rounded-full bg-action text-[8px] font-semibold text-action-text">
                    {notifications.length}
                  </span>
                ) : null}
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>通知</DropdownMenuLabel>
              {notifications.map((item) => (
                <DropdownMenuItem key={item.id} className="items-start gap-2 py-2">
                  <StatusDot status={item.tone} className="mt-1" />
                  <span>
                    <span className="block text-ink">{item.title}</span>
                    <span className="mt-0.5 block text-[10px] text-faint">{item.detail}</span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="账户与显示设置"
                className="ml-1 flex size-7 items-center justify-center rounded-full border border-line-strong bg-raised text-[9px] font-medium text-muted hover:border-[var(--lat-text-faint)] hover:text-ink"
              >
                AN
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>显示</DropdownMenuLabel>
              <DropdownMenuItem onSelect={onToggleTheme}>
                {theme === 'dark' ? <Moon className="size-3.5 text-faint" /> : <Sun className="size-3.5 text-faint" />}
                切换为{theme === 'dark' ? '浅色' : '深色'}主题
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onToggleDensity}>
                <Palette className="size-3.5 text-faint" />
                密度：{density === 'compact' ? '紧凑' : '宽松'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate('/foundations')}>
                <BookOpen className="size-3.5 text-faint" />
                设计基础
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => window.open('https://ui.shadcn.com/docs/registry', '_blank')}>
                <CircleHelp className="size-3.5 text-faint" />
                Registry 文档
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[var(--lat-rail-width)] shrink-0 flex-col items-center border-r border-line bg-shell py-2 md:flex">
          <nav aria-label="功能" className="flex w-full flex-1 flex-col items-center gap-1">
            {rail.map((item) => {
              const Icon = item.icon
              return (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      aria-label={item.label}
                      className={({ isActive }) =>
                        cn(
                          'relative flex size-9 items-center justify-center rounded-[var(--lat-radius-sm)] text-faint transition-colors hover:bg-hover hover:text-ink',
                          isActive && 'bg-selected text-action',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className="size-4" />
                          {isActive ? (
                            <span className="absolute -left-2 h-4 w-0.5 rounded-full bg-action" aria-hidden="true" />
                          ) : null}
                        </>
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </nav>
          <div className="flex flex-col items-center gap-1">
            {!navVisible ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton label="展开导航栏" size="sm" onClick={() => setNavVisible(true)}>
                    <PanelLeftOpen className="size-3.5" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent side="right">展开导航栏</TooltipContent>
              </Tooltip>
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/settings"
                  aria-label="设置"
                  className={({ isActive }) =>
                    cn(
                      'flex size-9 items-center justify-center rounded-[var(--lat-radius-sm)] text-faint hover:bg-hover hover:text-ink',
                      isActive && 'bg-selected text-action',
                    )
                  }
                >
                  <Settings className="size-4" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">设置</TooltipContent>
            </Tooltip>
            <div className="mb-1 mt-2 size-1.5 rounded-full bg-success" title="控制台在线" />
          </div>
        </aside>

        {navVisible ? (
          <aside className="hidden w-[var(--lat-nav-width)] shrink-0 border-r border-line bg-shell lg:block">
            {navContent()}
          </aside>
        ) : null}

        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={(next) => (next ? setMobileOpen(true) : closeMobile())}>
        <SheetContent side="left" className="w-[84vw] max-w-[300px] bg-shell p-0">
          <SheetTitle className="sr-only">主导航</SheetTitle>
          <SheetDescription className="sr-only">站点导航、页面入口和显示设置</SheetDescription>
          <SheetBody>{navContent(true)}</SheetBody>
        </SheetContent>
      </Sheet>

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        items={[
          ...navLinks.map((item) => ({
            id: item.to,
            label: item.label,
            hint: item.section,
            icon: item.icon,
            run: () => navigate(item.to),
          })),
          {
            id: 'theme',
            label: theme === 'dark' ? '切换为浅色主题' : '切换为深色主题',
            hint: '显示',
            icon: theme === 'dark' ? Sun : Moon,
            run: onToggleTheme,
          },
          {
            id: 'density',
            label: density === 'compact' ? '切换为宽松密度' : '切换为紧凑密度',
            hint: '显示',
            icon: Palette,
            run: onToggleDensity,
          },
        ]}
      />
    </div>
  )
}

type CommandItem = {
  id: string
  label: string
  hint: string
  icon: LucideIcon
  run: () => void
}

function CommandPalette({
  open,
  onOpenChange,
  items,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CommandItem[]
}) {
  const [query, setQuery] = React.useState('')
  const [activeIndex, setActiveIndex] = React.useState(0)
  const filtered = items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))

  React.useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  React.useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const choose = (item: CommandItem | undefined) => {
    if (!item) return
    item.run()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(calc(100vw-24px),560px)] overflow-hidden p-0">
        <DialogTitle className="sr-only">搜索与导航</DialogTitle>
        <div className="flex h-11 items-center gap-2 border-b border-line px-3">
          <Search className="size-4 text-faint" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActiveIndex((i) => Math.min(filtered.length - 1, i + 1))
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActiveIndex((i) => Math.max(0, i - 1))
              }
              if (event.key === 'Enter') {
                event.preventDefault()
                choose(filtered[activeIndex])
              }
            }}
            placeholder="搜索页面、设置或动作…"
            aria-label="搜索页面、设置或动作"
            aria-controls="command-results"
            aria-activedescendant={filtered[activeIndex] ? 'command-' + filtered[activeIndex].id : undefined}
            className="h-full min-w-0 flex-1 bg-transparent text-[var(--lat-text-sm)] text-ink outline-none placeholder:text-faint"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[9px] text-faint">ESC</kbd>
        </div>
        <div id="command-results" role="listbox" aria-label="搜索结果" className="max-h-[320px] overflow-y-auto p-1.5">
          {filtered.length ? (
            filtered.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  id={'command-' + item.id}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(item)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-[var(--lat-radius-sm)] px-2.5 py-2 text-left text-[var(--lat-text-sm)] transition-colors',
                    index === activeIndex ? 'bg-selected text-ink' : 'text-muted hover:bg-hover hover:text-ink',
                  )}
                >
                  <Icon className="size-4 text-faint" />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[10px] text-faint">{item.hint}</span>
                </button>
              )
            })
          ) : (
            <div className="px-3 py-8 text-center text-[var(--lat-text-sm)] text-faint">没有匹配的结果</div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-line px-3 py-2 text-[10px] text-faint">
          <span>↑ ↓ 选择 · Enter 打开</span>
          <span>Lattice command</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
