import { defineConfig } from 'vitest/config';
import { testEnv } from './libs/config/src/test-env';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['{apps,libs}/**/__spec__/**/*.e2e-spec.ts'],
    globalSetup: ['libs/database/src/__spec__/support/global-setup.ts'],
    fileParallelism: false,
    env: testEnv,
  },
});
