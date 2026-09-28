"use client";

import { useEffect, useState } from "react";

export type ReadingProgressProps = {
  /**
   * Fração lida, de 0 a 100. Opcional: sem ela o componente CALCULA pela posição de rolagem; com
   * ela a story controla a fração de forma determinística, e sem isso os três estados de
   * US4/AS-5 não seriam demonstráveis no catálogo.
   */
  value?: number;
};

const clamp = (fraction: number) => Math.min(100, Math.max(0, Math.round(fraction)));

/**
 * Client Component: lê a posição de rolagem. `window` e o evento `scroll` são API de browser, que
 * é um dos quatro gatilhos que o Princípio III autoriza.
 *
 * Não declara consulta própria de movimento reduzido: a regra global de `globals.css` já cobre o
 * sistema inteiro (FR-042a, SC-016). Repetir a consulta aqui seria o 36º ponto de manutenção de
 * uma decisão que é uma — e a régua de SC-016 é um grep, então nem o NOME da consulta pode
 * aparecer neste arquivo, mesmo em comentário.
 */
export default function ReadingProgress({ value }: ReadingProgressProps) {
  const [scrolled, setScrolled] = useState(0);
  const isControlled = value !== undefined;

  useEffect(() => {
    if (isControlled) return;

    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollable <= 0 ? 0 : (window.scrollY / scrollable) * 100);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isControlled]);

  const fraction = clamp(isControlled ? value : scrolled);

  return (
    <div
      role="progressbar"
      aria-label="Progresso de leitura"
      aria-valuenow={fraction}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full border-b-2 border-ink bg-sand"
    >
      <div
        className="h-full bg-flame transition-[width]"
        style={{ width: `${fraction}%` }}
      />
    </div>
  );
}
