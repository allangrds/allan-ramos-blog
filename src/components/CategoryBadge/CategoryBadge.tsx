export type CategoryName =
  | "Front-end"
  | "Back-end"
  | "Ferramentas"
  | "Design"
  | "Programação";

export type CategoryBadgeProps = {
  category: CategoryName;
  className?: string;
};

/**
 * Uma cor fixa por categoria (FR-009). O texto NÃO é escolha estética:
 *
 * - sobre `flame`, `sun` e `mint` é SEMPRE `ink`, em qualquer tamanho. Medido, branco sobre `sun`
 *   dá 1,59:1 e sobre `mint` 2,34:1 — reprovam até o limite relaxado de 3:1;
 * - branco só é permitido sobre `ink`, `ink-blue`, `code-bg` e `brand-linkedin`.
 *
 * A borda de `Programação` é `paper` e não `ink` porque o fundo já é `ink`: borda `ink` sobre
 * fundo `ink` é borda invisível, e o artboard desenha essa inversão.
 */
const CATEGORY_CLASSES: Record<CategoryName, string> = {
  "Front-end": "border-ink bg-flame text-ink",
  "Back-end": "border-ink bg-mint text-ink",
  Ferramentas: "border-ink bg-sun text-ink",
  Design: "border-ink bg-ink-blue text-white",
  Programação: "border-paper bg-ink text-white",
};

// A redução responsiva sai dos tokens `--text-micro-cap-sm` (9px) e `--text-micro-cap` (11px),
// criados para isto na tarefa de tokens. `px` avulso aqui violaria o Princípio I e SC-004.
// A troca acontece no ponto de corte único de 1024px e em nenhum outro (FR-038a).
const BASE_CLASSES =
  "inline-flex items-center rounded-pill border-2 px-2 py-1 font-display uppercase text-micro-cap-sm lg:text-micro-cap";

export default function CategoryBadge({
  category,
  className = "",
}: CategoryBadgeProps) {
  const classes =
    `${BASE_CLASSES} ${CATEGORY_CLASSES[category]} ${className}`.trim();

  return <span className={classes}>{category}</span>;
}
