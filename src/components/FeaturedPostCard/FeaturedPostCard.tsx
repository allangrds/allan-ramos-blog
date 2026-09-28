import Link from "next/link";

import type { Post } from "@/lib/types";
import TagPill from "@/components/TagPill/TagPill";

export type FeaturedPostCardProps = {
  post: Post;
};

export default function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <article className="rounded-xl bg-canvas border border-hairline border-l-4 border-l-primary shadow-md p-8 mb-10">
      <span className="inline-block rounded-pill bg-primary text-on-primary text-micro-cap font-bold uppercase px-3 py-1 mb-3">
        Último post
      </span>
      <Link href={`/posts/${post.slug}`} className="group">
        <h2 className="text-display-md font-bold text-ink group-hover:text-primary">
          {post.title}
        </h2>
      </Link>
      <p className="text-caption text-ink-mute mt-2">{formattedDate}</p>
      <p className="text-body-lg text-ink mt-4">{post.summary}</p>
      {(post.category || post.tags.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.category && (
            <TagPill
              tag={post.category}
              href={`/categories/${post.category}`}
            />
          )}
          {post.tags.map((tag) => (
            <TagPill key={tag} tag={tag} href={`/tags/${tag}`} />
          ))}
        </div>
      )}
    </article>
  );
}
