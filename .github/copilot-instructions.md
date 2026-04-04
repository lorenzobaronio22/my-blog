# Project Guidelines

## Code Style

- Use Astro components with typed frontmatter scripts and keep component names in PascalCase.
- Keep styling in existing CSS patterns: global tokens in src/styles/global.css and page/component-local style blocks inside .astro files.
- Maintain strict TypeScript compatibility (tsconfig enables strictNullChecks).
- Reuse site metadata constants from src/consts.ts instead of duplicating title/description strings.

## Architecture

- Route files live in src/pages and define site URLs; blog routes are in src/pages/blog.
- Blog content is managed through Astro Content Collections in src/content/blog and schema rules in src/content.config.ts.
- Shared shell and SEO primitives are in src/components (especially BaseHead.astro, Header.astro, Footer.astro).
- Post rendering flow: src/pages/blog/[...slug].astro loads a content entry, then src/layouts/BlogPost.astro renders it.

## Build and Test

- Install dependencies: npm install
- Start development server: npm run dev
- Build production output: npm run build
- Preview built output: npm run preview
- Run unit/integration tests: npm test
- Run tests in watch mode: npm run test:watch
- Run Astro CLI/type checks: npm run astro -- check
- Run lint checks: npm run lint
- Auto-fix lint issues: npm run lint:fix

## Conventions

- Follow content schema requirements in src/content.config.ts: title, description, and pubDate are required.
- Keep tests in test/**/\*.test.ts or colocated as src/**/\*.test.ts.
- Use Vitest with Astro's getViteConfig() helper in vitest.config.ts.
- For logic-heavy Astro files, extract pure helpers to src/utils and unit test those helpers.
- Use Astro Container API tests when verifying rendered HTML behavior of Astro components.
- Use relative hero image imports from within post files (for example ../../assets/...) so Astro image handling resolves correctly.
- Keep posts in src/content/blog as .md or .mdx files matching the existing frontmatter style.
- Before changing structure or commands, check README.md and update it if behavior changes.
- Update astro.config.mjs site value from https://example.com when configuring deployment, because canonical URLs, sitemap, and RSS depend on it.

## Documentation

- Start with README.md for project overview, structure, and command reference.
- Treat src/content.config.ts and src/layouts/BlogPost.astro as source-of-truth examples for content and rendering patterns.
