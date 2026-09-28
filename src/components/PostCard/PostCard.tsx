import Link from "next/link";

import CategoryBadge, { type CategoryName } from "@/components/CategoryBadge/CategoryBadge";
import TagPill from "@/components/TagPill/TagPill";
import type { Post } from "@/lib/types";

export type PostCardSurface = "light" | "dark";

export type PostCardProps = {
  post: Post;
  /** Variante de DESENHO, não tema (FR-023): as duas coexistem na mesma página. */
  surface?: PostCardSurface;
};

// As duas são variantes de superfície entregues, então FR-041 exige contraste verificado nas
// DUAS. Na escura o texto principal é `--color-white`, permitido sobre `ink`; o secundário é
// `sand`, porque `ink-soft` sobre `ink` seria texto escuro sobre fundo escuro.
const SURFACE = {
  light: {
    card: "border-ink bg-paper text-ink shadow-hard",
    muted: "text-ink-soft",
    divider: "border-hairline",
  },
  dark: {
    // O artboard dá à escura uma sombra dura em `flame`, que NÃO é token: as duas sombras do
    // sistema são `hard` e `frame`, as duas em `ink`. `shadow-[...]` seria valor avulso, e a prosa
    // de SC-004 exige que sombra resolva para token nomeado. `shadow-hard` serve nas duas porque a
    // página é clara: a sombra `ink` continua visível contra `canvas`.
    card: "border-ink bg-ink text-white shadow-hard",
    muted: "text-sand",
    divider: "border-ink-soft",
  },
} as const;

const CATEGORY_NAMES: CategoryName[] = [
  "Front-end",
  "Back-end",
  "Ferramentas",
  "Design",
  "Programação",
];

const isCategoryName = (value: string | undefined): value is CategoryName =>
  value !== undefined && (CATEGORY_NAMES as string[]).includes(value);

// EC-04: sem categoria a faixa NÃO desaparece — ela cai para `hairline`. Some faria o card mudar
// de altura por ausência de dado, e o leitor leria isso como outro formato de card.
const STRIPE_COLORS: Record<CategoryName, string> = {
  "Front-end": "bg-flame",
  "Back-end": "bg-mint",
  Ferramentas: "bg-sun",
  Design: "bg-ink-blue",
  Programação: "bg-ink",
};

export default function PostCard({ post, surface = "light" }: PostCardProps) {
  const theme = SURFACE[surface];
  const category = isCategoryName(post.category) ? post.category : undefined;
  const stripe = category === undefined ? "bg-hairline" : STRIPE_COLORS[category];

  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });

  return (
    <article
      className={`overflow-hidden rounded-md border-2 ${theme.card}`}
    >
      <div className={`h-2 border-b-2 border-ink ${stripe}`} />

      <div className="flex flex-col gap-2 p-4">
        {(category !== undefined || post.series !== undefined) && (
          <div className="flex flex-wrap items-center gap-2">
            {category !== undefined && <CategoryBadge category={category} />}
            {post.series !== undefined && (
              <span className="inline-flex items-center rounded-pill border-2 border-dashed border-current px-2 py-1 font-mono text-micro-cap">
                Série {post.seriesOrder ?? "—"}
              </span>
            )}
          </div>
        )}

        {/* O TÍTULO é o link, e não o card inteiro: o card compõe `TagPill`, que é link por
            contrato congelado, e `<a>` dentro de `<a>` é HTML inválido que o axe reprova. O
            artboard desenha o card como um link só porque desenha as tags como `span`. */}
        <h3 className="text-heading-md">
          <Link href={`/posts/${post.slug}`} className="line-clamp-3">
            {post.title}
          </Link>
        </h3>

        {/* EC-03: resumo ausente NÃO vira texto de substituição nem lacuna — o bloco sai do DOM e
            o `gap` do flex colapsa o espaço sozinho. */}
        {post.summary !== "" && (
          <p className={`line-clamp-3 text-body-lg ${theme.muted}`}>{post.summary}</p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} href={`/tags/${tag}`} />
            ))}
          </div>
        )}

        {/* Só a data: o tipo `Post` não tem tempo de leitura, e o artboard desenha "6 min". Não
            existe origem para esse número, e inventá-lo seria dado fabricado (SC-015). */}
        <p
          className={`border-t-2 border-dotted pt-2 font-mono text-micro-cap ${theme.divider} ${theme.muted}`}
        >
          {formattedDate}
        </p>
      </div>
    </article>
  );
}
