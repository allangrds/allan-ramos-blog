import { House, Layers, LayoutGrid, Tag, User } from "lucide-react";
import Link from "next/link";

export type SideRailProps = {
  /** Destino em que o leitor está. Sem estado: o ativo vem por prop (Princípio III). */
  activeHref?: string;
};

/**
 * Os cinco destinos do artboard. `/series` ainda NÃO existe como rota de índice — hoje só
 * `/series/[series]` —, e isso não quebra nada nesta feature porque a `SideRail` não é montada
 * por rota nenhuma enquanto `src/app/**` está congelado. A feature das rotas MUST criar a rota
 * antes de montar este componente.
 */
const DESTINATIONS = [
  { href: "/", label: "Feed", Icon: House },
  { href: "/categorias", label: "Categorias", Icon: LayoutGrid },
  { href: "/tags", label: "Tags", Icon: Tag },
  { href: "/series", label: "Séries", Icon: Layers },
  { href: "/sobre", label: "Sobre", Icon: User },
];

// O ativo ganha CAIXA própria com sombra dura, e não só uma troca de cor: cor sozinha seria o
// único portador da informação. O inativo fica em `ink-soft`, sem caixa.
const ICON_BASE = "inline-flex h-10 w-11 items-center justify-center";
const ICON_ACTIVE = "rounded-sm border-2 border-ink bg-paper shadow-hard";

/**
 * Server Component: cinco links reais, ativo por prop, sem estado.
 *
 * Não existe no celular — abaixo de 1024px quem aparece é a `MobileTabBar` (FR-038a). Quem monta
 * as duas é responsável por esconder esta com `lg:` e não por removê-la do DOM.
 */
export default function SideRail({ activeHref }: SideRailProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="rounded-sm border-2 border-ink bg-sand p-2"
    >
      <ul className="flex flex-col gap-1">
        {DESTINATIONS.map(({ href, label, Icon }) => {
          const isActive = href === activeHref;

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 w-24 flex-col items-center gap-1 rounded-sm py-1 text-micro-cap ${
                  isActive ? "text-ink" : "text-ink-soft"
                }`}
              >
                <span className={`${ICON_BASE} ${isActive ? ICON_ACTIVE : ""}`.trim()}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
