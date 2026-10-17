import * as React from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  MoreHorizontal,
  RefreshCw,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import type { Device, DeviceEvent, DevicePort, DeviceTraffic } from '@/data/demo'
import { deviceKindLabel, devices } from '@/data/demo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconButton } from '@/components/ui/icon-button'
import { Panel } from '@/components/ui/panel'
import { InlineNotice } from '@/components/ui/inline-notice'
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageBody, PageHeader, Toolbar } from '@/components/console/page'
import { FilterPanel, type FilterGroup } from '@/components/console/filter-panel'
import { DataTable, type DataTableColumn } from '@/components/console/data-table'
import { DeviceGlyph } from '@/components/console/device-glyph'
import { DeviceStatusBadge } from '@/components/console/device-status-badge'
import { DeviceDetailPanel } from '@/components/console/detail-panel'

const statusValues = ['online', 'warning', 'offline'] as const
const kindValues = ['gateway', 'switch', 'ap', 'camera', 'server'] as const
const locationValues = Array.from(new Set(devices.map((device) => device.location)))

function portsFor(device: Device): DevicePort[] {
  const count = device.kind === 'switch' ? 8 : device.kind === 'gateway' ? 4 : 2
  return Array.from({ length: count }, (_, index) => ({
    number: index + 1,
    label: index === 0 ? device.parent : index < 3 ? '客户端设备' : '空闲',
    connected: index < 3,
    speed: index < 3 ? (index === 0 ? device.uplink : '1 Gbps') : undefined,
    poe: index > 0 && index < 3,
  }))
}

function eventsFor(device: Device): DeviceEvent[] {
  return [
    { time: '10:42', title: '客户端连接', detail: '4 个新客户端接入 ' + (device.ssid ?? '网络') },
    { time: '09:16', title: '配置同步', detail: '设备配置与控制器同步完成' },
    { time: '08:04', title: '链路检查', detail: '上行链路 ' + device.uplink + ' 正常' },
    { time: '昨天 22:10', title: '固件检查', detail: '当前版本 ' + device.firmware },
  ]
}

function trafficFor(device: Device): DeviceTraffic {
  const seed = device.name.length
  const wave = (offset: number) =>
    Array.from({ length: 12 }, (_, index) =>
      8 + Math.round(Math.abs(Math.sin((index + seed + offset) * 1.25)) * 24),
    )
  return { download: wave(0), upload: wave(2.5) }
}

