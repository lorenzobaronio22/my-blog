import { test, expect } from '@playwright/test';

/**
 * Posts E2E Tests
 *
 * Tests:
 * - Posts index page structure and layout
 * - Internal link attributes
 * - Mobile responsiveness of posts index
 */

test.describe('Posts Index Structure', () => {
  test('posts index should load and display main content area', async ({ page }) => {
    await page.goto('/posts');

    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('internal post links should not have target="_blank"', async ({ page }) => {
    await page.goto('/posts');

    // Post links (if any) should not open in a new tab
    const postLinks = page.locator('a[href*="/posts/"]');
    const count = await postLinks.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = postLinks.nth(i);
      const target = await link.getAttribute('target');
      expect(target).not.toBe('_blank');
    }
  });

  test('posts index should list at least one post and every listed post should resolve', async ({ page }) => {
    await page.goto('/posts');

    const listingLinks = page.locator('main section ul li > a[href*="/posts/"]');
    await expect(listingLinks.first()).toBeVisible();

    const hrefs = await listingLinks.evaluateAll((anchors) =>
      anchors
        .map((anchor) => anchor.getAttribute('href'))
        .filter((href): href is string => Boolean(href)),
    );

    const postPathPattern = /\/posts\/[^/]+\/?$/;
    const normalizedPostLinks = [...new Set(hrefs)].filter((href) => postPathPattern.test(href));

    expect(normalizedPostLinks.length).toBeGreaterThanOrEqual(1);

    const clickSampleSize = Math.min(2, normalizedPostLinks.length);

    for (const href of normalizedPostLinks.slice(0, clickSampleSize)) {
      await page.goto('/posts');

      const currentLink = page.locator(`main section ul li > a[href="${href}"]`);

      await currentLink.click();

      await expect(page).toHaveURL(postPathPattern);
      await expect(page.locator('main, article').first()).toBeVisible();
    }

    for (const href of normalizedPostLinks.slice(clickSampleSize)) {
      await page.goto(href);
      await expect(page).toHaveURL(postPathPattern);
      await expect(page.locator('main, article').first()).toBeVisible();
    }
  });
});

test.describe('Mobile Responsive Posts Layout', () => {
  test('posts index should be visible on mobile viewport (480px)', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    await page.goto('/posts');

    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});
