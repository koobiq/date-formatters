# Contributing to Koobiq Date Formatters

## Found a bug?

If you find a bug in the source code or a mistake in the documentation, help us by
[creating an issue](https://github.com/koobiq/date-formatters/issues/new/choose).

Please include the package, its version, the locale (if the problem is locale-specific) and a
minimal reproduction — for date formatting, the input value, the requested format and the string
you got versus the one you expected.

## Development

The repository is an [Nx](https://nx.dev) monorepo. The Node.js version is pinned in
[`.nvmrc`](/.nvmrc); use [nvm](https://github.com/nvm-sh/nvm) or any tool that reads it.

```bash
npm ci
npm run build:all
npm run test:all
npm run lint:all
npm run format:check
```

Useful during development:

-   `npm run build:<package>` — build a single package, e.g. `npm run build:luxon-date-adapter`
-   `npm run format:write` — apply Prettier to `packages/`

Snapshot tests cover the formatted output for every supported locale. When you deliberately
change formatting, update the snapshots and make the snapshot diff part of the pull request so
the change is reviewable.

## Submitting a pull request

-   Fork the repository and create your branch from `main`.
-   Add tests for the behaviour you change; a formatting change without a snapshot or unit test
    will not be accepted.
-   Make sure `npm run lint:all`, `npm run test:all` and `npm run build:all` pass locally.
-   Open a pull request against `main`.

Pull requests are **squash-merged**, and the pull request title becomes the commit subject. It
must therefore follow [Conventional Commits](https://www.conventionalcommits.org) — this is
enforced by the `Commitlint` workflow, and the title also drives the labels and the release
notes.

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Scope: one of the package directory names under packages/, or
  │                  adapter | formatter | build | release | deps | deps-dev
  │
  └─⫸ Type: build | chore | ci | docs | feat | fix | perf | refactor | style | test
```

Examples:

```
fix(luxon-date-adapter): correct the DST offset for open ranges
feat(date-formatter): add tk-TM templates
refactor(adapter)!: drop the deprecated setLocale overload
```

A breaking change is marked either with `!` after the scope, as above, or with a
`BREAKING CHANGE:` footer in the description. Either form applies the `breaking changes` label
and puts the change at the top of the release notes.

## Review

At least one approval from a [code owner](/.github/CODEOWNERS) is required, and all review
conversations must be resolved before a pull request can be merged.

## Releases

Releases are cut from `main` by a maintainer:

```bash
npm run release:stage:commit
```

This bumps the package versions and updates [`CHANGELOG.md`](/CHANGELOG.md). Pushing the
resulting `<version>` tag triggers the `Publish` workflow, which builds the packages, publishes
them to npm and creates the GitHub release.
