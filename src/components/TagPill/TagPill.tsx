import Link from "next/link";

export type TagPillProps = {
  tag: string;
  href: string;
};

export default function TagPill({ tag, href }: TagPillProps) {
  return (
    <Link
      href={href}
      className="inline-block rounded-pill bg-canvas-cream border border-hairline px-3 py-1 text-caption text-ink hover:border-primary"
    >
      {tag}
    </Link>
  );
}
