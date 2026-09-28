import { describe, expect, it } from "vitest";

import {
  getPostsByCategory,
  getPostsBySeries,
  getPostsByTag,
} from "@/lib/posts";

describe("post filtering", () => {
  it("getPostsByTag returns only posts with the given tag", () => {
    const posts = getPostsByTag("react");
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach((post) => expect(post.tags).toContain("react"));
  });

  it("getPostsByTag returns an empty array for an unknown tag", () => {
    expect(getPostsByTag("does-not-exist")).toEqual([]);
  });

  it("getPostsByCategory returns only posts with the given category", () => {
    const posts = getPostsByCategory("Back-end");
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach((post) => expect(post.category).toBe("Back-end"));
  });

  it("getPostsBySeries returns member posts ordered by seriesOrder", () => {
    const posts = getPostsBySeries("Virando fullstack");
    expect(posts.length).toBe(3);
    for (let i = 0; i < posts.length - 1; i++) {
      expect(posts[i].seriesOrder!).toBeLessThan(posts[i + 1].seriesOrder!);
    }
  });
});
