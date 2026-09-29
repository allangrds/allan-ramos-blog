"use client";

import { ChevronDown, Pin } from "lucide-react";
import { useEffect, useState } from "react";

import IconButton from "@/components/IconButton/IconButton";

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export type TocProps = {
  items: TocItem[];
};

/**
 * Título em que o leitor está, acompanhando a rolagem. Devolve `undefined` enquanto nenhum
 * cabeçalho cruzou a faixa de observação — quem chama decide o padrão, porque o sumário nunca
 * pode ficar sem item ativo (a barra do celular anuncia o título ativo e ficaria muda).
 */
function useObservedHeadingId(items: TocItem[]): string | undefined {
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const ids = items.map((item) => item.id);
    const headingElements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        });

        const firstVisibleId = ids.find((id) => visibleIds.has(id));
        if (firstVisibleId) setActiveId(firstVisibleId);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );

    headingElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  return activeId;
}

const twoDigits = (value: number) => String(value).padStart(2, "0");

// O artboard desenha a barra do item ativo em 4px. Vira 2px pela mesma razão das 34 bordas de
// 1,5px (D-B): FR-007 fixa espessura ÚNICA no sistema, e o ativo não se distingue só por ela —
// ganha superfície `blush` e peso 700, então a informação sobrevive à mudança de espessura.
const ITEM_BASE = "flex min-h-11 items-center gap-3 border-l-2 pl-3 text-body-lg";
const ITEM_ACTIVE = "border-ink bg-blush font-bold text-ink";
const ITEM_IDLE = "border-hairline text-ink-soft";

/**
 * Client Component: `useState` do recolhido/aberto no celular e `IntersectionObserver` para o
 * item ativo no desktop — estado e API de browser, dois dos quatro gatilhos do Princípio III.
 *
 * Uma única região de navegação, com as duas apresentações de FR-027 dentro dela: abaixo de
 * 1024px a barra recolhível, a partir dele o painel fixo. Duas regiões seriam dois `landmark`
 * de mesmo nome, e a lista apareceria duas vezes para quem lê por tecnologia assistiva.
 */
export default function Toc({ items }: TocProps) {
  const [open, setOpen] = useState(false);
  const observedId = useObservedHeadingId(items);

  // EC-09: sem nenhum título o componente NÃO é renderizado — nunca uma casca vazia.
  if (items.length === 0) return null;

  // O primeiro título é o ativo enquanto a rolagem não disse outra coisa: no topo do post é onde
  // o leitor está, e sem este padrão a barra do celular abriria sem título nenhum para anunciar.
  const activeId = observedId ?? items[0].id;
  const activeIndex = Math.max(
    items.findIndex((item) => item.id === activeId),
    0,
  );

  return (
    <nav
      aria-label="Sumário"
      className="lg:rounded-md lg:border-2 lg:border-ink lg:bg-paper lg:p-4 lg:shadow-hard"
    >
      {/* Celular: barra recolhível (FR-027). O gatilho é um `IconButton`, não um botão
          redesenhado aqui — a forma do controle de ícone é decidida uma vez, na T006. */}
      <div className="flex items-center gap-2 rounded-pill border-2 border-ink bg-sun px-3 py-2 text-ink shadow-hard lg:hidden">
        <Pin size={16} aria-hidden="true" className="shrink-0" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-display text-micro-cap-sm uppercase">
            Sumário · {twoDigits(activeIndex + 1)} de {twoDigits(items.length)}
          </span>
          <span className="truncate text-body-lg font-bold">{items[activeIndex].text}</span>
        </span>
        <IconButton
          label={open ? "Recolher o sumário" : "Abrir o sumário"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          icon={<ChevronDown size={18} className={open ? "rotate-180" : undefined} />}
        />
      </div>

      {/* Desktop: cabeçalho do painel fixo. O selo "fixo" é o mesmo do artboard. */}
      <div className="hidden items-center gap-2 lg:flex">
        <span className="font-display text-micro-cap uppercase text-ink">Sumário</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-pill bg-sand px-2 py-1 font-mono text-micro-cap-sm text-ink">
          <Pin size={11} aria-hidden="true" />
          fixo
        </span>
      </div>

      {/* Uma lista só, com a visibilidade trocando no corte de 1024px: no celular ela depende do
          estado recolhido/aberto, no desktop está sempre aberta porque o painel é fixo. */}
      <ol
        className={`flex-col ${open ? "mt-3 flex" : "hidden lg:mt-3 lg:flex"}`}
      >
        {items.map((item, index) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id} style={{ paddingLeft: (item.level - 1) * 12 }}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`${ITEM_BASE} ${isActive ? ITEM_ACTIVE : ITEM_IDLE}`}
              >
                <span className="font-mono text-micro-cap text-ink-soft">{twoDigits(index + 1)}</span>
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
