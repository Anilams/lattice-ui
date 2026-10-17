# Lattice UI Design System

Version 0.1.0, 2026-10-17. This document records the implemented visual system and the evidence behind it.

## Direction

Lattice UI is a quiet instrument panel for operational work. The interface is dark by default, compact by default, and organized around data rather than decoration. A warm neutral shell, near-black canvas, thin dividers and a single blue action color create hierarchy. Cyan and violet carry chart series; green, amber and red carry status. The design language is an independent interpretation of patterns observed in UniFi, not a pixel clone and not an official Ubiquiti asset.

## Principles

1. **Data first.** Labels, values, timestamps and states align on a stable grid. Decoration never competes with a reading task.
2. **Weak hierarchy.** Canvas, shell, surface and raised surface differ by a few lightness steps. Borders are one pixel. Elevation is used for overlays, not for every panel.
3. **Action color is scarce.** Blue marks primary actions, current navigation, selection and focus. It is not used for chart series or generic decoration.
4. **Context stays visible.** Desktop device details open as a non-modal side panel; narrow screens convert the same content to a modal drawer.
5. **Complexity is disclosed in layers.** Summary strips lead to panels, panels lead to tables, tables lead to a detail surface. Settings are grouped and collapsible.
6. **State is redundant.** Status is encoded with text, a dot or icon, and a semantic color. Color alone is never the only signal.
7. **Density is a choice.** Compact is the console default; roomy density increases control and row heights for forms and reading without changing the type scale.

## Token layers

The runtime source of truth is src/styles/tokens.css. Primitive values are named by hue and step. Semantic values describe use. Component values describe density and layout. Components consume semantic or component tokens; they do not hard-code palette values.

| Layer | Examples | Rule |
|---|---|---|
| Primitive | --lat-ink-900, --lat-blue-400, --lat-cyan-500 | Raw palette and type/spacing scale; do not use directly in product components without a semantic reason. |
| Semantic | --lat-canvas, --lat-surface, --lat-line, --lat-text, --lat-action, --lat-success | Theme-aware meaning. This is the default layer for components. |
| Component | --lat-control-height, --lat-row-height, --lat-content-pad, --lat-rail-width | Layout and density. Do not reuse these for unrelated spacing. |

Dark and light themes swap semantic values while preserving names. Density swaps component values. Console and Marketing are separate recipes; this release implements Console only. The generated tokens.json is an export for tooling, not yet the editing source.

## Color

Observed values were sampled from the authenticated console on 2026-10-17. They were used as candidates, then paired with foreground colors and adjusted for contrast and product use. The table below records the implemented 0.1 values.

| Token | Dark | Light | Use |
|---|---|---|---|
| canvas | #131416 | #F4F5F7 | Application background |
| shell | #1C1E21 | #FFFFFF | Top bar, rail and navigation |
| surface | #1C1E21 | #FFFFFF | Panels and tables |
| surface-raised | #22252A | #F8F9FA | Inputs, compact controls |
| surface-overlay | #282B2F | #FFFFFF | Menus, dialogs, sheets |
| line | rgb(249 250 250 / 0.08) | #E3E6EA | Default divider |
| line-strong | rgb(249 250 250 / 0.16) | #D2D7DE | Control borders |
| text | #DEE0E3 | #181A1E | Primary text |
| text-muted | #A9B0B9 | #5C6470 | Secondary text |
| text-faint | #8F98A3 | #66707B | Metadata, placeholders |
| action | #4797FF | #0063E6 | Primary actions, focus, current state |
| success | #37BE5F | #16853A | Online, healthy |
| warning | #E6A23C | #9A6200 | Attention |
| danger | #FF5C66 | #C93038 | Offline, errors, destructive actions |
| info | #63BDE3 | #146B8C | Informational status |
| series-1 | #63BDE3 | #146B8C | First chart series |
| series-2 | #B47CDE | #7A43A5 | Second chart series |

The observed console values included #4797FF for blue, #37BE5F for success, #DEE0E3 for primary text and #131416 for the canvas. The marketing site used #006FFF for its commerce action. The light action was adjusted from the observed value to #0063E6 to reach 5.35:1 with white text; the light and dark faint text values were adjusted to keep normal metadata above 4.5:1 on their surfaces. These observations are recorded in docs/evidence.md with REA evidence identifiers.

## Typography

Inter Variable is the UI and display face. JetBrains Mono is reserved for IP addresses, MAC addresses, times, versions, traffic values and other measured data. Chinese falls back to PingFang SC / Noto Sans SC / Microsoft YaHei. Do not use monospace as a costume for technical-sounding prose.

| Role | Size / line | Weight | Use |
|---|---|---|---|
| Page title | 24 / 32 px | 600 | Page h1, tracking -0.025em |
| Section title | 16 / 24 px | 600 | Dialog titles and major subsections |
| Body | 14 / 20 px | 400 | Main text and navigation |
| Compact body | 13 / 20 px | 400 | Table cells, filters, forms |
| Small | 12 / 16 px | 400 | Helper text, secondary labels |
| Metadata | 11 / 16 px | 400/500 | WAN labels, timestamps, status |
| Data | 11 / 16 px mono | 400 | IPs, MACs, rates, versions |

Body copy stays at or below roughly 70 characters per line. Table text may run denser. Key content is never set at 11 px; metadata and compact labels use that size.

## Space, shape and density

