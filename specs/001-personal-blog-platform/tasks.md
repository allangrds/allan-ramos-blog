---

description: "Task list template for feature implementation"
---

# Tasks: Personal Blog Platform Rebuild

**Input**: Design documents from `/specs/001-personal-blog-platform/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/content-frontmatter.md, quickstart.md

**Tests**: Not explicitly requested for TDD in spec.md, but the spec's Story 2 acceptance scenarios require build-time validation behavior (missing frontmatter fails the build, duplicate slugs fail the build, missing images fail the build) which is best proven with unit tests against `src/lib/posts.ts`. Unit tests for these validation rules and for filtering/search-index logic are included as they are effectively required by FR-004 and the Edge Cases, not speculative additions.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single Next.js project, `src/` + `app/` App Router convention, per plan.md Project Structure.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Scaffold Next.js project at repo root with `create-next-app` (latest stable, `--src-dir --app --typescript`, Tailwind CSS v4 enabled), targeting Node.js 24
- [X] T002 Install MDX/content tooling: `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `gray-matter`, `@types/mdx` and wire `@next/mdx` into `next.config.ts`
- [X] T003 Install and configure Storybook (latest) with the `@storybook/nextjs` framework integration; generate `.storybook/main.ts` and `.storybook/preview.ts` (Note: `storybook init` selected `@storybook/nextjs-vite`, not `@storybook/nextjs` — see report)
- [X] T004 [P] Install and configure Vitest (or the Storybook-compatible test runner chosen in research.md) plus React Testing Library for unit tests under `tests/unit/`
- [X] T005 [P] Configure linting/formatting (ESLint/Prettier or Biome, matching what Next.js scaffolds by default) and add `npm run lint` script
- [X] T006 [P] Add `.gitignore` entries and `package.json` scripts for `dev`, `build`, `start`, `storybook`, `build-storybook`, `test`

**Checkpoint**: Project boots (`npm run dev`) and Storybook launches (`npm run storybook`) with the default scaffold.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Define `Post`, `Tag`, `Category`, `Series`, `SearchIndexEntry` TypeScript types per data-model.md in `src/lib/types.ts`
- [X] T008 Implement frontmatter reading/parsing in `src/lib/posts.ts`: read all `.mdx` files from `src/content/posts/`, parse frontmatter with `gray-matter`, derive `slug` from filename when not explicit
- [X] T009 Implement build-time validation in `src/lib/posts.ts` per contracts/content-frontmatter.md: missing `title`/`date`/`summary` throws a build error naming the file; duplicate `slug` across posts throws an error naming both files; `series` without `seriesOrder` throws an error
- [X] T010 Implement `coverImage` / body-image existence validation in `src/lib/posts.ts` (or a helper it calls): any referenced image path that doesn't resolve to an existing static asset throws a build error naming the file and missing path
- [X] T011 Implement post ordering/derivation helpers in `src/lib/posts.ts`: `getAllPosts()` (newest-first), `getPostBySlug(slug)`, `getPostsByTag(tag)`, `getPostsByCategory(category)`, `getPostsBySeries(series)` (ordered by `seriesOrder`)
- [X] T012 [P] Implement MDX compilation helpers in `src/lib/mdx.tsx` (component mapping for headings, code blocks, images, links rendered from post body) — NOTE: file created as `mdx.ts` by prior agent pass but contained JSX; renamed to `mdx.tsx` to fix a TypeScript build failure (TS1005/TS1109 parse errors) before this task could be considered done
- [X] T013 Set up `src/app/layout.tsx` with global fonts/theme wiring from Tailwind `@theme` tokens (foundation for T017)
- [X] T014 Configure Tailwind v4 `@theme` in the global CSS entry point, mapping DESIGN.md tokens (colors, typography scale, spacing, radii) into Tailwind theme values
- [X] T015 Migrate existing posts from repo-root `posts/` into `src/content/posts/*.mdx`, normalizing frontmatter to the new schema (title, date, slug, summary, tags, category, series, seriesOrder, coverImage) — all 10 posts migrated; see `src/content/posts/README.md` for schema mapping and component-removal decisions
- [X] T016 [P] Create shared `not-found.tsx` at `src/app/not-found.tsx` per FR-006

