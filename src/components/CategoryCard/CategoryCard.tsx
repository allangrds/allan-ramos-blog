import Link from "next/link";

import CategoryBadge, { type CategoryName } from "@/components/CategoryBadge/CategoryBadge";

export type CategoryCardProps = {
  category: CategoryName;
  /** Quantos posts moram na categoria. Exibida em display, sobre a cor da categoria. */
  count: number;
  /** Títulos que moram nela, para dar amostra do conteúdo. */
  titles?: string[];
};

/**
 * Card colorido com a contagem e os títulos que moram na categoria.
 *
 * ⚠️ Contraste: a contagem em display fica SOBRE a cor da categoria, então o texto é `ink` nas três
 * superfícies claras (`flame`, `sun`, `mint`) e branco só nas escuras (`ink-blue`, `ink`). É o
 * mesmo mapa do `CategoryBadge`, e por isso ele é a fonte: duplicar o mapa aqui deixaria dois
 * lugares para manter uma decisão.
 */
const SURFACES: Record<CategoryName, string> = {
  "Front-end": "bg-flame text-ink",
  "Back-end": "bg-mint text-ink",
  Ferramentas: "bg-sun text-ink",
  Design: "bg-ink-blue text-white",
  Programação: "bg-ink text-white",
};

export default function CategoryCard({
  category,
  count,
  titles = [],
}: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category}`}
      className={`flex min-h-11 flex-col gap-2 rounded-lg border-2 border-ink p-4 shadow-hard ${SURFACES[category]}`}
    >
      {/* A contagem em display, com dois dígitos como o artboard desenha. */}
      <span className="font-display text-display-md">
        {String(count).padStart(2, "0")}
      </span>

      <CategoryBadge category={category} />

      {titles.length > 0 && (
        <span className="line-clamp-2 text-body-lg">{titles.join(" · ")}</span>
      )}
    </Link>
  );
}
