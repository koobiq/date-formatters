module.exports = {
    '*': 'prettier --write --ignore-unknown',
    // Kept at the same strictness as `npm run lint:all` (and the Linters workflow), which runs
    // ESLint through the Nx target: warnings are reported but do not fail. `--max-warnings=0`
    // would be stricter than CI and would reject commits that CI accepts.
    //
    // Spec files are excluded because every packages/*/.eslintrc.json ignores `**.spec.ts`;
    // passing one explicitly only produces a "File ignored" warning.
    'packages/**/*.ts': (files) => {
        const lintable = files.filter((file) => !file.endsWith('.spec.ts'));

        return lintable.length ? [`eslint --fix ${lintable.map((file) => `"${file}"`).join(' ')}`] : [];
    }
};
