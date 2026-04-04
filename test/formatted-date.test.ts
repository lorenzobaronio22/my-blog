import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import FormattedDate from "../src/components/FormattedDate.astro";

describe("FormattedDate", () => {
  it("renders a time element with datetime and readable content", async () => {
    const date = new Date("2026-04-04T12:00:00.000Z");
    const container = await AstroContainer.create();

    const result = await container.renderToString(FormattedDate, {
      props: { date },
    });

    expect(result).toContain(`datetime="${date.toISOString()}"`);
    expect(result).toMatch(/<time[^>]*>.+<\/time>/s);
    expect(result).not.toContain("Invalid Date");
  });
});
