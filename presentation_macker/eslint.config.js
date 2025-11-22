import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // TypeScript правила
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/prefer-const': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // React правила
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      
      // Качество кода
      'prefer-const': 'warn',
      'no-var': 'warn',
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'warn',
      'arrow-parens': ['warn', 'as-needed'],
      'no-console': 'warn',
      'no-debugger': 'warn',
      
      // Стиль кода
      'quotes': ['warn', 'single', { 'avoidEscape': true }],
      'semi': ['warn', 'never'],
      'comma-dangle': ['warn', 'always-multiline'],
      'indent': ['warn', 2],
      'no-trailing-spaces': 'warn',
      'eol-last': 'warn',
      
      // Логика
      'no-duplicate-imports': 'warn',
      'no-unreachable': 'warn',
      'no-constant-condition': 'warn',
      'no-empty': 'warn',
    },
  },
  {
    // Отдельная конфигурация для тестовых файлов
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])