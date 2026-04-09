import { describe, expect, it } from "vitest";

import { getRelatedPostsByTags, mapPostsToStaticPaths } from "../../src/utils/posts";

describe("posts slug static paths mapping", () => {
  it("maps post ids to params.slug and preserves post props", () => {
    const posts = [
      {
        id: "first-post",
        data: {
          title: "First",
          description: "Desc",
          pubDate: new Date("2022-07-08"),
        },
      },
      {
        id: "second-post",
        data: {
          title: "Second",
          description: "Desc",
          pubDate: new Date("2022-07-15"),
        },
      },
    ];

    const staticPaths = mapPostsToStaticPaths(posts);

    expect(staticPaths).toHaveLength(2);
    expect(staticPaths[0]).toEqual({
      params: { slug: "first-post" },
      props: posts[0],
    });
    expect(staticPaths[1]).toEqual({
      params: { slug: "second-post" },
      props: posts[1],
    });
  });

  it("returns up to three related posts by shared tags sorted by date", () => {
    const posts = [
      {
        id: "current",
        data: {
          title: "Current",
          description: "Desc",
          pubDate: new Date("2024-01-01"),
          tags: ["astro", "typescript"],
        },
      },
      {
        id: "match-newer",
        data: {
          title: "Newer",
          description: "Desc",
          pubDate: new Date("2024-02-01"),
          tags: ["astro"],
        },
      },
      {
        id: "match-older",
        data: {
          title: "Older",
          description: "Desc",
          pubDate: new Date("2024-01-15"),
          tags: ["typescript"],
        },
      },
      {
        id: "not-related",
        data: {
          title: "Nope",
          description: "Desc",
          pubDate: new Date("2024-03-01"),
          tags: ["python"],
        },
      },
    ];

    const related = getRelatedPostsByTags(posts[0], posts, 3);
    expect(related.map((post) => post.id)).toEqual(["match-newer", "match-older"]);
  });

  it("returns empty array when current post has no tags", () => {
    const current = {
      id: "current",
      data: {
        title: "Current",
        description: "Desc",
        pubDate: new Date("2024-01-01"),
        tags: [],
      },
    };

    const related = getRelatedPostsByTags(current, [current], 3);
    expect(related).toEqual([]);
  });
});
