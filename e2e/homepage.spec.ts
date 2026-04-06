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
});
