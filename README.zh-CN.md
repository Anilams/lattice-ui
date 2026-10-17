<div align="center">

<img src="docs/images/lattice-mark.svg" width="64" alt="Lattice UI" />

# Lattice UI

**为高密度运维界面准备的设计系统。**

面向仪表盘、设备管理、设置和遥测的紧凑、克制、可复用的 React 组件。

[在线演示](https://anilams.github.io/lattice-ui/) · [组件文档](docs/components.md) · [Registry](docs/registry.md) · [设计规则](DESIGN.md) · [更新日志](CHANGELOG.md) · [English](README.md)

[![CI](https://github.com/Anilams/lattice-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/Anilams/lattice-ui/actions/workflows/ci.yml)
[![Deploy demo](https://github.com/Anilams/lattice-ui/actions/workflows/pages.yml/badge.svg)](https://github.com/Anilams/lattice-ui/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-4797FF.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-20232A.svg)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-0B1120.svg)](https://tailwindcss.com/)
[![Registry 37](https://img.shields.io/badge/registry-37_items-37BE5F.svg)](docs/registry.md)

<sub>v0.1 预览 · 公网演示 + 预览 registry · React 19 · TypeScript 7 · Tailwind CSS 4 · Radix UI</sub>

</div>

<img src="docs/images/social-preview.png" alt="Lattice UI 控制台与设计系统" width="100%" />

## 为什么是 Lattice UI

运维软件和营销页面承担着不同的任务。它需要在凌晨两点依然能快速扫读、比较和判断。Lattice UI 围绕这件事构建：紧凑的字号、稳定的表格、安静的表面，以及只用于决策和当前状态的单一强调色。仓库同时提供组件系统和一套可运行的参考控制台，让每条规则都能在真实页面中被检验。

| | 它解决什么问题 |
|---|---|
| **控制台优先的密度** | 默认 30 px 控件、38 px 行高和等宽数字；表单与阅读场景可切换宽松密度。 |
| **源码归你所有** | 组件通过 shadcn 风格 registry 复制到项目，直接修改源码、保留令牌和行为。 |
| **两套主题，两种密度** | 深色与浅色是完整的语义替换；紧凑与宽松只改变组件尺寸，不改变字号层级。 |
| **领域组合，而不只是按钮** | FilterPanel、DataTable、DetailPanel、TrafficPanel、TopologyMap、SettingsSection 和 AppShell 覆盖这一类产品反复出现的页面。 |
| **可访问性是行为** | Radix 原语、可见焦点、关闭后焦点恢复、Escape 层级、减少动效、键盘可检查图表和明确空态。 |
| **不依赖图表库** | 流量图和拓扑图使用 SVG/HTML 实现，视觉系统保持可检查、可移植。 |

## 包含什么

仓库包含 37 个 registry 条目和四个参考页面。

| 层级 | 内容 |
|---|---|
| 基础 | 主题令牌、深/浅色、紧凑/宽松密度、工具函数和控制台类型 |
| 基础控件 | Button、IconButton、Badge、StatusDot、Panel、Input、Checkbox、Switch、Tabs、Tooltip、DropdownMenu、Select、Dialog、Sheet、Separator、Skeleton、InlineNotice |
| 控制台组合 | Brand、页面原语、HealthStrip、DeviceGlyph、DeviceStatusBadge、Sparkline、TrafficChart、TrafficPanel、TopologyMap、FilterPanel、EmptyState、DataTable、SettingsSection、ActivityFeed、DetailPanel、AppShell |
| 参考应用 | 概览、设备、设置、设计基础 |

## 预览

<img src="docs/images/dashboard-dark.png" alt="深色 Lattice UI 仪表盘" width="100%" />

| 设备列表 | 详情面板 |
|---|---|
| <img src="docs/images/devices.png" alt="带筛选的设备表格" /> | <img src="docs/images/device-detail.png" alt="非模态设备详情面板" /> |

二级导航在 1024 px 以下变成抽屉；768 px 以下顶栏菜单取代图标栏。设备表横向滚动，详情面板在 1280 px 及以上保持非模态，低于该断点转换为模态 Sheet。

## 快速开始

已使用 Node.js 24 和 pnpm 11.25.0 验证。package.json 声明 Node.js >=20.19.0、pnpm >=10；Vite 8 要求 Node.js 20.19+ 或 22.12+。

~~~bash
git clone https://github.com/Anilams/lattice-ui.git
cd lattice-ui
pnpm install
pnpm dev
~~~

打开 http://127.0.0.1:4173/。如果 pnpm 提示 esbuild 构建脚本被忽略，执行一次 <code>pnpm approve-builds</code>。

## 安装到现有项目

预览 registry 随演示一起发布在 GitHub Pages 上。当前使用可变的 <code>/r</code> 通道，固定版本目录是发布后续事项。上游 shadcn CLI 和仓库内的本地安装器都会解析源码依赖闭包。

CLI 路径的前提：React 19 + Tailwind CSS 4 项目、已配置 <code>@/*</code> 别名，以及已初始化 shadcn 并包含全局样式表。

~~~bash
# 安装一个基础控件
npx shadcn@latest add https://anilams.github.io/lattice-ui/r/button.json
npx shadcn@latest add https://anilams.github.io/lattice-ui/r/badge.json

# 安装表格及其依赖
npx shadcn@latest add https://anilams.github.io/lattice-ui/r/data-table.json

# 安装控制台外壳
npx shadcn@latest add https://anilams.github.io/lattice-ui/r/app-shell.json
~~~

在接入项目的全局样式表中引入主题：

~~~css
@import "tailwindcss";
@import "./styles/lattice/lattice.css";
~~~

离线或 fork 后，复制源码闭包，再执行安装器打印的 npm 依赖命令：

~~~bash
pnpm registry
node scripts/install.mjs data-table detail-panel --target ../my-app
~~~

本地安装器默认写入 <code>src</code>。源码在项目根目录时使用 <code>--src .</code>。它复制源码并打印 npm 依赖命令，不会自动运行包管理器。冲突会在任何文件写入前中止，缺失依赖会返回非零退出码。参数与接入配置见 [docs/registry.md](docs/registry.md)。

## 30 秒示例

~~~tsx
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/console/data-table'

type Device = { id: string; name: string; status: 'online' | 'attention' }

const rows: Device[] = [
  { id: 'gw', name: '核心网关', status: 'online' },
  { id: 'ap', name: '东厅 AP', status: 'attention' },
]

const columns: DataTableColumn<Device>[] = [
  { id: 'name', header: '设备', sortValue: (row) => row.name, cell: (row) => row.name },
  {
    id: 'status',
    header: '状态',
    cell: (row) => <Badge tone={row.status === 'online' ? 'success' : 'warning'}>{row.status}</Badge>,
  },
]

export function Devices() {
  return <DataTable rows={rows} columns={columns} getRowId={(row) => row.id} />
}
~~~

传入 <code>onRowClick</code> 时，请在单元格中提供一个有名称的按钮或等价的键盘操作。表格行保持语义，不把整行做成焦点目标。

## 设计规则

视觉规则刻意保持精简。少数规则承担了大部分界面：

- **信息优先。** 装饰不与扫读、比较和判断争夺注意力。
- **弱层级，强对齐。** 画布、外壳、表面和抬升表面只差几个明度台阶；边框始终是一像素。
- **强调色是预算。** 蓝色只用于主操作、当前导航、选中和焦点。图表使用青色和紫色，状态使用绿色、琥珀色和红色。
- **保留上下文。** 宽屏在列表旁展开详情；1280 px 以下转换为模态抽屉。
- **状态冗余表达。** 文字、图标或形状与颜色共同说明状态。
- **动效报告状态。** 悬停和焦点 120 ms，对话框 180 ms，面板 240 ms。减少动效模式关闭位移、缩放和图表擦除。

<img src="docs/images/foundations.png" alt="Lattice UI 色彩、排版和控件基础" width="100%" />

## 主题与密度

~~~tsx
document.documentElement.classList.toggle('dark', theme === 'dark')
document.documentElement.classList.toggle('light', theme === 'light')
document.documentElement.dataset.density = density // compact | roomy
~~~

运行时令牌源是 [src/styles/tokens.css](src/styles/tokens.css)。生成的 [tokens.json](tokens.json) 是给工具使用的机器可读导出。组件使用语义令牌，不直接依赖原始色阶。

## 可访问性

参考应用以 WCAG 2.2 AA 为目标，包含键盘导航、可见焦点、浮层关闭后焦点恢复、嵌套 Escape 顺序、可访问排序、图表键盘检查和减少动效处理。空数据是可支持状态。

以下验证尚未完成，生产发布前必须补齐：

- VoiceOver、NVDA 和 JAWS 的屏幕阅读器检查；
- 320 px 重排和 200% 文字缩放；
- 组件边界与 muted-on-soft 组合的完整对比度矩阵；
- 完整的自动化与人工 WCAG 验收。

自动检查是有用证据，不等于认证。当前兼容性边界是 React 19 + Tailwind CSS 4 的 Vite 接入项目；React 18、Tailwind 3、Next.js SSR/RSC 和其他浏览器尚未验证。

## Registry

每个条目都由应用实际使用的同一份源码生成，不存在第二套组件实现。

| 类别 | 条目 |
|---|---|
| 主题与工具 | theme、utils、types、control |
| 基础控件 | 上表中的 17 个 UI 原语 |
| 组合组件 | 上表中的 16 个控制台组合 |

已使用 shadcn 4.21.5 验证 <code>button</code>、<code>data-table</code>、<code>app-shell</code> 和 <code>detail-panel</code>，并使用本地安装器验证完整闭包；公网 Pages URL 已做匿名访问检查和实际安装。工具链为 Node 24、pnpm 11.25.0。当前是可变的预览通道，在承诺可复现安装前需要固定版本目录。条目格式、兼容性说明和发布清单见 [docs/registry.md](docs/registry.md)。

## 项目结构

~~~text
src/
  components/ui/         基础控件
  components/console/    控制台组合与共享类型
  styles/tokens.css      运行时令牌源
  styles/lattice.css     Tailwind 映射、基础样式和动效
  data/demo.ts           虚构演示数据
  pages/                 四个参考页面
scripts/
  build-registry.mjs     生成 public/r/*.json
  install.mjs            安装到接入项目
  export-tokens.mjs      生成 tokens.json
public/r/                发布的 registry
docs/                    组件、registry 与证据文档
~~~

## 作为 Codex skill 使用

仓库包含 [SKILL.md](SKILL.md)，可供代理工作流使用。将整个目录复制到 Codex skills 目录，或在构建控制台页面时让代理读取 <code>SKILL.md</code> 和 <code>DESIGN.md</code>。

## 路线图

- [x] 令牌系统、深/浅主题和两种密度
- [x] 37 个源码 registry 条目和可工作的本地安装器
- [x] shadcn CLI 安装路径与接入项目构建验证
- [x] 四页参考控制台和移动端行为
- [ ] 完整 WCAG 与屏幕阅读器验收
- [ ] JSON-first 令牌生成和 Figma 导出
- [ ] 官网营销页面配方
- [ ] 拓扑编辑、端口矩阵和历史回放

## 贡献

提交 PR 前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。小而聚焦、带截图和状态矩阵的改动最容易审查。请遵守 [Code of Conduct](CODE_OF_CONDUCT.md)。

~~~bash
pnpm typecheck
pnpm build
pnpm build:lib
pnpm registry
~~~

## 许可证

[MIT](LICENSE) © 2026 Lattice UI contributors。

## 致谢

视觉方向最初来自对 UniFi 控制台和官网的独立研究。Lattice UI **与 Ubiquiti 无关联，也未获其背书**。仓库不包含 UniFi 源码、Logo、专有字体、私有截图或业务数据。

使用 [React](https://react.dev/)、[Tailwind CSS](https://tailwindcss.com/)、[Radix UI](https://www.radix-ui.com/)、[Lucide](https://lucide.dev/)、[Inter](https://rsms.me/inter/) 和 [JetBrains Mono](https://www.jetbrains.com/lp/mono/) 构建。

如果它帮你省下了一周的界面决策时间，点一个 star 会让更多团队找到它。
