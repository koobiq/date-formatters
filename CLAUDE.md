# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Nx monorepo, npm. Node is pinned in `.nvmrc` (24.20.0, npm >= 11) — the pin is load-bearing for
`npm ci`, see the comment in `.github/workflows/actions/setup-node/action.yml`.

Every entry point is an npm script, so `package.json` is the complete list — prefer those over
calling `nx` by hand.

```bash
npm ci
npm run build:all        # nx run-many, --parallel=false
npm run test:all
npm run lint:all
npm run format:check     # prettier; CI runs this together with lint:all
npm run format:write
```

Each target also exists per package, as `<target>:<package>` — the package is the directory name
under `packages/`, without the `@koobiq/` scope:

```bash
npm run build:luxon-date-adapter
npm run test:luxon-date-adapter
npm run lint:luxon-date-adapter
```

Narrowing a test run — jest options go after `--`. The executor is `@nx/jest:jest`, which takes
named options, **not** jest's short flags:

```bash
npm run test:luxon-date-adapter -- --testFile=packages/luxon-date-adapter/src/adapter.spec.ts
npm run test:date-formatter -- --testNamePattern="duration"
npm run test:native-date-adapter -- --updateSnapshot
```

An unrecognized flag (`-t`, `-u`) is silently dropped, and Nx then hashes to the same cache key as
the unfiltered run and replays the whole suite from cache. Add `--skip-nx-cache` when a filtered run
reports more tests than the filter should match.

## Architecture

Three layers, one npm package each, all released together on a single version:

1. **`@koobiq/date-adapter`** — the abstract `DateAdapter<D>` class and `DateAdapterConfig`. No
   runtime dependencies; everything else depends only on this.
2. **Four adapters** — `luxon-`, `moment-`, `native-`, `internationalized-date-adapter`. Each binds
   `DateAdapter<D>` to a concrete date type (`DateTime`, `Moment`, `Date`, `CalendarDateTime`).
3. **`@koobiq/date-formatter`** — `DateFormatter<D>` plus per-locale ICU MessageFormat templates. It
   never imports a date library; it only calls the adapter it was constructed with.

### How formatting actually works

`DateFormatter` compiles ICU MessageFormat strings from `templates/<locale>.ts`. The variables inside
those templates (`{DATE}`, `{TIME}`, `{SHORT_DATE}`, `{YEAR}`…) are **not** filled by the formatter:
`compileVariables()` looks each name up in `adapter.config.variables`, where the value is a _format
token string_, and renders it with `adapter.format(date, token)`.

Two consequences that catch people out:

-   Those token strings are written in **each adapter's own dialect**. `moment-date-adapter` locales use
    moment tokens (`D`, `YYYY`); luxon, native and internationalized use luxon-style tokens (`d`,
    `yyyy`). A token copied between adapters will silently render wrong.
-   Adding a new template variable is a change across **every** adapter's locale files, not just the
    formatter template.

Branching in templates is driven by string flags the formatter sets to `'yes'` / `'no'` and feeds to
ICU `select`: `CURRENT_YEAR`, `SAME_MONTH`, `SAME_DAY`, `SHOW_SECONDS`, `SHOW_MILLISECONDS`,
`RANGE_TYPE`. Relative dates ("Yesterday", "Today") come from `adapter.daysFromToday()`; range
collapsing from `adapter.hasSame()`.

### Two different kinds of locale file

-   `packages/date-formatter/src/templates/<locale>.ts` → `FormatterConfig`: the sentence templates
    (relative / absolute / range / duration, each in short and long variants).
-   `packages/<x>-date-adapter/src/locales/<locale>.ts` → `DateAdapterConfig`: token `variables`, month
    and weekday names, `firstDayOfWeek`.

They are selected independently — `new DateFormatter(adapter, localeName)` takes both, and
`formatter.setLocale()` forwards to `adapter.setLocale()`. Coverage is not uniform: the formatter
templates and the luxon / moment / native adapters ship `en-US`, `ru-RU`, `es-LA`, `pt-BR`, `zh-CN`,
`fa-IR`, `tk-TM`; `internationalized-date-adapter` ships only `en-US` and `ru-RU`.

`fa-IR` is the RTL case: `DateFormatter` enables MessageFormat `biDiSupport` when
`adapter.config.name == 'fa-IR'`.

### Adapter-specific things worth knowing before editing

-   **native** — formats from its config alone and never touches `Intl`, so output is byte-identical
    across runtimes. That requires `NativeDateAdapterConfig`, which extends the shared config with
    `monthNames.longFormatted` (`марта` inside a date vs standalone `Март`). It supports the fixed token
    set in `formatToken()`, nothing more.
-   **internationalized** — `format()` short-circuits when `displayFormat` is exactly the `DATE` or
    `SHORT_DATE` variable and composes the date instead of substituting tokens. `@internationalized/date`
    has no duration type, so `durationObjectFromDates` estimates from fixed unit sizes and then refines.
-   **moment** — maps standard locale names onto moment's ids in both directions (`ru-RU` ↔ `ru`), and
    mutates moment's global locale data via `updateLocaleData`.
-   **luxon** — thin; the closest thing to a reference implementation.

## Tests

-   `jest.preset.js` sets `process.env.TZ = 'UTC'` for the whole workspace. Assertions compare against
    fixed instants and previously encoded the authors' local zone. Keep expectations zone-independent
    and do not remove the pin.
-   Snapshots live in `src/__snapshots__/` and are excluded from prettier. When a formatting change is
    intentional, regenerate them and include the snapshot diff in the PR — `CONTRIBUTING.md` treats an
    unaccompanied formatting change as unreviewable.
-   `date-adapter` has no specs (`passWithNoTests: true` in `nx.json`).
-   The native and internationalized adapter specs import `@koobiq/date-formatter` and assert through it
    — those are integration tests over the token contract described above, not unit tests of the adapter.
-   `**/*.spec.ts` is ignored by the root ESLint config, so lint rules do not apply to test files.

## TypeScript and build

-   `tsconfig.base.json` maps `@koobiq/*` to package sources, so in-repo imports resolve without a build.
-   `tsconfig.lib.json` sets `"types": []` on purpose: library sources must not reach for `@types/node`
    or Node globals. Specs get `"types": ["jest"]`. See commit `2a9b8b1`.
-   Builds go through `@nx/rollup:rollup` with `compiler: "tsc"` to `dist/<package>` in both esm and cjs.
-   Adapters declare `@koobiq/date-adapter` (and their date library) as **peer** dependencies.

## Contributions and releases

-   Prettier: 4-space indent, single quotes, 120 columns, no trailing commas, sorted imports.
-   PRs are squash-merged with the **PR title** as the commit subject, so the title is what commitlint
    checks in CI. Conventional Commits; the scope enum is generated from the `packages/` directory names
    plus `adapter | formatter | build | release | deps | deps-dev`. The title also drives the labels
    (`.github/workflows/pr-label.yml`) and the release notes.
-   `npm run release:stage:commit` (nx release) bumps every package and updates `CHANGELOG.md`; pushing
    the resulting `<version>` tag is what publishes to npm. Maintainer-only — do not run it speculatively.
-   Dependabot deliberately holds majors for `nx`/`@nx/*`, `typescript`, `eslint`, `@koobiq/cli` and
    `@types/node`; `.github/dependabot.yml` explains each. Upgrade those by hand, together.
