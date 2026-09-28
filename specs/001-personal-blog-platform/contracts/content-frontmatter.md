# Contract: Post Content File (`.mdx` frontmatter)

This is the authoring contract every post content file must satisfy. It is the interface between the author (writing `.mdx` files) and the build-time content pipeline (`src/lib/posts.ts`).

## File location

`src/content/posts/<slug>.mdx`

The filename (without extension) is the default `slug` unless overridden by an explicit `slug` frontmatter field.

## Frontmatter schema

```yaml
---
title: string              # required
date: YYYY-MM-DD            # required
summary: string             # required
slug: string                 # optional, defaults to filename
tags: [string, ...]          # optional
category: string             # optional
series: string                # optional
seriesOrder: number            # required if `series` is set
coverImage: string (path)      # optional, must resolve to an existing static asset
---
```

## Build-time guarantees (contract enforced by `src/lib/posts.ts`)

1. A post file missing `title`, `date`, or `summary` **fails the build** with an error identifying the offending file.
2. Two post files resolving to the same `slug` **fail the build** with an error naming both files.
3. A `coverImage` (or any image path referenced in the MDX body) that does not resolve to an existing file **fails the build** with an error naming the file and the missing path.
4. A post with `series` set but no `seriesOrder` **fails the build**.
5. Posts with no `tags` or no `category` are valid; they are omitted from tag/category groupings but still appear in the main chronological listing.

## Output contract: routes generated per post

For a valid post with `slug: "my-post"`:

- `/posts/my-post` — full post page (FR-002)
- Appears in `/` listing (FR-001)
- If `tags: [a, b]` — appears in `/tags/a` and `/tags/b` (FR-007)
- If `category: x` — appears in `/categories/x` (FR-007)
- If `series: y` — appears in `/series/y` at position `seriesOrder` (FR-013)
- Included in the generated search index consumed by `/search` (FR-008)

## Not-found contract

Any requested route not matching a generated slug/tag/category/series value renders the shared `not-found` page (FR-006) rather than an error or blank page.
