import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SideRail from "./SideRail";

describe("SideRail", () => {
  it("renderiza os cinco destinos como links reais", () => {
    render(<SideRail />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
    links.forEach((link) => {
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href");
    });
  });

  it.each(["Feed", "Categorias", "Tags", "Séries", "Sobre"])(
    "o destino %s está presente",
    (label) => {
      render(<SideRail />);

      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    },
  );

  // FR-033/US4/AS-1: o ativo é DISTINTO do inativo, e exatamente um.
  it("activeHref marca exatamente um destino", () => {
    render(<SideRail activeHref="/tags" />);

    const current = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");

    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName("Tags");
  });

  it("sem activeHref nenhum destino é o ativo", () => {
    render(<SideRail />);

    const current = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");

    expect(current).toHaveLength(0);
  });

  // O ativo não pode ser distinguido SÓ por cor: ele ganha caixa própria com sombra dura.
  it("o ativo se distingue por forma, não apenas por cor", () => {
    render(<SideRail activeHref="/" />);

    const active = screen.getByRole("link", { name: "Feed" });
    expect(active.querySelector(".shadow-hard")).not.toBeNull();

    const inactive = screen.getByRole("link", { name: "Tags" });
    expect(inactive.querySelector(".shadow-hard")).toBeNull();
  });

  it("todo destino tem alvo de toque de 44px", () => {
    render(<SideRail />);

    screen.getAllByRole("link").forEach((link) => expect(link).toHaveClass("min-h-11"));
  });

  // CHK031: nome de região distinto, senão `landmark-unique` reprova quando coexistir com as
  // outras navegações.
  it("a região tem nome acessível próprio", () => {
    render(<SideRail />);

    expect(screen.getByRole("navigation")).toHaveAccessibleName("Navegação principal");
  });
});
