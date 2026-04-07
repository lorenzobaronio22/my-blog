import { z } from "astro/zod";
import { describe, expect, it } from "vitest";

import { collections } from "../src/content.config";

describe("blog content schema", () => {
  const schemaFactory = collections.blog.schema;

  if (typeof schemaFactory !== "function") {
    throw new Error("Expected blog schema to be a schema factory function");
  }

  const schema = schemaFactory({
    image: () => z.string(),
  } as unknown as Parameters<typeof schemaFactory>[0]);

  it("accepts required fields and coerces pubDate", () => {
    const result = schema.safeParse({
      title: "Post title",
      description: "Post description",
      pubDate: "2026-04-04",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.pubDate).toBeInstanceOf(Date);
    }
  });

  it("rejects missing required fields", () => {
    const result = schema.safeParse({
      description: "Missing title",
      pubDate: "2026-04-04",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid pubDate values", () => {
    const result = schema.safeParse({
      title: "Post title",
      description: "Post description",
      pubDate: "not-a-date",
    });

    expect(result.success).toBe(false);
  });

  it("coerces valid updatedDate values", () => {
    const result = schema.safeParse({
      title: "Post title",
      description: "Post description",
      pubDate: "2026-04-04",
      updatedDate: "2026-04-05T00:00:00.000Z",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.updatedDate).toBeInstanceOf(Date);
    }
  });

  it("rejects invalid updatedDate values", () => {
    const result = schema.safeParse({
      title: "Post title",
      description: "Post description",
      pubDate: "2026-04-04",
      updatedDate: "invalid-updated-date",
    });

    expect(result.success).toBe(false);
  });

  it("accepts optional heroImage when present or absent", () => {
    const withoutHeroImage = schema.safeParse({
      title: "Post title",
      description: "Post description",
      pubDate: "2026-04-04",
    });

    const withHeroImage = schema.safeParse({
      title: "Post title",
      description: "Post description",
      pubDate: "2026-04-04",
      heroImage: "../../assets/blog-placeholder-1.jpg",
    });

    expect(withoutHeroImage.success).toBe(true);
    expect(withHeroImage.success).toBe(true);
  });

  it("accepts optional tags array", () => {
    const result = schema.safeParse({
      title: "Post title",
      description: "Post description",
      pubDate: "2026-04-04",
      tags: ["astro", "homelab"],
    });

    expect(result.success).toBe(true);
  });
});
