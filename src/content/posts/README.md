# Content migration notes

Posts were migrated from the old Gatsby `posts/` directory into the frontmatter contract described in `specs/001-personal-blog-platform/contracts/content-frontmatter.md`.

Schema mapping applied to every post:
- `subtitle` + `description` collapsed into a single `summary` (prefers non-empty `description`, falls back to `subtitle`, else a one-sentence summary written from the post's opening paragraph).
- `hero_image` renamed to `coverImage`.
- `author` dropped (site is single-author).
- `tags: ['']` normalized to `tags: []`; empty `series: ''` dropped entirely.
- Slug derived from the new filename (no more date-prefixed filenames).
- The three "Virando fullstack" posts share `series: Virando fullstack` with `seriesOrder: 1, 2, 3` assigned by chronological `date`.

Component removals (no per-post code should be required to render a post, per FR-003):
- `tudo-sei-design-system-components-guide.mdx` imported a local `Alert` component that no longer exists. The two alert boxes were rewritten as plain Markdown blockquotes.
- `aha-programacao.mdx` imported a local `EmbedVideo` component. Replaced with a plain link to the YouTube video.
- `react-compilado.mdx` imported `TwitterTweetEmbed` from `react-twitter-embed`. Replaced both tweet embeds with plain links to `https://twitter.com/i/status/<tweetId>` rather than reintroducing the dependency for two embeds.

Adding a new post is just adding a `.mdx` file here with the required frontmatter (`title`, `date`, `summary`) — no page or component code needs to change; `src/app/page.tsx` and `src/app/posts/[slug]/page.tsx` read the full post list via `src/lib/posts.ts` at build time.
