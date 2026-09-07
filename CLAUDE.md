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
npm run format:check     # prettier over packages/ only; CI runs this together with lint:all
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

Every test run warns that `@nx/jest:jest` is deprecated in favour of inferred targets. That is
expected. Converting (`nx g @nx/jest:convert-to-inferred`) is a deliberate migration that has to
carry over the extra `inputs` on `date-formatter`'s test target (see Tests) — not something to do
in passing.

## Architecture

Three layers, one npm package each, all released together on a single version:

1. **`@koobiq/date-adapter`** — the abstract `DateAdapter<D>` class and `DateAdapterConfig`. No
   runtime dependencies; everything else depends only on this.
2. **Four adapters** — `luxon-`, `moment-`, `native-`, `internationalized-date-adapter`. Each binds
   `DateAdapter<D>` to a concrete date type (`DateTime`, `Moment`, `Date`, `CalendarDateTime`).
3. **`@koobiq/date-formatter`** — `DateFormatter<D>` plus per-locale ICU MessageFormat templates. It
   never imports a date library; it only calls the adapter it was constructed with. Its _specs_ do
   import all four adapters (see below), which is why they type-check those packages' sources.

`DateAdapter<D>` mirrors Angular Material's `DateAdapter` (the doc comments still mention
`<mat-datepicker>`) plus the methods the formatter needs on top: `hasSame`, `daysFromToday`,
`diffNow`, `startOf`, `addCalendarUnits`, `durationObjectFromDates`, `durationAs`,
`durationFormat`. Those, with `format`, `today` and `setLocale`, are what a new adapter has to get
right for the formatter. The packages are consumed by
[koobiq/angular-components](https://github.com/koobiq/angular-components), which only wraps them in
Angular DI — a formatting change here reaches it through a release, never directly.

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

The public surface is four method families: `relative{Short,Long}Date[Time]`,
`absolute{Short,Long}Date[Time]`, `range{Short,Middle,Long}Date[Time]` and
`duration{Shortest,Short,Long}`. A `null` start or end on a range method selects the `openedRange`
templates ("From …" / "Until …"). The methods throw `Invalid date` on an invalid input instead of
returning a string.

Branching in templates is driven by string flags the formatter sets and feeds to ICU `select`:
`CURRENT_YEAR`, `SAME_MONTH`, `SAME_DAY`, `SHOW_SECONDS`, `SHOW_MILLISECONDS` (`'yes'` / `'no'`) and
`RANGE_TYPE` (`'onlyStart'` / `'onlyEnd'`). Relative dates ("Yesterday", "Today") come from
`adapter.daysFromToday()`; range collapsing from `adapter.hasSame()`.

### Two different kinds of locale file

-   `packages/date-formatter/src/templates/<locale>.ts` → `FormatterConfig`: the sentence templates.
    Relative and absolute come in `short` / `long`; closed ranges in `short` / `middle` / `long` and
    opened ranges in `short` / `long`; durations in `shortest` (numeric) / `short` / `long`.
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
    `SHORT_DATE` variable and composes the date instead of substituting tokens. Long month names
    (`MMMM`, and the month inside `DATE`) come from `Intl.DateTimeFormat` with the config as fallback,
    so unlike native they depend on the runtime's ICU data. `@internationalized/date` has no duration
    type, so `durationObjectFromDates` estimates from fixed unit sizes and then refines.
-   **moment** — maps standard locale names onto moment's ids in both directions (`ru-RU` ↔ `ru`) and
    applies the locale per instance (`.locale(this.locale)`), not globally; the one global side effect
    is `moment.locale('en')` at import, so the bundled `moment/locale/fa` import does not become the
    default. `format()` goes through moment's own locale data, not this repo's `locales/` month names,
    which is why ru-RU short months come out as `мар.` where every other adapter gives `мар`.
    Durations go through `moment.duration(end.diff(start))` and `moment.utc(ms)`, so whole calendar
    years and months can floor to one less and anything past 24 hours wraps — the locale suite
    documents and pins this (see Tests).
-   **luxon** — thin; the closest thing to a reference implementation.

## Tests

-   `jest.preset.js` sets `process.env.TZ = 'UTC'` for the whole workspace. Assertions compare against
    fixed instants and previously encoded the authors' local zone. Keep expectations zone-independent
    and do not remove the pin.
-   Snapshots live in `src/__snapshots__/` and are excluded from prettier. When a formatting change is
    intentional, regenerate them and include the snapshot diff in the PR — `CONTRIBUTING.md` treats an
    unaccompanied formatting change as unreviewable.
-   `date-adapter` has no specs (`passWithNoTests: true` in `nx.json`).
-   The adapter specs are unit tests of the adapter only. Everything that asserts through `DateFormatter`
    lives in `packages/date-formatter/src`: `formatter-locales.spec.ts` runs one parametrised suite over
    all four adapters × `en-US`/`ru-RU`, `formatter-formats.spec.ts` holds the per-format cases that
    used to sit in the native and internationalized specs, and `formatter.spec.ts` is a small luxon-only
    duration suite. That is why `date-formatter`'s `test` target declares the four adapter source trees
    in its `inputs` — without them Nx caches it against the wrong hash and replays a green run after an
    adapter changes.
-   Conventions in `formatter-locales.spec.ts`, to keep when adding cases: only the template words
    ("Today", "С … по …") are spelled out; anything token-shaped is read back from
    `adapter.config.variables`, so one expectation covers every adapter dialect, and a snapshot per
    adapter × locale pins the literal output as the other half of the check. `today()` is pinned by
    assigning it on the adapter instance (or by subclassing, as `FixedTodayAdapter` does in
    `formatter-formats.spec.ts`), never with fake timers.
-   Moment's duration divergences are documented at its `runFormatterSuite` registration at the bottom
    of `formatter-locales.spec.ts`; the year and month cases are skipped there and written to pass once
    the adapter is fixed — unskip them rather than weaken them.
-   `**/*.spec.ts` is ignored by the root ESLint config, so lint rules do not apply to test files.

## TypeScript and build

-   `tsconfig.base.json` maps `@koobiq/*` to package sources, so in-repo imports resolve without a build.
-   `tsconfig.lib.json` sets `"types": []` on purpose: library sources must not reach for `@types/node`
    or Node globals. Specs get `"types": ["jest"]`. See commit `2a9b8b1`.
-   Builds go through `@nx/rollup:rollup` with `compiler: "tsc"` to `dist/<package>` in both esm and cjs.
-   A runtime library is declared twice: in the root `package.json` `dependencies`, which is what the
    workspace installs for tests and builds, and as a **peer** dependency of the package that uses it —
    adapters peer on `@koobiq/date-adapter` and their date library, `date-formatter` on
    `@koobiq/date-adapter` and `@messageformat/core`. Add a new one in both places.

## Contributions and releases

-   Prettier: 4-space indent, single quotes, 120 columns, no trailing commas, sorted imports.
-   PRs are squash-merged with the **PR title** as the commit subject, so the title is what commitlint
    checks in CI. Conventional Commits; the scope enum is generated from the `packages/` directory names
    plus `adapter | formatter | build | release | deps | deps-dev`. The title also drives the labels
    (`.github/workflows/pr-label.yml`) and the release notes.
-   Local commits are checked too: husky's `commit-msg` hook runs commitlint on the message, and
    `pre-commit` runs lint-staged — Prettier rewrites every staged file (markdown included; the `-   `
    list markers in this file are its doing) and `eslint --fix` runs on staged non-spec `.ts`.
    `format:check` covers only `packages/`, so root markdown is formatted by the hook alone.
-   `npm run release:stage:commit` (nx release) bumps every package and updates `CHANGELOG.md`; pushing
    the resulting `<version>` tag is what publishes to npm. Maintainer-only — do not run it speculatively.
-   Dependabot deliberately holds majors for `nx`/`@nx/*`, `typescript`, `eslint`, `@koobiq/cli` and
    `@types/node`; `.github/dependabot.yml` explains each. Upgrade those by hand, together.
