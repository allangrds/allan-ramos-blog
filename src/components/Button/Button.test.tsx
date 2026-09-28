import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Button from "./Button";

describe("Button", () => {
  it("renderiza <a href> quando recebe href", () => {
    render(<Button href="/sobre">Sobre mim</Button>);

    const link = screen.getByRole("link", { name: "Sobre mim" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/sobre");
  });

  it("renderiza <button> quando recebe onClick", () => {
    render(<Button onClick={() => {}}>Abrir</Button>);

    expect(screen.getByRole("button", { name: "Abrir" }).tagName).toBe("BUTTON");
  });

  // FR-040: elemento genérico com manipulador de clique é violação. As duas asserções acima
  // provam o elemento semântico; esta prova que não sobrou um terceiro caminho.
  it("nunca renderiza elemento genérico com manipulador de clique", () => {
    const { container } = render(<Button onClick={() => {}}>Abrir</Button>);

    expect(container.querySelector("div[onclick], span[onclick]")).toBeNull();
  });

  it("impede o clique quando desabilitado", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        disabled
      </Button>,
    );

    const button = screen.getByRole("button", { name: "disabled" });
    expect(button).toBeDisabled();

    button.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  // FR-037/SC-008: a menor dimensão do alvo é >=44px nos DOIS tamanhos. jsdom não faz layout,
  // então a asserção é sobre a classe de altura que resolve a dimensão — `h-12` = 48px e
  // `h-11` = 44px pela escala de `--spacing`. A dimensão renderizada de verdade é medida pelo
  // Portão 4, onde a regra `target-size` roda em navegador real.
  it.each([
    ["lg", "h-12"],
    ["md", "h-11"],
  ] as const)("tamanho %s tem altura de alvo >=44px (%s)", (size, heightClass) => {
    render(
      <Button onClick={() => {}} size={size}>
        alvo
      </Button>,
    );

    expect(screen.getByRole("button", { name: "alvo" })).toHaveClass(heightClass);
  });

  it("é alcançável por teclado", () => {
    render(<Button onClick={() => {}}>Foco</Button>);

    const button = screen.getByRole("button", { name: "Foco" });
    button.focus();

    expect(button).toHaveFocus();
    // Elemento nativo: não recebe tabindex artificial, então a ordem é a do DOM (CHK032).
    expect(button).not.toHaveAttribute("tabindex");
  });

  it("desabilitado sai da ordem de foco", () => {
    render(
      <Button onClick={() => {}} disabled>
        disabled
      </Button>,
    );

    const button = screen.getByRole("button", { name: "disabled" });
    button.focus();

    expect(button).not.toHaveFocus();
  });

  it("o ícone é decorativo e não entra no nome acessível", () => {
    render(
      <Button onClick={() => {}} icon={<svg data-testid="icone" />}>
        Ler agora
      </Button>,
    );

    // O nome acessível é só o rótulo: o ícone está sob aria-hidden.
    const button = screen.getByRole("button", { name: "Ler agora" });
    expect(screen.getByTestId("icone").closest("[aria-hidden='true']")).not.toBeNull();
    expect(button).toHaveTextContent("Ler agora");
  });

  it("className recebido soma às classes próprias em vez de substituí-las", () => {
    render(
      <Button onClick={() => {}} className="flex-1">
        Anterior
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Anterior" });
    expect(button).toHaveClass("flex-1");
    expect(button).toHaveClass("rounded-pill");
  });
});
