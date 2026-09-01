import baseConfig from '../../eslint.config.mjs';

export default [
    ...baseConfig,
    {
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: ['packages/moment-date-adapter/tsconfig.*?.json', 'tsconfig.*?.json']
            }
        }
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        // Override or add rules here
        rules: {}
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
        ignores: ['jest.config.js', '**.spec.ts']
    }
];
