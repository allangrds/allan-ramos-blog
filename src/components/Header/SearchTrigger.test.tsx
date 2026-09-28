import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SearchTrigger from "./SearchTrigger";

describe("SearchTrigger", () => {
  it("tem nome acessível", () => {
    render(<SearchTrigger />);

    expect(screen.getByRole("button", { name: "Buscar" })).toBeInTheDocument();
  });

  // O estado `open` é a razão de a ilha existir: é ele que não pode subir para o Header.
  it("o botão abre e fecha o estado open", () => {
    render(<SearchTrigger />);
    const button = screen.getByRole("button", { name: "Buscar" });

    expect(button).toHaveAttribute("aria-expanded", "false");

    // `fireEvent` em vez de `button.click()`: o clique cru não passa pelo `act` do React, então a
    // re-renderização não acontece e a asserção mediria o estado anterior.
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("anuncia que vai abrir um diálogo", () => {
    render(<SearchTrigger />);

    expect(screen.getByRole("button", { name: "Buscar" })).toHaveAttribute(
      "aria-haspopup",
      "dialog",
    );
  });

  // FR-037: o `MobileHeader` desenha o gatilho em 40px, que reprova o mínimo. Aqui é 44px.
  it("tem alvo de toque de 44px", () => {
    render(<SearchTrigger />);
    const button = screen.getByRole("button", { name: "Buscar" });

    expect(button).toHaveClass("h-11");
    expect(button).toHaveClass("w-11");
  });

  // Um único elemento para as duas apresentações: dois botões dariam duas paradas de tabulação
  // para o mesmo controle.
  it("é um único controle, não um por ponto de corte", () => {
    render(<SearchTrigger />);

    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("é alcançável por teclado sem tabindex artificial", () => {
    render(<SearchTrigger />);
    const button = screen.getByRole("button", { name: "Buscar" });

    button.focus();
    expect(button).toHaveFocus();
    expect(button).not.toHaveAttribute("tabindex");
  });
});
