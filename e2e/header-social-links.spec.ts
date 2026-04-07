import { test, expect } from '@playwright/test';

test.describe('Footer social links', () => {
  test('should render the shared social links component in the footer', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const socialLinksRegion = page.locator('footer .social-links.social-links--footer');
    await expect(socialLinksRegion).toBeVisible();

    const socialLinks = socialLinksRegion.locator('a');
    await expect(socialLinks).toHaveCount(2);

    const githubLink = socialLinksRegion.locator('a[href="https://github.com/lorenzobaronio22"]');
    const linkedInLink = socialLinksRegion.locator('a[href="https://www.linkedin.com/in/lorenzobaronio/"]');

    await expect(githubLink).toBeVisible();
    await expect(linkedInLink).toBeVisible();

    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(linkedInLink).toHaveAttribute('target', '_blank');

    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
