import { describe, expect, it } from "vitest";

import { sortPosts } from "../../src/utils/posts";

describe("posts index sorting", () => {
  it("sorts posts by pubDate descending", () => {
    const posts = [
      { id: "first", data: { pubDate: new Date("2022-07-08") } },
      { id: "third", data: { pubDate: new Date("2022-07-22") } },
      { id: "second", data: { pubDate: new Date("2022-07-15") } },
    ];

    const sorted = sortPosts(posts);

    expect(sorted.map((post) => post.id)).toEqual(["third", "second", "first"]);
  });

  it("uses id as deterministic tie-breaker for identical dates", () => {
    const sharedDate = new Date("2022-07-08");
    const posts = [
      { id: "z-post", data: { pubDate: sharedDate } },
      { id: "a-post", data: { pubDate: sharedDate } },
    ];

    const sorted = sortPosts(posts);

    expect(sorted.map((post) => post.id)).toEqual(["a-post", "z-post"]);
  });

  it("handles empty and single-item collections", () => {
    expect(sortPosts([])).toEqual([]);

    const onePost = [{ id: "only", data: { pubDate: new Date("2022-07-08") } }];
    expect(sortPosts(onePost)).toEqual(onePost);
  });
});
