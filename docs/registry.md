# Source registry

The registry follows the shadcn registry shape: a top-level registry index, one JSON file per item, source files with content, npm dependencies and registry dependencies. The build script reads the same source files that the application uses; there is no second component implementation.

## Generated files

- registry.json: root index.
- public/r/registry.json: served index.
- public/r/<name>.json: individual items.

Build them with:

~~~bash
pnpm registry
~~~

By default, registryDependencies are emitted as absolute URLs under https://anilams.github.io/lattice-ui/r. For a fork or local test, build with a different base URL:

~~~bash
LATTICE_REGISTRY_URL=http://127.0.0.1:4173/r pnpm registry
~~~

Bare dependency names are not used. During validation, a bare "utils" dependency was resolved by the upstream CLI to an unrelated package; absolute item URLs made the closure deterministic. The local installer resolves absolute item URLs by basename, so offline installs still work.

The default /r channel is a moving preview. Pin a version directory before promising reproducible installs. A fork must set LATTICE_REGISTRY_URL to its own Pages URL, regenerate the registry, and use its own repository name in the README install examples. The upstream-only registry drift check is skipped on forks; forks should add their own equivalent check once their registry is initialized.

## Item types

| Type | Items |
|---|---|
| registry:theme | theme |
| registry:lib | utils, types, control |
| registry:ui | button, icon-button, badge, status-dot, panel, input, checkbox, switch, tabs, tooltip, dropdown-menu, select, dialog, sheet, separator, skeleton, inline-notice |
| registry:block | brand, page, health-strip, device-glyph, device-status-badge, sparkline, traffic-chart, traffic-panel, topology-map, filter-panel, empty-state, data-table, settings-section, activity-feed, detail-panel, app-shell |

## Item format

Each item has:

~~~json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "title": "Button",
  "description": "...",
  "dependencies": ["class-variance-authority", "lucide-react"],
  "registryDependencies": ["https://anilams.github.io/lattice-ui/r/utils.json"],
  "files": [
    {
      "path": "src/components/ui/button.tsx",
      "target": "components/ui/button.tsx",
      "type": "registry:ui",
      "content": "..."
    }
  ]
}
~~~

The theme item installs styles/lattice/tokens.css and styles/lattice/lattice.css. utilities depend on the theme, so every UI item brings the theme closure. Console items depend on the shared types and the base controls they use.

## Local installer

~~~bash
node scripts/install.mjs data-table detail-panel --target ../my-app
~~~

Options:

- --target <directory>: destination project. Defaults to the current directory.
- --src <directory>: source root inside the destination. Defaults to src. Use . for projects that keep components at the project root.
- --from <directory>: registry directory. Defaults to public/r.
- --force: replace files that differ from the registry.
- --dry-run: print the planned writes without changing files.

The installer resolves registryDependencies recursively, deduplicates shared files, checks that every target stays inside the destination, and prints the npm packages to add. It preflights all files before writing; any conflict aborts the entire install without partial files. Use --dry-run to inspect the plan.

## Consumer setup

The components use the @/* path alias and Tailwind CSS 4. The local installer writes under src by default, so @/* should point to ./src/*. A typical consumer has:

~~~json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
~~~

and imports the theme after Tailwind:

~~~css
@import "tailwindcss";
@import "./styles/lattice/lattice.css";
~~~

The CSS import assumes the global stylesheet is inside src, matching the default source root. If the stylesheet lives elsewhere, adjust the relative path.

If the consumer uses a different alias, rewrite the copied imports. The installer copies source rather than a compiled black box so this rewrite is expected and supported.

## Compatibility status

The local installer was tested against a clean target directory for button, data-table and detail-panel. The copied dependency closure passed TypeScript checking in a consumer-like tsconfig.

The upstream CLI (4.21.5) was run against a clean consumer project on 2026-10-17:

- button installed 4 files: theme CSS, tokens, utils and button.
- data-table installed 6 files: theme, utils, checkbox, empty-state and table.
- app-shell installed 10 additional files across the shell and its dependencies; identical theme and util files were skipped.
- detail-panel installed as a 17-file dependency closure.
- The resulting consumer source passed TypeScript checking with the @/* alias.
- The same consumer produced a successful Vite production build.
- The published Pages registry was checked anonymously at https://anilams.github.io/lattice-ui/r/button.json.
- shadcn 4.21.5 installed button + data-table from the public Pages URL into another clean consumer; TypeScript passed.

This validates the registry shape and a production consumer build for the tested items. The project is currently on a mutable preview channel at /r; a full install against a pinned version directory is still recommended before a stable release. Use absolute registryDependencies for all published items.

## Release checklist

1. Run pnpm typecheck and pnpm build.
2. Run pnpm registry and verify registry.json is unchanged when source is unchanged.
3. Install button, data-table and app-shell into a clean consumer project.
4. Add npm dependencies and run a production build in that consumer.
5. Verify no component imports src/data/demo.ts, a page, or a route.
6. Repeat the shadcn CLI install and a consumer production build against a pinned version directory.
7. Keep the preview /r channel or cut a versioned registry URL; do not use bare generic names that could resolve to an unrelated upstream component.
8. Confirm the MIT license and complete a name/trademark review before a stable release.
9. Keep the Pages verify job (typecheck, registry drift, library build) ahead of the deploy job.

## Versioning

Source files and registry item JSON are versioned together. A breaking prop change requires a minor version before 1.0 and a migration note. Existing installed files are consumer-owned; upgrades should show a diff and require an explicit force or manual merge.
