// @ts-check

const { readdirSync } = require('fs');
const { resolve } = require('path');

const makeScopeTypesByPath = (path) => {
    const files = readdirSync(resolve(__dirname, path), { withFileTypes: true });
    const directories = files.filter((file) => file.isDirectory());

    return directories.map((dir) => dir.name);
};

/** @type {import('@commitlint/types').UserConfig} */
const config = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', 120],
        'scope-enum': [
            2,
            'always',
            [
                // One scope per published package, derived from the directory names so a new
                // package does not need this file touched.
                ...makeScopeTypesByPath(resolve(__dirname, 'packages')),

                // Shorthands for the two areas that span several packages.
                'adapter',
                'formatter',

                // others
                'build',
                'release',

                // Dependabot scopes
                'deps',
                'deps-dev'
            ]
        ]
    }
};

module.exports = config;
