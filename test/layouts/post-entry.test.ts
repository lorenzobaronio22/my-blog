import { describe, expect, it } from "vitest";

import type { ImageMetadata } from "astro";
import { hasHeroImage, hasUpdatedDate } from "../../src/utils/post-entry";

const heroImage: ImageMetadata = {
  src: "/test-image.jpg",
  width: 100,
  height: 100,
  format: "jpg",
};

describe("PostEntry layout", () => {
  it("flags updated date section as visible when updatedDate is provided", () => {
    expect(hasUpdatedDate(new Date("2022-07-09T00:00:00.000Z"))).toBe(true);
  });

  it("flags updated date section as hidden when updatedDate is missing", () => {
    expect(hasUpdatedDate(undefined)).toBe(false);
  });

  it("flags hero image as visible only when heroImage exists", () => {
    expect(hasHeroImage(heroImage)).toBe(true);
    expect(hasHeroImage(undefined)).toBe(false);
  });
});
