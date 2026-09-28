import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import InlineCode from "./InlineCode";

describe("InlineCode", () => {
  it("renderiza o elemento semântico <code>", () => {
    const { container } = render(<InlineCode>satisfies</InlineCode>);

    expect(container.firstElementChild?.tagName).toBe("CODE");
  });

  it("o conteúdo recebido aparece intacto", () => {
    const { container } = render(<InlineCode>npm run test</InlineCode>);

    expect(container.textContent).toBe("npm run test");
  });

  it("usa a família monoespaçada", () => {
    const { container } = render(<InlineCode>satisfies</InlineCode>);

    expect(container.firstElementChild).toHaveClass("font-mono");
  });

  // Decisão registrada: o tamanho é HERDADO do parágrafo, então o componente não pode declarar
  // uma escala própria. Este teste existe para que acrescentar uma reprove.
  it("não declara tamanho de texto próprio", () => {
    const { container } = render(<InlineCode>satisfies</InlineCode>);
    const classes = container.firstElementChild?.className ?? "";

    expect(classes).not.toMatch(/\btext-(display|heading|body|micro)/);
  });

  it("className recebido soma às classes próprias", () => {
    const { container } = render(<InlineCode className="mx-1">x</InlineCode>);
    const code = container.firstElementChild;

    expect(code).toHaveClass("mx-1");
    expect(code).toHaveClass("bg-sand");
  });
});
