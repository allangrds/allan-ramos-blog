import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "accent";
export type ButtonSize = "lg" | "md";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ícone decorativo à esquerda do rótulo. Recebe `aria-hidden` do próprio Button. */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = BaseProps & {
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
};

type NativeButtonProps = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-expanded"?: boolean;
  "aria-label"?: string;
};

export type ButtonProps = LinkButtonProps | NativeButtonProps;

// Largura cheia abaixo do ponto de corte único de 1024px, automática a partir dele (FR-039):
// em 390px o botão isolado ocupa a linha. Um par de ações irmãs divide a linha porque o pai
// é um flex e cada botão recebe `flex-1` pelo `className` — o componente não precisa saber
// se está sozinho.
const BASE_CLASSES =
  "inline-flex w-full items-center justify-center gap-2 rounded-pill border-2 text-body-lg font-bold lg:w-auto";

// A cor do anel de foco NÃO aparece aqui: ela é resolvida por superfície na regra de sistema de
// `globals.css` (FR-018b, ponto único). `bg-ink` e `bg-sun` já dizem ao sistema qual anel usar.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "border-ink bg-ink text-paper shadow-hard",
  secondary: "border-ink bg-paper text-ink shadow-hard",
  accent: "border-ink bg-sun text-ink shadow-hard",
};

// `md` é 44px (`h-11`), não os 40px do artboard: 40 reprova o mínimo de alvo de toque, que é
// MUST no Princípio IV e incondicional em FR-037. A constituição prevalece sobre o mock (FR-017).
const SIZE_CLASSES: Record<ButtonSize, string> = {
  lg: "h-12 px-5",
  md: "h-11 px-4",
};

// Sem sombra e sem preenchimento: o artboard desenha o desabilitado como contorno tracejado.
// As cores são as duas mais próximas entre as doze — `hairline` no traço e `ink-soft` no
// rótulo. Os dois valores do artboard (um bege médio no traço, um cinza-terra no rótulo) não
// são tokens, e hex literal em componente reprovaria a régua 1 de SC-004.
const DISABLED_CLASSES =
  "cursor-not-allowed border-dashed border-hairline bg-transparent text-ink-soft";

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    icon,
    className = "",
    children,
  } = props;

  const isDisabled = props.href === undefined && props.disabled === true;
  const stateClasses = isDisabled ? DISABLED_CLASSES : VARIANT_CLASSES[variant];
  const classes = `${BASE_CLASSES} ${stateClasses} ${SIZE_CLASSES[size]} ${className}`.trim();

  const content = (
    <>
      {icon !== undefined && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      )}
      {children}
    </>
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      onClick={props.onClick}
      disabled={isDisabled}
      aria-expanded={props["aria-expanded"]}
      aria-label={props["aria-label"]}
    >
      {content}
    </button>
  );
}
