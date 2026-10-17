import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'r')
const registryUrl = new URL(
  process.env.LATTICE_REGISTRY_URL ?? 'https://anilams.github.io/lattice-ui/r',
)
registryUrl.hostname = registryUrl.hostname.toLowerCase()
const registryBase = registryUrl.toString().replace(/\/$/, '')

const ui = [
  ['button', 'Button', 'Primary, secondary, ghost, danger and link actions with loading state.', ['utils'], ['class-variance-authority', 'lucide-react']],
  ['icon-button', 'IconButton', 'Square icon action with an accessible label.', ['utils'], ['class-variance-authority']],
  ['badge', 'Badge', 'Compact semantic status label.', ['utils'], ['class-variance-authority']],
  ['status-dot', 'StatusDot', 'Small status indicator with optional pulse.', ['utils'], []],
  ['panel', 'Panel', 'Bordered surface with a compact header.', ['control', 'utils'], []],
  ['input', 'Input', 'Labeled input with hint, error and leading or trailing content.', ['control', 'utils'], []],
  ['checkbox', 'Checkbox', 'Radix checkbox with an enlarged hit area.', ['utils'], ['@radix-ui/react-checkbox', 'lucide-react']],
  ['switch', 'Switch', 'Radix switch with label and description.', ['utils'], ['@radix-ui/react-switch']],
  ['tabs', 'Tabs', 'Line and segmented tabs with keyboard navigation.', ['utils'], ['@radix-ui/react-tabs', 'class-variance-authority']],
  ['tooltip', 'Tooltip', 'Portal tooltip with collision handling.', ['utils'], ['@radix-ui/react-tooltip']],
  ['dropdown-menu', 'DropdownMenu', 'Accessible menu primitives with checkbox items.', ['utils'], ['@radix-ui/react-dropdown-menu', 'lucide-react']],
  ['select', 'Select', 'Radix select styled as a compact form control.', ['control', 'utils'], ['@radix-ui/react-select', 'lucide-react']],
  ['dialog', 'Dialog', 'Modal dialog with focus management and Escape handling.', ['utils'], ['@radix-ui/react-dialog', 'lucide-react']],
  ['sheet', 'Sheet', 'Left, right or bottom drawer built on Radix Dialog.', ['utils'], ['@radix-ui/react-dialog', 'class-variance-authority', 'lucide-react']],
  ['separator', 'Separator', 'Horizontal or vertical divider.', ['utils'], ['@radix-ui/react-separator']],
  ['skeleton', 'Skeleton', 'Loading placeholder with reduced-motion support.', ['utils'], []],
  ['inline-notice', 'InlineNotice', 'Inline info, success, warning and danger message.', ['utils'], ['lucide-react']],
  ['toast', 'Toast', 'Queued status notifications with an accessible live region.', ['utils'], ['lucide-react']],
]

const blocks = [
  ['page', 'Page primitives', 'Page header, body and toolbar.', ['utils'], []],
  ['health-strip', 'HealthStrip', 'Compact operational health summary.', ['status-dot', 'utils'], ['lucide-react']],
  ['device-glyph', 'DeviceGlyph', 'Device kind glyph with status indicator.', ['status-dot', 'types', 'utils'], ['lucide-react']],
  ['device-status-badge', 'DeviceStatusBadge', 'Online, warning and offline labels.', ['badge', 'types'], []],
  ['sparkline', 'Sparkline', 'Dependency-free sparkline for compact telemetry.', ['utils'], []],
  ['traffic-chart', 'TrafficChart', 'Keyboard-inspectable SVG traffic chart with two series and animated updates.', ['motion', 'types', 'utils'], []],
  ['traffic-panel', 'TrafficPanel', 'Chart panel with range and series controls.', ['button', 'panel', 'tabs', 'traffic-chart', 'types', 'utils'], ['lucide-react']],
  ['topology-map', 'TopologyMap', 'Interactive network topology with keyboard-selectable nodes.', ['badge', 'device-glyph', 'empty-state', 'icon-button', 'panel', 'status-dot', 'types', 'utils'], ['lucide-react']],
  ['topology-workbench', 'TopologyWorkbench', 'Zoomable, pannable topology workbench with animated links and an inspector-ready node layer.', ['badge', 'device-glyph', 'icon-button', 'panel', 'types', 'utils'], ['lucide-react']],
  ['filter-panel', 'FilterPanel', 'Search and grouped filters for dense lists.', ['button', 'checkbox', 'input', 'utils'], ['lucide-react']],
  ['empty-state', 'EmptyState', 'Empty result with teaching copy and optional action.', ['utils'], ['lucide-react']],
  ['data-table', 'DataTable', 'Sortable, selectable table with responsive column hiding.', ['checkbox', 'empty-state', 'utils'], ['lucide-react']],
  ['settings-section', 'SettingsSection', 'Collapsible settings group and key-value rows.', ['panel', 'utils'], ['lucide-react']],
  ['activity-feed', 'ActivityFeed', 'Timestamped activity stream accepting caller data.', ['icon-button', 'panel', 'status-dot', 'types', 'utils'], ['lucide-react']],
  ['detail-panel', 'DetailPanel', 'Non-modal desktop detail panel and modal mobile sheet.', ['badge', 'button', 'device-glyph', 'device-status-badge', 'dialog', 'icon-button', 'inline-notice', 'separator', 'sheet', 'sparkline', 'tabs', 'types', 'utils'], ['lucide-react']],
  ['live-value', 'LiveValue', 'Tweened numeric value for live operational metrics.', ['motion', 'utils'], []],
  ['port-matrix', 'PortMatrix', 'Selectable port grid with status, PoE and utilization.', ['live-value', 'types', 'utils'], []],
  ['log-stream', 'LogStream', 'Pausable, auto-scrolling log viewer with severity badges.', ['badge', 'types', 'utils'], []],
  ['app-shell', 'AppShell', 'Console shell with rail, navigation, site switcher, command palette and theme controls.', ['badge', 'brand', 'button', 'dialog', 'dropdown-menu', 'icon-button', 'sheet', 'status-dot', 'tooltip', 'utils'], ['lucide-react', 'react-router-dom']],
]

