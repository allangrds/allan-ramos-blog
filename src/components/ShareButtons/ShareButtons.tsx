import CopyLinkButton from "@/components/CopyLinkButton/CopyLinkButton";

export type ShareButtonsProps = {
  url: string;
  title: string;
};

/**
 * GitHub e LinkedIn **não** existem em `lucide-react`: a biblioteca tem 2118 ícones e zero
 * marcas (R2, verificado na instalação). FR-028 manda usar o SVG oficial de cada marca nesse
 * caso, e proíbe substituí-la por um ícone genérico.
 *
 * Os dois são caminhos com `fill="currentColor"` — **nenhuma cor própria**. É o que mantém a
 * régua 1 de SC-004 devolvendo vazio: a cor vem da superfície, e `brand-linkedin` é token.
 */
function GithubMark() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.6 5.63.6 11.9c0 5.02 3.25 9.27 7.76 10.77.57.1.78-.25.78-.55v-1.93c-3.16.69-3.83-1.34-3.83-1.34-.52-1.32-1.27-1.67-1.27-1.67-1.03-.71.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.52-.29-5.18-1.26-5.18-5.62 0-1.24.44-2.25 1.17-3.05-.12-.29-.51-1.45.11-2.99 0 0 .95-.3 3.12 1.16a10.9 10.9 0 0 1 5.68 0c2.17-1.46 3.12-1.16 3.12-1.16.62 1.54.23 2.7.11 2.99.73.8 1.17 1.81 1.17 3.05 0 4.37-2.67 5.33-5.2 5.61.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55a11.28 11.28 0 0 0 7.75-10.77C23.4 5.63 18.27.5 12 .5z" />
    </svg>
  );
}

function LinkedinMark() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

// Os destinos são os perfis do autor, como o artboard desenha — GitHub não tem endpoint de
// compartilhamento, então "compartilhar no GitHub" não existiria como link real.
const PROFILES = [
  {
    network: "GitHub",
    href: "https://github.com/allangrds",
    Mark: GithubMark,
    // Branco sobre `ink` dá 18.69 (§3 de DESIGN.md).
    surface: "bg-ink text-white",
  },
  {
    network: "LinkedIn",
    href: "https://www.linkedin.com/in/allangabrielrds/",
    Mark: LinkedinMark,
    // Branco sobre `brand-linkedin` dá 5.69.
    surface: "bg-brand-linkedin text-white",
  },
];

const ACTION_CLASSES =
  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-pill border-2 border-ink px-4 text-body-lg font-bold shadow-hard";

/**
 * Server Component — recusa deliberada da diretiva. Os dois primeiros são `<a href>` reais, que
 * não precisam de JavaScript, e a única ação que precisa já é a ilha `CopyLinkButton`. Marcar o
 * conjunto como cliente arrastaria dois links estáticos para o bundle sem nada em troca.
 */
export default function ShareButtons({ url, title }: ShareButtonsProps) {
  return (
    // `title` nomeia o GRUPO, não cada ação: é o post que está sendo compartilhado, e repetir o
    // título em três rótulos faria a tecnologia assistiva anunciá-lo três vezes. O nome da rede
    // fica inteiro no texto visível de cada ação, como FR-028 exige.
    <div
      role="group"
      aria-label={`Compartilhar “${title}”`}
      className="flex flex-wrap items-center gap-3"
    >
      <span className="font-display text-micro-cap uppercase text-ink">Compartilhar</span>

      {PROFILES.map(({ network, href, Mark, surface }) => (
        <a
          key={network}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${ACTION_CLASSES} ${surface}`}
        >
          <Mark />
          {network}
        </a>
      ))}

      <CopyLinkButton url={url} />
    </div>
  );
}
