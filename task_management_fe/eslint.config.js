// eslint.config.js
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ── TypeScript ────────────────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'warn',           // flag any usage
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',                               // allow _action pattern you use in reducers
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-non-null-assertion': 'warn',     // flag ! assertions
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',                                // enforces: import type { Foo }
      }],

      // ── React ─────────────────────────────────────────────────────────────
      'react/react-in-jsx-scope': 'off',                      // not needed in React 17+
      'react/prop-types': 'off',                              // TypeScript handles this
      'react-hooks/rules-of-hooks': 'error',                  // catches hooks in wrong places
      'react-hooks/exhaustive-deps': 'warn',                  // missing useEffect deps

      // ── Imports ───────────────────────────────────────────────────────────
      'import/no-duplicates': 'error',                        // catches double imports
      'import/no-unresolved': 'off',                          // TypeScript handles resolution

      // ── General ───────────────────────────────────────────────────────────
      'no-console': ['warn', { allow: ['error', 'warn'] }],   // flag console.log in prod code
      'prefer-const': 'error',                                // catches let that should be const
      'no-var': 'error',
    },
  },
];
