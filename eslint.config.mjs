import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'test-deploy/**',
      '.claude/notes/**',
    ],
  },
  {
    rules: {
      // Code style standards (from CLAUDE.md)
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
      'comma-dangle': ['error', 'always-multiline'],

      // React/Next.js best practices
      'react/prop-types': 'off', // Using TypeScript for type checking
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
    },
  },
];

export default eslintConfig;
