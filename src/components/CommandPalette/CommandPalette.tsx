"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import EmptyState from "@/components/EmptyState/EmptyState";
import Kbd from "@/components/Kbd/Kbd";
// Importa a função PURA, nunca `src/lib/search-index.ts`: `getSearchIndex()` chama
// `getAllPosts()`, que lê o sistema de arquivos, e módulo de servidor dentro de Client Component
// reprova o Portão 6 (FR-031a). Importar não é alterar, logo SC-011 segue intacto.
import { searchIndex } from "@/lib/search";
import type { SearchIndexEntry } from "@/lib/types";

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Índice RECEBIDO por propriedade (FR-016a, SC-015). Nenhum componente busca dado. */
  index?: SearchIndexEntry[];
};

/** Quantos trechos do post casam com o que foi digitado. É o "3 trechos" do artboard. */
function excerptCount(entry: SearchIndexEntry, query: string): number {
  const haystack = [entry.title, entry.summary, ...entry.tags, entry.bodyText]
    .join(" ")
    .toLowerCase();

  return haystack.split(query.trim().toLowerCase()).length - 1;
}

/**
 * Client Component: estado do campo e escuta de teclado — dois dos quatro gatilhos do
 * Princípio III.
 *
 * `open` é **controlado por propriedade** para que a story mostre os três estados de FR-031 de
 * forma determinística; com estado interno, "fechada", "com resultado" e "vazia" dependeriam de
 * digitar dentro da apresentação e nenhum deles seria demonstrável no catálogo.
 *
 * **A linha de dica do artboard — "↑↓ navegar · ↵ abrir · tab filtrar" — não é portada.** Nenhum
 * FR pede navegação por seta, e exibir a promessa sem a implementação seria dizer ao leitor que
 * uma tecla faz algo que ela não faz. Ela volta junto com o comportamento, não antes.
 */
export default function CommandPalette({ open, onOpenChange, index = [] }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  // A escuta vive fora do `open` porque ⌘K precisa ABRIR: um efeito que só rodasse com a folha
  // aberta nunca veria o atalho que a abre.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
        return;
      }

      if (event.key === "Escape" && open) onOpenChange(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  // Foca e SELECIONA ao abrir. A busca anterior sobrevive ao fechamento de propósito — reabrir
  // logo depois costuma ser para refinar o mesmo termo —, e a seleção faz a primeira tecla
  // substituí-la, de modo que manter não custa nada a quem quer começar de novo.
  useEffect(() => {
    if (open) inputRef.current?.select();
  }, [open]);

  // Estado FECHADA: nada no documento. Uma folha escondida por CSS continuaria sendo parada de
  // tabulação e conteúdo anunciado por leitor de tela.
  if (!open) return null;

  const results = searchIndex(index, query);
  const typed = query.trim().length > 0;

  return (
    // Em 390px a folha ocupa a tela inteira (US7/AS-2); a partir de 1024px vira painel centrado.
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas lg:items-center lg:justify-start lg:bg-transparent lg:pt-24">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar"
        className="flex min-h-0 flex-1 flex-col overflow-hidden border-2 border-ink bg-paper lg:h-auto lg:max-h-[32rem] lg:w-full lg:max-w-2xl lg:flex-none lg:rounded-md lg:shadow-hard"
      >
        <div className="flex shrink-0 items-center gap-3 border-b-2 border-ink px-4 py-3">
          <Search size={18} aria-hidden="true" className="shrink-0 text-ink" />
          <label htmlFor={inputId} className="sr-only">
            Buscar
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por título, resumo ou tag"
            className="min-h-11 min-w-0 flex-1 bg-transparent text-body-lg text-ink outline-none"
          />
          {/* A dica `esc` é do desktop; em 390px quem fecha é o × (US7/AS-2). */}
          <Kbd className="hidden shrink-0 lg:inline-flex">esc</Kbd>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Fechar a busca"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sand text-ink lg:hidden"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {results.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {results.map((entry) => {
                const count = excerptCount(entry, query);

                return (
                  <li key={entry.slug}>
                    <Link
                      href={`/posts/${entry.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="flex min-h-11 items-center gap-3 rounded-sm px-3 py-2 text-body-lg text-ink"
                    >
                      <span
                        aria-hidden="true"
                        className="size-2 shrink-0 rounded-full border-2 border-ink bg-flame"
                      />
                      <span className="min-w-0 flex-1 truncate">{entry.title}</span>
                      <span className="shrink-0 font-mono text-micro-cap text-ink-soft">
                        {`${count} ${count === 1 ? "trecho" : "trechos"}`}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            // EC-11 e o estado VAZIA caem no mesmo convite: índice ausente e busca sem
            // correspondência são o mesmo nada para quem lê. FR-032 proíbe a contagem nos dois.
            <EmptyState
              title={typed ? "Nada com essa palavra, ainda" : "Busque por título, resumo ou tag"}
              hint={typed ? "tente outro termo" : "o índice é gerado no build"}
            />
          )}
        </div>
      </div>
    </div>
  );
}
