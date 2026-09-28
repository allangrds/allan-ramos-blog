import { describe, expect, it } from "vitest";

import { getSearchIndex } from "@/lib/search-index";
import { searchIndex } from "@/lib/search";

describe("search index", () => {
  it("generates one entry per post with slug/title/summary/tags/bodyText", () => {
    const index = getSearchIndex();
    expect(index.length).toBeGreaterThan(0);
    index.forEach((entry) => {
      expect(entry).toHaveProperty("slug");
      expect(entry).toHaveProperty("title");
      expect(entry).toHaveProperty("summary");
      expect(entry).toHaveProperty("tags");
      expect(entry).toHaveProperty("bodyText");
    });
  });

  it("matches posts by keyword in the title", () => {
    const index = getSearchIndex();
    const results = searchIndex(index, "Ngrok");
    expect(results.some((entry) => entry.slug === "expondo-web-server-com-ngrok")).toBe(
      true,
    );
  });

  it("returns an empty array for an empty query", () => {
    const index = getSearchIndex();
    expect(searchIndex(index, "")).toEqual([]);
  });

  it("returns an empty array when nothing matches", () => {
    const index = getSearchIndex();
    expect(searchIndex(index, "zzzznomatchzzzz")).toEqual([]);
  });
});
