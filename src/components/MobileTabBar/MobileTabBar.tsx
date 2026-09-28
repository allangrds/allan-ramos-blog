import { House, Layers, LayoutGrid, Tag, User } from "lucide-react";
import Link from "next/link";

export type MobileTabBarProps = {
  /** Destino em que o leitor está. Ativo por prop, não por `usePathname()` — ver nota abaixo. */
  activeHref?: string;
};

const DESTINATIONS = [
  { href: "/", label: "Feed", Icon: House },
  { href: "/categorias", label: "Categorias", Icon: LayoutGrid },
  { href: "/tags", label: "Tags", Icon: Tag },
  { href: "/series", label: "Séries", Icon: Layers },
  { href: "/sobre", label: "Sobre", Icon: User },
];

/**
 * Server Component — e a diretiva é RECUSADA de propósito. Ela só seria necessária para chamar
 * `usePathname()`. Recebendo `activeHref` por prop não há estado, efeito, handler criado
 * localmente nem API de browser, e o Princípio III só autoriza a diretiva de cliente quando há um
 * desses. Nesta feature o componente nunca é ligado a rota, então `usePathname()` seria
 * especulativo (Princípio V). Se a feature das rotas preferir `usePathname()`, a diretiva entra
 * lá, no componente que a precisar.
 *
 * **Divergência D-A, medida**: a BARRA é 74px e cada ABA é 62px nos artboards de página. Não é
 * conflito de fontes — são medidas de coisas diferentes. FR-034 exige alvo de 74px por aba, então
 * a aba PREENCHE os 74px da barra. `h-18.5` é 74px pela escala de `--spacing`.
 */
export default function MobileTabBar({ activeHref }: MobileTabBarProps) {
  return (
    <nav
      aria-label="Navegação em telas pequenas"
      className="h-18.5 border-t-2 border-ink bg-paper"
    >
      <ul className="flex h-full">
        {DESTINATIONS.map(({ href, label, Icon }) => {
          const isActive = href === activeHref;

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-full min-h-18.5 flex-col items-center justify-center gap-1 text-micro-cap-sm ${
                  isActive ? "text-ink" : "text-ink-soft"
                }`}
              >
                {/* A MARCA sobre o ícone ativo (FR-034). Ela é o portador redundante da
                    informação: quem não distingue matiz ainda vê a barra. */}
                <span
                  aria-hidden="true"
                  className={`h-1 w-6 rounded-pill ${isActive ? "bg-ink" : "bg-transparent"}`}
                />
                <Icon size={20} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
