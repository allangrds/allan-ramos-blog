"use client";

import { useState } from "react";
import Link from "next/link";

import Container from "@/components/Container/Container";
import Button from "@/components/Button/Button";

const NAV_LINKS = [
  { href: "/", label: "Posts" },
  { href: "/categorias", label: "Categorias" },
  { href: "/tags", label: "Tags" },
  { href: "/search", label: "Buscar" },
  { href: "/sobre", label: "Sobre" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-canvas text-ink px-6 py-4 border-b border-hairline shadow-sm">
      <Container className="px-0">
        <nav className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center min-h-11 text-heading-sm font-bold">
            Allan Ramos
          </Link>
          <div className="hidden md:flex gap-4 text-body-md">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center min-h-11 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Button
            variant="secondary"
            size="md"
            className="md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label="Abrir menu"
          >
            Menu
          </Button>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden flex flex-col gap-3 mt-4 text-body-md">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center min-h-11 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </header>
  );
}
