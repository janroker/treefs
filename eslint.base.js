import eslint from '@eslint/js';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import vitest from '@vitest/eslint-plugin';
import prettier from 'eslint-config-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

const bannedSyntax = [
  {
    selector: 'TSEnumDeclaration',
    message:
      'Use an `as const` object and a derived union type instead of an enum.',
  },
  { selector: 'ExportDefaultDeclaration', message: 'Use named exports.' },
  {
    selector: ':function > TSTypeAnnotation TSTypeLiteral',
    message:
      'Declare return types in the domain types file (for example items.types.ts), not inline.',
  },
];

export const baseConfig = [
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  comments.recommended,

  {
    languageOptions: { parserOptions: { projectService: true } },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    plugins: { unicorn },
    rules: {
      complexity: ['error', 8],
      'sonarjs/cognitive-complexity': ['error', 10],
      'max-depth': ['error', 3],
      'max-nested-callbacks': ['error', 3],
      'max-lines-per-function': [
        'error',
        { max: 40, skipBlankLines: true, skipComments: true },
      ],
      'max-lines': [
        'error',
        { max: 250, skipBlankLines: true, skipComments: true },
      ],
      'max-statements': ['error', 15],
      'max-params': ['error', 3],

      'no-else-return': ['error', { allowElseIf: false }],
      'no-lonely-if': 'error',
      'unicorn/no-negated-condition': 'error',
      'no-nested-ternary': 'error',
      curly: ['error', 'all'],

      'no-restricted-syntax': ['error', ...bannedSyntax],
      'max-classes-per-file': ['error', 1],
      '@typescript-eslint/no-extraneous-class': [
        'error',
        { allowWithDecorator: true },
      ],

      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true },
      ],

      'no-console': 'error',
      'no-inline-comments': 'error',
      'no-warning-comments': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/throw-new-error': 'error',
      'unicorn/no-useless-undefined': 'error',
      '@eslint-community/eslint-comments/require-description': 'error',
    },
  },

  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  {
    files: ['**/*.config{,.*}.{js,ts}'],
    rules: { 'no-restricted-syntax': 'off' },
  },

  {
    files: ['**/*.spec.{ts,tsx}', '**/*.e2e-spec.ts', '**/__spec__/**/*.ts'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'error',
      'vitest/expect-expect': [
        'error',
        {
          assertFunctionNames: [
            'expect',
            'expect*',
            'request.**.expect',
            '**.expect',
          ],
        },
      ],
      'max-lines-per-function': 'off',
      'max-nested-callbacks': ['error', 4],
      'max-lines': [
        'error',
        { max: 500, skipBlankLines: true, skipComments: true },
      ],
      'max-statements': 'off',
      'sonarjs/no-hardcoded-passwords': 'off',
    },
  },

  prettier,
];
