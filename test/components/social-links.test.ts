import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import SocialLinks from "../../src/components/SocialLinks.astro";

describe("SocialLinks", () => {
  it("renders exactly GitHub and LinkedIn links with secure new-tab attributes", async () => {
    const container = await AstroContainer.create();

    const result = await container.renderToString(SocialLinks, {
      props: { variant: "header" },
    });

    expect(result).toContain('href="https://github.com/lorenzobaronio22"');
    expect(result).toContain('href="https://www.linkedin.com/in/lorenzobaronio/"');
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
    expect(result).toContain("Visit Lorenzo Baronio on GitHub");
    expect(result).toContain("Visit Lorenzo Baronio on LinkedIn");

    const blankTargetCount = (result.match(/target="_blank"/g) ?? []).length;
    const relCount = (result.match(/rel="noopener noreferrer"/g) ?? []).length;
    expect(blankTargetCount).toBe(2);
    expect(relCount).toBe(2);
  });

  it("applies the requested variant class", async () => {
    const container = await AstroContainer.create();

    const result = await container.renderToString(SocialLinks, {
      props: { variant: "footer" },
    });

    expect(result).toContain('class="social-links social-links--footer"');
  });
});