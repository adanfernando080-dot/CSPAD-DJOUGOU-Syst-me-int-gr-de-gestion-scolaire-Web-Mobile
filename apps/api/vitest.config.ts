import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// SWC est nécessaire : esbuild n'émet pas les métadonnées de décorateurs
// dont dépend l'injection de dépendances NestJS.
export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
    environment: 'node',
  },
});
