import { test, expect } from '@playwright/test';

test.describe('Homepage Content and Latest Links', () => {
  test('home page shows new title and section heading', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Code & Cables' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Latest Posts' }),
    ).toBeVisible();
  });

  test('home page shows intro section', async ({ page }) => {
    await page.goto('/');

    const intro = page.locator('.intro');
    await expect(intro).toBeVisible();
  });
});
