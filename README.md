# My Blog

## Development Container

This repository includes a Dev Container definition in `.devcontainer/devcontainer.json`.

### What it includes

- Base image: Node.js 22.x TypeScript dev container (`mcr.microsoft.com/devcontainers/typescript-node:22-bullseye`)
- Features/plugins:
  - Docker outside of Docker
  - GitHub CLI
- VS Code extensions:
  - Astro
  - MDX
  - ESLint
  - Prettier
  - Docker
  - GitHub Actions
- Container lifecycle:
  - `onCreateCommand`: installs CI helper tools (`jq`, `yq`, `act`)
  - `postCreateCommand`: runs `npm install`

### Usage

1. Open this folder in VS Code.
2. Run the command: Dev Containers: Reopen in Container.
3. After setup finishes, use the project commands:

- `npm run dev` to start Astro.
- `npm run lint` to run ESLint checks.
- `npm run lint:fix` to auto-fix ESLint issues.
- `npm run astro -- check` to run Astro type/content checks.
