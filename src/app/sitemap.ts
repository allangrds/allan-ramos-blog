import type { MetadataRoute } from "next";

import {
  getAllCategories,
  getAllPosts,
  getAllSeries,
  getAllTags,
} from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: post.date,
  }));

  const tags = getAllTags().map((tag) => ({
    url: `${SITE_URL}/tags/${tag}`,
  }));

  const categories = getAllCategories().map((category) => ({
    url: `${SITE_URL}/categories/${category}`,
  }));

  const series = getAllSeries().map((seriesName) => ({
    url: `${SITE_URL}/series/${seriesName}`,
  }));

  return [{ url: SITE_URL }, ...posts, ...tags, ...categories, ...series];
}
