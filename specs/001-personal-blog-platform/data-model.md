# Data Model: Personal Blog Platform Rebuild

All content is file-based (no database). Entities below describe the shape of data extracted from `.mdx` frontmatter and derived at build time.

## Post

Represents a single published piece of writing, sourced from one `.mdx` file.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Post title (FR-004) |
| `date` | ISO date string | yes | Publish date; drives homepage ordering (FR-001, FR-004) |
| `slug` | string | yes (derived from filename if not explicit) | Used to build the post's unique address (FR-002); must be unique across all posts |
| `summary` | string | yes | Short excerpt shown in listings (FR-001, FR-004) |
| `tags` | string[] | no | Zero or more topic labels (FR-007) |
| `category` | string | no | Single broader grouping label (FR-007) |
| `series` | string | no | Name of the series this post belongs to, if any |
| `seriesOrder` | number | no (required if `series` present) | Position within the series |
| `coverImage` | string (path) | no | Must resolve to an existing file; missing target fails the build (Edge Cases) |
| `body` | MDX content | yes | Compiled post content (FR-003) |

**Validation rules**:
- Missing `title`, `date`, or `summary` → build fails (FR-004).
- Duplicate `slug` across posts → build fails (Edge Cases: unique stable address per post).
- `coverImage` or any body-referenced image path that does not resolve to a file → build fails (Edge Cases).
- Posts with no `tags` or `category` are valid and still appear in the main listing (Edge Cases).

## Tag

Derived, not separately authored — the set of distinct values across all posts' `tags` arrays.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Unique tag label |
| `posts` | Post[] | All posts carrying this tag, newest first |

## Category

Derived — the set of distinct values across all posts' `category` field.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Unique category label |
| `posts` | Post[] | All posts in this category, newest first |

## Series

Derived — groups of posts sharing the same `series` value, ordered by `seriesOrder`.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Unique series label |
| `posts` | Post[] | Member posts, ordered by `seriesOrder` ascending |

## SearchIndexEntry

Build-time generated record used to power client-side search (FR-008); one per Post.

| Field | Type | Notes |
|---|---|---|
| `slug` | string | Links back to the Post |
| `title` | string | Searchable |
| `summary` | string | Searchable |
| `tags` | string[] | Searchable |
| `bodyText` | string | Plain-text-extracted post body, searchable |

## Relationships

```
Post 1---0..* Tag        (many-to-many via Post.tags)
Post 1---0..1 Category   (many-to-one via Post.category)
Post 1---0..1 Series     (many-to-one via Post.series + seriesOrder)
Post 1---1   SearchIndexEntry
```
