import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import Header from "../../src/components/Header.astro";

describe("Header social links", () => {
  it("renders exactly GitHub and LinkedIn social links with secure new-tab attributes", async () => {
    const container = await AstroContainer.create();

    const result = await container.renderToString(Header);

    expect(result).toContain('href="https://github.com/lorenzobaronio22"');
    expect(result).toContain('href="https://www.linkedin.com/in/lorenzobaronio/"');

    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');

    const blankTargetCount = (result.match(/target="_blank"/g) ?? []).length;
    const relCount = (result.match(/rel="noopener noreferrer"/g) ?? []).length;
    expect(blankTargetCount).toBe(2);
    expect(relCount).toBe(2);

    expect(result).toContain("Visit Lorenzo Baronio on GitHub");
    expect(result).toContain("Visit Lorenzo Baronio on LinkedIn");
  });
});
