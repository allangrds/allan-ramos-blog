import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Footer from "./Footer";

describe("Footer", () => {
  it("todo destino é link real", () => {
    render(<Footer />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href");
      expect(link.getAttribute("href")).not.toBe("");
    });
  });

  it("todo link tem alvo de toque de 44px", () => {
    render(<Footer />);

    screen.getAllByRole("link").forEach((link) => expect(link).toHaveClass("min-h-11"));
  });

  it.each(["Posts", "Categorias", "Tags"])("a seção %s está presente", (label) => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
  });

  it.each(["GitHub", "LinkedIn"])("a rede %s está presente e abre fora", (label) => {
    render(<Footer />);

    const link = screen.getByRole("link", { name: label });
    expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\//));
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("o atalho do design system está presente", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "Design system" })).toBeInTheDocument();
  });

  // Nenhum link aponta para rota que não existe: o Footer é composto por TODAS as rotas, então
  // um destino inventado daria 404 em toda página.
  it("nenhum link interno aponta para rota inexistente", () => {
    render(<Footer />);

    const internal = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href") ?? "")
      .filter((href) => href.startsWith("/"));

    expect(internal).toEqual(expect.arrayContaining(["/", "/categorias", "/tags", "/sobre"]));
    internal.forEach((href) => {
      expect(href).not.toMatch(/^\/(posts|series|rss)/);
    });
  });

  // As duas navegações têm nome próprio, senão `landmark-unique` reprova ao coexistirem.
  it("cada navegação tem nome acessível próprio", () => {
    render(<Footer />);

    const names = screen.getAllByRole("navigation").map((nav) => nav.getAttribute("aria-label"));
    expect(names).toEqual(["Seções", "Redes"]);
  });

  it("o ano do aviso de direitos é o corrente", () => {
    render(<Footer />);

    expect(screen.getByText(`© ${new Date().getFullYear()} Allan Ramos`)).toBeInTheDocument();
  });

  // SC-005: nenhum token aubergine sobrevive. O Footer era o último a consumi-los.
  it("não usa token da paleta anterior", () => {
    const { container } = render(<Footer />);

    expect(container.innerHTML).not.toMatch(
      /aubergine|on-primary|text-caption|link-blue|ink-mute|body-md/,
    );
  });
});
