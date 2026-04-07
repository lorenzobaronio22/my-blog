import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import AvatarImage from "../../src/components/AvatarImage.astro";
import { SITE_TITLE } from "../../src/consts";

describe("AvatarImage", () => {
  it("renders the configured avatar image with accessible alt text", async () => {
    const container = await AstroContainer.create();
    const expectedAlt = `Avatar of ${SITE_TITLE}`.replaceAll("&", "&#38;");

    const result = await container.renderToString(AvatarImage);

    expect(result).toContain('class="avatar-image"');
    expect(result).toContain('loading="eager"');
    expect(result).toContain(`alt="${expectedAlt}"`);
    expect(result).toContain('width="112"');
    expect(result).toContain('height="112"');
    expect(result).toMatch(/src="[^"]+\.png(?:\?[^"]*)?"/);
  });
});