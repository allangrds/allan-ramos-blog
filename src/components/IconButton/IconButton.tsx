import Link from "next/link";
import type { ReactNode } from "react";

export type IconButtonVariant = "neutral" | "accent" | "brand";

type BaseProps = {
  /**
   * Nome acessível do controle, OBRIGATÓRIO. O ícone carrega o único significado do botão, e
   * ícone sem nome deixa o controle mudo para tecnologia assistiva (FR-036a).
   */
  label: string;
  icon: ReactNode;
  variant?: IconButtonVariant;
  className?: string;
};

type LinkIconButtonProps = BaseProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type NativeIconButtonProps = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-expanded"?: boolean;
};

export type IconButtonProps = LinkIconButtonProps | NativeIconButtonProps;

// `size-11` é 44px pela escala de `--spacing`, que é o mínimo de alvo de toque de FR-037 — aqui
// ele é a dimensão do componente, não um piso que o conteúdo pode furar.
const BASE_CLASSES =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2";

// A cor do anel de foco não aparece aqui: sai da regra por superfície de `globals.css`.
const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  neutral: "border-ink bg-paper text-ink",
  accent: "border-ink bg-sun text-ink",
  brand: "border-ink bg-brand-linkedin text-white",
};

export default function IconButton(props: IconButtonProps) {
  const { label, icon, variant = "neutral", className = "" } = props;
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`.trim();

  // O ícone é decorativo PORQUE o nome vem de `aria-label`: sem isto o leitor de tela
  // anunciaria o nome do arquivo do SVG junto do rótulo.
  const content = (
    <span aria-hidden="true" className="inline-flex">
      {icon}
    </span>
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      onClick={props.onClick}
      aria-label={label}
      aria-expanded={props["aria-expanded"]}
    >
      {content}
    </button>
  );
}
