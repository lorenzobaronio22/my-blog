import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import Footer from "../../src/components/Footer.astro";

describe("Footer", () => {
  it("renders the shared social links output and copyright text", async () => {
    const container = await AstroContainer.create();

    const result = await container.renderToString(Footer);

    expect(result).toContain("<footer");
    expect(result).toContain(
      `&copy; ${new Date().getFullYear()} Lorenzo Baronio. All rights reserved.`,
    );
    expect(result).toContain(
      '<div class="social-links social-links--footer"',
    );
    expect(result).toContain('href="https://github.com/lorenzobaronio22"');
    expect(result).toContain('href="https://www.linkedin.com/in/lorenzobaronio/"');
  });
});