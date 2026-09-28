import { render, screen } from "@testing-library/react";
import { Search } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import IconButton from "./IconButton";

const icon = <Search size={20} />;

describe("IconButton", () => {
  it("o label vira o nome acessível do controle", () => {
    render(<IconButton label="Buscar" icon={icon} onClick={() => {}} />);

    expect(screen.getByRole("button", { name: "Buscar" })).toBeInTheDocument();
  });

  // FR-036a: o ícone carrega o único significado do controle, então ele NÃO pode ser a única
  // fonte do nome nem entrar no nome acessível por conta própria.
  it("o ícone é escondido de tecnologia assistiva", () => {
    const { container } = render(
      <IconButton label="Buscar" icon={icon} onClick={() => {}} />,
    );

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("renderiza <a href> quando recebe href", () => {
    render(<IconButton label="Ir para a busca" icon={icon} href="/search" />);

    const link = screen.getByRole("link", { name: "Ir para a busca" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/search");
  });

  it("renderiza <button> quando recebe onClick", () => {
    render(<IconButton label="Buscar" icon={icon} onClick={() => {}} />);

    expect(screen.getByRole("button", { name: "Buscar" }).tagName).toBe("BUTTON");
  });

  it("chama onClick", () => {
    const onClick = vi.fn();
    render(<IconButton label="Buscar" icon={icon} onClick={onClick} />);

    screen.getByRole("button", { name: "Buscar" }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  // FR-019/FR-037: redondo e 44px na menor dimensão. `size-11` é 44px pela escala de `--spacing`.
  // A dimensão renderizada é medida pela regra `target-size` no Portão 4.
  it("é redondo e tem alvo de 44px", () => {
    render(<IconButton label="Buscar" icon={icon} onClick={() => {}} />);

    const button = screen.getByRole("button", { name: "Buscar" });
    expect(button).toHaveClass("size-11");
    expect(button).toHaveClass("rounded-full");
  });

  it("é alcançável por teclado sem tabindex artificial", () => {
    render(<IconButton label="Buscar" icon={icon} onClick={() => {}} />);

    const button = screen.getByRole("button", { name: "Buscar" });
    button.focus();

    expect(button).toHaveFocus();
    expect(button).not.toHaveAttribute("tabindex");
  });

  it("className recebido soma às classes próprias", () => {
    render(
      <IconButton label="Buscar" icon={icon} onClick={() => {}} className="ml-2" />,
    );

    const button = screen.getByRole("button", { name: "Buscar" });
    expect(button).toHaveClass("ml-2");
    expect(button).toHaveClass("rounded-full");
  });
});
