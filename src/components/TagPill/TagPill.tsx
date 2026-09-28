import Link from "next/link";

export type TagPillProps = {
  tag: string;
  href: string;
  /** Pílula da tag em que o leitor já está. Opcional com padrão, para não quebrar o contrato. */
  active?: boolean;
  /** Quantidade de posts na tag. Opcional: ausente não deixa lacuna no rótulo. */
  count?: number;
  className?: string;
};

// `min-h-11` (44px) é o mínimo de alvo de toque de FR-037, e vale porque a pílula é um LINK REAL.
// O artboard desenha a pílula compacta (6px de recuo, ~20px de altura), que reprova o mínimo — a
// constituição prevalece sobre o mock, pelo mesmo critério que subiu o `Button` `md` de 40 a 44px.
//
// O corpo é `text-micro-cap` (11px) com `font-mono`: o artboard usa mono 12px, e 12px não é
// escala declarada. A família vem de FR-004 (mono para data, tag, código e métrica), e o tamanho
// da escala mais próxima — inventar `text-[12px]` violaria a prosa de SC-004.
const BASE_CLASSES =
  "inline-flex min-h-11 items-center gap-1 rounded-pill px-3 font-mono text-micro-cap";

// O padrão NÃO tem contorno no artboard, então não recebe `border-2`: FR-007a manda dar borda de
// 2px onde o desenho PREVÊ borda, e não onde ele não prevê.
const STATE_CLASSES = {
  default: "bg-sand text-ink",
  active: "border-2 border-ink bg-paper font-bold text-ink",
} as const;

export default function TagPill({
  tag,
  href,
  active = false,
  count,
  className = "",
}: TagPillProps) {
  const classes =
    `${BASE_CLASSES} ${active ? STATE_CLASSES.active : STATE_CLASSES.default} ${className}`.trim();

  return (
    <Link href={href} className={classes} aria-current={active ? "page" : undefined}>
      {/* O `#` é prefixo SEMPRE (FR-022), e é decorativo: não entra no nome da tag. */}
      <span aria-hidden="true">#</span>
      {tag}
      {count !== undefined && (
        <span className="text-ink-soft">{count}</span>
      )}
    </Link>
  );
}
