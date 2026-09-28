import { expect, waitFor } from "storybook/test";

// FR-038b exige duas entradas por estado, com a largura declarada NA PRÓPRIA story: 1280px e
// 390px. Isto é atendido por DOIS mecanismos, porque um só não cobre os dois leitores:
//
//   1. `globals.viewport` — declara a largura para quem NAVEGA o catálogo. Quando presente, o
//      controle da barra de ferramentas não pode alterá-la, e é por isso que ele conta como
//      apresentação enquanto o controle global não conta.
//   2. `page.viewport()` do contexto do Vitest — redimensiona o viewport DE VERDADE no Portão 4.
//      Medido em 2026-09-27: o runner de story NÃO aplica `globals.viewport` ao iframe, que fica
//      em 1200px. Sem (2), a asserção de SC-009 mediria 1200 e a de 390 nunca seria provada.
//
// Toda entrada declara a sua largura pelos dois, e é por isso que as entradas de desktop também
// têm `play`: sem redimensionar de volta, os 390px da entrada anterior vazariam para elas e a
// apresentação de desktop viraria uma de celular.

export const DESKTOP_WIDTH = 1280;
export const MOBILE_WIDTH = 390;

export const DESKTOP = { viewport: { value: `${DESKTOP_WIDTH}px-900px` } };
export const MOBILE = { viewport: { value: `${MOBILE_WIDTH}px-844px` } };

type ViewportPage = { viewport: (width: number, height: number) => Promise<void> };

// Fora do Vitest — Storybook em `dev` — este módulo não existe, e aí a largura da apresentação
// é a de `globals.viewport`. A asserção de rolagem só se aplica onde há viewport real para medir.
const vitestPage = async (): Promise<ViewportPage | undefined> => {
  try {
    const context = (await import("vitest/browser")) as { page?: ViewportPage };
    return context.page;
  } catch {
    return undefined;
  }
};

/** Entrada de desktop: fixa 1280px para que os 390px da entrada anterior não vazem. */
export const atDesktop = async () => {
  const page = await vitestPage();
  await page?.viewport(DESKTOP_WIDTH, 900);
};

/**
 * Entrada de celular: fixa 390px e assere zero rolagem horizontal (SC-009, regra global 6).
 * A asserção roda em navegador real, não em inspeção visual.
 */
export const atMobile = async () => {
  const page = await vitestPage();
  if (page === undefined) return;

  await page.viewport(MOBILE_WIDTH, 844);
  await waitFor(() => {
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(MOBILE_WIDTH);
  });
};
