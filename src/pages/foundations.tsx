import * as React from 'react'
import {
  Check,
  ChevronDown,
  Command,
  Copy,
  Layers3,
  MousePointer2,
  SwatchBook,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageBody, PageHeader } from '@/components/console/page'
import { DeviceGlyph } from '@/components/console/device-glyph'

const swatches = [
  { name: 'Action', token: '--lat-action', use: '主操作、选中、焦点' },
  { name: 'Success', token: '--lat-success', use: '在线、成功、已完成' },
  { name: 'Warning', token: '--lat-warning', use: '注意、待处理' },
  { name: 'Danger', token: '--lat-danger', use: '离线、错误、破坏性操作' },
  { name: 'Info', token: '--lat-info', use: '提示、数据说明' },
  { name: 'Series 1', token: '--lat-series-1', use: '图表系列 A' },
  { name: 'Series 2', token: '--lat-series-2', use: '图表系列 B' },
  { name: 'Canvas', token: '--lat-canvas', use: '应用底色' },
]

const componentRows = [
  ['Button / IconButton', '基础', '5 种变体、3 种尺寸、加载与禁用状态'],
  ['Input / Select / Checkbox / Switch', '基础', '标签、提示、错误与键盘状态'],
  ['Tabs / Tooltip / DropdownMenu', '基础', 'Radix 驱动的可访问交互'],
  ['Dialog / Sheet', '基础', '焦点陷阱、Escape、关闭后焦点恢复'],
  ['Badge / StatusDot / InlineNotice', '状态', '语义色与文字双重表达'],
  ['AppShell / PageHeader', '组合', '导航、站点切换、命令搜索、主题与密度'],
  ['FilterPanel / DataTable', '组合', '搜索、筛选、排序、选择与 CSV 导出'],
  ['DetailPanel / SettingsSection', '组合', '非模态侧栏、移动抽屉、设置分组与保存状态'],
]

