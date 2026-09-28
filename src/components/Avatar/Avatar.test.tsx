import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Avatar, { initialsOf } from "./Avatar";

describe("initialsOf", () => {
  it.each([
    ["Allan Ramos", "AR"],
    ["Allan", "A"],
    ["allan ramos da silva", "AS"],
    ["  Allan   Ramos  ", "AR"],
  ])("deriva %s em %s", (name, expected) => {
    expect(initialsOf(name)).toBe(expected);
  });

  it.each([undefined, "", "   ", "123", "!!"])(
    "devolve vazio para %s, que é o que dispara EC-01",
    (name) => {
      expect(initialsOf(name)).toBe("");
    },
  );
});

describe("Avatar", () => {
  it("mostra as iniciais derivadas do nome quando não há foto", () => {
    const { container } = render(<Avatar name="Allan Ramos" />);

    expect(container.textContent).toBe("AR");
  });

  // EC-01: o estado é RENDERIZÁVEL — marcador neutro, nunca círculo vazio nem string vazia.
  it("sem foto e sem nome aproveitável mostra marcador neutro, não string vazia", () => {
    const { container } = render(<Avatar />);

    expect(container.textContent).toBe("");
    // O que prova que não é um círculo vazio: existe um marcador desenhado dentro dele.
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("nome sem letra nenhuma também cai no marcador neutro", () => {
    const { container } = render(<Avatar name="123" />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("com foto renderiza imagem com o nome como texto alternativo", () => {
    render(<Avatar name="Allan Ramos" src="/foto.png" />);

    expect(screen.getByAltText("Allan Ramos")).toBeInTheDocument();
  });

  // FR-020: 32px, 44px e o grande RESPONSIVO 78→108, pelo mesmo componente.
  it.each([
    ["sm", "size-8"],
    ["md", "size-11"],
  ] as const)("tamanho %s resolve para %s", (size, expected) => {
    const { container } = render(<Avatar name="Allan Ramos" size={size} />);

    expect(container.firstElementChild).toHaveClass(expected);
  });

  it("o tamanho grande é responsivo no mesmo componente: 78px em celular e 108px no desktop", () => {
    const { container } = render(<Avatar name="Allan Ramos" size="lg" />);
    const root = container.firstElementChild;

    // 19,5 × 4px = 78px e 27 × 4px = 108px, pela escala de `--spacing`.
    expect(root).toHaveClass("size-19.5");
    expect(root).toHaveClass("lg:size-27");
  });

  it("a troca de tamanho acontece só no ponto de corte único de 1024px", () => {
    const { container } = render(<Avatar name="Allan Ramos" size="lg" />);
    const classes = container.firstElementChild?.className ?? "";

    // Nenhum outro prefixo de ponto de corte pode aparecer (FR-038a).
    expect(classes).not.toMatch(/\b(sm|md|xl|2xl):/);
  });

  it("className recebido soma às classes próprias", () => {
    const { container } = render(<Avatar name="Allan Ramos" className="mr-3" />);
    const root = container.firstElementChild;

    expect(root).toHaveClass("mr-3");
    expect(root).toHaveClass("rounded-full");
  });
});