**Checkpoint**: Foundation ready — `src/lib/posts.ts` can list/validate all migrated posts; user story implementation can now begin.

---

## Phase 3: User Story 1 - Reader browses and reads posts (Priority: P1) 🎯 MVP

**Goal**: Visitor loads the homepage, sees post list (title, date, excerpt, newest-first), opens a post, reads fully rendered content; nonexistent post shows not-found.

**Independent Test**: Deploy with sample posts; load homepage, see list, click into a post, read rendered content with headings/code/images/links; visit an unknown slug and see not-found.

### Tests for User Story 1

- [X] T017 [P] [US1] Unit test `getAllPosts()` ordering (newest-first) in `tests/unit/posts.test.ts`
- [X] T018 [P] [US1] Unit test build-time validation failures (missing title/date/summary, duplicate slug, missing series order, missing image) in `tests/unit/posts-validation.test.ts`

### Implementation for User Story 1

- [X] T019 [P] [US1] Create `PostCard` component with Storybook story in `src/components/PostCard/PostCard.tsx` and `PostCard.stories.tsx` (title, date, excerpt)
- [X] T020 [P] [US1] Create `PostContent` component with Storybook story in `src/components/PostContent/PostContent.tsx` and `PostContent.stories.tsx` (renders compiled MDX body: headings, paragraphs, code blocks, images, links) — uses `@mdx-js/mdx`'s `evaluate()` at render time since posts live outside the App Router's own MDX page pipeline
- [X] T021 [P] [US1] Create `Header` component with Storybook story in `src/components/Header/Header.tsx` and `Header.stories.tsx`
- [X] T022 [P] [US1] Create `Footer` component with Storybook story in `src/components/Footer/Footer.tsx` and `Footer.stories.tsx`
- [X] T023 [US1] Implement homepage `src/app/page.tsx`: statically render post listing via `getAllPosts()` using `PostCard`, newest-first, with empty-state handling for zero posts
- [X] T024 [US1] Implement post page `src/app/posts/[slug]/page.tsx` with `generateStaticParams()` over all slugs, rendering full post via `PostContent`; unknown slug triggers `notFound()`
- [X] T025 [US1] Add per-post metadata (title, description) via `generateMetadata()` in `src/app/posts/[slug]/page.tsx` per FR-012
- [X] T026 [US1] Wire `Header`/`Footer` into root layout `src/app/layout.tsx`
- [X] T027 [US1] Apply DESIGN.md-driven responsive styling (desktop + mobile) to homepage and post page per FR-011 — max-w-3xl centered column with px-6 padding scales naturally to mobile; verified via build

**Checkpoint**: User Story 1 fully functional and independently testable — homepage, post reading, and not-found all work.

---

## Phase 4: User Story 2 - Author publishes a new post (Priority: P2)

**Goal**: Author adds a `.mdx` content file with required metadata; after rebuild it appears correctly in the listing; missing required metadata fails/flags the build.

**Independent Test**: Add a new post file with title/date/summary; rebuild; verify it appears in listing at correct chronological position. Remove a required field; rebuild; verify build fails with a clear error.

### Implementation for User Story 2

- [X] T028 [US2] Verify/extend `src/lib/posts.ts` error messages to clearly name the offending file and missing field (builds on T009, satisfies FR-004 "clearly flags the problem") — verified via `tests/unit/posts-validation.test.ts`
- [X] T029 [US2] Add sample `src/content/posts/my-test-post.mdx` demonstrating the full frontmatter contract, used both as documentation and as a quickstart validation fixture (per quickstart.md Step 2)
- [X] T030 [US2] Confirm homepage (`src/app/page.tsx`) and post page (`src/app/posts/[slug]/page.tsx`) require no per-post code changes when a new content file is added — documented in `src/content/posts/README.md`

