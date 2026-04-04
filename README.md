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
- `npm test` to run Vitest unit/integration tests once.
- `npm run test:watch` to run Vitest in watch mode.
- `npm run lint` to run ESLint checks.
- `npm run lint:fix` to auto-fix ESLint issues.
- `npm run astro -- check` to run Astro type/content checks.

### Testing

This project uses Vitest for unit and integration testing with Astro's
recommended `getViteConfig()` setup.

- Test config: `vitest.config.ts`
- Test files: `test/**/*.test.ts` and `src/**/*.test.ts`
- Run all tests: `npm test`
- Watch mode: `npm run test:watch`
- Current coverage includes:
  - content schema validation edge cases
  - HeaderLink active-route logic
  - blog post sorting rules
  - blog slug static-path mapping rules
  - FormattedDate component rendering
  - BlogPost conditional branch predicates
- Preferred strategy: extract logic-heavy rules into small helpers under `src/utils/` and test them directly; keep Astro component rendering tests for output-specific behavior.
