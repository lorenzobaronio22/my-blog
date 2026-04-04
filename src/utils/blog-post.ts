import type { ImageMetadata } from "astro";

export function hasUpdatedDate(updatedDate: Date | undefined): updatedDate is Date {
  return updatedDate instanceof Date;
}

export function hasHeroImage(
  heroImage: ImageMetadata | undefined,
): heroImage is ImageMetadata {
  return Boolean(heroImage);
}
