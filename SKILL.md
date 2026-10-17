---
name: lattice-ui
description: Build dense operational consoles, dashboards, device lists and settings screens with the Lattice UI design system. Use when the task needs calm information hierarchy, compact tables, source-first React components, dark/light themes, or a working console pattern.
metadata:
  version: "0.1.0"
  homepage: "https://github.com/Anilams/lattice-ui"
---

# Lattice UI

Use this skill when a product needs an operational interface rather than a marketing page.

## Start with evidence

Read DESIGN.md for the visual rules and PRODUCT.md for the product context. Inspect the target application's existing tokens before adding a new world. Do not copy UniFi logos, proprietary fonts, private screenshots or business data.

## Choose the right layer

- Use components/ui for primitives that can be installed independently.
- Use components/console for dense compositions such as DataTable, FilterPanel, DetailPanel and TrafficPanel.
- Keep demo data, routes and backend clients out of reusable components.
- Prefer semantic tokens from src/styles/tokens.css over hard-coded colors and spacing.

## Build the surface

1. Define the task, the information hierarchy and the important states.
2. Use the compact density for console work and roomy density for forms or reading.
3. Use action color for primary actions, current selection and focus only.
4. Keep tables semantic, numeric columns aligned and status expressed with text or icon as well as color.
5. Use a non-modal detail panel on wide screens and a modal drawer below 1280px.
6. Make focus visible, restore focus after closing overlays, and support reduced motion.

## Install instead of copying the demo

Use the registry when the consumer already has React and Tailwind CSS 4:

~~~bash
npx shadcn@latest add https://anilams.github.io/lattice-ui/r/button.json
npx shadcn@latest add https://anilams.github.io/lattice-ui/r/data-table.json
~~~

Read docs/registry.md for the local installer, dependency closure and conflict behavior.

## Verify before finishing

Run the type check and production build. Exercise keyboard focus, Escape, empty data and both themes. Do not claim WCAG certification from an automated check alone.
