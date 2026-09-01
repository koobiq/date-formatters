import baseConfig from '../../eslint.config.mjs';

export default [
    ...baseConfig,
    {
        // parserOptions.project only applies to TypeScript sources. Without this the typed parser
        // is also used for eslint.config.mjs, which no tsconfig includes, and ESLint fails with
        // "The file was not found in any of the provided project(s)".
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: ['packages/date-formatter/tsconfig.*?.json', 'tsconfig.*?.json']
            }
        }
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        // Override or add rules here
        rules: {}
    },
    {
        files: ['**/*.js', '**/*.jsx'],
        // Override or add rules here
        rules: {}
    },
    {
        ignores: ['jest.config.js', '**/*.spec.ts']
    }
];
