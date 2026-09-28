// Portão 6 — canal do console do navegador.
// Chromium de perfil limpo, sem extensão (GATES.md §6).
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3000';
const MODE = process.argv[3] || 'dev';

const ROUTES = [
  ['1',  '/'],
  ['2',  '/page/2'],
  ['3',  '/posts/react-compilado'],
  ['4',  '/categorias'],
  ['5',  '/categories/Front-end'],
  ['6',  '/tags'],
  ['7',  '/tags/react'],
  ['8',  '/series/' + encodeURIComponent('Virando fullstack')],
  ['9',  '/search'],
  ['10', '/sobre'],
  ['11', '/rota-que-nao-existe'],
];

const browser = await chromium.launch({
  args: ['--disable-extensions', '--disable-component-extensions-with-background-pages'],
});

let totalFindings = 0;
const report = [];

for (const [n, route] of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const found = [];

  page.on('console', (m) => {
    const t = m.type();
    if (t === 'error' || t === 'warning' || t === 'assert') {
      found.push(`console.${t}: ${m.text()}`);
    }
  });
  page.on('pageerror', (e) => found.push(`pageerror: ${e.message.split('\n')[0]}`));
  page.on('requestfailed', (r) => {
    const f = r.failure();
    if (f && !/ERR_ABORTED/.test(f.errorText)) {
      found.push(`requestfailed: ${r.url()} — ${f.errorText}`);
    }
  });

  let status = 'n/a';
  try {
    const resp = await page.goto(BASE + route, { waitUntil: 'load', timeout: 45000 });
    status = resp ? resp.status() : 'null';
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1800); // deixa a hidratação assentar
  } catch (e) {
    found.push(`navigation: ${e.message.split('\n')[0]}`);
  }

  // Overlay de desenvolvimento do Next.js conta como canal de erro (GATES.md §6).
  // O <nextjs-portal> existe SEMPRE em dev (é o indicador de devtools); o que sinaliza
  // problema é o badge com data-error="true"/data-status != "none", ou um diálogo de erro.
  const overlay = await page.evaluate(() => {
    const msgs = [];
    for (const portal of document.querySelectorAll('nextjs-portal')) {
      const sr = portal.shadowRoot;
      if (!sr) continue;
      const badge = sr.querySelector('[data-next-badge]');
      if (badge) {
        const err = badge.getAttribute('data-error');
        const st = badge.getAttribute('data-status');
        if (err === 'true') msgs.push('badge data-error="true"');
        if (st && st !== 'none') msgs.push(`badge data-status="${st}"`);
      }
      const dialog = sr.querySelector('[data-nextjs-dialog], [data-nextjs-error-overlay], [data-nextjs-error-dialog]');
      if (dialog) msgs.push('diálogo de erro: ' + (dialog.textContent || '').trim().slice(0, 200));
    }
    return msgs;
  }).catch(() => []);
  for (const o of overlay) found.push(`next-overlay: ${o}`);

  // marcador de hidratação: o app precisa ter hidratado
  const hydrated = await page.evaluate(() => !!document.querySelector('body > div, body > main, body > header')).catch(() => false);

  totalFindings += found.length;
  report.push({ n, route, status, hydrated, found });
  await ctx.close();
}

await browser.close();

console.log(`\n===== PORTÃO 6 · CONSOLE · MODO ${MODE.toUpperCase()} · ${BASE} =====`);
for (const r of report) {
  const tag = r.found.length === 0 ? 'LIMPO' : `${r.found.length} ACHADO(S)`;
  console.log(`\n[${r.n}] ${r.route}  → HTTP ${r.status} · hidratado=${r.hydrated} · ${tag}`);
  for (const f of r.found) console.log(`      • ${f}`);
}
console.log(`\n----- TOTAL ${MODE}: ${totalFindings} achado(s) em ${report.length} rotas -----`);
process.exit(totalFindings === 0 ? 0 : 1);
