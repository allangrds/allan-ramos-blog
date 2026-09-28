import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_CWD = process.cwd();
let tmpDir: string;

async function loadPostsModuleWithCwd(cwd: string) {
  process.chdir(cwd);
  vi.resetModules();
  return import("@/lib/posts");
}

function writePost(tmpDir: string, fileName: string, contents: string) {
  const postsDir = path.join(tmpDir, "src/content/posts");
  fs.mkdirSync(postsDir, { recursive: true });
  fs.writeFileSync(path.join(postsDir, fileName), contents, "utf8");
}

describe("posts.ts build-time validation", () => {
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "posts-validation-"));
  });

  afterEach(() => {
    process.chdir(ORIGINAL_CWD);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("fails the build when title/date/summary are missing", async () => {
    writePost(
      tmpDir,
      "missing-fields.mdx",
      `---\ntitle: Only a title\n---\n\nBody`,
    );

    const { getAllPosts } = await loadPostsModuleWithCwd(tmpDir);
    expect(() => getAllPosts()).toThrowError(/missing required frontmatter/i);
  });

  it("fails the build on duplicate slugs", async () => {
    writePost(
      tmpDir,
      "post-a.mdx",
      `---\ntitle: Post A\ndate: 2024-01-01\nsummary: Summary A\nslug: duplicate\n---\n\nBody`,
    );
    writePost(
      tmpDir,
      "post-b.mdx",
      `---\ntitle: Post B\ndate: 2024-01-02\nsummary: Summary B\nslug: duplicate\n---\n\nBody`,
    );

    const { getAllPosts } = await loadPostsModuleWithCwd(tmpDir);
    expect(() => getAllPosts()).toThrowError(/duplicate slug/i);
  });

  it("fails the build when series is set without seriesOrder", async () => {
    writePost(
      tmpDir,
      "no-series-order.mdx",
      `---\ntitle: Post\ndate: 2024-01-01\nsummary: Summary\nseries: My Series\n---\n\nBody`,
    );

    const { getAllPosts } = await loadPostsModuleWithCwd(tmpDir);
    expect(() => getAllPosts()).toThrowError(/seriesOrder/);
  });

  it("fails the build when a referenced image does not exist", async () => {
    writePost(
      tmpDir,
      "missing-image.mdx",
      `---\ntitle: Post\ndate: 2024-01-01\nsummary: Summary\ncoverImage: /assets/uploads/does-not-exist.png\n---\n\nBody`,
    );

    const { getAllPosts } = await loadPostsModuleWithCwd(tmpDir);
    expect(() => getAllPosts()).toThrowError(/does not exist/i);
  });
});