The spacing scale starts at 2 px and moves through 4, 6, 8, 10, 12, 16, 20, 24, 32, 40 and 48 px. Controls are 30 px tall in compact mode and 36 px in roomy mode. Table rows are 38 px and 46 px. Panels use 8 px radius, dialog/sheet surfaces 12 px, and controls 4 px. Pills are reserved for badges and statuses.

Compact mode uses a 56 px rail, 228 px navigation panel, 52 px top bar and 20 px content padding. Roomy mode increases the control, row and content padding without changing the type scale. The secondary navigation becomes a drawer below 1024 px; below 768 px the top-bar menu replaces the rail. Content padding drops to 14 px below 900 px.

## Components

### Button and IconButton

Primary: blue fill, dark blue text in dark mode, white text in light mode. Secondary: raised surface with a strong border. Ghost: transparent until hover. Danger: soft red fill with red text. Link: text-only action. Loading keeps the button width and swaps the leading icon for a spinner. Disabled opacity is 45 percent and removes pointer events. Focus is a 2 px action-color ring with a 2 px canvas-colored offset.

### Fields

Inputs and selects are 30 px tall in compact mode, use a raised surface and a 1 px strong border. Labels sit above the control; hints and errors sit below. Error state changes both border and helper text and sets aria-invalid. The whole control shell receives focus-within styling so the ring surrounds leading and trailing icons as well.

### Panels

A panel is a surface with a 1 px line border and an 8 px radius. It has one elevation decision: the border. Shadows are reserved for menus, dialogs, sheets and floating detail panels. Panel headers are at least 44 px tall and use a 13 px medium title with optional 11 px description.

### Tables

Tables are semantic table elements with sticky headers, right-aligned numeric columns, tabular numerals and a 1 px row divider. Sortable headers expose aria-sort and cycle ascending, descending and unsorted. Selection uses a 14 px visual checkbox with an enlarged hit area. Rows expose a named detail button; mouse users may also click the row. Narrow screens keep a minimum table width and scroll horizontally rather than collapsing columns into unlabeled cells.

### Detail panel

At 1280 px and wider, device details appear in a fixed 430 px non-modal panel below the top bar. The page reserves space for it, so background controls remain visible. Its close button receives focus on open, Escape closes it, and the trigger receives focus again on close. Below 1280 px, the same content becomes a modal right sheet with an overlay and focus trap. The panel footer includes a restart flow with an explicit demo warning.

### Filters and settings

Filters are grouped, collapsible and counted. Active filters appear as removable chips. Settings use collapsible sections and a two-column row layout on desktop that stacks on narrow screens. The save bar is sticky, reports dirty/saving/saved states, and validates required fields before submission. Errors are associated with inputs through aria-describedby.

### Charts and topology

Traffic charts are SVG, not a charting dependency. The chart has two named series, a legend that can hide either series, a range control, hover tooltips and keyboard left/right inspection. A screen-reader summary reports the series peaks. The chart never uses color alone: the second series is dashed and both series have text labels in the legend and tooltip.

The topology map is a positioned HTML node layer over a simple SVG link layer. Nodes are real buttons with aria-pressed, can be focused and selected with the keyboard, and update a text summary below the map. Links highlight only when connected to the selected node.

## Motion

The observed stylesheet contained 100, 200 and 250 ms transition declarations, but frequency in computed styles is not proof that every control uses those values. The implemented system uses project-authored values:

| Token | Value | Use |
|---|---|---|
| fast | 120 ms | Hover, focus, button state, tooltip and menu fade |
| base | 180 ms | Dialog fade/scale, general state changes |
| panel | 240 ms | Detail panel and drawer translation |
| ease-out | cubic-bezier(0.16, 1, 0.3, 1) | Entering and settling |
| ease-in | cubic-bezier(0.4, 0, 1, 1) | Exiting |
| standard | cubic-bezier(0.2, 0.8, 0.2, 1) | Color and border changes |

Dialogs fade and scale from 98.5 percent. Menus fade and rise 4 px. Drawers translate 24 px and do not fade, so content stays readable during entry. Charts reveal with a clip-path wipe on data change. Reduced-motion mode stops translation, scaling, pulsing and chart wipes while keeping state changes and close behavior functional.

## Dark and light use

Dark is the default console environment. Light is a full semantic swap, not an inverted filter. Both themes use the same component code and layout. Borders, disabled states, focus rings and chart grids are retuned for each theme. Light mode’s action is #0063E6; dark mode’s action is #4797FF. Do not use the marketing site’s full-bleed composition inside a console surface.

## Anti-patterns

- Do not use colored left borders on cards, alerts or list rows as a generic accent. Selection indicators are small inset marks or background states.
- Do not stack cards inside cards. Use section dividers and rows inside a panel.
- Do not use gradient text, decorative glass or a colored halo as elevation.
- Do not make every panel a shadowed floating card. Use a border; reserve shadow for overlays.
- Do not use the action color for chart series or decorative icons.
- Do not use monospace for prose. Use it for measured data.
- Do not use 11 px text for essential instructions or primary content.
- Do not ship a control without default, hover, focus, active, disabled and loading or error behavior where relevant.

## Known gaps

- No automated WCAG audit or screen-reader matrix has been run yet.
- The 320 px layout and 200% text zoom require a dedicated pass.
- The registry was installed with the upstream shadcn CLI for button, data-table, app-shell and detail-panel into clean consumers; one consumer's production build passed.
- Marketing-site components, full topology editing, port matrices and historical time replay are deferred.
- CSS is the canonical token source in 0.1; JSON-first generation and Figma export are follow-up work.
- The public repository uses the 'Lattice UI' working name; trademark clearance has not been completed.
