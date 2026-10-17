# Research and verification record

Date: 2026-10-17 (Asia/Shanghai). This record separates observations, design decisions and remaining unknowns.

## Observed sources

| Source | Method | What was observed |
|---|---|---|
| Official UniFi homepage, https://www.ui.com/ | REA DOM and accessibility inspection, REA viewport screenshot, browser computed styles | White navigation, blue commerce action, large product compositions, brand-principle tabs |
| Authenticated UniFi Network settings overview | REA DOM and accessibility inspection, REA viewport screenshot | Rail and secondary navigation, collapsible settings groups, compact tables, semantic status colors |
| Authenticated Network dashboard | Browser screenshot, DOM style sampling, range and ISP dropdown interactions | Dense summary strip, traffic chart, cyan/violet series, uplink rows, topology context |
| Device list and detail | Browser accessibility snapshot, screenshot, opening the detail panel | Grouped filters, sortable columns, row density, right-side detail surface, tabs and actions |

No network configuration, device restart, firmware update, speed test or other mutating control was sent to the real console. The authenticated screenshots are research evidence and are not part of the distributable component package.

REA evidence identifiers from the research pass:

- Settings structure: ev_1bd6681cca796b799752897a6e9b4dc0a506678ab25b468358a55905529ff27a
- Settings screenshot: ev_b5609a981a3f88d9f5f62990c5c69ccf142d978c547e5cd2ba51b7f3c914c77f
- Homepage structure: ev_60455850800e9262ecdb128c3ef50e431ea103d843d1f2b1cc00b65008b777f4
- Homepage screenshot: ev_55747b512712409f173291e890a53d405d1984222848fe514565f486bb6d2fa0

REA reported policy filtering and attach-window limitations. These identifiers are tool evidence from this session and are not a guarantee of later retrieval.

## Observed values

Sampled browser styles included:

- Dark canvas #131416, surfaces #1C1E21 and #282B2F, strong line #34383D.
- Text #DEE0E3 and #B7BCC2, action #4797FF, commerce action #006FFF.
- Chart-related colors #63BDE3 and #B47CDE.
- Common radii 4 px and 8 px.
- 13/20 px and 11/16 px type pairings.
- Transition declarations at 100, 200 and 250 ms.

Computed-style frequency is not a design specification. Inherited values and off-screen nodes were included in the sample. The implementation records its own design values: 120, 180 and 240 ms; compact and roomy densities; and component tokens. Light action was adjusted from the observed #006FFF to #0063E6 (5.35:1 with white), and faint text was darkened/lightened to reach 4.5:1 on normal surfaces.

## Implementation decisions

- Independent source implementation, no copied proprietary code or assets.
- Console first; marketing components deferred.
- Dark default, full semantic light theme, independent density switch.
- Radix for complex accessible interactions; no charting library; SVG chart and HTML topology nodes.
- Source registry generated from application source; no duplicate component tree.
- Fictional device, WAN, IP and activity data. Documentation-range IPs are used for public examples.

## Verification performed

