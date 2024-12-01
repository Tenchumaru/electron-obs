import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import reactRefresh from 'eslint-plugin-react-refresh';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default tseslint.config({
}, ...fixupConfigRules(compat.extends(
  'eslint:recommended',
  'plugin:@typescript-eslint/strict-type-checked',
  'plugin:@typescript-eslint/stylistic-type-checked',
  'plugin:react-hooks/recommended',
)), {
  plugins: {
    'react-refresh': reactRefresh,
  },
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: { jsx: true },
      project: ['tsconfig.node.json', 'tsconfig.web.json'],
      tsconfigRootDir: __dirname, // https://stackoverflow.com/a/64940811
    },
  },
  rules: {
    '@typescript-eslint/no-confusing-void-expression': ['error', {
      ignoreArrowShorthand: true,
      ignoreVoidOperator: true,
    }],
    '@typescript-eslint/no-meaningless-void-operator': 'off', // https://github.com/typescript-eslint/typescript-eslint/issues/4507
    '@typescript-eslint/no-misused-promises': ['error', {
      checksVoidReturn: false,
    }],
    '@typescript-eslint/restrict-template-expressions': ['error', {
      allowBoolean: true,
      allowNumber: true,
    }],
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': ['error', {
      allowConstantExport: true,
    }],
  }
});
