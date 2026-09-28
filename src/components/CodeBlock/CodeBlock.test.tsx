import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CodeBlockView from "./CodeBlockView";

const html = "<pre><code>const x = 1;</code></pre>";
const code = "const x = 1;";

describe("CodeBlockView", () => {
  it("renderiza o html destacado recebido", () => {
    const { container } = render(<CodeBlockView html={html} code={code} />);

    expect(container.querySelector("pre code")?.textContent).toBe(code);
  });

  it("mostra nome do arquivo e linguagem quando os dois vêm", () => {
    render(
      <CodeBlockView html={html} code={code} language="ts" filename="exemplo.ts" />,
    );

    expect(screen.getByText("exemplo.ts")).toBeInTheDocument();
    expect(screen.getByText("ts")).toBeInTheDocument();
  });

  // EC-07: o cabeçalho OMITE o campo ausente e nenhum rótulo de substituição é inventado —
  // "sem nome" no lugar do nome seria informação falsa sobre o arquivo.
  it("sem nome de arquivo o campo sai, sem rótulo de substituição", () => {
    render(<CodeBlockView html={html} code={code} language="ts" />);

    expect(screen.queryByText(/sem nome|desconhecido|untitled/i)).toBeNull();
    expect(screen.getByText("ts")).toBeInTheDocument();
  });

  it("sem linguagem o campo sai, sem rótulo de substituição", () => {
    render(<CodeBlockView html={html} code={code} filename="exemplo.txt" />);

    expect(screen.queryByText(/text|plain|desconhecid/i)).toBeNull();
    expect(screen.getByText("exemplo.txt")).toBeInTheDocument();
  });

  it("linguagem vazia conta como ausente", () => {
    render(<CodeBlockView html={html} code={code} language="" filename="a.txt" />);

    // A pílula de linguagem não existe; só o nome do arquivo aparece.
    expect(screen.getByText("a.txt")).toBeInTheDocument();
  });

  // EC-07 é sobre manter a AÇÃO: sem nome e sem linguagem, copiar continua lá.
  it.each([
    ["com os dois", { language: "ts", filename: "a.ts" }],
    ["sem nome", { language: "ts" }],
    ["sem linguagem", { filename: "a.ts" }],
    ["sem nenhum dos dois", {}],
  ])("a ação de copiar sobrevive %s", (_label, extra) => {
    render(<CodeBlockView html={html} code={code} {...extra} />);

    expect(screen.getByRole("button", { name: /Copiar/ })).toBeInTheDocument();
  });

  // US6/AS-3 e SC-009: o CORPO rola na horizontal; a página, não. `overflow-x-auto` é o que prende
  // a rolagem dentro do bloco.
  it("a rolagem horizontal fica presa no corpo do bloco", () => {
    const { container } = render(<CodeBlockView html={html} code={code} />);
    const body = container.querySelector("[class*='overflow-x-auto']");

    expect(body).not.toBeNull();
    expect(body?.querySelector("pre")).not.toBeNull();
  });

  it("a dica de rolagem existe e só aparece abaixo do ponto de corte", () => {
    const { container } = render(<CodeBlockView html={html} code={code} />);
    const caption = container.querySelector("figcaption");

    expect(caption).toHaveTextContent("role o código para o lado");
    expect(caption).toHaveClass("lg:hidden");
  });


  // Os dois testes abaixo guardam defeitos que o Portão 4 encontrou nesta tarefa, não hipóteses.
  it("a área rolável é alcançável por teclado e tem nome", () => {
    const { container } = render(
      <CodeBlockView html={html} code={code} filename="exemplo.ts" />,
    );
    const region = container.querySelector("[role='region']");

    // Sem isto quem não usa mouse não chega ao fim da linha longa: o axe reprovou com
    // `scrollable-region-focusable`.
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).toHaveAttribute("aria-label", "Código: exemplo.ts");
  });

  it("o corpo tem cor de reserva legível quando o html vem sem cor", () => {
    const { container } = render(<CodeBlockView html={html} code={code} />);
    const region = container.querySelector("[role='region']");

    // Sem `text-sand` o texto herda `ink` sobre `code-bg`, que dá 1,04:1 — praticamente invisível.
    expect(region).toHaveClass("text-sand");
    expect(region).toHaveClass("bg-code-bg");
  });

  it("sem nome de arquivo a região ainda tem nome acessível", () => {
    const { container } = render(<CodeBlockView html={html} code={code} />);

    expect(container.querySelector("[role='region']")).toHaveAttribute(
      "aria-label",
      "Bloco de código",
    );
  });

  it("usa a superfície de código do sistema", () => {
    const { container } = render(<CodeBlockView html={html} code={code} />);

    expect(container.querySelector(".bg-code-bg")).not.toBeNull();
  });
});
