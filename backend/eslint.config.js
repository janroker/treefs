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
  {
    files: ['apps/**/*.ts', 'libs/**/*.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message: 'Read configuration through the config library.',
        },
      ],
    },
  },
  {
    files: ['libs/config/**/*.ts', '**/__spec__/**/*.ts'],
    rules: { 'no-restricted-properties': 'off' },
  },
  {
    files: ['libs/database/src/migrations/*.ts'],
    rules: { 'max-lines-per-function': 'off' },
  },
]);
