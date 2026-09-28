import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Container from "./Container";

describe("Container", () => {
  // Contrato congelado `{ className }`, consumido por `src/app/**` (FR-016): o className recebido
  // SOMA às classes próprias e não pode substituí-las.
  it("className recebido soma às classes próprias em vez de substituí-las", () => {
    const { container } = render(
      <Container className="py-12">
        <span>conteúdo</span>
      </Container>,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("py-12");
    expect(root).toHaveClass("mx-auto");
    expect(root).toHaveClass("px-6");
  });

  it("sem className continua com as classes próprias", () => {
    const { container } = render(
      <Container>
        <span>conteúdo</span>
      </Container>,
    );

    expect(container.firstElementChild).toHaveClass("mx-auto");
  });

  it("renderiza os filhos recebidos", () => {
    const { container } = render(
      <Container>
        <span>conteúdo</span>
      </Container>,
    );

    expect(container.textContent).toBe("conteúdo");
  });

  // FR-012: a largura de leitura sai do TOKEN `--measure-prose`, não de um valor avulso.
  it("a largura de leitura usa o token --measure-prose", () => {
    const { container } = render(
      <Container prose>
        <span>conteúdo</span>
      </Container>,
    );

    expect(container.firstElementChild).toHaveClass("max-w-(--measure-prose)");
  });

  it("a largura padrão não usa a medida de leitura", () => {
    const { container } = render(
      <Container>
        <span>conteúdo</span>
      </Container>,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass("max-w-3xl");
    expect(root).not.toHaveClass("max-w-(--measure-prose)");
  });
});
