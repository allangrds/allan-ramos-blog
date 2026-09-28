import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "lg" | "md";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = BaseProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type NativeButtonProps = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-expanded"?: boolean;
  "aria-label"?: string;
};

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-press",
  secondary:
    "border border-primary text-primary hover:bg-primary hover:text-on-primary",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  lg: "text-button-lg px-8 py-3",
  md: "text-button-md px-6 py-2",
};

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children } = props;
  const classes =
    `inline-flex items-center justify-center rounded-pill transition-colors ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`.trim();

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      onClick={props.onClick}
      aria-expanded={props["aria-expanded"]}
      aria-label={props["aria-label"]}
    >
      {children}
    </button>
  );
}
