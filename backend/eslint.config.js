import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import { baseConfig } from '../eslint.base.js';

export default defineConfig([
  globalIgnores(['dist/', 'coverage/']),
  ...baseConfig,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
]);
