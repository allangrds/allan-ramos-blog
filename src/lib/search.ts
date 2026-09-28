import type { SearchIndexEntry } from "./types";

export function searchIndex(
  index: SearchIndexEntry[],
  query: string,
): SearchIndexEntry[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return index.filter((entry) => {
    const haystack = [
      entry.title,
      entry.summary,
      ...entry.tags,
      entry.bodyText,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
