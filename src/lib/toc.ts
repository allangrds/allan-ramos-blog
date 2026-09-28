import type { TocItem } from "@/components/Toc/Toc";

// Matches Markdown ATX headings (`# `, `## `, `### `) to build a table of contents.
const HEADING_REGEX = /^(#{1,3})\s+(.+)$/gm;

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractToc(body: string): TocItem[] {
  const items: TocItem[] = [];
  for (const match of body.matchAll(HEADING_REGEX)) {
    const level = match[1].length;
    const text = match[2].trim();
    items.push({ id: slugifyHeading(text), text, level });
  }
  return items;
}
