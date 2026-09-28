# Implementation Plan: Personal Blog Platform Rebuild

**Branch**: `001-personal-blog-platform` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-personal-blog-platform/spec.md`

## Summary

Rebuild the personal blog (currently a Gatsby site) as a statically-generated Next.js application. Posts are authored as `.mdx` files and rendered via SSG so every page (home listing, individual posts, tag/category pages) is pre-built at deploy time. Visual design follows the tokens defined in `DESIGN.md`, implemented with Tailwind CSS. Shared UI is built as isolated, independently viewable components using Storybook. The project is TypeScript throughout, using the `src/` + `app/` directory convention.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 24 (LTS)

**Primary Dependencies**: Next.js (latest stable, App Router, `src/` directory), React (latest matching Next.js), Tailwind CSS (latest, v4), MDX tooling for Next.js (`@next/mdx` or `next-mdx-remote`, TBD in research), Storybook (latest, Next.js framework integration)

**Storage**: N/A — content lives as `.mdx` files in the repository (file-based content), no database

**Testing**: Storybook for component-level visual/interaction verification; a component/unit test runner compatible with the chosen Storybook setup (e.g., Vitest) for logic (frontmatter parsing, tag/category filtering, search indexing)

**Target Platform**: Statically exported/pre-rendered site served over the web (SSG output), deployable to any static or Node-capable host

**Project Type**: Web application (single Next.js project — no separate backend; this supersedes the "frontend+backend" web-app split since there is no API layer, only build-time content processing)

**Performance Goals**: Pages interactive in under 2 seconds on typical broadband (SC-002); no client-side data fetching required for initial render since all content is statically generated

**Constraints**: All routes must be statically generated at build time (no per-request server rendering of post content, per FR-005); visual styling must derive from `DESIGN.md` tokens (FR-009); must preserve existing content types — standalone posts, series, tags, categories (FR-013)

**Scale/Scope**: Personal blog scale — tens to low hundreds of posts; single author; no concurrent-write concerns

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is an unfilled template with no ratified principles. No project-specific gates are defined, so this check has nothing to enforce and passes trivially. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-blog-platform/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Homepage: post listing
│   ├── posts/[slug]/page.tsx       # Individual post page (SSG)
│   ├── tags/[tag]/page.tsx         # Posts filtered by tag
│   ├── categories/[category]/page.tsx  # Posts filtered by category
│   ├── series/[series]/page.tsx    # Posts grouped by series
│   ├── search/page.tsx             # Search UI (client-side index)
│   ├── not-found.tsx               # 404 page
│   ├── sitemap.ts
│   └── robots.ts
├── components/                     # Reusable UI building blocks, each with a co-located Storybook story
│   ├── PostCard/
│   ├── PostContent/
│   ├── TagPill/
│   ├── Header/
│   ├── Footer/
│   ├── Toc/
│   ├── SearchBox/
│   └── ShareButtons/
├── lib/
│   ├── posts.ts                    # Reads/parses .mdx frontmatter, builds post index
│   ├── mdx.ts                      # MDX compilation/rendering helpers
│   └── search-index.ts             # Builds static search index at build time
└── content/
    └── posts/*.mdx                 # Post content files (migrated from existing posts/)

.storybook/
├── main.ts
└── preview.ts

tests/
├── unit/                           # Frontmatter parsing, filtering, search-index logic
└── stories/                        # Storybook interaction tests (if configured)
```

**Structure Decision**: Single Next.js project using the `src/` + `app/` App Router convention (per explicit requirement). No separate backend project — all content resolution happens at build time via `src/lib`. Components live under `src/components` with co-located Storybook stories so each is independently viewable, satisfying FR-010. Post content is migrated from the existing top-level `posts/` directory into `src/content/posts/` as `.mdx` files.

## Complexity Tracking

*No constitution violations to justify — table intentionally omitted.*
