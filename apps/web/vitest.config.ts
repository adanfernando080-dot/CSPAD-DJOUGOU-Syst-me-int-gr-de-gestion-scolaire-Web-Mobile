import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  test: { include: ['app/**/*.test.tsx', 'app/**/*.test.ts'], environment: 'node' },
});
