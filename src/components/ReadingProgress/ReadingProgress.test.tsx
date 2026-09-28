import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ReadingProgress from "./ReadingProgress";

const setScrollable = ({ scrollHeight, innerHeight, scrollY }: {
  scrollHeight: number;
  innerHeight: number;
  scrollY: number;
}) => {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(window, "innerHeight", { value: innerHeight, configurable: true });
  Object.defineProperty(window, "scrollY", { value: scrollY, configurable: true });
};

describe("ReadingProgress", () => {
  it("expõe role progressbar com os atributos de valor", () => {
    render(<ReadingProgress value={0} />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAccessibleName("Progresso de leitura");
  });

  it.each([0, 42, 100])("com value a fração é exatamente %i", (value) => {
    render(<ReadingProgress value={value} />);

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(value));
  });

  it("value fora da faixa é limitado a 0 e 100", () => {
    const { unmount } = render(<ReadingProgress value={-20} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    unmount();

    render(<ReadingProgress value={180} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  // Sem `value` a fração REFLETE a posição de rolagem — é o comportamento real do componente.
  it("sem value calcula a fração pela posição de rolagem", () => {
    setScrollable({ scrollHeight: 2000, innerHeight: 1000, scrollY: 500 });
    render(<ReadingProgress />);

    // 500 de 1000 roláveis = 50%.
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
  });

  it("acompanha a rolagem quando ela muda", () => {
    setScrollable({ scrollHeight: 2000, innerHeight: 1000, scrollY: 0 });
    render(<ReadingProgress />);

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");

    setScrollable({ scrollHeight: 2000, innerHeight: 1000, scrollY: 1000 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  // Página que não rola: dividir por zero daria NaN no atributo.
  it("página sem rolagem fica em 0, não em NaN", () => {
    setScrollable({ scrollHeight: 800, innerHeight: 1000, scrollY: 0 });
    render(<ReadingProgress />);

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});
