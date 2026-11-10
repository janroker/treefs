import { defineConfig, globalIgnores } from 'eslint/config';
import { baseConfig } from './eslint.base.js';

export default defineConfig([
  globalIgnores(['**/dist/', '**/coverage/', '**/node_modules/']),
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
]);