- pnpm typecheck passed.
- pnpm build passed; production bundle emitted. The main JS chunk is about 550 kB before gzip and triggers Vite's 500 kB warning.
- pnpm registry generated 43 items.
- The local installer installed button + theme, then data-table + detail-panel into clean targets under src, matching the @/* to ./src/* contract.
- The installed file set passed a consumer-like TypeScript check.
- A deliberately modified file caused the installer to abort before writing any file and exit nonzero; the local edit remained intact.
- A missing registry dependency exited nonzero instead of reporting a successful empty install.
- The local installer's default src output and conflict/missing-dependency behavior were retested after the path change.
- detail-panel installed as a 17-file dependency closure and passed TypeScript checking.
- The upstream shadcn CLI (4.21.5) installed button, data-table and app-shell into a clean consumer project.
- That consumer produced a successful Vite build (about 33 kB CSS before gzip and 276 kB JS before gzip for the control sample).
- The shadcn CLI installed detail-panel into another clean consumer (17 files plus the consumer stylesheet) and the result passed TypeScript checking.
- A final combined data-table + detail-panel install created 20 files plus the consumer stylesheet and passed TypeScript checking.
- A standalone topology-map install created 12 files, including empty-state, and passed TypeScript checking.
- Clicking a navigation link in the mobile drawer navigated to the new page and returned focus to the menu trigger.
- The public Pages registry at https://anilams.github.io/lattice-ui/r/button.json was installed with shadcn 4.21.5 alongside data-table into a clean consumer; 7 files plus the stylesheet were created and TypeScript passed.
- A server-render smoke test rendered TrafficPanel, TrafficChart, TopologyMap, Sparkline and ActivityFeed with empty inputs without throwing and with explicit empty-state copy.
- Desktop visual review at 1440x792 in dark and light themes.
- Narrow visual review at 390x844 for dashboard, device table, navigation drawer, filter drawer and detail sheet.
- Nested detail/restart dialog: Escape closed only the dialog, leaving the detail panel open.
- Mobile navigation and detail drawers restored focus to their real triggers after closing.
- A 390x260 viewport kept the device update dialog inside the viewport with a scrollable body.
- Key contrast pairs: light faint text 5.04:1 on white, 4.78:1 on raised, 4.53:1 on warning-soft; white on light action 5.35:1; dark faint text 4.87:1 on overlay.
- The Impeccable mechanical detector returned no findings for pages and components; this is not a substitute for an accessibility audit.
- GitHub Pages deployed https://anilams.github.io/lattice-ui/ successfully; the home page and registry return 200, and a deep link to /devices serves the SPA fallback.
- Dialog centering was corrected after visual review; popover and drawer motion use separate translate/scale properties so Radix positioning is not overwritten.

## Not verified

- Automated axe or equivalent WCAG scan.
- Screen-reader passes with VoiceOver, NVDA or JAWS.
- 320 px minimum layout and 200% text zoom.
- A production build from a pinned registry install. A consumer production build from the local-URL install passed; the public preview install passed type checking.
- A complete color-contrast matrix for every muted-on-soft combination.
- Safari and Firefox visual parity.
- Marketing/homepage component extraction.
- Any production backend, authentication or real UniFi integration.

## Publication

- Repository: https://github.com/Anilams/lattice-ui
- Demo: https://anilams.github.io/lattice-ui/
- Preview registry: https://anilams.github.io/lattice-ui/r/
- CI and Pages workflows passed on the initial public commit; the Pages build is gated by a verify job.

## v0.2 verification

- Shared ControlPlane advances 1h/1d/1w/1m telemetry, clients, latency and port utilization.
- The live chart path changed between two samples 2.2 seconds apart without a full remount.
- Demo injection propagates through overview, topology, devices, ports and logs; recovery restores devices, ports and alerts.
- The command flow exposes pending, success and error states; reset clears incident state.
- Vitest covers telemetry ticks, pause, AP failure, recovery and reset (4 tests passing).
- The registry now contains 43 items. New topology-workbench, port-matrix, toast and live-value items installed together with 15 files and passed consumer TypeScript checking.
- Desktop and 390x844 screenshots cover the new topology, port matrix and log/alerts routes.

## Model review disclosure

Planning and an implementation review were requested through the subagent interface with the model override Krill/gpt-6-astra. The subagent returned a planning review and reported the model marker gpt-6-astra. No independent provider or route evidence was obtained, so this is recorded as a model-assisted review and not as verified Krill routing. The main model made the final implementation decisions, ran the checks and owns the result.

A follow-up review found two remaining blockers: the topology empty-state dependency was missing from the registry, and mobile navigation links bypassed focus restoration. Both were fixed; standalone topology installation and mobile link-focus behavior were retested.

A publication review found that an uppercase owner in the registry base URL could create drift; the generator now normalizes the hostname, and the CI and Pages workflows also lowercase the owner. The final review reported no remaining v0.1 public-preview release blockers.
