import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { Post } from "@/lib/types";

export type FeaturedAccent = "sun" | "flame" | "mint";

export type FeaturedPostCardProps = {
  post: Post;
  /** Cor de acento do destaque. API livre: FR-016 não lista este componente. */
  accent?: FeaturedAccent;
};

/**
 * Só o último post, com o título em display sobre a cor de acento (FR-025).
 *
 * ⚠️ PONTO DE MAIOR RISCO DE CONTRASTE DA FEATURE. Título branco sobre `sun` dá **1,59:1** e sobre
 * `mint` **2,34:1** — reprovam ATÉ o limite relaxado de 3:1, em qualquer tamanho. Por isso o texto
 * é `ink` nas TRÊS cores de acento, sem exceção e sem prop que permita trocá-lo. As três são
 * superfícies claras; branco só é permitido sobre `ink`, `ink-blue`, `code-bg` e `brand-linkedin`.
 */
const ACCENT_SURFACES: Record<FeaturedAccent, string> = {
  sun: "bg-sun",
  flame: "bg-flame",
  mint: "bg-mint",
};

export default function FeaturedPostCard({
  post,
  accent = "sun",
}: FeaturedPostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });

  return (
    <article
      className={`rounded-xl border-2 border-ink p-6 text-ink shadow-frame ${ACCENT_SURFACES[accent]}`}
    >
      <p className="font-display text-micro-cap uppercase">Último post</p>

      {/* O título é `ink` em toda cor de acento. Não existe caminho no componente que o torne
          branco: é o que impede a regressão de contraste que FR-041 e SC-007 proíbem. */}
      <h2 className="mt-3 text-display-md text-ink">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>

      {/* EC-03: resumo ausente sai do DOM. */}
      {post.summary !== "" && (
        <p className="mt-3 text-body-lg text-ink">{post.summary}</p>
      )}

      <p className="mt-4 flex items-center gap-2 font-mono text-micro-cap text-ink">
        {formattedDate}
        <ArrowRight size={16} aria-hidden="true" />
      </p>
    </article>
  );
}
