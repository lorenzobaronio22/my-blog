export function formatYMD(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/-/g, "/");
}

export function getMD(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });
}

export function getFormatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