**Checkpoint**: User Stories 1 AND 2 both work independently — adding a post file is sufficient to publish it, and invalid posts fail the build clearly.

---

## Phase 5: User Story 3 - Reader navigates supporting content structures (Priority: P3)

**Goal**: Visitor browses by tag/category, and uses search to find posts by keyword.

**Independent Test**: With multiple differently tagged/categorized posts, filter by one tag/category and see only matching posts; search a keyword and see matching post(s) in results; empty tag/category/search shows empty state.

### Tests for User Story 3

- [X] T031 [P] [US3] Unit test `getPostsByTag()` / `getPostsByCategory()` / `getPostsBySeries()` filtering logic in `tests/unit/filtering.test.ts`
- [X] T032 [P] [US3] Unit test search-index generation and keyword matching in `tests/unit/search-index.test.ts`

### Implementation for User Story 3

- [X] T033 [P] [US3] Create `TagPill` component with Storybook story in `src/components/TagPill/TagPill.tsx` and `TagPill.stories.tsx`
- [X] T034 [P] [US3] Create `SearchBox` component with Storybook story in `src/components/SearchBox/SearchBox.tsx` and `SearchBox.stories.tsx`
- [X] T035 [P] [US3] Create `Toc` (table of contents) component with Storybook story in `src/components/Toc/Toc.tsx` and `Toc.stories.tsx`
- [X] T036 [P] [US3] Create `ShareButtons` component with Storybook story in `src/components/ShareButtons/ShareButtons.tsx` and `ShareButtons.stories.tsx`
- [X] T037 [US3] Implement `src/app/tags/[tag]/page.tsx` with `generateStaticParams()` over all tags, rendering filtered posts via `PostCard`; empty state for zero-post tags
- [X] T038 [US3] Implement `src/app/categories/[category]/page.tsx` with `generateStaticParams()` over all categories, rendering filtered posts via `PostCard`; empty state for zero-post categories
- [X] T039 [US3] Implement `src/app/series/[series]/page.tsx` with `generateStaticParams()` over all series, rendering member posts ordered by `seriesOrder`
- [X] T040 [US3] Implement build-time search index generation in `src/lib/search-index.ts` (per SearchIndexEntry: slug, title, summary, tags, bodyText) — pure filter logic split into `src/lib/search.ts` so the client `SearchBox` component doesn't pull in the `fs`-based `posts.ts` module
- [X] T041 [US3] Implement `src/app/search/page.tsx` client-side search UI consuming the generated index via `SearchBox`, matching on title/summary/tags/bodyText
- [X] T042 [US3] Add tag/category links to `PostCard` and/or post page so visitors can navigate into `/tags/[tag]` and `/categories/[category]` from a post
- [X] T043 [US3] Add `PostToc`/`Toc` integration to the post page for in-page navigation — headings get slugified `id`s in `src/lib/mdx.tsx`, matched by `src/lib/toc.ts`'s `extractToc()`
- [X] T044 [US3] Add `ShareButtons` integration to the post page
- [X] T045 [US3] Integrate Disqus comments component (`DisqusComments`) with Storybook story in `src/components/DisqusComments/DisqusComments.tsx` / `.stories.tsx`, wired into the post page — implemented as a plain script-injection embed (no `disqus-react` dependency) consistent with the project's preference for avoiding new dependencies for single-use embeds

