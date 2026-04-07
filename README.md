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
  - homepage content rendering
  - blog post sorting rules
  - blog slug static-path mapping rules
  - FormattedDate component rendering
  - BlogPost conditional branch predicates
- Preferred strategy: extract logic-heavy rules into small helpers under `src/utils/` and test them directly; keep Astro component rendering tests for output-specific behavior.

### End-to-End Testing

This project uses Playwright for end-to-end testing. Tests verify navigation flow, blog functionality, and accessibility standards on Chromium.

#### Test Files

- Config: `playwright.config.ts`
- Test folder: `e2e/`
  - `e2e/homepage.spec.ts` — Homepage title/subtitle and section structure
  - `e2e/header-social-links.spec.ts` — Header social links rendering and attributes
  - `e2e/blog.spec.ts` — Blog index structure and responsiveness
  - `e2e/accessibility.spec.ts` — Semantic HTML, link text, heading hierarchy, page landmarks

#### Running Tests

- Build and run all tests: `npm run build && npm run test:e2e`
- Run specific test file: `npm run test:e2e -- homepage.spec.ts`
- Run in UI mode (interactive): `npm run test:e2e:ui`
- Run in debug mode: `npm run test:e2e:debug`
- View test report: `npx playwright show-report`

#### Test Coverage

- **Pages**: Home (`/`), Blog index (`/blog`)
- **Browsers**: Chromium (single-browser coverage)
- **Scenarios**: Navigation flow, blog index structure, accessibility
- **Viewports**: Desktop (1280px) and mobile (480px)

> **Note**: `src/content/blog/` is empty and ready for real content. Post-specific E2E tests will be added once real posts are published.

#### Key Features

- **WebServer**: Automatically builds and previews site during test runs
- **Parallel execution**: Tests run concurrently for speed (~1-2 min total)
- **Production testing**: Tests validate built/preview code (catches build-time issues)
- **Traces & screenshots**: Failed tests capture traces and screenshots in `test-results/`

For detailed E2E testing documentation, see [e2e/README.md](./e2e/README.md).

## CI/CD

This project uses GitHub Actions with a trunk-based workflow:

- Pull requests targeting `main` run CI checks.
- Pushes to `main` run CI checks.
- A successful `main` CI run triggers a release, tagged from `package.json` version (raw format, e.g. `0.0.1`).
- A published release triggers deployment to GitHub Pages.

### Workflows

- `.github/workflows/ci.yml`
  - Runs lint, Astro check, Vitest, build, and Playwright e2e.
- `.github/workflows/release.yml`
  - Triggered by successful CI on `main`.
  - Creates a GitHub release using the version in `package.json`.
  - If the tag already exists, release creation fails and deployment is not triggered.
- `.github/workflows/deploy.yml`
  - Triggered by `release.published`.
  - Builds and deploys to GitHub Pages via official Pages actions.

### GitHub Pages Settings

- Repository Settings > Pages > Source must be set to GitHub Actions.
- Astro config is set for custom domain deployment:
  - `site: https://www.lorenzobaronio.com`

### Branch Protection Recommendation

To align with trunk-based development, protect `main` and require CI status checks to pass before merge.
