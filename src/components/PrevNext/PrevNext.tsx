import Link from "next/link";

export type PrevNextItem = {
  href: string;
  title: string;
  /** Linha de contexto já pronta, ex.: "Back-end · 06 set 2022". Ausente, a linha é omitida. */
  meta?: string;
};

export type PrevNextProps = {
  prev?: PrevNextItem;
  next?: PrevNextItem;
};

const CARD_BASE = "flex flex-1 flex-col gap-1 rounded-md border-2 border-ink p-4 shadow-hard";
const LABEL = "font-display text-micro-cap uppercase";

// O artboard dá ao "próximo" uma sombra dura em `flame`, que NÃO é token: as duas sombras do
// sistema são `hard` e `frame`, as duas em `ink`. É a mesma situação que o `PostCard` escuro
// resolveu na T021, e a decisão se repete aqui para não haver duas respostas à mesma pergunta —
// `shadow-hard` serve porque a página é clara e a sombra `ink` continua visível contra `canvas`.
//
// Sobre `ink`, medido na régua de FR-041b: branco 18.69, `sand` 14.62 e `sun` 11.74 — os três
// passam 4,5:1. Os dois últimos são a linha `ink` da tabela de §3 lida ao contrário, porque a
// razão de contraste é simétrica.
const SURFACE = {
  prev: "bg-paper text-ink",
  next: "bg-ink text-white",
} as const;

const META = { prev: "text-ink-soft", next: "text-sand" } as const;

/**
 * Server Component: dois links reais, sem estado.
 *
 * Vizinho ausente **omite o lado inteiro**, e os cards restantes ocupam a largura — um espaço
 * reservado para o que não existe seria exatamente a lacuna que a tarefa proíbe.
 */
export default function PrevNext({ prev, next }: PrevNextProps) {
  if (prev === undefined && next === undefined) return null;

  const cards = [
    { side: "prev" as const, item: prev, label: "← Anterior", align: "text-left" },
    { side: "next" as const, item: next, label: "Próximo →", align: "text-right" },
  ];

  return (
    <nav aria-label="Posts vizinhos" className="flex flex-col gap-3 lg:flex-row">
      {cards.map(({ side, item, label, align }) =>
        item === undefined ? null : (
          <Link
            key={side}
            href={item.href}
            className={`${CARD_BASE} ${SURFACE[side]} ${align}`}
          >
            <span className={`${LABEL} ${side === "next" ? "text-sun" : "text-ink-soft"}`}>
              {label}
            </span>
            <span className="text-body-lg font-bold">{item.title}</span>
            {item.meta && <span className={`font-mono text-micro-cap ${META[side]}`}>{item.meta}</span>}
          </Link>
        ),
      )}
    </nav>
  );
}
