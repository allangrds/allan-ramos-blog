import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Kbd from "./Kbd";

describe("Kbd", () => {
  it("renderiza o elemento semântico <kbd>", () => {
    const { container } = render(<Kbd>⌘K</Kbd>);

    expect(container.firstElementChild?.tagName).toBe("KBD");
  });

  it.each(["⌘K", "esc", "↵"])("o conteúdo %s aparece intacto", (key) => {
    const { container } = render(<Kbd>{key}</Kbd>);

    expect(container.textContent).toBe(key);
  });

  // FR-007: espessura única. O artboard desenha 1,5px (D-B) e aqui é 2px.
  it("usa a espessura de borda única do sistema", () => {
    const { container } = render(<Kbd>⌘K</Kbd>);

    expect(container.firstElementChild).toHaveClass("border-2");
  });

  it("className recebido soma às classes próprias", () => {
    const { container } = render(<Kbd className="ml-1">⌘K</Kbd>);
    const kbd = container.firstElementChild;

    expect(kbd).toHaveClass("ml-1");
    expect(kbd).toHaveClass("font-mono");
  });
});
