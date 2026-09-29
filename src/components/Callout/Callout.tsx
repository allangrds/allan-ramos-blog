import { Check, Info } from "lucide-react";
import type { ReactNode } from "react";

export type CalloutKind = "note" | "quote" | "checklist";

export type CalloutProps = {
  kind: CalloutKind;
  title?: string;
  children: ReactNode;
};

const TITLE_CLASSES = "mb-1 block font-display text-micro-cap uppercase";

// Cada tipo tem superfície própria, e em todas o texto é `ink`: sobre `sun` dá 11.74 e sobre
// `blush` 16.67 (§3 de DESIGN.md). A regra "sobre flame, sun e mint o texto é SEMPRE ink" é o
// que decide isto, não uma escolha por tipo.
const SURFACE = "rounded-md border-2 border-ink p-4 text-body-lg text-ink";

/**
 * Server Component: render puro dos três tipos de FR-029. Cada tipo sai num elemento
 * **semanticamente distinto** — a citação é `<blockquote>`, a nota é `<aside>` e o item de
 * checklist é um parágrafo com a marca de conferido. Distinguir só por cor deixaria os três
 * iguais para quem não enxerga a superfície.
 *
 * O artboard desenha a citação com a borda esquerda em 10px. Vira `border-2` como as 34 bordas
 * de 1,5px da divergência D-B: FR-007 fixa espessura única, e a citação continua distinta pelo
 * elemento, pela superfície `blush` e pelo itálico.
 */
export default function Callout({ kind, title, children }: CalloutProps) {
  if (kind === "quote") {
    return (
      <blockquote className={`${SURFACE} bg-blush italic`}>
        {title && <span className={TITLE_CLASSES}>{title}</span>}
        {children}
      </blockquote>
    );
  }

  if (kind === "checklist") {
    return (
      <p className="flex items-start gap-3 text-body-lg text-ink">
        <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-mint">
          <Check size={13} aria-hidden="true" />
        </span>
        <span>
          {title && <span className={TITLE_CLASSES}>{title}</span>}
          {children}
        </span>
      </p>
    );
  }

  return (
    <aside className={`${SURFACE} flex items-start gap-3 bg-sun`}>
      <Info size={20} aria-hidden="true" className="mt-1 shrink-0" />
      <span>
        {title && <span className={TITLE_CLASSES}>{title}</span>}
        {children}
      </span>
    </aside>
  );
}
