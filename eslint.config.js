import pluginTs from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'
// @ts-expect-error
import configStandard from 'eslint-config-standard'
// @ts-expect-error
import pluginImport from 'eslint-plugin-import'
// @ts-expect-error
import pluginN from 'eslint-plugin-n'
// @ts-expect-error
import pluginPromise from 'eslint-plugin-promise'
import globals from 'globals'

/** @type {import('eslint').Linter.FlatConfig[]} */
// @ts-expect-error
export default [{
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.es2021,
      ...globals.node,
      Bun: false
    },
    parser,
    parserOptions: {
      ecmaVersion: 'latest',
      project: 'tsconfig.json',
      sourceType: 'module'
    }
  },
  files: [
    'eslint.config.js',
    'src/**/*.js',
    'src/**/*.ts',
    'test/**/*.ts',
    'data/**/*.js'
  ],
  plugins: {
    import: pluginImport,
    n: pluginN,
    promise: pluginPromise,
    '@typescript-eslint': pluginTs
  },
  rules: {
    ...configStandard.rules,
    '@typescript-eslint/strict-boolean-expressions': 'error',
    'max-len': ['warn', { code: 120 }],
    'no-redeclare': 'off',
    'no-shadow': 'error',
    'no-unused-expressions': 'off'
  }
}]
