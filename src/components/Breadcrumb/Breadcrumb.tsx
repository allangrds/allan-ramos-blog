import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  /** Ausente marca o item como a PÁGINA ATUAL, que por isso não é link. */
  href?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

/**
 * Server Component. O último item é a página atual e MUST NOT ser link: link para onde já se está
 * é uma parada de tabulação que não leva a nada. Ele se anuncia com `aria-current="page"`.
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className="flex flex-wrap items-center gap-1 font-mono text-micro-cap text-ink-soft">
        {items.map((item, position) => {
          const isLast = position === items.length - 1;

          return (
            <li key={`${item.label}-${position}`} className="flex items-center gap-1">
              {position > 0 && <ChevronRight size={14} aria-hidden="true" />}
              {item.href !== undefined && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-pill px-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="inline-flex min-h-11 items-center px-2 text-ink">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
