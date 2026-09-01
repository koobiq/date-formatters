import nx from '@nx/eslint-plugin';
import jsoncEslintParser from 'jsonc-eslint-parser';

export default [
    ...nx.configs['flat/base'],
    {
        files: ['**/*.json'],
        // Override or add rules here
        rules: {},
        languageOptions: {
            parser: jsoncEslintParser
        }
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: [],
                    depConstraints: [
                        {
                            sourceTag: '*',
                            onlyDependOnLibsWithTags: ['*']
                        }
                    ]
                }
            ]
        }
    },
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: [
            '/node_modules',
            '/dist',
            '.prettierrc.js',
            '.commitlintrc.js',
            '.lintstagedrc.js',
            'jest.preset.js',
            '**/*.config.js',
            // Specs are excluded from linting. Kept here rather than per package so it also
            // applies when ESLint is invoked from the repo root, as lint-staged does — flat
            // config resolves one config from cwd and never reaches the package configs.
            '**/*.spec.ts',
            '**/*.config.mjs',
            '**/*.d.ts'
        ]
    }
];
