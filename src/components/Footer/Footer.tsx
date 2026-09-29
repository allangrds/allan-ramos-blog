import Link from "next/link";

import Container from "@/components/Container/Container";

// Só rotas que EXISTEM hoje. `/posts` e `/series` não têm índice — o feed é a `/` —, e um link
// para rota inexistente seria 404 em TODA página, porque o `Footer` é composto por todas elas.
// É a diferença entre este componente e a `SideRail`, que pôde nomear `/series` por não ser
// montada por rota nenhuma enquanto `src/app/**` estiver congelado.
const SECTIONS = [
  { label: "Posts", href: "/" },
  { label: "Categorias", href: "/categorias" },
  { label: "Tags", href: "/tags" },
];

// O artboard escreve os nomes das redes em texto, sem ícone — então nenhum SVG de marca entra
// aqui. A regra de FR-028 (lucide não tem marcas, R2) continua valendo caso um dia entre.
// RSS consta do artboard e fica de fora: não existe rota de feed neste repositório, e inventar
// uma daria 404 em todas as páginas.
const NETWORKS = [
  { label: "GitHub", href: "https://github.com/allangrds" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/allangabrielrds/" },
];

// Sobre `ink`: branco 18.69, `sand` 14.62 e `sun` 11.74 — os três passam 4,5:1 (§3 de DESIGN.md,
// lido ao contrário porque a razão é simétrica). `ink-soft` NÃO pode ser usado aqui: dá 1.54.
const COLUMN_TITLE = "font-display text-micro-cap uppercase text-sun";
const LINK = "inline-flex min-h-11 items-center text-body-lg";

/** Server Component: links reais, sem estado. Contrato congelado — sem props. */
export default function Footer() {
  return (
    <footer className="px-6 py-8">
      <Container className="px-0">
        <div className="flex flex-col gap-8 rounded-sm bg-ink p-6 text-white lg:flex-row lg:gap-10">
          <div className="flex flex-col gap-2 lg:w-64 lg:shrink-0">
            <span className="font-display text-heading-md">allanramos.dev</span>
            <span className="text-body-lg text-sand">
              Escrito em MDX, servido por Next.js, sem newsletter e sem popup.
            </span>
          </div>

          <nav aria-label="Seções" className="flex flex-col gap-1">
            <span className={COLUMN_TITLE}>Seções</span>
            {SECTIONS.map(({ label, href }) => (
              <Link key={href} href={href} className={LINK}>
                {label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Redes" className="flex flex-col gap-1">
            <span className={COLUMN_TITLE}>Redes</span>
            {NETWORKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-start gap-2 lg:ml-auto lg:items-end">
            <span className="font-mono text-micro-cap text-sand">
              © {new Date().getFullYear()} Allan Ramos
            </span>
            {/* `ink` sobre `flame` dá 5.87; a borda em `paper` é o que separa o selo do fundo. */}
            <Link
              href="/sobre"
              className="inline-flex min-h-11 items-center rounded-pill border-2 border-paper bg-flame px-4 text-body-lg font-bold text-ink"
            >
              Design system
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
