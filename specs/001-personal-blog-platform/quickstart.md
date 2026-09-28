# Quickstart: Personal Blog Platform Rebuild

Validation guide for confirming the rebuilt blog meets the feature spec end-to-end. See [data-model.md](./data-model.md) for entity shapes and [contracts/content-frontmatter.md](./contracts/content-frontmatter.md) for the authoring contract.

## Prerequisites

- Node.js 24
- Project dependencies installed (`npm install`)

## 1. Verify Story 1 — Reader browses and reads posts

```bash
npm run build
npm run start
```

- Open the homepage: confirm posts are listed newest-first with title, date, summary (FR-001).
- Click into a post: confirm it renders at its own address with headings, code blocks, images, and links correctly formatted (FR-002, FR-003).
- Visit a nonexistent post address (e.g. `/posts/does-not-exist`): confirm the not-found page renders (FR-006).

**Expected outcome**: SC-001 (homepage → full post read in ≤2 clicks) and SC-002 (pages interactive in <2s).

## 2. Verify Story 2 — Author publishes a new post

1. Add a new file at `src/content/posts/my-test-post.mdx` following the [frontmatter contract](./contracts/content-frontmatter.md), including `title`, `date`, `summary`.
2. Run `npm run build`.
3. Confirm the new post appears in the homepage listing at the correct chronological position.
4. Remove one required frontmatter field (e.g. `summary`) and rebuild — confirm the build fails with an error naming the file.

**Expected outcome**: SC-003 (publish without touching template/component code), FR-004 enforcement.

## 3. Verify Story 3 — Tags, categories, search

1. Ensure at least two posts share a `tags` value and two share a `category` value.
2. Visit `/tags/<tag>` and `/categories/<category>`: confirm only matching posts appear.
3. Visit `/search`, enter a keyword known to appear in one post's title or body: confirm that post appears in results.
4. Visit a tag/category with zero posts: confirm an empty state, not an error.

**Expected outcome**: FR-007, FR-008 satisfied.

## 4. Verify design fidelity

- Compare rendered colors, typography, spacing, and component styling (buttons, cards, pills) against `DESIGN.md` tokens.

**Expected outcome**: FR-009.

## 5. Verify component isolation

```bash
npm run storybook
```

- Confirm each component under `src/components/` has a visible, interactive story independent of any full page.

**Expected outcome**: FR-010, SC-006.

## 6. Verify responsive layout

- Resize the browser (or use device emulation) across common desktop and mobile widths on the homepage, a post page, and a tag page.

**Expected outcome**: FR-011, SC-005.

## 7. Verify content parity with existing blog

- Cross-check the migrated post count and their tags/categories/series against the current `posts/` directory contents.

**Expected outcome**: FR-013, SC-004 (no content loss).
