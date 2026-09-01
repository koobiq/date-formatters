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
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            // parse, deserialize and isDateInstance take arbitrary untrusted input and narrow it,
            // and the abstract DateAdapter they implement declares them with `any`. The other five
            // packages disable the rule for the same reason; this one had lost the override.
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
