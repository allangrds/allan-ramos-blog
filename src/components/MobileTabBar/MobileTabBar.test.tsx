import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import MobileTabBar from "./MobileTabBar";

describe("MobileTabBar", () => {
  it("renderiza as cinco abas como links reais", () => {
    render(<MobileTabBar />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
    links.forEach((link) => expect(link).toHaveAttribute("href"));
  });

  it("activeHref marca exatamente uma aba", () => {
    render(<MobileTabBar activeHref="/sobre" />);

    const current = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");

    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName("Sobre");
  });

  // Divergência D-A: a barra é 74px e a aba preenche os 74px, porque FR-034 exige alvo de 74px
  // POR ABA — não os 62px que o card descreve. `h-18.5` é 74px pela escala de `--spacing`.
  it("cada aba tem alvo de 74px, não 62px", () => {
    render(<MobileTabBar />);

    screen.getAllByRole("link").forEach((link) => expect(link).toHaveClass("min-h-18.5"));
  });

  it("a barra tem 74px", () => {
    render(<MobileTabBar />);

    expect(screen.getByRole("navigation")).toHaveClass("h-18.5");
  });

  // FR-034: marca sobre o ícone ativo, para que a informação não dependa só de matiz.
  it("o ativo recebe marca sobre o ícone", () => {
    render(<MobileTabBar activeHref="/" />);

    expect(screen.getByRole("link", { name: "Feed" }).querySelector(".bg-ink")).not.toBeNull();
    expect(screen.getByRole("link", { name: "Tags" }).querySelector(".bg-ink")).toBeNull();
  });

  it("a região tem nome distinto do da SideRail", () => {
    render(<MobileTabBar />);

    expect(screen.getByRole("navigation")).toHaveAccessibleName("Navegação em telas pequenas");
  });
});
