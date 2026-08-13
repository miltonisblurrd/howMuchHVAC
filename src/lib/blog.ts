import type { ReactNode } from "react";

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** Normalize frontmatter Date | string ? YYYY-MM-DD for storage/sorting. */
export function toIsoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, "0");
    const d = String(value.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const raw = String(value).trim();
  const iso = /^(\d{4}-\d{2}-\d{2})/.exec(raw);
  if (iso) return iso[1];
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return undefined;
}

/** Human-readable date like "July 15, 2026". */
export function formatBlogDate(value?: string | Date | null): string {
  const iso = toIsoDate(value ?? undefined);
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Stable slug for heading IDs and TOC anchors */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['?]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Pull H2/H3 headings from MDX/Markdown source for TOC */
export function extractMarkdownHeadings(content: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const seen = new Map<string, number>();
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/\*\*/g, "").replace(/`/g, "").trim();
    if (!text) continue;

    let id = slugifyHeading(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    headings.push({ id, text, level });
  }

  return headings;
}

export function getTextFromChildren(children: ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join("");
  }
  if (typeof children === "object" && "props" in children) {
    const el = children as { props?: { children?: ReactNode } };
    return getTextFromChildren(el.props?.children);
  }
  return "";
}
