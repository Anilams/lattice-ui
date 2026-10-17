# Contributing to Lattice UI

Thanks for considering a contribution. This project is a design system and a reference application, so changes should improve both the component contract and the working example when relevant.

## Before opening a PR

- Open an issue for a new component or a public API change. Describe the operational use case and the state matrix.
- Keep component source independent of demo data, routes and backend clients.
- Add or update the component documentation when props or behavior change.
- Run the checks below and include the commands and results in the PR.

## Local setup

~~~bash
pnpm install
pnpm dev
~~~

Useful checks:

~~~bash
pnpm typecheck
pnpm build
pnpm build:lib
pnpm registry
pnpm tokens
~~~

## Design and accessibility expectations

- Use semantic tokens from src/styles/tokens.css; do not hard-code palette values.
- Cover default, hover, focus, active, disabled and loading or error states where relevant.
- Keep keyboard access and visible focus. For overlays, verify focus restoration and Escape behavior.
- Provide a text or icon cue when color carries status.
- Respect prefers-reduced-motion.
- Keep demo data fictional and put it outside components/ui and reusable console blocks.

## Registry changes

Source files are the source of truth. Run pnpm registry after changing a shipped component. The generated JSON should be committed with the source. If you add a module dependency, declare it in the item's dependencies and test installation in a clean target.

## Pull requests

Small, focused PRs are easiest to review. Include:

- the problem and the new behavior;
- screenshots for visual changes;
- the state matrix you checked;
- commands run and their results;
- known limitations or follow-up work.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).
