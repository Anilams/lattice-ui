# Component guide

Components import through the @/* alias. Base controls live in components/ui; console compositions live in components/console. All controls accept the usual React HTML attributes in addition to the props listed here.

## Theme and density

The theme is controlled by .dark or .light on the html element. Density is controlled by data-density="compact" or data-density="roomy" on the same element. The reference app persists both choices in localStorage.

~~~tsx
document.documentElement.classList.toggle('dark', theme === 'dark')
document.documentElement.classList.toggle('light', theme === 'light')
document.documentElement.dataset.density = density
~~~

Import the token and theme styles once:

~~~css
@import "tailwindcss";
@import "./styles/lattice/lattice.css";
~~~

## Button

~~~tsx
<Button variant="primary" size="md" onClick={save}>
  保存更改
</Button>
<Button variant="secondary" loading>
  正在同步
</Button>
~~~

Variants: primary, secondary, ghost, danger, link. Sizes: sm, md, lg, icon. Loading disables the button and sets aria-busy. Use IconButton for a square action with one icon; label is required and becomes the accessible name.

## Input

~~~tsx
<Input
  label="网关 IP 地址"
  value={gateway}
  onChange={(event) => setGateway(event.target.value)}
  hint="局域网内控制器的默认网关。"
  error={showErrors ? errors.gateway : undefined}
  leading={<RouterIcon />}
/>
~~~

Input composes a label, a bordered control shell and a hint or error. The error text is connected through aria-describedby and the input receives aria-invalid. If you provide an id, it is used; otherwise a generated id links the label and help text.

## Select

~~~tsx
<Select value={width} onValueChange={setWidth}>
  <SelectTrigger aria-label="信道宽度">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="20">20 MHz</SelectItem>
    <SelectItem value="40">40 MHz</SelectItem>
    <SelectItem value="80">80 MHz</SelectItem>
  </SelectContent>
</Select>
~~~

Select uses Radix Select. The trigger always needs an accessible name, either from a visible label or aria-label. Use SelectLabel and SelectSeparator for grouped menus.

## Checkbox and Switch

~~~tsx
<Checkbox
  checked={autoChannel}
  onCheckedChange={(checked) => setAutoChannel(checked === true)}
  label="自动选择信道"
  description="优先使用干扰最小的信道。"
/>

<Switch
  checked={guestNetwork}
  onCheckedChange={setGuestNetwork}
  label="访客网络"
  description="与内网客户端隔离。"
/>
~~~

The visual box is intentionally small, but both controls include an enlarged pseudo-element hit area for pointer and touch. For a checkbox used inside a table with no visible label, pass aria-label.

## Tabs

~~~tsx
<Tabs value={tab} onValueChange={setTab}>
  <TabsList variant="segmented">
    <TabsTrigger value="overview">概览</TabsTrigger>
    <TabsTrigger value="ports">端口</TabsTrigger>
    <TabsTrigger value="activity">活动</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
</Tabs>
~~~

The line variant uses a bottom border; the segmented variant uses a raised track. Arrow-key navigation comes from Radix.

## Tooltip, DropdownMenu and Dialog

Wrap the application in TooltipProvider. Place TooltipTrigger around the actual button and TooltipContent in the same tree. DropdownMenu exposes Content, Item, CheckboxItem, Label, Separator and SubTrigger. DialogContent includes an overlay, Escape handling, a close button and focus management.

~~~tsx
<Tooltip>
  <TooltipTrigger asChild>
    <IconButton label="复制 IP">
      <Copy />
    </IconButton>
  </TooltipTrigger>
  <TooltipContent>复制 IP 地址</TooltipContent>
</Tooltip>
~~~

Use a Dialog when a task needs protected focus or explicit confirmation. Use Sheet for a task that can be dismissed without losing the surrounding context.

## Sheet

~~~tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>设备详情</SheetTitle>
      <SheetDescription>Hall AP-6E · 东厅</SheetDescription>
    </SheetHeader>
    <SheetBody>...</SheetBody>
  </SheetContent>
</Sheet>
~~~

Sides: right, left, bottom. The right sheet is 460 px wide with a 92vw cap; the left sheet is 320 px wide. Focus is trapped by Radix while the sheet is modal.

## Badge, StatusDot and InlineNotice

~~~tsx
<Badge tone="success" dot>在线</Badge>
<StatusDot status="warning" pulse label="需要注意" />
<InlineNotice tone="warning" title="上游 NAT 已检测到">
  部分入站连接可能受限。
</InlineNotice>
~~~

StatusDot can be used without a label when adjacent text already names the state. InlineNotice accepts an action node; keep the action small and specific.

## Panel

~~~tsx
<Panel>
  <PanelHeader
    title="上行链路"
    description="按延迟与使用量排序"
    actions={<Badge tone="success" dot>2 条在线</Badge>}
  />
  <div>...</div>
</Panel>
~~~

Panel is a bordered surface. Do not nest Panel inside Panel for ordinary content. Use a divider or a row group instead.

## DataTable

DataTable is generic over a row type with a stable id.

~~~tsx
const columns: DataTableColumn<Device>[] = [
  {
    id: 'name',
    header: '设备',
    sortValue: (device) => device.name,
    cell: (device) => <span>{device.name}</span>,
  },
  {
    id: 'status',
    header: '状态',
    sortValue: (device) => device.status,
    cell: (device) => <DeviceStatusBadge status={device.status} />,
  },
]

<DataTable
  rows={devices}
  columns={columns}
  getRowId={(device) => device.id}
  selected={selected}
  onSelectedChange={setSelected}
  onRowClick={openDetail}
  initialSort={{ id: 'name', direction: 'asc' }}
/>
~~~

Column options: id, header, cell, sortValue, width, align, hideBelow. Sorting is internal and cycles ascending, descending and unsorted. Selection is controlled by the caller through a Set of ids. If rows is empty, render EmptyState with the supplied title and description.

When onRowClick is provided, include a named button in one of the cells, as the Devices page does with the device name, or provide an equivalent keyboard action. DataTable keeps semantic rows and does not make the row itself a focus target.

## FilterPanel

~~~tsx
<FilterPanel
  search={search}
  onSearchChange={setSearch}
  groups={groups}
  selected={selected}
  onToggle={toggleFilter}
  onClear={clearFilters}
  resultCount={filtered.length}
/>
~~~

Each group has options with value, label, optional count and optional tone. Selection is a Record<string, string[]>; the caller owns filtering. The reference app renders the same panel in a desktop sidebar and a mobile Sheet.

## DetailPanel

~~~tsx
<DetailPanel
  device={device}
  open={detailOpen}
  onClose={closeDetail}
  ports={ports}
  events={events}
  traffic={traffic}
  demoMode
/>
~~~

The Device shape is in components/console/types.ts. ports, events and traffic are caller-provided; when omitted, the related tab or chart shows an explicit empty state. demoMode makes the restart action simulate and show a warning; in production pass onRestart instead. At 1280px and wider the panel is a complementary non-modal aside; below that it becomes a modal Sheet. Focus returns to the caller's trigger through onClose.

## SettingsSection and SettingRow

~~~tsx
<SettingsSection title="互联网" description="网关地址与 DNS 解析">
  <SettingRow label="网关 IP 地址" description="局域网内控制器的默认网关。">
    <Input value={gateway} onChange={...} />
  </SettingRow>
</SettingsSection>
~~~

SettingsSection owns its open state. SettingRow uses a one-column layout below the md breakpoint and a two-column label/control layout above it.

## TrafficPanel and TrafficChart

~~~tsx
<TrafficPanel
  data={traffic}
  range={range}
  onRangeChange={setRange}
  wans={wans}
  selectedWan={wan}
  onSelectWan={setWan}
/>
~~~

TrafficChart accepts data points with download and upload values. The chart is a group with tabIndex 0; left and right arrows move the inspected point, Escape clears it, and a screen-reader summary reports the peaks. The second series is dashed as well as differently colored.

## TopologyMap

~~~tsx
<TopologyMap nodes={nodes} links={[['wan', 'gw'], ['gw', 'sw']]} />
~~~

Nodes use percentage positions over a 600x330 coordinate space. Each node is a real button with aria-pressed. The selected node updates the text summary and highlights connected links.

## AppShell

AppShell expects rail items, grouped navigation, theme and density props. It includes the site switcher, product tabs, notification panel, account menu, mobile navigation sheet and command palette (Cmd/Ctrl+K). It depends on react-router-dom and should be treated as an application-level block rather than a primitive.
