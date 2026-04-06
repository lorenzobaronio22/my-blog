import { test, expect } from '@playwright/test';

const withBase = (path: string) => `/my-blog${path === '/' ? '/' : path}`;

test.describe('Header social links', () => {
  test('should show exactly two social links with expected URLs and target blank', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(withBase('/'));

    const socialLinks = page.locator('header .social-links a');
    await expect(socialLinks).toHaveCount(2);

    const githubLink = page.locator('header .social-links a[href="https://github.com/lorenzobaronio22"]');
    const linkedInLink = page.locator('header .social-links a[href="https://www.linkedin.com/in/lorenzobaronio/"]');

    await expect(githubLink).toBeVisible();
    await expect(linkedInLink).toBeVisible();

    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(linkedInLink).toHaveAttribute('target', '_blank');

    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
