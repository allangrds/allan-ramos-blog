import Link from "next/link";

import type { Post } from "@/lib/types";
import TagPill from "@/components/TagPill/TagPill";

export type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <article className="border-b border-hairline py-6 pl-3 border-l-2 border-l-transparent hover:border-l-primary transition-colors">
      <Link href={`/posts/${post.slug}`} className="group">
        <h2 className="text-heading-md font-semibold text-ink group-hover:text-primary">
          {post.title}
        </h2>
      </Link>
      <p className="text-caption text-ink-mute mt-1">{formattedDate}</p>
      <p className="text-body-md text-ink mt-3">{post.summary}</p>
      {(post.category || post.tags.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-3">
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
