import { test, expect } from '@playwright/test';

const withBase = (path: string) => `/my-blog${path === '/' ? '/' : path}`;

test.describe('Homepage Content and Latest Links', () => {
  test('home page shows new title and section heading', async ({ page }) => {
    await page.goto(withBase('/'));

    await expect(
      page.getByRole('heading', { level: 1, name: 'Welcome!' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Latest & Greatest' }),
    ).toBeVisible();
  });

  test('home page shows subtle publication subtitle', async ({ page }) => {
    await page.goto(withBase('/'));

    const subtitle = page.locator('.build-date');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Published on');
  });

  test('latest list links first-post and second-post with non-clickable date text', async ({ page }) => {
    await page.goto(withBase('/'));

    const first = page.locator('.latest-greatest li').first();
    await expect(first.locator('a.post-link')).toHaveAttribute('href', '/my-blog/blog/first-post/');
    await expect(page.locator('a.post-link[href="/my-blog/blog/second-post/"]')).toBeVisible();

    const dateInItem = first.locator('time.post-date');
    await expect(dateInItem).toBeVisible();

    const nestedClickableDate = first.locator('a.post-link time.post-date');
    await expect(nestedClickableDate).toHaveCount(0);
  });
});
