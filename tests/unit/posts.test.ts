import { describe, expect, it } from "vitest";

import { getAllPosts } from "@/lib/posts";

describe("getAllPosts", () => {
  it("orders posts newest-first by date", () => {
    const posts = getAllPosts();

    expect(posts.length).toBeGreaterThan(0);

    for (let i = 0; i < posts.length - 1; i++) {
      const current = new Date(posts[i].date).getTime();
      const next = new Date(posts[i + 1].date).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });
});
