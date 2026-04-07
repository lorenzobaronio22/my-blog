import { test, expect } from '@playwright/test';

test.describe('Homepage Content and Latest Links', () => {
  test('home page shows new title and section heading', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Welcome!' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Latest & Greatest' }),
    ).toBeVisible();
  });

  test('home page shows subtle publication subtitle', async ({ page }) => {
    await page.goto('/');

    const subtitle = page.locator('.build-date');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Published on');
  });
});
