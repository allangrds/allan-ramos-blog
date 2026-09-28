import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { extractToc } from "@/lib/toc";
import { SITE_URL } from "@/lib/site";
import PostContent from "@/components/PostContent/PostContent";
import TagPill from "@/components/TagPill/TagPill";
import Toc from "@/components/Toc/Toc";
import ShareButtons from "@/components/ShareButtons/ShareButtons";
import DisqusComments from "@/components/DisqusComments/DisqusComments";
import Container from "@/components/Container/Container";
import CopyLinkButton from "@/components/CopyLinkButton/CopyLinkButton";

const DISQUS_SHORTNAME = "allan-ramos-blog";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const toc = extractToc(post.body);
  const postUrl = `${SITE_URL}/posts/${post.slug}`;

  return (
    <Container className="py-12">
      <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-8">
        <article>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-display-md font-bold text-ink">{post.title}</h1>
            <CopyLinkButton url={postUrl} />
          </div>
          <p className="text-body-md text-ink-mute mt-2">{formattedDate}</p>
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
          {toc.length > 0 && (
            <div className="mt-8 lg:hidden">
              <Toc items={toc} />
            </div>
          )}
          <div className="mt-8">
            <PostContent body={post.body} />
          </div>
          <div className="mt-10">
            <ShareButtons url={postUrl} title={post.title} />
          </div>
          <div className="mt-10">
            <DisqusComments
              shortname={DISQUS_SHORTNAME}
              slug={post.slug}
              title={post.title}
            />
          </div>
        </article>
        {toc.length > 0 && (
          <aside className="hidden lg:block sticky top-20 self-start">
            <Toc items={toc} />
          </aside>
        )}
      </div>
    </Container>
  );
}
