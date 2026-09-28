import { CodeXml } from "lucide-react";
import Link from "next/link";

import Avatar from "@/components/Avatar/Avatar";
import Container from "@/components/Container/Container";
import type { SearchIndexEntry } from "@/lib/types";

import SearchTrigger from "./SearchTrigger";

/**
 * Os CINCO destinos continuam aqui nesta feature (FR-013a), e isso é deliberado contra o
 * artboard: ele os move para a `SideRail` (desktop) e a `MobileTabBar` (celular), mas nenhuma das
 * duas pode ser montada enquanto `src/app/layout.tsx` está congelado compondo só
 * `Header`/`main`/`Footer`. Removê-los aqui deixaria as onze rotas SEM NAVEGAÇÃO, em 1280px e em
 * 390px — regressão que nenhum dos oito portões detecta, porque a página renderiza sem erro e sem
 * aviso. A transferência pertence à feature das rotas, junto da montagem das duas.
 *
 * `/search` continua na lista como link real: o gatilho do ⌘K só abre a `CommandPalette` a partir
 * da T044, e até lá tirá-lo daqui tornaria a rota inalcançável sem JavaScript.
 */
const NAV_LINKS = [
  { href: "/", label: "Posts" },
  { href: "/categorias", label: "Categorias" },
  { href: "/tags", label: "Tags" },
  { href: "/search", label: "Buscar" },
  { href: "/sobre", label: "Sobre" },
];

export type HeaderProps = {
  /**
   * Índice de busca. Opcional com padrão `[]`, que é o que mantém `Header()` CHAMÁVEL SEM
   * ARGUMENTO — o contrato congelado que `src/app/layout.tsx` consome (FR-016a). Daqui ele segue
   * para a ilha cliente, que é o único caminho legal até a `CommandPalette` (SC-015).
   */
  index?: SearchIndexEntry[];
  /**
   * Destino em que o leitor está, para distinguir o item ativo do inativo (FR-033). Opcional com
   * padrão `undefined`, então `Header()` segue chamável sem argumento e `layout.tsx` não muda.
   */
  activeHref?: string;
};

// O ativo ganha superfície própria em vez de só mudar de cor: cor sozinha seria o único
// portador da informação, e `paper` sobre `sun` com borda de 2px sobrevive a quem não distingue
// matiz.
const LINK_CLASSES = "inline-flex min-h-11 items-center rounded-pill px-3 text-body-lg";
const ACTIVE_CLASSES = "border-2 border-ink bg-paper font-bold";

/**
 * Server Component. Era Client Component inteiro, com `useState` para o menu de 390px; o estado
 * desceu para a ilha `SearchTrigger` e a diretiva saiu daqui. Subi-la de volta é violação do
 * Princípio III, mesmo que funcione.
 *
 * `TopBar` e `MobileHeader` dos artboards não são componentes novos: são as duas apresentações
 * responsivas DESTE componente, trocando em 1024px — 64px abaixo, 68px a partir dele (FR-038a).
 *
 * Sem alternador de tema (R9, FR-010): o artboard desenha um, e tema único foi decidido.
 */
export default function Header({ index = [], activeHref }: HeaderProps = {}) {
  return (
    <header className="border-b-2 border-ink bg-sun text-ink">
      <Container className="px-4 lg:px-6">
        <div className="flex h-16 items-center gap-3 lg:h-17">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-flame text-ink">
              <CodeXml size={19} aria-hidden="true" />
            </span>
            {/* O artboard desenha a marca em 14px (celular) e 18px (desktop), e NENHUM dos dois é
                escala declarada: as quatro de Archivo Black são 52, 30, 11 e 9. `display-md` é a
                mais próxima acima; descer para `micro-cap` deixaria a marca menor que o corpo. */}
            <span className="font-display text-display-md">allanramos</span>
            <span className="hidden font-mono text-micro-cap text-ink-soft lg:inline">/ blog</span>
          </Link>

          <div className="grow" />

          {/* Em 1024px os destinos vivem na própria faixa; abaixo dele descem para a segunda
              linha, e é por isso que a faixa mantém os 64px que o `MobileHeader` desenha. */}
          <nav aria-label="Navegação do site" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={link.href === activeHref ? "page" : undefined}
                    className={`${LINK_CLASSES} ${link.href === activeHref ? ACTIVE_CLASSES : ""}`.trim()}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <SearchTrigger index={index} />
          <Avatar name="Allan Ramos" size="md" className="hidden lg:inline-flex" />
        </div>

        {/* Sem JavaScript: os destinos estão no HTML servido, não atrás de um `useState`. */}
        <nav aria-label="Navegação do site em telas pequenas" className="lg:hidden">
          <ul className="flex flex-wrap items-center gap-1 pb-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={link.href === activeHref ? "page" : undefined}
                  className={`${LINK_CLASSES} ${link.href === activeHref ? ACTIVE_CLASSES : ""}`.trim()}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
