import { test, expect } from '@playwright/test';

const withBase = (path: string) => `/my-blog${path === '/' ? '/' : path}`;

/**
 * Blog E2E Tests
 *
 * Tests:
 * - Blog index page structure and layout
 * - Internal link attributes
 * - Mobile responsiveness of blog index
 */

test.describe('Blog Index Structure', () => {
  test('blog index should load and display main content area', async ({ page }) => {
    await page.goto(withBase('/blog'));

    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('internal blog links should not have target="_blank"', async ({ page }) => {
    await page.goto(withBase('/blog'));

    // Blog post links (if any) should not open in a new tab
    const blogLinks = page.locator('a[href*="/blog/"]');
    const count = await blogLinks.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = blogLinks.nth(i);
      const target = await link.getAttribute('target');
      expect(target).not.toBe('_blank');
    }
  });
});

test.describe('Mobile Responsive Blog Layout', () => {
  test('blog index should be visible on mobile viewport (480px)', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    await page.goto(withBase('/blog'));

    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});