const items = [
  {
    name: 'theme',
    type: 'registry:theme',
    title: 'Lattice theme',
    description: 'Primitive and semantic tokens for dark, light and density modes.',
    files: [
      ['src/styles/tokens.css', 'styles/lattice/tokens.css', 'registry:style'],
      ['src/styles/lattice.css', 'styles/lattice/lattice.css', 'registry:style'],
    ],
  },
  {
    name: 'utils',
    type: 'registry:lib',
    title: 'Utilities',
    description: 'Class merging and compact number helpers.',
    files: [['src/lib/utils.ts', 'lib/utils.ts', 'registry:lib']],
    registryDependencies: ['theme'],
    dependencies: ['clsx', 'tailwind-merge'],
  },
  {
    name: 'types',
    type: 'registry:lib',
    title: 'Console types',
    description: 'Device, WAN, traffic, topology and activity data shapes.',
    files: [['src/components/console/types.ts', 'components/console/types.ts', 'registry:lib']],
  },
  {
    name: 'control',
    type: 'registry:lib',
    title: 'Control styles',
    description: 'Shared form-control and panel class recipes.',
    files: [['src/components/ui/control.ts', 'components/ui/control.ts', 'registry:lib']],
  },
  {
    name: 'motion',
    type: 'registry:lib',
    title: 'Motion hooks',
    description: 'Reduced-motion-aware numeric and series tweening.',
    files: [['src/hooks/use-motion.ts', 'hooks/use-motion.ts', 'registry:lib']],
  },
  {
    name: 'brand',
    type: 'registry:block',
    title: 'Lattice brand mark',
    description: 'Independent geometric mark and wordmark for the demo shell.',
    files: [['src/components/console/brand.tsx', 'components/console/brand.tsx', 'registry:block']],
    registryDependencies: ['utils'],
  },
  ...ui.map(([name, title, description, deps, packages]) => ({
    name,
    type: 'registry:ui',
    title,
    description,
    files: [[
      'src/components/ui/' + name + '.tsx',
      'components/ui/' + name + '.tsx',
      'registry:ui',
    ]],
    registryDependencies: deps,
    dependencies: packages,
  })),
  ...blocks.map(([name, title, description, deps, packages]) => ({
    name,
    type: 'registry:block',
    title,
    description,
    files: [[
      'src/components/console/' + name + '.tsx',
      'components/console/' + name + '.tsx',
      'registry:block',
    ]],
    registryDependencies: deps,
    dependencies: packages,
  })),
]

const index = []
await mkdir(outDir, { recursive: true })

for (const item of items) {
  const files = []
  for (const [source, target, type] of item.files) {
    const content = await readFile(path.join(root, source), 'utf8')
    files.push({ path: source, target, type, content })
  }
  const record = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: (item.registryDependencies ?? []).map((dependency) =>
      dependency.startsWith('http') ? dependency : registryBase + '/' + dependency + '.json',
    ),
    files,
  }
  await writeFile(path.join(outDir, item.name + '.json'), JSON.stringify(record, null, 2) + '\n')
  index.push({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
  })
}

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'lattice',
  homepage: 'https://anilams.github.io/lattice-ui/',
  items: index,
}

await writeFile(path.join(outDir, 'registry.json'), JSON.stringify(registry, null, 2) + '\n')
await writeFile(path.join(root, 'registry.json'), JSON.stringify(registry, null, 2) + '\n')
console.log('Wrote ' + index.length + ' registry items to ' + outDir)
