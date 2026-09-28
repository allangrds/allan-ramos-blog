# Research: Personal Blog Platform Rebuild

## 1. Next.js version and structure

- **Decision**: Use the latest stable Next.js release with the App Router and `src/` directory (`create-next-app` defaults: `--src-dir --app --typescript`). Node.js 24 as the runtime baseline.
- **Rationale**: Explicitly requested by the user ("latest version of Next.js with src and app directories"). The App Router is required for React Server Components and the static generation model (`generateStaticParams`) needed for SSG per-post pages. A prior abandoned scaffold in this repo (`my-app/`, now removed) already validated Next 16 + React 19 + Tailwind v4 + Biome as a working combination on this machine.
- **Alternatives considered**: Pages Router — rejected, legacy API, weaker static-params ergonomics for MDX-per-file routing.

## 2. Static generation (SSG) approach

- **Decision**: Use `generateStaticParams` on `app/posts/[slug]/page.tsx`, `app/tags/[tag]/page.tsx`, `app/categories/[category]/page.tsx`, and `app/series/[series]/page.tsx` to pre-render every route at build time. No `dynamic = 'force-dynamic'` anywhere in the posts/listing paths, satisfying FR-005 (no per-request content lookup).
- **Rationale**: Native Next.js App Router mechanism for SSG; avoids introducing `next export` limitations (e.g., no `next/image` optimization API) since a Node-capable static/ISR-less deployment target is assumed per the spec's "generated ahead of time" requirement.
- **Alternatives considered**: `output: 'export'` full static export — viable but constrains image optimization and any future dynamic route; deferred unless a specific hosting constraint requires it.

## 3. MDX handling

- **Decision**: Use `@next/mdx` for compiling `.mdx` files with the App Router's native MDX support, combined with `gray-matter` (or equivalent frontmatter parser) to extract post metadata (title, date, summary, tags, category, series) from frontmatter before compiling the body.
- **Rationale**: `@next/mdx` is the officially maintained integration and works directly with the App Router's file conventions; frontmatter parsing is a well-established, minimal-dependency pattern for content-file metadata (satisfies FR-003, FR-004).
- **Alternatives considered**: `next-mdx-remote` — more flexible for remote/dynamic MDX sources, but adds complexity not needed here since all content is local, build-time, file-based.

## 4. Styling: Tailwind CSS + DESIGN.md tokens

- **Decision**: Use Tailwind CSS v4 (latest), configured via its CSS-first `@theme` directive to map the DESIGN.md tokens (colors, typography scale, spacing, radii) directly into Tailwind theme values, rather than hand-rolling a parallel design-token layer.
- **Rationale**: Tailwind v4's `@theme` approach removes the need for a separate `tailwind.config.js` token-mapping layer and keeps token definitions close to the CSS entry point; DESIGN.md already expresses tokens (colors, typography, rounded, spacing, components) in a structure that maps cleanly to Tailwind theme keys. Satisfies FR-009.
- **Alternatives considered**: JS-based `tailwind.config.ts` `theme.extend` — still valid in v4 but the CSS-first approach is the new idiomatic default and reduces indirection.

## 5. Component isolation: Storybook

- **Decision**: Use Storybook (latest major) with its Next.js framework integration (`@storybook/nextjs`), stories co-located next to each component (`ComponentName.stories.tsx`).
- **Rationale**: Directly requested ("components with Storybook"); the Next.js framework adapter handles App Router primitives (next/image, next/link, next/font) inside stories without extra shimming. Satisfies FR-010 and SC-006.
- **Alternatives considered**: Standalone React Storybook without the Next.js adapter — rejected, would require manual mocking of Next-specific APIs used across components (Header, PostCard links/images).

## 6. Search

- **Decision**: Build a static client-side search index at build time (e.g., a generated JSON of post title/summary/body-text/tags) and query it in the browser with a lightweight full-text matching library (e.g., a small fuzzy/keyword matcher) rather than a hosted search service.
- **Rationale**: Consistent with the spec's assumption of static-only content (no live backend) and avoids a paid/hosted dependency (the previous Gatsby version used Algolia, a hosted paid service, which is unnecessary at this scale — tens to low hundreds of posts). Satisfies FR-008.
- **Alternatives considered**: Algolia (used previously) — rejected as unnecessary operational/cost overhead for personal-blog scale; a live backend search API — rejected, contradicts full SSG approach (FR-005).

## 7. Comments

- **Decision**: Carry over a third-party embedded commenting widget (Disqus, matching the prior implementation) rather than building custom comment infrastructure.
- **Rationale**: Matches existing spec Assumption ("comments rely on a third-party embedded service"); avoids building/hosting a comments backend, out of scope for a static blog rebuild.
- **Alternatives considered**: Giscus (GitHub Discussions-backed) — reasonable alternative, not selected here since it changes the reader's login provider expectation from the existing Disqus-based blog; can be swapped later without affecting page structure.

## 8. Content migration

- **Decision**: Migrate existing posts from the repository's top-level `posts/` directory (Markdown/MDX with Gatsby-style frontmatter) into `src/content/posts/*.mdx`, normalizing frontmatter fields to the new schema (title, date, slug, summary, tags, category, series, cover image).
- **Rationale**: Satisfies FR-013 / SC-004 (no content loss, full parity) while adapting metadata to the new build-time processing pipeline.
- **Alternatives considered**: Keep posts at repo root — rejected, since colocating content under `src/` keeps the build pipeline (`src/lib/posts.ts`) simpler and self-contained within the Next.js project boundary.

## Open items resolved

All Technical Context fields from the plan are resolved above; no `NEEDS CLARIFICATION` markers remain.