export function DevicesPage() {
  const [search, setSearch] = React.useState('')
  const [selected, setSelected] = React.useState<Record<string, string[]>>({})
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [detailDevice, setDetailDevice] = React.useState<Device | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [bulkOpen, setBulkOpen] = React.useState(false)
  const [bulkNote, setBulkNote] = React.useState('')
  const [firmwareOpen, setFirmwareOpen] = React.useState(false)
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  const [updatedIds, setUpdatedIds] = React.useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>([
    'kind',
    'status',
    'ip',
    'uplink',
    'clients',
    'location',
  ])
  const lastFocus = React.useRef<HTMLElement | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const groups: FilterGroup[] = [
    {
      id: 'status',
      label: '状态',
      defaultOpen: true,
      options: statusValues.map((value) => ({
        value,
        label: value === 'online' ? '在线' : value === 'warning' ? '需要注意' : '离线',
        count: devices.filter((device) => device.status === value).length,
        tone: value === 'online' ? 'success' : value === 'warning' ? 'warning' : 'danger',
      })),
    },
    {
      id: 'kind',
      label: '设备类型',
      defaultOpen: true,
      options: kindValues.map((value) => ({
        value,
        label: deviceKindLabel[value],
        count: devices.filter((device) => device.kind === value).length,
      })),
    },
    {
      id: 'location',
      label: '位置',
      defaultOpen: true,
      options: locationValues.map((value) => ({
        value,
        label: value,
        count: devices.filter((device) => device.location === value).length,
      })),
    },
  ]

  const activeFilterCount = Object.values(selected).reduce((total, values) => total + values.length, 0)
  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return devices.filter((device) => {
      const matchesSearch =
        !query ||
        [device.name, device.model, device.ip, device.mac, device.location].some((field) =>
          field.toLowerCase().includes(query),
        )
      const matchesStatus = !selected.status?.length || selected.status.includes(device.status)
      const matchesKind = !selected.kind?.length || selected.kind.includes(device.kind)
      const matchesLocation = !selected.location?.length || selected.location.includes(device.location)
      return matchesSearch && matchesStatus && matchesKind && matchesLocation
    })
  }, [search, selected])

  const toggleFilter = (group: string, value: string) => {
    setSelected((current) => {
      const values = current[group] ?? []
      return {
        ...current,
        [group]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value],
      }
    })
  }

  const clearFilters = () => {
    setSelected({})
    setSearch('')
  }

  const openDetail = (device: Device) => {
    lastFocus.current = document.activeElement as HTMLElement | null
    setDetailDevice(device)
    setDetailOpen(true)
  }

  const closeDetail = () => {
    setDetailOpen(false)
    requestAnimationFrame(() => lastFocus.current?.focus())
  }

  const exportCsv = () => {
    const header = ['名称', '型号', '类型', '状态', 'IP', 'MAC', '位置', '客户端']
    const rows = filtered.map((device) => [
      device.name,
      device.model,
      deviceKindLabel[device.kind],
      device.status,
      device.ip,
      device.mac,
      device.location,
      String(device.clients),
    ])
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => '"' + cell.replaceAll('"', '""') + '"').join(','))
      .join('\n')
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'lattice-devices.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const confirmBulk = () => {
    const count = selectedRows.size
    setBulkOpen(false)
    setSelectedRows(new Set())
    setBulkNote('演示模式：已模拟选中 ' + count + ' 台设备的重启操作，未发送真实命令。')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setBulkNote(''), 6000)
  }

  const runFirmwareUpdate = (id: string) => {
    setUpdatingId(id)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setUpdatingId(null)
      setUpdatedIds((current) => (current.includes(id) ? current : [...current, id]))
    }, 800)
  }

  const columns: DataTableColumn<Device>[] = [
    {
      id: 'name',
      header: '设备',
      width: '27%',
      sortValue: (device) => device.name,
      cell: (device) => (
        <div className="flex items-center gap-2.5">
          <DeviceGlyph kind={device.kind} status={device.status} size="sm" />
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => openDetail(device)}
              className="block max-w-[190px] truncate text-left text-[11px] font-medium text-ink hover:text-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/35"
            >
              {device.name}
            </button>
            <div className="mt-0.5 truncate text-[9px] text-faint">{device.model}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'kind',
      header: '类型',
      hideBelow: 'md',
      sortValue: (device) => device.kind,
      cell: (device) => <span className="text-[10px] text-muted">{deviceKindLabel[device.kind]}</span>,
    },
    {
      id: 'status',
      header: '状态',
      sortValue: (device) => device.status,
      cell: (device) => <DeviceStatusBadge status={device.status} />,
    },
    {
      id: 'ip',
      header: 'IP 地址',
      hideBelow: 'lg',
      sortValue: (device) => device.ip,
      cell: (device) => <span className="lat-data text-[10px]">{device.ip}</span>,
    },
    {
      id: 'uplink',
      header: '上行链路',
      hideBelow: 'xl',
      sortValue: (device) => device.uplink,
      cell: (device) => <span className="text-[10px]">{device.uplink}</span>,
    },
    {
      id: 'clients',
      header: '客户端',
      align: 'right',
      hideBelow: 'md',
      sortValue: (device) => device.clients,
      cell: (device) => <span className="lat-data tabular-nums text-[10px]">{device.clients}</span>,
    },
    {
      id: 'location',
      header: '位置',
      hideBelow: 'xl',
      sortValue: (device) => device.location,
      cell: (device) => <span className="text-[10px]">{device.location}</span>,
    },
    {
      id: 'actions',
      header: '',
      width: '40px',
      cell: (device) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton label={'打开 ' + device.name + ' 菜单'} size="sm">
              <MoreHorizontal className="size-3.5" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => openDetail(device)}>查看详情</DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                void navigator.clipboard?.writeText(device.ip)
              }}
            >
              复制 IP 地址
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => openDetail(device)}>
              设备操作…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const detailHidden = detailOpen ? new Set(['uplink', 'clients', 'location']) : null
  const displayedColumns = columns.filter(
    (column) =>
      (column.id === 'name' || column.id === 'actions' || visibleColumns.includes(column.id)) &&
      !detailHidden?.has(column.id),
  )

  const activeChips = Object.entries(selected).flatMap(([group, values]) =>
    values.map((value) => {
      const label =
        group === 'status'
          ? value === 'online'
            ? '在线'
            : value === 'warning'
              ? '需要注意'
              : '离线'
          : group === 'kind'
            ? deviceKindLabel[value as Device['kind']]
            : value
      return { group, value, label }
    }),
  )

  const filterPanel = (
    <FilterPanel
      search={search}
      onSearchChange={setSearch}
      groups={groups}
      selected={selected}
      onToggle={toggleFilter}
      onClear={clearFilters}
      resultCount={filtered.length}
      className="h-full"
    />
  )

  return (
    <PageBody className={detailOpen ? 'xl:pr-[446px]' : undefined}>
      <PageHeader
        title="设备"
        description="8 台托管设备，按状态、类型和位置筛选。点击任意设备查看详情。"
        meta={<Badge tone="neutral">8 台</Badge>}
        actions={
          <>
            <Button variant="secondary" onClick={exportCsv}>
              <Download className="size-3.5" />
              导出 CSV
            </Button>
            <Button variant="primary" onClick={() => setFirmwareOpen(true)}>
              <RefreshCw className="size-3.5" />
              设备更新
              <Badge tone="action" className="ml-0.5 px-1 py-0 text-[9px]">
                2
              </Badge>
            </Button>
          </>
        }
      />

      {bulkNote ? (
        <InlineNotice tone="success" className="mb-3">
          {bulkNote}
        </InlineNotice>
      ) : null}

      <div className="flex items-start gap-3">
        <aside
          className={cn(
            'sticky top-3 hidden max-h-[calc(100vh-160px)] w-[226px] shrink-0 overflow-hidden rounded-[var(--lat-radius-lg)] border border-line lg:block',
            detailOpen && 'xl:hidden',
          )}
        >
          {filterPanel}
        </aside>

        <Panel className="min-w-0 flex-1 overflow-hidden">
          <Toolbar>
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-ink">全部设备</span>
              <span className="text-[10px] text-faint">({filtered.length})</span>
              {activeChips.map((chip) => (
                <button
                  key={chip.group + chip.value}
                  type="button"
                  onClick={() => toggleFilter(chip.group, chip.value)}
                  className="flex items-center gap-1 rounded-full border border-line bg-raised px-1.5 py-0.5 text-[9px] text-muted hover:border-line-strong hover:text-ink"
                >
                  {chip.label}
                  <X className="size-2.5" />
                </button>
              ))}
              {activeFilterCount || search ? (
                <button type="button" onClick={clearFilters} className="ml-1 text-[9px] text-action hover:text-action-hover">
                  清除筛选
                </button>
              ) : null}
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                className="lg:hidden"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal className="size-3" />
                筛选
                {activeFilterCount ? (
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-action text-[8px] text-action-text">
                    {activeFilterCount}
                  </span>
                ) : null}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden gap-1 sm:flex">
                    <Columns3 className="size-3" />
                    列
                    <ChevronDown className="size-2.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>显示列</DropdownMenuLabel>
                  {[
                    ['kind', '类型'],
                    ['status', '状态'],
                    ['ip', 'IP 地址'],
                    ['uplink', '上行链路'],
                    ['clients', '客户端'],
                    ['location', '位置'],
                  ].map(([id, label]) => (
                    <DropdownMenuCheckboxItem
                      key={id}
                      checked={visibleColumns.includes(id)}
                      onCheckedChange={(checked) =>
                        setVisibleColumns((current) =>
                          checked ? [...current, id] : current.filter((item) => item !== id),
                        )
                      }
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Toolbar>

          {selectedRows.size > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-action-soft px-3 py-2">
              <span className="text-[11px] text-ink">已选择 {selectedRows.size} 台设备</span>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => setSelectedRows(new Set())}>
                  取消选择
                </Button>
                <Button variant="danger" size="sm" className="h-6 px-2 text-[10px]" onClick={() => setBulkOpen(true)}>
                  批量重启
                </Button>
              </div>
            </div>
          ) : null}

          <DataTable
            rows={filtered}
            columns={displayedColumns}
            getRowId={(device) => device.id}
            selected={selectedRows}
            onSelectedChange={setSelectedRows}
            onRowClick={openDetail}
            initialSort={{ id: 'name', direction: 'asc' }}
            minWidth={detailOpen ? 560 : 760}
          />
          <div className="flex items-center justify-between border-t border-line px-3 py-2 text-[10px] text-faint">
            <span>
              显示 {filtered.length} / {devices.length} 台设备
            </span>
            <div className="flex items-center gap-1">
              <span>第 1 页，共 1 页</span>
              <IconButton label="上一页" size="sm" disabled>
                <ChevronLeft className="size-3" />
              </IconButton>
              <IconButton label="下一页" size="sm" disabled>
                <ChevronRight className="size-3" />
              </IconButton>
            </div>
          </div>
        </Panel>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-[88vw] max-w-[320px] bg-surface p-0">
          <SheetHeader>
            <SheetTitle>筛选设备</SheetTitle>
          </SheetHeader>
          <SheetBody>{filterPanel}</SheetBody>
        </SheetContent>
      </Sheet>

      <DeviceDetailPanel
        device={detailDevice}
        open={detailOpen}
        onClose={closeDetail}
        ports={detailDevice ? portsFor(detailDevice) : undefined}
        events={detailDevice ? eventsFor(detailDevice) : undefined}
        traffic={detailDevice ? trafficFor(detailDevice) : undefined}
        demoMode
      />

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重启 {selectedRows.size} 台设备？</DialogTitle>
            <DialogDescription>
              设备会依次重启，过程中可能短暂离线。当前为演示环境，不会发送真实命令。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBulkOpen(false)}>
              取消
            </Button>
            <Button variant="danger" onClick={confirmBulk}>
              确认重启
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={firmwareOpen} onOpenChange={setFirmwareOpen}>
        <DialogContent className="w-[min(calc(100vw-32px),580px)]">
          <DialogHeader>
            <DialogTitle>设备更新</DialogTitle>
            <DialogDescription>以下更新为演示流程，固件版本与设备均为虚构数据。</DialogDescription>
          </DialogHeader>
          <div className="divide-y divide-line rounded-[var(--lat-radius-md)] border border-line">
            {devices
              .filter((device) => device.id === 'lab-ap' || device.id === 'render-node')
              .map((device) => {
                const updated = updatedIds.includes(device.id)
                return (
                  <div key={device.id} className="flex items-center gap-3 p-3">
                    <DeviceGlyph kind={device.kind} status={device.status} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-ink">{device.name}</div>
                      <div className="mt-0.5 text-[9px] text-faint">
                        {device.model} · 当前 {device.firmware}
                      </div>
                    </div>
                    {updated ? (
                      <Badge tone="success" dot>
                        已是最新
                      </Badge>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={updatingId === device.id}
                        onClick={() => runFirmwareUpdate(device.id)}
                      >
                        更新
                      </Button>
                    )}
                  </div>
                )
              })}
          </div>
          <DialogFooter>
            <Button onClick={() => setFirmwareOpen(false)}>完成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageBody>
  )
}
