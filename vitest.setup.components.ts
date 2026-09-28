import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';

// O auto-cleanup do @testing-library/react só se registra sozinho quando `globals: true`, e o
// project `components` roda sem globais. Sem este afterEach cada `render` acumula no mesmo
// document e a segunda consulta do mesmo papel falha com "found multiple elements" — erro que
// não aparecia enquanto o project tinha zero teste de verdade (T001 o criou vazio).
afterEach(() => {
  cleanup();
});
