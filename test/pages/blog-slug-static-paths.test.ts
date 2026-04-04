import { describe, expect, it } from "vitest";

import { mapPostsToStaticPaths } from "../../src/utils/blog";

describe("blog slug static paths mapping", () => {
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
});
