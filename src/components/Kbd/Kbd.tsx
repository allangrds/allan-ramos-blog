import type { ReactNode } from "react";

export type KbdProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Tecla única, no elemento semântico `<kbd>`. Não é alvo de toque — é rótulo —, então o mínimo
 * de 44px de FR-037 não se aplica.
 *
 * O raio é `rounded-sm` (12px) e não os 6px do artboard: `DESIGN.md` §5 atribui `--radius-sm` a
 * "selo, pílula pequena, `Kbd`", então o sistema já decidiu. O artboard desenha a borda em 1,5px
 * (divergência D-B) e ela sobe para 2px, que é a espessura única do sistema.
 */
export default function Kbd({ children, className = "" }: KbdProps) {
  const classes =
    `inline-flex items-center rounded-sm border-2 border-ink bg-sand px-2 py-1 font-mono text-micro-cap font-bold text-ink ${className}`.trim();

  return <kbd className={classes}>{children}</kbd>;
}
