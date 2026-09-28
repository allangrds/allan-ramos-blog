import type { Preview } from "@storybook/nextjs-vite";

// Sem este import as stories renderizam SEM o design system, e o Portao 4 fica oco: o
// `target-size` mede texto cru (18px de line-height, zero padding) e o `color-contrast` mede
// preto sobre branco em vez das superficies reais. As reguas de SC-007, SC-008 e SC-009
// dependem de o CSS estar carregado.
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "error",
      config: {
        rules: [
          // Regua de SC-008. NAO vem habilitada por padrao no axe-core: sem esta linha o alvo de
          // toque de 44px nao tinha verificacao automatica nenhuma.
          { id: "target-size", enabled: true },
          // Regua de SC-007. Habilitada por padrao, declarada aqui para que desligar seja uma
          // edicao visivel em vez de uma omissao.
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
};

export default preview;
