import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type { Post } from "./types";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");
const PUBLIC_DIR = path.join(process.cwd(), "public");

// Matches Markdown image syntax `![alt](path)` to find body-referenced images.
const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*\]\(([^)\s]+)\)/g;

function resolveStaticAsset(assetPath: string): boolean {
  if (!assetPath.startsWith("/")) return true; // external or relative link, not our concern
  return fs.existsSync(path.join(PUBLIC_DIR, assetPath));
}

function readPostFile(fileName: string): { filePath: string; slug: string } {
  const isDir = fs.statSync(path.join(POSTS_DIR, fileName)).isDirectory();
  const filePath = isDir
    ? path.join(POSTS_DIR, fileName, "index.mdx")
    : path.join(POSTS_DIR, fileName);
  const slug = isDir ? fileName : fileName.replace(/\.mdx$/, "");
  return { filePath, slug };
}

function listPostEntries(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((entry) => {
    const fullPath = path.join(POSTS_DIR, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      return fs.existsSync(path.join(fullPath, "index.mdx"));
    }
    return entry.endsWith(".mdx");
  });
}

function parsePost(fileName: string): Post {
  const { filePath, slug: derivedSlug } = readPostFile(fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const relativePath = path.relative(POSTS_DIR, filePath);

  const missing: string[] = [];
  if (!data.title) missing.push("title");
  if (!data.date) missing.push("date");
  if (!data.summary) missing.push("summary");
  if (missing.length > 0) {
    throw new Error(
      `Post "${relativePath}" is missing required frontmatter field(s): ${missing.join(", ")}`,
    );
  }

  if (data.series && data.seriesOrder === undefined) {
    throw new Error(
      `Post "${relativePath}" declares series "${data.series}" but is missing required field "seriesOrder"`,
    );
  }

  const slug: string = data.slug ?? derivedSlug;
  const date =
    data.date instanceof Date ? data.date.toISOString() : String(data.date);

  if (data.coverImage && !resolveStaticAsset(data.coverImage)) {
    throw new Error(
      `Post "${relativePath}" references coverImage "${data.coverImage}" which does not exist in public/`,
    );
  }

  for (const match of content.matchAll(MARKDOWN_IMAGE_REGEX)) {
    const imagePath = match[1];
    if (!resolveStaticAsset(imagePath)) {
      throw new Error(
        `Post "${relativePath}" references image "${imagePath}" which does not exist in public/`,
      );
    }
  }

  const tags: string[] = Array.isArray(data.tags)
    ? data.tags.filter((tag: string) => tag.trim() !== "")
    : [];

  return {
    title: data.title,
    date,
    slug,
    summary: data.summary,
    tags,
    category: data.category || undefined,
    series: data.series || undefined,
    seriesOrder: data.seriesOrder,
    coverImage: data.coverImage || undefined,
    body: content,
  };
}

let cachedPosts: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cachedPosts) return cachedPosts;

  const entries = listPostEntries();
  const posts = entries.map(parsePost);

  const seenSlugs = new Map<string, string>();
  entries.forEach((fileName, index) => {
    const post = posts[index];
    const existing = seenSlugs.get(post.slug);
    if (existing) {
      throw new Error(
        `Duplicate slug "${post.slug}" found in "${existing}" and "${fileName}"`,
      );
    }
    seenSlugs.set(post.slug, fileName);
  });

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  cachedPosts = posts;
  return posts;
}

export function getPaginatedPosts(
  page: number,
  perPage = 6,
): { posts: Post[]; totalPages: number } {
  const allPosts = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(allPosts.length / perPage));
  const start = (page - 1) * perPage;
  return { posts: allPosts.slice(start, start + perPage), totalPages };
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostsBySeries(series: string): Post[] {
  return getAllPosts()
    .filter((post) => post.series === series)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags);
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();
  getAllPosts().forEach((post) => {
    if (post.category) categories.add(post.category);
  });
  return Array.from(categories);
}

export function getAllSeries(): string[] {
  const series = new Set<string>();
  getAllPosts().forEach((post) => {
    if (post.series) series.add(post.series);
  });
  return Array.from(series);
}
