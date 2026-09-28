import Image from "next/image";
import { User } from "lucide-react";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  /** Nome de quem aparece. Origem das iniciais quando não há foto. */
  name?: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
};

// `lg` é UM componente com classe responsiva, não dois componentes nem duas props (FR-020, R8):
// 78px em 390px e 108px no desktop, trocando no ponto de corte único de 1024px. `size-19.5` e
// `size-27` resolvem por `--spacing` (19,5 × 4px = 78; 27 × 4px = 108), então nenhum px avulso
// entra no componente.
const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "size-8 text-micro-cap",
  md: "size-11 text-body-lg",
  lg: "size-19.5 text-display-md lg:size-27",
};

// O tamanho do marcador neutro acompanha o do círculo. Em `sm` o ícone ocupa quase todo o
// espaço porque 32px não cabe mais do que isso.
const MARKER_SIZE: Record<AvatarSize, number> = { sm: 16, md: 22, lg: 40 };

/**
 * Deriva as iniciais do nome: primeira letra do primeiro e do último termo, no máximo duas.
 * Devolve string vazia quando não há nada aproveitável, e é isso que dispara EC-01.
 */
export function initialsOf(name: string | undefined): string {
  if (name === undefined) return "";

  const words = name.trim().split(/\s+/).filter((word) => /\p{L}/u.test(word));
  if (words.length === 0) return "";

  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";

  return `${first}${last}`.toUpperCase();
}

export default function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = initialsOf(name);
  const classes =
    `relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-mint font-display text-ink ${SIZE_CLASSES[size]} ${className}`.trim();

  if (src !== undefined) {
    return (
      <span className={classes}>
        {/* `alt` vazio quando não há nome: a foto é decorativa e o nome vem do contexto. */}
        <Image src={src} alt={name ?? ""} fill className="object-cover" />
      </span>
    );
  }

  // EC-01: sem foto E sem nome aproveitável o círculo recebe um MARCADOR NEUTRO, nunca um
  // círculo vazio nem uma string vazia dentro dele. `aria-hidden` porque o marcador não
  // acrescenta informação — quem é a pessoa vem do texto ao lado.
  if (initials === "") {
    return (
      <span className={classes}>
        <User size={MARKER_SIZE[size]} aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className={classes} aria-hidden="true">
      {initials}
    </span>
  );
}
