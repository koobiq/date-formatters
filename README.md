# Koobiq Date Formatters

[![npm latest version](https://img.shields.io/npm/v/@koobiq/date-formatter/latest.svg?color=brightgreen)](https://www.npmjs.com/package/@koobiq/date-formatter)
[![downloads](https://img.shields.io/npm/dm/@koobiq/date-formatter.svg?color=brightgreen)](https://www.npmjs.com/package/@koobiq/date-formatter)

[Documentation](https://koobiq.io/en) • [Angular components](https://github.com/koobiq/angular-components)

Framework-agnostic date adapters and localized date formatting for
[Koobiq](https://koobiq.io), an open-source design system focused on products related to
**information security**.

The date adapters wrap a concrete date library behind one interface, so a consumer can switch
between Luxon, Moment, the native `Date` and `@internationalized/date` without touching the code
that formats dates.

| Package                                                                                        | Description                                      |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [`@koobiq/date-adapter`](/packages/date-adapter/README.md)                                     | Abstract date adapter and format definitions     |
| [`@koobiq/date-formatter`](/packages/date-formatter/README.md)                                 | Localized date, range and duration formatting    |
| [`@koobiq/luxon-date-adapter`](/packages/luxon-date-adapter/README.md)                         | Luxon implementation of the date adapter         |
| [`@koobiq/moment-date-adapter`](/packages/moment-date-adapter/README.md)                       | Moment implementation of the date adapter        |
| [`@koobiq/native-date-adapter`](/packages/native-date-adapter/README.md)                       | Native `Date` implementation of the date adapter |
| [`@koobiq/internationalized-date-adapter`](/packages/internationalized-date-adapter/README.md) | `@internationalized/date` implementation         |

Supported locales: `en-US`, `ru-RU`, `es-LA`, `pt-BR`, `zh-CN`, `fa-IR`, `tk-TM`.

## Installation

```bash
npm install @koobiq/date-formatter @koobiq/luxon-date-adapter
```

Pick the adapter that matches the date library already in your project; `@koobiq/date-adapter`
is pulled in as a peer dependency.

## Development

This is an [Nx](https://nx.dev) monorepo. Node.js version is pinned in [`.nvmrc`](/.nvmrc).

```bash
npm ci
npm run build:all
npm run test:all
npm run lint:all
```

## Contributing

See [CONTRIBUTING.md](/CONTRIBUTING.md). Pull request titles follow
[Conventional Commits](https://www.conventionalcommits.org) and are checked by CI.

## Community

-   [Join our Telegram](https://t.me/koobiq_io)
-   [GitHub Discussions](https://github.com/koobiq/angular-components/discussions)

## License

[MIT](/LICENSE)
