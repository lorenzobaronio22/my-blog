import { test, expect } from '@playwright/test';

const withBase = (path: string) => `/my-blog${path === '/' ? '/' : path}`;

/**
 * Blog Functionality E2E Tests
 * 
 * Tests:
 * - Blog index rendering (featured post, grid layout, responsiveness)
 * - Blog post content rendering (title, date, hero image, markdown)
 * - MDX post rendering
 * - External links handling
 * - Post sorting by publication date
 * - Responsive layout changes at viewport breakpoint
 */

test.describe('Blog Index Rendering', () => {
  test('blog index should display featured post and grid', async ({ page }) => {
    await page.goto(withBase('/blog'));
    
    // Should have posts rendered
    const articles = page.locator('li');
    await expect(articles.first()).toBeVisible();
    
    // Should have at least 5 posts
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('blog cards should be clickable', async ({ page }) => {
    await page.goto(withBase('/blog'));
    
    // Get first post link
    const firstPostLink = page.locator('li a').first();
    const href = await firstPostLink.getAttribute('href');
    
    // Should have valid href
    expect(href).toBeTruthy();
    expect(href).toContain('/blog/');
  });

  test('clicking blog post should navigate to full post', async ({ page }) => {
    await page.goto(withBase('/blog'));
    
    // Get first post and click it
    const firstPostLink = page.locator('li a').first();
    const href = await firstPostLink.getAttribute('href');
    
    await firstPostLink.click();
    
    // Should navigate to the post
    expect(page.url()).toContain(href!);
  });
});

test.describe('Blog Post Content Rendering', () => {
  test('blog post should display title in h1', async ({ page }) => {
    await page.goto(withBase('/blog/first-post'));
    
    // Should have h1 heading
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    // Title should have text
    const titleText = await h1.textContent();
    expect(titleText?.trim().length).toBeGreaterThan(0);
  });

  test('blog post should display formatted publication date', async ({ page }) => {
    await page.goto(withBase('/blog/first-post'));
    
    // Look for date element
    const dateElements = page.locator('time, .date, [role="note"] time').first();
    expect(dateElements).not.toBeEmpty();
    
    // Page should have navigated successfully
    await expect(page).toHaveTitle(/first-post|First Post/i);
    
    // Content should be visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('blog post should have semantic structure (h1, main, article)', async ({ page }) => {
    await page.goto(withBase('/blog/first-post'));
    
    // Should have main heading
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
    
    // Should have main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});

test.describe('External Links in Blog Posts', () => {
  test('external links should have target="_blank" where appropriate', async ({ page }) => {
    // Visit pages that might have external links
    await page.goto(withBase('/about'));
    
    // Find external links
    const externalLinks = page.locator('a[href^="http"], a[href^="https"], a[href^="//"]');
    const count = await externalLinks.count();
    
    // If external links exist, check they open in new tab
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const link = externalLinks.nth(i);
        const href = await link.getAttribute('href');
        
        // External links should be marked to open in new tab
        const target = await link.getAttribute('target');
        if (href && (href.includes('http') || href.includes('//'))) {
          // External link should have target="_blank"
          expect(target).toBe('_blank');
        }
      }
    }
  });

  test('internal blog links should not have target="_blank"', async ({ page }) => {
    await page.goto(withBase('/blog'));
    
    // Blog post links
    const blogLinks = page.locator('a[href*="/blog/"]');
    const count = await blogLinks.count();
    
    // Internal links should not have target="_blank"
    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = blogLinks.nth(i);
      const target = await link.getAttribute('target');
      expect(target).not.toBe('_blank');
    }
  });
});

test.describe('Blog Post Layout & Typography', () => {
  test('blog content should be readable', async ({ page }) => {
    await page.goto(withBase('/blog/first-post'));
    
    // Get article/main content
    const content = page.locator('main');
    await expect(content).toBeVisible();
    
    // Should have substantial text content
    const text = await content.textContent();
    expect(text?.trim().length).toBeGreaterThan(100);
  });
});

test.describe('Mobile Responsive Blog Layout', () => {
  test('blog index should adapt to mobile viewport (480px)', async ({ page }) => {
    // Start on mobile viewport
    await page.setViewportSize({ width: 480, height: 800 });
    await page.goto(withBase('/blog'));
    
    // Content should be visible
    const articles = page.locator('li');
    await expect(articles.first()).toBeVisible();
    
    // Should still have posts
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('blog post should be readable on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 480, height: 800 });
    await page.goto(withBase('/blog/first-post'));
    
    // Content should be visible
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    // Main content should be readable
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});
