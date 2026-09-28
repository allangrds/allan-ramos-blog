import Link from "next/link";

import CategoryBadge, { type CategoryName } from "@/components/CategoryBadge/CategoryBadge";
import TagPill from "@/components/TagPill/TagPill";
import type { Post } from "@/lib/types";

export type PostListRowProps = {
  post: Post;
};

const CATEGORY_NAMES: CategoryName[] = [
  "Front-end",
  "Back-end",
  "Ferramentas",
  "Design",
  "Programação",
];

const isCategoryName = (value: string | undefined): value is CategoryName =>
  value !== undefined && (CATEGORY_NAMES as string[]).includes(value);

// EC-04: sem categoria a faixa cai para `hairline`, ela não desaparece. A faixa é o que identifica
// a categoria à distância na lista, então removê-la mudaria o formato da linha por falta de dado.
const STRIPE_COLORS: Record<CategoryName, string> = {
  "Front-end": "bg-flame",
  "Back-end": "bg-mint",
  Ferramentas: "bg-sun",
  Design: "bg-ink-blue",
  Programação: "bg-ink",
};

/**
 * A linha da home. Compõe `CategoryBadge` e `TagPill` — a faixa de categoria e as pílulas NÃO são
 * redesenhadas aqui.
 */
export default function PostListRow({ post }: PostListRowProps) {
  const category = isCategoryName(post.category) ? post.category : undefined;
  const stripe = category === undefined ? "bg-hairline" : STRIPE_COLORS[category];

  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });

  return (
    <article className="flex gap-3 border-b-2 border-dotted border-hairline py-4">
      {/* Faixa vertical: a cor é a da categoria, e é o que se lê à distância na lista. */}
      <div className={`w-2 shrink-0 rounded-pill border-2 border-ink ${stripe}`} />

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {category !== undefined && <CategoryBadge category={category} />}
          {/* FR-024: a numeração aparece SÓ quando a série é informada. */}
          {post.series !== undefined && (
            <span className="inline-flex items-center rounded-pill border-2 border-dashed border-ink px-2 py-1 font-mono text-micro-cap text-ink">
              Série {post.seriesOrder ?? "—"}
            </span>
          )}
        </div>

        <h3 className="text-heading-md">
          {/* EC-02: três linhas na linha da home, truncado por limite de linhas. */}
          <Link href={`/posts/${post.slug}`} className="line-clamp-3">
            {post.title}
          </Link>
        </h3>

        {/* EC-03: resumo ausente sai do DOM, sem texto de substituição. */}
        {post.summary !== "" && (
          <p className="line-clamp-3 text-body-lg text-ink-soft">{post.summary}</p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} href={`/tags/${tag}`} />
            ))}
          </div>
        )}

        <p className="font-mono text-micro-cap text-ink-soft">{formattedDate}</p>
      </div>
    </article>
  );
}
