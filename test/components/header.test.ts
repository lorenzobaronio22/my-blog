import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import Header from "../../src/components/Header.astro";

describe("Header", () => {
  it("renders nav links and theme toggle", async () => {
    const container = await AstroContainer.create();

    const result = await container.renderToString(Header);

    expect(result).toContain("Main navigation");
    expect(result).toContain('href="/"');
    expect(result).toContain('href="/blog"');
    expect(result).toContain('href="/tags"');
    expect(result).toContain('href="/search"');
    expect(result).toContain('id="themeToggle"');
  });
});
