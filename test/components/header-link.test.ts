import { describe, expect, it } from "vitest";

import { isHeaderLinkActive } from "../../src/utils/navigation";

describe("HeaderLink active-state logic", () => {
  it("marks link as active when href matches pathname", () => {
    expect(
      isHeaderLinkActive({
        href: "/blog",
        pathname: "/blog",
        baseUrl: "/",
      }),
    ).toBe(true);
  });

  it("marks section link as active for nested blog paths", () => {
    expect(
      isHeaderLinkActive({
        href: "/blog",
        pathname: "/blog/my-post",
        baseUrl: "/",
      }),
    ).toBe(true);
  });

  it("does not mark unrelated link as active", () => {
    expect(
      isHeaderLinkActive({
        href: "/",
        pathname: "/blog/my-post",
        baseUrl: "/",
      }),
    ).toBe(false);
  });

  it("handles base URL stripping", () => {
    expect(
      isHeaderLinkActive({
        href: "/blog",
        pathname: "/base/blog",
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