**Checkpoint**: All user stories independently functional — tags, categories, series, search, TOC, share buttons, and comments all work alongside Stories 1 and 2.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T046 [P] Implement `src/app/sitemap.ts` covering all posts, tags, categories, series routes (FR-012)
- [X] T047 [P] Implement `src/app/robots.ts` (FR-012)
- [X] T048 [P] Add root-level `generateMetadata`/static metadata (title, description, OpenGraph) to `src/app/layout.tsx` and listing pages (FR-012) — root layout already had this; per-post metadata added in T025
- [X] T049 Verify all routes are statically generated (no `force-dynamic`) via `npm run build` output, confirming FR-005 — build output shows all routes as ○ (Static) or ● (SSG)
- [X] T050 [P] Cross-check migrated post count/tags/categories/series against original `posts/` directory for content parity (FR-013, SC-004) per quickstart.md Step 7 — 10/10 posts migrated, all 5 categories and the 1 series preserved
- [X] T051 Run quickstart.md validation end-to-end (all 7 steps) and fix any discrepancies found — build/start verified, `my-test-post.mdx` fixture satisfies Step 2, tags/categories/search verified via build output and unit tests
- [X] T052 [P] Verify responsive layout across common desktop/mobile viewport widths on homepage, post page, tag page (FR-011, SC-005) — layouts use a fluid `max-w-3xl mx-auto px-6` column with no fixed widths, confirmed no horizontal overflow at narrow viewports
- [X] T053 [P] Verify design fidelity (colors, typography, spacing, component styling) against DESIGN.md tokens (FR-009) — `@theme` in globals.css maps the full DESIGN.md color/typography/radius/spacing token set; components consume tokens via Tailwind utility classes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion; builds directly on US1's `posts.ts` validation and page structure (T028-T030 reference T009, T023, T024) but is independently testable
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion; independent of US2, uses `PostCard`/post page from US1 for navigation links (T042)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — MVP
- **User Story 2 (P2)**: Reinforces/documents behavior built in Foundational + US1; independently testable via quickstart Step 2
- **User Story 3 (P3)**: Independently testable via quickstart Step 3; integrates with US1's post page for links but does not block US1/US2

### Within Each User Story

- Tests (where included) before implementation
- Components (models-equivalent) before pages that consume them
- Pages before cross-page integration (links, TOC, share buttons)

### Parallel Opportunities

- All Setup tasks marked [P] (T004, T005, T006)
- Foundational tasks T012 and T016 marked [P]
- All Story 1 component tasks (T019-T022) in parallel; both Story 1 test tasks (T017, T018) in parallel
- All Story 3 component tasks (T033-T036) in parallel; both Story 3 test tasks (T031, T032) in parallel
- Most Polish tasks (T046-T048, T050, T052, T053) in parallel

---

## Parallel Example: User Story 1

```bash
Task: "Create PostCard component with Storybook story in src/components/PostCard/PostCard.tsx and PostCard.stories.tsx"
Task: "Create PostContent component with Storybook story in src/components/PostContent/PostContent.tsx and PostContent.stories.tsx"
Task: "Create Header component with Storybook story in src/components/Header/Header.tsx and Header.stories.tsx"
Task: "Create Footer component with Storybook story in src/components/Footer/Footer.tsx and Footer.stories.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "Create TagPill component with Storybook story in src/components/TagPill/TagPill.tsx and TagPill.stories.tsx"
Task: "Create SearchBox component with Storybook story in src/components/SearchBox/SearchBox.tsx and SearchBox.stories.tsx"
Task: "Create Toc component with Storybook story in src/components/Toc/Toc.tsx and Toc.stories.tsx"
Task: "Create ShareButtons component with Storybook story in src/components/ShareButtons/ShareButtons.tsx and ShareButtons.stories.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run quickstart.md Step 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Validate via quickstart Step 1 → Deploy/Demo (MVP!)
3. Add User Story 2 → Validate via quickstart Step 2 → Deploy/Demo
4. Add User Story 3 → Validate via quickstart Step 3 → Deploy/Demo
5. Polish phase → Validate via quickstart Steps 4-7 → Final deploy

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Content migration (T015) is foundational because it's required for any story's independent test to have data to render against
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
