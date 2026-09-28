import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TagPill from "./TagPill";

describe("TagPill", () => {
  // FR-040: link real, nunca div com manipulador de clique.
  it("renderiza <a href> de verdade", () => {
    render(<TagPill tag="react" href="/tags/react" />);

    const link = screen.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/tags/react");
  });

  // FR-022: o `#` é prefixo SEMPRE.
  it.each([
    { tag: "react", active: false, count: undefined },
    { tag: "node", active: true, count: undefined },
    { tag: "typescript", active: false, count: 12 },
  ])("prefixa a tag com # em todos os estados (%o)", ({ tag, active, count }) => {
    render(<TagPill tag={tag} href={`/tags/${tag}`} active={active} count={count} />);

    expect(screen.getByRole("link").textContent).toMatch(new RegExp(`^#${tag}`));
  });

  it("o contador aparece quando recebido", () => {
    render(<TagPill tag="react" href="/tags/react" count={12} />);

    expect(screen.getByText("12")).toBeInTheDocument();
  });

  // Contrato congelado: `count` ausente não pode deixar lacuna nem renderizar "undefined".
  it("contador ausente não deixa lacuna no rótulo", () => {
    render(<TagPill tag="react" href="/tags/react" />);

    expect(screen.getByRole("link").textContent).toBe("#react");
  });

  it("a pílula ativa se anuncia como página atual", () => {
    render(<TagPill tag="react" href="/tags/react" active />);

    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page");
  });

  it("a pílula inativa não tem aria-current", () => {
    render(<TagPill tag="react" href="/tags/react" />);

    expect(screen.getByRole("link")).not.toHaveAttribute("aria-current");
  });

  // FR-037: link real, então alvo >=44px na menor dimensão. `min-h-11` = 44px por `--spacing`.
  it("tem alvo de toque de 44px", () => {
    render(<TagPill tag="react" href="/tags/react" />);

    expect(screen.getByRole("link")).toHaveClass("min-h-11");
  });

  it("usa sempre a família monoespaçada", () => {
    render(<TagPill tag="react" href="/tags/react" />);

    expect(screen.getByRole("link")).toHaveClass("font-mono");
  });

  it("é alcançável por teclado", () => {
    render(<TagPill tag="react" href="/tags/react" />);

    const link = screen.getByRole("link");
    link.focus();

    expect(link).toHaveFocus();
    expect(link).not.toHaveAttribute("tabindex");
  });
});
