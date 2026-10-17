# Changelog

## 0.1.0 — 2026-10-17

First public preview.

### Added

- Semantic light/dark token system with compact and roomy densities.
- 17 base UI components and 16 console blocks generated as 37 source registry items.
- Four-page reference console: overview, devices, settings and design foundations.
- Sortable, selectable and filterable device table with CSV export and detail panel.
- Non-modal detail panel at 1280 px and above; modal drawer below.
- Settings form validation, dirty/saving/saved states and sticky save bar.
- Dependency-free SVG traffic chart with keyboard inspection and topology map.
- Local installer with source-root selection, atomic conflict handling and recursive dependency resolution.
- shadcn-compatible registry with absolute dependency URLs and public Pages hosting.
- English and Chinese README, component guide, registry guide, research evidence and Codex skill instructions.

### Validation

- <code>pnpm typecheck</code>, <code>pnpm build</code> and <code>pnpm build:lib</code> pass.
- shadcn 4.21.5 installs button, data-table, app-shell and detail-panel from clean consumers.
- Public Pages registry installs button + data-table and passes consumer TypeScript checking.
- Empty-data server rendering, mobile focus restoration, nested Escape ordering and short-height dialogs were exercised.

### Known limitations

- WCAG AA validation is still in progress: no screen-reader matrix, 320 px pass or 200% zoom pass yet.
- React 18, Tailwind 3, Next.js SSR/RSC and non-Chromium browser parity are not verified.
- The <code>/r</code> registry is a mutable preview channel; a pinned version directory is planned.
- The project name has not completed trademark clearance.
- Marketing-site components and topology/port editing are deferred.
