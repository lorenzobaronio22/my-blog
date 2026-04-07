import { defineConfig, devices } from '@playwright/test';
import process from 'node:process';

/**
 * Playwright E2E Testing Configuration for Astro Blog
 * 
 * Features:
 * - WebServer mode: Automatically builds and previews the site before running tests
 * - Chromium-only: Tests run on Chromium in local and CI environments
 * - Parallel execution: Tests run concurrently for faster results
 * - Base URL: All tests use relative paths from http://localhost:4321/
 */

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  
  // Maximum time for a single test
  timeout: 5 * 1000,
  
  // Expect timeout
  expect: {
    timeout: 2000,
  },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail on console errors (optional, helps catch issues)
  use: {
    baseURL: 'http://localhost:4321/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Configure web server to run Astro preview during tests
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321/',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes to start server
  },

  // Configure browser projects.
  // Chromium is the only active browser in this repo.
  // If Firefox or WebKit are enabled later, update CI and docs to match.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment these when system dependencies are available and CI is updated:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Reporter for test results
  reporter: process.env.CI ? 'github' : [
    ['html', { open: 'never' }],
    ['list'],
  ],
});
