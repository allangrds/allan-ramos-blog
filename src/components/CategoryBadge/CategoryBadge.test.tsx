import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CategoryBadge, { type CategoryName } from "./CategoryBadge";

describe("CategoryBadge", () => {
  // FR-009: cada categoria resolve para a SUA cor fixa. O par de classes é o contrato, porque
  // é ele que carrega a decisão de contraste — texto `ink` nas três superfícies claras.
  it.each([
    ["Front-end", "bg-flame", "text-ink"],
    ["Back-end", "bg-mint", "text-ink"],
    ["Ferramentas", "bg-sun", "text-ink"],
    ["Design", "bg-ink-blue", "text-white"],
    ["Programação", "bg-ink", "text-white"],
  ] as [CategoryName, string, string][])(
    "%s resolve para %s com %s",
    (category, background, text) => {
      render(<CategoryBadge category={category} />);

      const badge = screen.getByText(category);
      expect(badge).toHaveClass(background);
      expect(badge).toHaveClass(text);
    },
  );

  // FR-008/FR-041: contraste é item de aceitação. Branco sobre `sun` dá 1,59:1 e sobre `mint`
  // 2,34:1 — este teste existe para que trocar o texto dessas três por branco REPROVE.
  it.each(["Front-end", "Back-end", "Ferramentas"] as CategoryName[])(
    "%s nunca usa texto branco",
    (category) => {
      render(<CategoryBadge category={category} />);

      expect(screen.getByText(category)).not.toHaveClass("text-white");
    },
  );

  it("a troca de 9px para 11px acontece em 1024px e em nenhum outro ponto", () => {
    render(<CategoryBadge category="Design" />);
    const badge = screen.getByText("Design");

    expect(badge).toHaveClass("text-micro-cap-sm");
    expect(badge).toHaveClass("lg:text-micro-cap");
    // FR-038a: nenhum outro ponto de corte.
    expect(badge.className).not.toMatch(/\b(sm|md|xl|2xl):/);
  });

  it("usa a família display em caixa alta", () => {
    render(<CategoryBadge category="Design" />);
    const badge = screen.getByText("Design");

    expect(badge).toHaveClass("font-display");
    expect(badge).toHaveClass("uppercase");
  });

  it("className recebido soma às classes próprias", () => {
    render(<CategoryBadge category="Design" className="mt-2" />);
    const badge = screen.getByText("Design");

    expect(badge).toHaveClass("mt-2");
    expect(badge).toHaveClass("rounded-pill");
  });
});
