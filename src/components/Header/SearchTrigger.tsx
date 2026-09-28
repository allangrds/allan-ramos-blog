"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import Kbd from "@/components/Kbd/Kbd";
import type { SearchIndexEntry } from "@/lib/types";

export type SearchTriggerProps = {
  /**
   * Índice de busca, RECEBIDO do `Header` e nunca buscado aqui (SC-015). É o único caminho legal
   * do índice até a `CommandPalette`, que a T044 liga a este mesmo estado `open`.
   */
  index?: SearchIndexEntry[];
};

/**
 * Ilha cliente mínima do `Header`. Ela existe para que o `Header` permaneça Server Component: é o
 * único arquivo desta dupla com `"use client"`, e o estado `open` vive aqui em vez de subir.
 * Mesmo padrão de `CodeBlock` (S) → `CopyButton` (C), que já existe no repositório.
 *
 * Subir a diretiva de volta para o `Header` é violação do Princípio III, mesmo que funcione.
 *
 * O `index` chega aqui mas AINDA não é consumido: quem o consome é a `CommandPalette`, e a T044 é
 * a tarefa que a liga a este mesmo estado `open`. Ele entra já nesta camada porque FR-016a o
 * declara o único caminho legal do índice até ela — e tê-lo agora deixa a fiação `Header` →
 * `SearchTrigger` provável por teste, de modo que a T044 só precise consumi-lo.
 *
 * O `eslint-disable` abaixo é o registro visível desse estado intermediário: ele MUST sair na T044,
 * junto com o primeiro uso real do índice. Sem ele o aviso entraria na linha de base do Portão 1,
 * que é de exatamente um aviso.
 */
export default function SearchTrigger({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- consumido pela CommandPalette na T044 (FR-016a)
  index = [],
}: SearchTriggerProps) {
  const [open, setOpen] = useState(false);

  // Um único botão para as duas apresentações, em vez de um por ponto de corte: dois elementos
  // dariam duas paradas de tabulação para o mesmo controle. Em 390px ele é redondo e só com
  // ícone (o `MobileHeader` desenha 40px, que sobe para 44px por FR-037); a partir de 1024px
  // ganha o rótulo e a tecla, virando a pílula que o `TopBar` desenha.
  return (
    <button
      type="button"
      onClick={() => setOpen((current) => !current)}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-label="Buscar"
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-full border-2 border-ink bg-paper text-body-lg font-bold text-ink lg:w-auto lg:rounded-pill lg:px-5"
    >
      <Search size={18} aria-hidden="true" />
      <span className="hidden lg:inline">Buscar</span>
      <Kbd className="hidden lg:inline-flex">⌘K</Kbd>
    </button>
  );
}
