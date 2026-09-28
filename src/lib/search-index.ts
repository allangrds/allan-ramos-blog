import { getAllPosts } from "./posts";
import type { SearchIndexEntry } from "./types";

export function getSearchIndex(): SearchIndexEntry[] {
  return getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    tags: post.tags,
    bodyText: post.body,
  }));
}

export { searchIndex } from "./search";
