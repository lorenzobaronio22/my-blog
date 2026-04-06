import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import Header from "../../src/components/Header.astro";

describe("Header", () => {
  it("renders navigation and the shared social links output", async () => {
    const container = await AstroContainer.create();

    const result = await container.renderToString(Header);

    expect(result).toContain(
      '<div class="social-links social-links--header"',
    );
    expect(result).toContain('Code &amp; Cables by Lorenzo');
    expect(result).toContain('href="/"');
    expect(result).toContain('href="/blog"');
    expect(result).toContain('href="https://github.com/lorenzobaronio22"');
    expect(result).toContain('href="https://www.linkedin.com/in/lorenzobaronio/"');

    const socialLinksMarkup = result.match(
      /<div class="social-links social-links--header"[\s\S]*?<\/div>/,
    )?.[0];
    const socialLinkCount = socialLinksMarkup?.match(/target="_blank"/g)?.length;

    expect(socialLinkCount).toBe(2);
  });
});
