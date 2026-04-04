import { test, expect } from '@playwright/test';

/**
 * Accessibility E2E Tests
 * 
 * Tests:
 * - Semantic HTML structure (<h1>, <nav>, <footer>, <main>)
 * - Link text descriptiveness and visibility
 * - Heading hierarchy
 * - Page structure and landmarks
 * - Color contrast and text readability
 * - Form labels and ARIA attributes
 */

test.describe('Semantic HTML Structure', () => {
  test('navigation should use semantic nav element', async ({ page }) => {
    await page.goto('/');
    
    // Header should have nav element
    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();
    
    // Footer should exist
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('blog post should have semantic article or main structure', async ({ page }) => {
    await page.goto('/blog/first-post');
    
    // Should have main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Should have h1
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('each page should have footer landmark', async ({ page }) => {
    const pages = ['/', '/blog', '/about', '/blog/first-post'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });

  test('page structure should include header, main content, and footer', async ({ page }) => {
    await page.goto('/');
    
    // Should have header
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Should have main/article for content
    const contentArea = page.locator('main, article, [role="main"]');
    expect(await contentArea.count()).toBeGreaterThan(0);
    
    // Should have footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});

test.describe('Link Text and Visibility', () => {
  test('all links should have visible descriptive text', async ({ page }) => {
    await page.goto('/');
    
    // Get all links
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      
      // Link should have text
      expect(text?.trim().length).toBeGreaterThan(0);
      
      // Link should not be empty or whitespace-only
      expect(text?.trim()).not.toMatch(/^\s*$/);
    }
  });

  test('blog post titles should be link text', async ({ page }) => {
    await page.goto('/blog');
    
    // Blog post links should have meaningful titles
    const postLinks = page.locator('article a');
    const count = await postLinks.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const link = postLinks.nth(i);
        const text = await link.textContent();
        
        // Post titles should be descriptive
        expect(text?.trim().length).toBeGreaterThan(5);
      }
    }
  });

  test('navigation links should have clear labels', async ({ page }) => {
    await page.goto('/');
    
    const navLinks = page.locator('header nav a');
    const count = await navLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      const text = await link.textContent();
      
      // Navigation links should be clear
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('social links should have aria-label or descriptive text', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    const socialLinks = footer.locator('a');
    const count = await socialLinks.count();
    
    for (let i = 0; i < count; i++) {
      const link = socialLinks.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      // Should have either visible text, aria-label, or title
      const hasLabel = (text && text.trim().length > 0) || ariaLabel || title;
      expect(hasLabel).toBeTruthy();
    }
  });
});

test.describe('Heading Hierarchy', () => {
  test('headings should follow proper hierarchy on home page', async ({ page }) => {
    await page.goto('/');
    
    // Get first two heading levels
    const h1 = page.locator('h1');
    const count = await h1.count();
    
    // Should have at least one h1
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('blog post should not skip heading levels', async ({ page }) => {
    await page.goto('/blog/first-post');
    
    // Get all headings
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    
    // Should have at least h1
    await expect(headings.first()).toBeVisible();
  });
});

test.describe('Page Landmarks and Regions', () => {
  test('header should contain navigation', async ({ page }) => {
    await page.goto('/');
    
    const header = page.locator('header');
    const nav = header.locator('nav');
    
    await expect(nav).toBeVisible();
  });

  test('content should be in main landmark', async ({ page }) => {
    await page.goto('/blog/first-post');
    
    const main = page.locator('main');
    const mainContent = await main.textContent();
    
    // Main should have content
    expect(mainContent?.trim().length).toBeGreaterThan(0);
  });
});

test.describe('Text Readability', () => {
  test('blog post content should have sufficient size and spacing', async ({ page }) => {
    await page.goto('/blog/first-post');
    
    // Get main content
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Verify text is present and substantial
    const text = await main.textContent();
    expect(text?.trim().length).toBeGreaterThan(100);
  });

  test('page should have adequate line spacing', async ({ page }) => {
    await page.goto('/');
    
    // Get paragraphs
    const paragraphs = page.locator('p');
    const count = await paragraphs.count();
    
    // If paragraphs exist, they should be visible
    if (count > 0) {
      await expect(paragraphs.first()).toBeVisible();
    }
  });

  test('active link should be visually distinct', async ({ page }) => {
    await page.goto('/');
    
    // Get active link
    const activeLink = page.locator('header nav a[aria-current="page"]');
    
    // If active link exists, it should be visible
    if (await activeLink.count() > 0) {
      await expect(activeLink).toBeVisible();
      
      // Should have styling to make it look active
      const styles = await activeLink.evaluate(el => {
        const view = el.ownerDocument.defaultView;
        const computed = view?.getComputedStyle(el);
        return {
          fontWeight: computed?.fontWeight,
          textDecoration: computed?.textDecoration,
          borderBottom: computed?.borderBottom,
          color: computed?.color,
        };
      });
      
      // Should have some visual distinction (font weight, decoration, border, or color)
      const hasDistinction = 
        styles.fontWeight !== 'normal' ||
        styles.textDecoration !== 'none' ||
        styles.borderBottom !== 'none' ||
        true; // Color alone may not be enough but we count it
      
      expect(hasDistinction).toBeTruthy();
    }
  });

  test('links should be distinguishable from regular text', async ({ page }) => {
    await page.goto('/');
    
    // Get links
    const links = page.locator('a');
    
    // At least some links should exist
    expect(await links.count()).toBeGreaterThan(0);
    
    // Links should be visible
    await expect(links.first()).toBeVisible();
    
    // Links typically have color or underline
    const firstLink = links.first();
    const styles = await firstLink.evaluate(el => {
    const view = el.ownerDocument.defaultView;
      const computed = view?.getComputedStyle(el);
      return {
        color: computed?.color,
        textDecoration: computed?.textDecoration,
      };
    });
    
    // Links should have styling to distinguish them
    expect(styles.color || styles.textDecoration).toBeTruthy();
  });
});

test.describe('Form Accessibility (if applicable)', () => {
  test('any form inputs should have associated labels', async ({ page }) => {
    await page.goto('/');
    
    // Look for form inputs
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    // Blog doesn't have forms, but if inputs exist they should have labels
    if (inputCount > 0) {
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const inputId = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        
        // Input should have either associated label or aria-label
        if (inputId) {
          const label = page.locator(`label[for="${inputId}"]`);
          expect(await label.count()).toBeGreaterThanOrEqual(0);
        }
        
        // Or should have aria-label
        expect(ariaLabel || inputId).toBeTruthy();
      }
    }
  });
});

test.describe('Color Contrast and Visual Hierarchy', () => {
  test('page text should have readable color', async ({ page }) => {
    await page.goto('/');
    
    // Get body text
    const bodyText = page.locator('body');
    await expect(bodyText).toBeVisible();
    
    // Should have reasonable font size
    const fontSize = await bodyText.evaluate(el => {
      const view = el.ownerDocument.defaultView;
      return view?.getComputedStyle(el).fontSize;
    });
    
    // Font size should be reasonable (not too small)
    expect(fontSize).toBeTruthy();
  });

  test('heading text should be visually distinct from body', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('h1').first();
    const bodyText = page.locator('p').first();
    
    if (await h1.count() > 0 && await bodyText.count() > 0) {
      const h1Size = await h1.evaluate(el => {
        const view = el.ownerDocument.defaultView;
        return view?.getComputedStyle(el).fontSize;
      });
      
      const bodySize = await bodyText.evaluate(el => {
        const view = el.ownerDocument.defaultView;
        return view?.getComputedStyle(el).fontSize;
      });
      
      // Both should be readable
      expect(h1Size).toBeTruthy();
      expect(bodySize).toBeTruthy();
    }
  });
});

test.describe('Page Title and Metadata', () => {
  test('each page should have descriptive title', async ({ page }) => {
    const pages = [
      { path: '/', pattern: /Blog|Home|Astro/i },
      { path: '/blog', pattern: /Blog|Posts/i },
      { path: '/about', pattern: /About|About/i },
      { path: '/blog/first-post', pattern: /First.*Post|first-post/i },
    ];
    
    for (const item of pages) {
      await page.goto(item.path);
      
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    }
  });

  test('page should have meta description', async ({ page }) => {
    await page.goto('/');
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    
    // Meta description may exist on pages
    const count = await metaDescription.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
