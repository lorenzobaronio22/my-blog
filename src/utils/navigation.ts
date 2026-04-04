export function isHeaderLinkActive({
  href,
  pathname,
  baseUrl,
}: {
  href?: string | { pathname: string } | null;
  pathname: string;
  baseUrl: string;
}): boolean {
  const hrefPath = typeof href === "string" ? href : href?.pathname;
  const normalizedPathname = pathname.replace(baseUrl, "");
  const subpath = normalizedPathname.match(/[^/]+/g);
  return (
    hrefPath === normalizedPathname || hrefPath === "/" + (subpath?.[0] || "")
  );
}
