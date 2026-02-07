import tseslint from '@typescript-eslint/eslint-plugin'
import astro from 'eslint-plugin-astro'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.astro/**'],
  },
  ...tseslint.configs['flat/recommended'],
  ...astro.configs['flat/recommended'],
]
