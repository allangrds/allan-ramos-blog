import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { CategoryName } from "@/components/CategoryBadge/CategoryBadge";
import CategoryCard from "./CategoryCard";

describe("CategoryCard", () => {
  it("a contagem exibida é a recebida", () => {
    render(<CategoryCard category="Front-end" count={3} />);

    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("contagem de dois dígitos não é preenchida com zero", () => {
    render(<CategoryCard category="Front-end" count={12} />);

    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("contagem zero aparece como 00, não como vazio", () => {
    render(<CategoryCard category="Design" count={0} />);

    expect(screen.getByText("00")).toBeInTheDocument();
  });

  it("é link real para a categoria", () => {
    render(<CategoryCard category="Front-end" count={3} />);

    const link = screen.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/categories/Front-end");
  });

  // Contraste: a contagem fica sobre a cor da categoria, então `ink` nas três claras e branco só
  // nas escuras. É o mesmo mapa do CategoryBadge.
  it.each([
    ["Front-end", "bg-flame", "text-ink"],
    ["Back-end", "bg-mint", "text-ink"],
    ["Ferramentas", "bg-sun", "text-ink"],
    ["Design", "bg-ink-blue", "text-white"],
    ["Programação", "bg-ink", "text-white"],
  ] as [CategoryName, string, string][])(
    "%s usa %s com %s",
    (category, background, text) => {
      render(<CategoryCard category={category} count={1} />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass(background);
      expect(link).toHaveClass(text);
    },
  );

  it.each(["Front-end", "Back-end", "Ferramentas"] as CategoryName[])(
    "%s nunca usa texto branco",
    (category) => {
      render(<CategoryCard category={category} count={1} />);

      expect(screen.getByRole("link")).not.toHaveClass("text-white");
    },
  );

  it("mostra os títulos recebidos", () => {
    render(
      <CategoryCard category="Front-end" count={2} titles={["Um título", "Outro"]} />,
    );

    expect(screen.getByText("Um título · Outro")).toBeInTheDocument();
  });

  it("sem títulos o bloco sai do DOM em vez de deixar lacuna", () => {
    const { container } = render(<CategoryCard category="Front-end" count={0} />);

    expect(container.querySelectorAll("span")).toHaveLength(2); // contagem + badge
  });

  it("tem alvo de toque de 44px", () => {
    render(<CategoryCard category="Front-end" count={1} />);

    expect(screen.getByRole("link")).toHaveClass("min-h-11");
  });
});
