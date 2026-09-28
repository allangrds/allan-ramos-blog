import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const CSS = readFileSync('src/app/globals.css', 'utf8');

/**
 * Asserção sobre REGRA ignora comentário. Sem isto o texto explicativo do próprio arquivo entra
 * na medição — e entrou: o comentário de FR-042a cita `animation: none` para dizer que NÃO é o que
 * a regra faz, e a asserção negativa casava com a prosa em vez do CSS.
 */
const RULES = CSS.replace(/\/\*[\s\S]*?\*\//g, '');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/**
 * EC-12 e SC-016 — a supressão de movimento tem PONTO ÚNICO de definição.
 *
 * FR-042a: `globals.css` neutraliza `transition` e `animation` sob
 * `prefers-reduced-motion: reduce` para o sistema inteiro, e nenhum componente repete a regra.
 * Repeti-la por componente criaria 36 pontos de manutenção para uma decisão que é uma.
 */
describe('supressão de movimento (FR-042a, EC-12, SC-016)', () => {
  it('declara a consulta exatamente uma vez', () => {
    const matches = RULES.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  it('neutraliza transition e animation', () => {
    const block = RULES.slice(RULES.indexOf('prefers-reduced-motion'));
    expect(block).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
    expect(block).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
  });

  it('alcança o estado final sem transição, em vez de suprimir a animação junto', () => {
    const block = RULES.slice(RULES.indexOf('prefers-reduced-motion'));
    // `animation: none` abortaria a animação e deixaria o elemento no estado INICIAL.
    // `fill-mode: forwards` com duração ~0 salta para o estado FINAL, que é o que EC-12 exige.
    expect(block).toMatch(/animation-fill-mode:\s*forwards\s*!important/);
    expect(block).not.toMatch(/animation:\s*none/);
  });

  it('nenhum componente declara a própria consulta', () => {
    const offenders = walk('src/components').filter(
      (f) => /\.tsx?$/.test(f) && readFileSync(f, 'utf8').includes('prefers-reduced-motion'),
    );
    expect(offenders).toEqual([]);
  });

  it('nenhuma dependência de animação consta do package.json', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const all = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    expect(all.filter((d) => /^(motion|framer-motion|gsap|@react-spring)/.test(d))).toEqual([]);
  });
});

/**
 * FR-010 / FR-010a — tema único, e o navegador informado de que só existe um.
 */
describe('tema único (FR-010, FR-010a)', () => {
  it('declara color-scheme: light', () => {
    expect(CSS).toMatch(/color-scheme:\s*light/);
  });

  it('não declara seletor de tema escuro', () => {
    expect(RULES).not.toMatch(/prefers-color-scheme/);
    expect(RULES).not.toMatch(/\[data-theme/);
  });
});

/**
 * FR-002 / SC-005 — a paleta aubergine saiu inteira.
 */
describe('paleta anterior removida (FR-002, SC-005)', () => {
  const AUBERGINE = [
    'primary', 'primary-deep', 'primary-press', 'primary-tint', 'on-primary',
    'ink-mute', 'link-blue', 'link-hover', 'canvas-cream', 'canvas-lavender',
    'surface-elev', 'surface-aubergine', 'hairline-strong', 'semantic-error',
    'semantic-success', 'on-aubergine-mute',
  ];

  it('nenhum dos tokens sem sucessor de nome permanece declarado', () => {
    const declared = AUBERGINE.filter((t) => RULES.includes(`--color-${t}:`));
    expect(declared).toEqual([]);
  });

  it('os três nomes reusados carregam o valor novo, não o antigo', () => {
    expect(CSS).toMatch(/--color-ink:\s*#141210/);
    expect(CSS).toMatch(/--color-canvas:\s*#FBEFD8/);
    expect(CSS).toMatch(/--color-hairline:\s*#E0CFAC/);
  });

  it('a família anterior saiu', () => {
    expect(RULES).not.toMatch(/--font-jakarta/);
  });
});
