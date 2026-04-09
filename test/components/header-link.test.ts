import { describe, expect, it } from "vitest";

import { isHeaderLinkActive } from "../../src/utils/navigation";

describe("HeaderLink active-state logic", () => {
  it("marks link as active when href matches pathname", () => {
    expect(
      isHeaderLinkActive({
        href: "/posts",
        pathname: "/posts",
        baseUrl: "/",
      }),
    ).toBe(true);
  });

  it("marks section link as active for nested post paths", () => {
    expect(
      isHeaderLinkActive({
        href: "/posts",
        pathname: "/posts/my-post",
        baseUrl: "/",
      }),
    ).toBe(true);
  });

  it("does not mark unrelated link as active", () => {
    expect(
      isHeaderLinkActive({
        href: "/",
        pathname: "/posts/my-post",
        baseUrl: "/",
      }),
    ).toBe(false);
  });

  it("handles base URL stripping", () => {
    expect(
      isHeaderLinkActive({
        href: "/posts",
        pathname: "/base/posts",
        baseUrl: "/base",
      }),
    ).toBe(true);
  });

  it("marks home link as active on root path", () => {
    expect(
      isHeaderLinkActive({
        href: "/",
        pathname: "/",
        baseUrl: "/",
      }),
    ).toBe(true);
  });
});
