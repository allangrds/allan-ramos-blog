import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import YearArchive from "./YearArchive";

const withGap = [
  { year: 2024, count: 3 },
  { year: 2023, count: 0 },
  { year: 2022, count: 7 },
];

describe("YearArchive", () => {
  // US5/AS-4: o hiato é INFORMAÇÃO — mostra que houve um ano sem escrever. Omitir o ano faria a
  // lista mentir por silêncio.
  it("ano com count 0 PERMANECE no DOM como hiato", () => {
    render(<YearArchive years={withGap} />);

    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("2023").closest("[data-gap='true']")).not.toBeNull();
  });

  it("o hiato não é clicável, porque não há para onde ir", () => {
    render(<YearArchive years={withGap} />);

    expect(screen.queryByRole("link", { name: /2023/ })).toBeNull();
  });

  it("o hiato diz por que está vazio, em vez de mostrar um zero solto", () => {
    render(<YearArchive years={withGap} />);

    expect(screen.getByText("sem posts")).toBeInTheDocument();
  });

  it("ano com post é link e mostra a contagem", () => {
    render(<YearArchive years={withGap} />);

    const link = screen.getByRole("link", { name: /2024/ });
    expect(link).toHaveAttribute("href", expect.stringContaining("2024"));
    expect(link).toHaveTextContent("3");
  });

  it("renderiza todos os anos recebidos", () => {
    render(<YearArchive years={withGap} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  // EC-06: nenhum hiato é FABRICADO. O componente não preenche lacunas entre o menor e o maior ano.
  it("com um único ano não há hiato inventado", () => {
    render(<YearArchive years={[{ year: 2024, count: 3 }]} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.queryByText("sem posts")).toBeNull();
  });

  it("anos distantes não geram os anos intermediários", () => {
    render(
      <YearArchive years={[{ year: 2024, count: 1 }, { year: 2018, count: 1 }]} />,
    );

    // Só os dois recebidos: 2019 a 2023 NÃO são inventados.
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.queryByText("2020")).toBeNull();
  });

  it("o ano com post tem alvo de toque de 44px", () => {
    render(<YearArchive years={withGap} />);

    screen.getAllByRole("link").forEach((link) => expect(link).toHaveClass("min-h-11"));
  });
});