export function FoundationsPage() {
  const [copied, setCopied] = React.useState('')
  const [switchOn, setSwitchOn] = React.useState(true)
  const [checked, setChecked] = React.useState(true)
  const [selectValue, setSelectValue] = React.useState('80')
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [motion, setMotion] = React.useState(false)
  const [tab, setTab] = React.useState('overview')

  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText('var(' + token + ')')
      setCopied(token)
      window.setTimeout(() => setCopied(''), 1400)
    } catch {
      setCopied('')
    }
  }

  return (
    <PageBody>
      <PageHeader
        title="设计基础"
        description="Lattice UI 0.1 · 为高密度运维界面提炼的令牌、控件与交互规则。"
        meta={<Badge tone="action">内部预览</Badge>}
        actions={
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>
            打开组件抽屉
          </Button>
        }
      />

      <Panel className="mb-3 overflow-hidden">
        <div className="grid divide-y divide-line md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
          {[
            ['数据优先', '控件服务于扫读、比较和判断，装饰让位于信息。'],
            ['弱层级', '用近黑表面、细边框和少量蓝色建立秩序，保持对比稳定。'],
            ['上下文连续', '列表旁展开详情，移动端转为可关闭的抽屉。'],
            ['状态可读', '颜色与文字、图标、形状并用，避免只靠颜色传达状态。'],
          ].map(([title, description]) => (
            <div key={title} className="p-4">
              <div className="text-[12px] font-medium text-ink">{title}</div>
              <p className="mt-1 text-[10px] leading-4 text-faint">{description}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel>
          <PanelHeader title="语义色彩" description="点击复制 CSS 变量。" icon={<SwatchBook className="size-3.5" />} />
          <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
            {swatches.map((swatch) => (
              <button
                key={swatch.token}
                type="button"
                onClick={() => copyToken(swatch.token)}
                className="group bg-surface p-2.5 text-left transition-colors hover:bg-hover focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-action"
                aria-label={'复制 ' + swatch.token}
              >
                <div
                  className="mb-2 h-12 rounded-[var(--lat-radius-sm)] border border-line"
                  style={{ background: 'var(' + swatch.token + ')' }}
                />
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-medium text-ink">{swatch.name}</span>
                  {copied === swatch.token ? (
                    <Check className="size-3 text-success" />
                  ) : (
                    <Copy className="size-2.5 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </div>
                <div className="mt-0.5 truncate text-[9px] text-faint">{swatch.use}</div>
                <div className="lat-data mt-1 truncate text-[8px] text-faint">{swatch.token}</div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="排版" description="固定字号；中文与数字共同验证。" icon={<Layers3 className="size-3.5" />} />
          <div className="divide-y divide-line-faint">
            {[
              ['2xl / 24–32', '概览', '页面级标题，tracking -0.025em'],
              ['lg / 16–24', '设备详情', '区块标题与对话标题'],
              ['md / 14–20', '网络状态与上行链路', '主要正文与导航'],
              ['sm / 13–20', '设备名称、筛选与表单', '高密度操作文本'],
              ['xs / 12–16', '203.0.113.24', '辅助说明与数据标签'],
              ['2xs / 11–16', 'WAN1 · 12 ms', '元数据、时间、状态'],
            ].map(([size, sample, note]) => (
              <div key={size} className="grid grid-cols-[76px_1fr] items-baseline gap-3 px-3.5 py-2.5">
                <span className="lat-data text-[9px] text-faint">{size}</span>
                <div className="min-w-0">
                  <div
                    className={cn(
                      'truncate text-ink',
                      size.startsWith('2xl') && 'text-[24px] font-semibold leading-8 tracking-[-0.025em]',
                      size.startsWith('lg') && 'text-[16px] font-semibold leading-6',
                      size.startsWith('md') && 'text-[14px] leading-5',
                      size.startsWith('sm') && 'text-[13px] leading-5',
                      size.startsWith('xs') && 'text-[12px] leading-4',
                      size.startsWith('2xs') && 'lat-data text-[11px] leading-4',
                    )}
                  >
                    {sample}
                  </div>
                  <div className="mt-0.5 text-[9px] text-faint">{note}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,1fr)]">
        <Panel>
          <PanelHeader title="控件状态" description="悬停、聚焦、禁用、加载与错误。" icon={<MousePointer2 className="size-3.5" />} />
          <div className="space-y-4 p-3.5">
            <div>
              <div className="mb-2 text-[9px] uppercase tracking-[0.08em] text-faint">Button</div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary">主操作</Button>
                <Button variant="secondary">次操作</Button>
                <Button variant="ghost">幽灵</Button>
                <Button variant="danger">危险</Button>
                <Button variant="secondary" loading>
                  加载
                </Button>
                <Button variant="secondary" disabled>
                  禁用
                </Button>
              </div>
            </div>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="设备名称" placeholder="例如：东厅 AP" hint="支持中文与长名称。" />
              <Input label="IP 地址" defaultValue="192.168.10" error="请输入完整的 IPv4 地址。" />
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium text-muted">信道宽度</span>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger aria-label="信道宽度">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 MHz</SelectItem>
                    <SelectItem value="40">40 MHz</SelectItem>
                    <SelectItem value="80">80 MHz</SelectItem>
                    <SelectItem value="160">160 MHz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col justify-end gap-2.5">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) => setChecked(value === true)}
                  label="自动选择信道"
                  description="优先使用干扰最小的信道。"
                />
                <Switch
                  checked={switchOn}
                  onCheckedChange={setSwitchOn}
                  label="访客网络"
                  description="与内网客户端隔离。"
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success" dot>
                在线
              </Badge>
              <Badge tone="warning" dot>
                注意
              </Badge>
              <Badge tone="danger" dot>
                离线
              </Badge>
              <Badge tone="action">Network</Badge>
              <Badge tone="neutral">Fabric</Badge>
              <DeviceGlyph kind="ap" size="sm" />
              <DeviceGlyph kind="gateway" size="sm" />
            </div>
            <Separator />
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="ports">端口</TabsTrigger>
                <TabsTrigger value="activity">活动</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-3 text-[10px] text-faint">
                概览面板使用同一套边框与文字层级。
              </TabsContent>
              <TabsContent value="ports" className="pt-3 text-[10px] text-faint">
                端口面板保留相同的行高与数值对齐。
              </TabsContent>
              <TabsContent value="activity" className="pt-3 text-[10px] text-faint">
                活动面板使用时间列与状态点。
              </TabsContent>
            </Tabs>
          </div>
        </Panel>

        <div className="space-y-3">
          <Panel>
            <PanelHeader title="浮层与焦点" description="Escape 关闭；关闭后返回触发点。" icon={<Command className="size-3.5" />} />
            <div className="flex flex-wrap items-center gap-2 p-3.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="sm">
                    悬停提示
                  </Button>
                </TooltipTrigger>
                <TooltipContent>工具提示使用 120ms 淡入。</TooltipContent>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm">
                    菜单
                    <ChevronDown className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>设备操作</DropdownMenuLabel>
                  <DropdownMenuItem>查看详情</DropdownMenuItem>
                  <DropdownMenuItem>复制 IP 地址</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive>重启设备</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="secondary" size="sm" onClick={() => setDialogOpen(true)}>
                打开对话框
              </Button>
            </div>
            <div className="border-t border-line px-3.5 py-2.5 text-[10px] leading-4 text-faint">
              Dialog 用于需要明确确认或阻断的任务；侧栏详情优先使用非模态面板。
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="动效" description="只表达状态变化，不做页面入场编排。" />
            <div className="p-3.5">
              <button
                type="button"
                onClick={() => setMotion((value) => !value)}
                className="flex w-full items-center justify-between rounded-[var(--lat-radius-sm)] border border-line bg-raised px-2.5 py-2 text-left text-[10px] text-muted hover:border-line-strong"
              >
                <span>切换状态以观察过渡</span>
                <span className={cn('size-2 rounded-full transition-colors duration-[var(--lat-duration-base)]', motion ? 'bg-success' : 'bg-faint')} />
              </button>
              <div className="mt-3 h-8 overflow-hidden rounded-[var(--lat-radius-sm)] bg-raised">
                <div
                  className={cn(
                    'h-full w-1/3 rounded-[var(--lat-radius-sm)] bg-action/70 transition-[transform,background-color] duration-[var(--lat-duration-panel)] ease-[var(--lat-ease-out)]',
                    motion ? 'translate-x-[200%]' : 'translate-x-0',
                  )}
                />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1 text-[9px] text-faint">
                <span>Fast 120ms</span>
                <span>Base 180ms</span>
                <span className="text-right">Panel 240ms</span>
              </div>
              <p className="mt-3 text-[10px] leading-4 text-faint">
                系统设置 prefers-reduced-motion 时，位移与持续动画会停止，状态与关闭行为仍然可用。
              </p>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="安装片段" description="源码 registry 的预期用法。" />
            <pre className="overflow-x-auto p-3.5 text-[10px] leading-5 text-muted">
              <code>{'node scripts/install.mjs data-table\nnode scripts/install.mjs detail-panel\n\n# 主题与工具函数随依赖闭包安装'}</code>
            </pre>
          </Panel>
        </div>
      </div>

      <Panel className="mt-3 overflow-hidden">
        <PanelHeader title="组件清单" description="首版实现范围；组合组件依赖基础组件与令牌。" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead className="border-b border-line bg-raised text-[9px] uppercase tracking-[0.08em] text-faint">
              <tr>
                <th className="px-3.5 py-2 font-medium">组件</th>
                <th className="px-3.5 py-2 font-medium">层级</th>
                <th className="px-3.5 py-2 font-medium">行为</th>
              </tr>
            </thead>
            <tbody>
              {componentRows.map(([name, layer, detail]) => (
                <tr key={name} className="border-b border-line-faint last:border-b-0">
                  <td className="px-3.5 py-2 text-[10px] text-ink">{name}</td>
                  <td className="px-3.5 py-2">
                    <Badge tone={layer === '基础' ? 'neutral' : 'action'}>{layer}</Badge>
                  </td>
                  <td className="px-3.5 py-2 text-[10px] text-faint">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>应用更改？</DialogTitle>
            <DialogDescription>这是一个演示对话框。确认后不会修改任何外部系统。</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-[var(--lat-radius-sm)] border border-line bg-raised px-3 py-2 text-[10px] text-faint">
            <Check className="size-3 text-success" />
            焦点会被限制在对话框内，Escape 可关闭。
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button variant="primary" onClick={() => setDialogOpen(false)}>
              确认
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>组件抽屉</SheetTitle>
          </SheetHeader>
          <SheetBody className="p-4 text-[11px] leading-5 text-faint">
            抽屉用于窄屏详情和临时任务。桌面端的设备详情使用非模态侧栏，以避免打断表格的浏览上下文。
          </SheetBody>
        </SheetContent>
      </Sheet>
    </PageBody>
  )
}
