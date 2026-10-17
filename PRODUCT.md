# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: React 19.3.1 + TypeScript 7.0.2 + Vite 8.3.4 + Tailwind CSS 4.3.3 + Radix primitives. The stack was chosen for a runnable reference console, a source-first component registry, and portable CSS tokens. Versions are pinned in package.json and the lockfile.

## Users

Product and engineering teams building dense operational consoles, internal admin tools, network and infrastructure dashboards, and data-heavy settings surfaces. Designers use the token and component rules to review new work; AI coding agents use the registry and documentation to generate consistent screens.

## Product Purpose

Lattice UI is a reusable design system and reference console. It turns a visual language observed in UniFi's console and marketing site into independent tokens, accessible React primitives, operational composites, and a source registry that teams can install one component at a time. Success means a new operational screen can be assembled without re-deciding color hierarchy, density, table behavior, panel motion, or status semantics.

## Positioning

The system pairs a compact console language with a source-first distribution model. Teams can copy and edit the actual component source, install complete dependency closures, and switch dark/light and compact/roomy modes without rewriting individual components. The domain composites (filterable table, non-modal detail panel, traffic panel, topology map) make the system useful beyond a generic button library.

## Operating Context

Primary surfaces are authenticated desktop consoles used for monitoring and configuration. Narrow screens are used for quick checks and interrupt-driven tasks, so the shell collapses to a drawer, tables scroll independently, and detail views become modal sheets. Design work is reviewed in both themes and both densities. Demo data is entirely fictional and lives outside the component library.

## Capabilities and Constraints

- Console components and three complete demo pages: overview, devices, settings.
- Source-first registry with 43 items, including theme, utilities, base UI, and domain blocks.
- Working local installer with recursive dependency resolution and conflict protection.
- Dark and light themes; compact and roomy density.
- Radix-backed dialogs, sheets, menus, selects, tabs, tooltips, checkboxes and switches.
- Sortable and selectable data table, grouped filters, CSV export, detail tabs, form validation and save states.
- SVG traffic chart with keyboard inspection, series toggles and range controls.
- Independent topology map with keyboard-selectable nodes.
- No backend, authentication, real UniFi connection, or production persistence.
- Marketing-page components and the full UniFi interaction set are out of scope for this first console release.
- CSS tokens are the runtime source of truth in 0.2; a generated JSON export is provided for tooling. A JSON-first generation pipeline is a follow-up engineering task.
- Modern evergreen browsers with CSS individual transform properties and Tailwind CSS 4.

## Brand Commitments

The public-facing name 'Lattice UI' is an internal working name and still requires package, domain and trademark review before release. The visual work is an independent interpretation, not an official Ubiquiti or UniFi product. Do not use UniFi/Ubiquiti logos, proprietary fonts, product photography, private console screenshots, or business data in distributed assets. Use the geometric Lattice mark and fictional demo content.

## Evidence on Hand

- REA observations of the official UniFi homepage and an authenticated Network settings overview, captured 2026-10-17.
- Browser inspection of the dashboard, device list, detail panel, light theme and narrow layout.
- The research and verification record at docs/evidence.md.
- Fictional demo data in src/data/demo.ts.
- No official UniFi design specification, source code license, or component API documentation was obtained.

## Product Principles

1. Information earns the space; controls stay quiet until they are needed.
2. Hierarchy comes from surface, line and type, with action color reserved for decisions and current state.
3. Keep context: inspect a row beside its list on desktop, and use a focused drawer only when the screen cannot hold both.
4. Make states explicit in text, icon and shape as well as color.
5. Ship source that teams can own, with tokens and dependency closures that survive installation.

## Accessibility & Inclusion

Target WCAG 2.2 AA. Body and placeholder text should reach 4.5:1; large text and essential non-text indicators should reach 3:1. Interactive targets aim for at least 24x24 CSS pixels, with larger primary touch actions on narrow screens. The reference console includes keyboard focus, focus restoration for dialogs, Escape handling, accessible table sorting, chart keyboard inspection, and reduced-motion handling. Full screen-reader and 200% zoom audits are still required before a production release.
