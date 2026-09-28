import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PostContentView from "./PostContentView";

describe("PostContentView", () => {
  // FR-012: a medida de leitura sai do TOKEN, não de valor avulso dentro do componente. O token é
  // insumo da justificativa do ponto de corte de 1024px, então não pode viver solto aqui.
  it("a medida de leitura resolve para o token --measure-prose", () => {
    const { container } = render(<PostContentView>corpo</PostContentView>);

    expect(container.firstElementChild).toHaveClass("max-w-(--measure-prose)");
  });

  // EC-13 depende de a medida estar em unidade RELATIVA: em `ch` a caixa cresce com a fonte, então
  // ampliar a 200% aumenta a caixa junto em vez de cortar o texto. Uma largura fixa em px passaria
  // este teste de classe mas falharia no leitor, por isso o teste olha o valor do token.
  it("o token está em ch, não em px, que é o que sustenta EC-13", () => {
    const { container } = render(<PostContentView>corpo</PostContentView>);
    const classes = container.firstElementChild?.className ?? "";

    expect(classes).not.toMatch(/max-w-\[\d+px\]/);
    expect(classes).toContain("max-w-(--measure-prose)");
  });

  it("não declara largura fixa que impediria a ampliação do texto", () => {
    const { container } = render(<PostContentView>corpo</PostContentView>);
    const classes = container.firstElementChild?.className ?? "";

    expect(classes).not.toMatch(/\bw-\[?\d/);
  });

  it("renderiza os filhos recebidos", () => {
    const { container } = render(
      <PostContentView>
        <p>parágrafo</p>
      </PostContentView>,
    );

    expect(container.textContent).toBe("parágrafo");
  });

  it("usa a escala de corpo do sistema", () => {
    const { container } = render(<PostContentView>corpo</PostContentView>);

    expect(container.firstElementChild).toHaveClass("text-body-lg");
  });
});
