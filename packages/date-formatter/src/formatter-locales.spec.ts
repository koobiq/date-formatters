import { DateAdapter, DurationObjectUnits } from '@koobiq/date-adapter';
import { InternationalizedDateAdapter } from '@koobiq/internationalized-date-adapter';
import { LuxonDateAdapter } from '@koobiq/luxon-date-adapter';
import { MomentDateAdapter } from '@koobiq/moment-date-adapter';
import { NativeDateAdapter } from '@koobiq/native-date-adapter';

import { DateFormatter } from './formatter';

/**
 * A locale contributes two independent things to a formatted date: the token strings in the adapter's
 * own locale config (`d MMMM` in ru-RU against `MMMM d` in en-US, `D`/`YYYY` in moment against
 * `d`/`yyyy` in luxon), and the sentence fragments the formatter template supplies around them
 * ("Сегодня" against "Today"). Only the second kind is spelled out here. Everything token-shaped is
 * read back from `adapter.config.variables`, so one expectation covers every locale and every adapter
 * dialect — and the snapshots at the bottom of this file are what stops a wrong token in a locale
 * config from shifting both sides of such an expectation together.
 */
type TemplateWords = {
    today: string;
    yesterday: string;
    tomorrow: string;
    from: string;
    until: string;
    /** joins a date to the year qualifying it: `d MMM yyyy` in ru-RU, `MMM d, yyyy` in en-US */
    yearSeparator: string;
    /**
     * The same join inside an opened range. It is its own field because the en-US opened-range
     * templates put a bare space where every other en-US template puts a comma — "Until Mar 16 2027"
     * against "Mar 16, 2027". That looks unintended, but it is what the templates ship, so it is
     * pinned here rather than quietly normalised.
     */
    openedYearSeparator: string;
    /**
     * `rangeLongDateTime` is the one closed range written as prose instead of joined with a dash, and
     * the words are not derivable from `from`/`until`: en-US closes with "to", not "until", and opens
     * with a plain space where every other en-US template uses a non-breaking one.
     */
    longRange: {
        /** opens a range whose ends fall on different days */
        open: string;
        /** opens the time part when both ends fall on the same day */
        sameDayOpen: string;
        /** joins the two ends, in both shapes */
        join: string;
    };
};

const templateWords: Record<string, TemplateWords> = {
    'ru-RU': {
        today: 'Сегодня',
        yesterday: 'Вчера',
        tomorrow: 'Завтра',
        from: 'С',
        until: 'По',
        yearSeparator: ' ',
        openedYearSeparator: ' ',
        longRange: { open: 'С\u00A0', sameDayOpen: 'с\u00A0', join: ' по\u00A0' }
    },
    'en-US': {
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        from: 'From',
        until: 'Until',
        yearSeparator: ', ',
        openedYearSeparator: ' ',
        longRange: { open: 'From ', sameDayOpen: 'from\u00A0', join: ' to\u00A0' }
    }
};

type DurationUnitKey = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';

/** unit names keyed by the `Intl.PluralRules` category the amount selects */
type PluralForms = Record<DurationUnitKey, Record<string, string>>;

type DurationWords = {
    long: { units: PluralForms; separator: string };
    short: { units: PluralForms; separator: string; millisecondsSeparator: string };
    /** the numeric `durationShortest` form has its own separator, which need not match the text one */
    shortestMillisecondsSeparator: string;
};

const durationWords: Record<string, DurationWords> = {
    'ru-RU': {
        long: {
            separator: ' и ',
            units: {
                years: { one: 'год', few: 'года', many: 'лет' },
                months: { one: 'месяц', few: 'месяца', many: 'месяцев' },
                weeks: { one: 'неделя', few: 'недели', many: 'недель' },
                days: { one: 'день', few: 'дня', many: 'дней' },
                hours: { one: 'час', few: 'часа', many: 'часов' },
                minutes: { one: 'минута', few: 'минуты', many: 'минут' },
                seconds: { one: 'секунда', few: 'секунды', many: 'секунд' }
            }
        },
        short: {
            separator: ' ',
            millisecondsSeparator: ',',
            units: {
                years: { one: 'г', few: 'г', many: 'л' },
                months: { one: 'мес', few: 'мес', many: 'мес' },
                weeks: { one: 'нед', few: 'нед', many: 'нед' },
                days: { one: 'д', few: 'д', many: 'д' },
                hours: { one: 'ч', few: 'ч', many: 'ч' },
                minutes: { one: 'мин', few: 'мин', many: 'мин' },
                seconds: { one: 'с', few: 'с', many: 'с' }
            }
        },
        shortestMillisecondsSeparator: ','
    },
    'en-US': {
        long: {
            separator: ' ',
            units: {
                years: { one: 'year', other: 'years' },
                months: { one: 'month', other: 'months' },
                weeks: { one: 'week', other: 'weeks' },
                days: { one: 'day', other: 'days' },
                hours: { one: 'hour', other: 'hours' },
                minutes: { one: 'minute', other: 'minutes' },
                seconds: { one: 'second', other: 'seconds' }
            }
        },
        short: {
            separator: ' ',
            millisecondsSeparator: '.',
            units: {
                years: { one: 'y', other: 'y' },
                months: { one: 'mo', other: 'mo' },
                weeks: { one: 'w', other: 'w' },
                days: { one: 'd', other: 'd' },
                hours: { one: 'h', other: 'h' },
                minutes: { one: 'min', other: 'min' },
                seconds: { one: 's', other: 's' }
            }
        },
        shortestMillisecondsSeparator: ','
    }
};

/**
 * The subset of `DateAdapterConfig.variables` these expectations are written against, lifted out of
 * the config's index signature once so the tests below can read the tokens by name.
 */
const tokensOf = <D>(adapter: DateAdapter<D>) => {
    const read = (name: string): string => adapter.config.variables[name];

    return {
        YEAR: read('YEAR'),
        DAY: read('DAY'),
        TIME: read('TIME'),
        SECONDS: read('SECONDS'),
        MILLISECONDS: read('MILLISECONDS'),
        DATE: read('DATE'),
        SHORT_DATE: read('SHORT_DATE'),
        DASH: read('DASH'),
        LONG_DASH: read('LONG_DASH'),
        NBSP: read('NBSP')
    };
};

/**
 * June 15th, kept fixed so that "today", "current year" and every relative branch resolve to the same
 * thing on every run. `today()` is reassigned rather than overridden in a subclass: the adapters call
 * into overridable members from their own constructor, while a subclass's fields are still undefined.
 */
const FIXED_TODAY = { year: 2026, month: 5, day: 15 } as const;

type SuiteOptions = {
    /**
     * Units whose duration the adapter derives from an average unit length instead of from the calendar,
     * which makes it report one less than every other adapter for a whole number of them. Cases resting
     * on such a unit are skipped rather than given a weaker expectation, so the day the adapter is fixed
     * they start passing as written.
     */
    approximateDurationUnits?: DurationUnitKey[];
};

const runFormatterSuite = <D>(
    adapterName: string,
    createAdapter: (locale: string) => DateAdapter<D>,
    { approximateDurationUnits = [] }: SuiteOptions = {}
) => {
    describe(`DateFormatter with ${adapterName}`, () => {
        for (const locale of Object.keys(templateWords)) {
            describe(locale, () => {
                const w = templateWords[locale];

                let adapter: DateAdapter<D>;
                let formatter: DateFormatter<D>;
                let today: D;
                /** the tokens this locale renders dates with, straight from the adapter's own config */
                let v: ReturnType<typeof tokensOf>;

                const shift = (date: D, amount: DurationObjectUnits): D => adapter.addCalendarUnits(date, amount);

                /**
                 * `startOf` is destructive on a mutable date type — `MomentDateAdapter` forwards straight to
                 * moment's in-place `startOf` — so it is only ever given a copy, never the caller's instance.
                 */
                const startOfDay = (date: D): D => adapter.startOf(shift(date, {}), 'day');

                /** `endOf('day')` has no adapter-level equivalent: walk to the next midnight and step back */
                const endOfDay = (date: D): D => shift(startOfDay(shift(date, { days: 1 })), { milliseconds: -1 });

                /** the three instants a relative day has to collapse to the same word */
                const acrossDay = (date: D): D[] => [startOfDay(date), date, endOfDay(date)];

                beforeEach(() => {
                    adapter = createAdapter(locale);

                    today = adapter.createDateTime(FIXED_TODAY.year, FIXED_TODAY.month, FIXED_TODAY.day, 0, 0, 0, 0);
                    adapter.today = () => today;

                    formatter = new DateFormatter<D>(adapter, locale);
                    formatter.setLocale(locale);

                    v = tokensOf(adapter);
                });

                describe('relative formats', () => {
                    describe('Relative short (relativeShortDate method)', () => {
                        it('before yesterday (other year)', () => {
                            const date = shift(adapter.createDate(2015), { days: -3 });

                            expect(formatter.relativeShortDate(date)).toBe(
                                adapter.format(date, `${v.SHORT_DATE}${w.yearSeparator}${v.YEAR}`)
                            );
                        });

                        it('before yesterday, more than 2 days ago', () => {
                            for (const days of [-3, -5]) {
                                const date = shift(today, { days });

                                expect(formatter.relativeShortDate(date)).toBe(
                                    adapter.format(date, `${v.SHORT_DATE}, ${v.TIME}`)
                                );
                            }
                        });

                        it('yesterday', () => {
                            for (const date of acrossDay(shift(today, { days: -1 }))) {
                                expect(formatter.relativeShortDate(date)).toBe(
                                    `${w.yesterday}, ${adapter.format(date, v.TIME)}`
                                );
                            }
                        });

                        it('today', () => {
                            for (const date of acrossDay(today)) {
                                expect(formatter.relativeShortDate(date)).toBe(
                                    `${w.today}, ${adapter.format(date, v.TIME)}`
                                );
                            }
                        });

                        it('tomorrow', () => {
                            for (const date of acrossDay(shift(today, { days: 1 }))) {
                                expect(formatter.relativeShortDate(date)).toBe(
                                    `${w.tomorrow}, ${adapter.format(date, v.TIME)}`
                                );
                            }
                        });

                        it('after tomorrow (current year)', () => {
                            for (const days of [3, 5]) {
                                const date = shift(today, { days });

                                expect(formatter.relativeShortDate(date)).toBe(
                                    adapter.format(date, `${v.SHORT_DATE}, ${v.TIME}`)
                                );
                            }
                        });

                        it('after tomorrow (other year)', () => {
                            const date = shift(today, { years: 1 });

                            expect(formatter.relativeShortDate(date)).toBe(
                                adapter.format(date, `${v.SHORT_DATE}${w.yearSeparator}${v.YEAR}`)
                            );
                        });

                        it('with milliseconds', () => {
                            expect(formatter.relativeShortDateTime(today, { milliseconds: true })).toBe(
                                `${w.today}, ${adapter.format(today, `${v.TIME}:${v.SECONDS}${v.MILLISECONDS}`)}`
                            );
                        });

                        it('with seconds', () => {
                            expect(formatter.relativeShortDateTime(today, { seconds: true })).toBe(
                                `${w.today}, ${adapter.format(today, `${v.TIME}:${v.SECONDS}`)}`
                            );
                        });
                    });

                    describe('Relative long (relativeLongDate method)', () => {
                        it('before yesterday (other year)', () => {
                            const date = shift(adapter.createDate(2015), { days: -3 });

                            expect(formatter.relativeLongDate(date)).toBe(
                                adapter.format(date, `${v.DATE}${w.yearSeparator}${v.YEAR}`)
                            );
                        });

                        it('before yesterday, more than 2 days ago', () => {
                            for (const days of [-3, -5]) {
                                const date = shift(today, { days });

                                expect(formatter.relativeLongDate(date)).toBe(
                                    adapter.format(date, `${v.DATE}, ${v.TIME}`)
                                );
                            }
                        });

                        it('yesterday', () => {
                            for (const date of acrossDay(shift(today, { days: -1 }))) {
                                expect(formatter.relativeLongDate(date)).toBe(
                                    `${w.yesterday}, ${adapter.format(date, v.TIME)}`
                                );
                            }
                        });

                        it('today', () => {
                            for (const date of acrossDay(today)) {
                                expect(formatter.relativeLongDate(date)).toBe(
                                    `${w.today}, ${adapter.format(date, v.TIME)}`
                                );
                            }
                        });

                        it('tomorrow', () => {
                            for (const date of acrossDay(shift(today, { days: 1 }))) {
                                expect(formatter.relativeLongDate(date)).toBe(
                                    `${w.tomorrow}, ${adapter.format(date, v.TIME)}`
                                );
                            }
                        });

                        it('after tomorrow (current year)', () => {
                            for (const days of [3, 5]) {
                                const date = shift(today, { days });

                                expect(formatter.relativeLongDate(date)).toBe(
                                    adapter.format(date, `${v.DATE}, ${v.TIME}`)
                                );
                            }
                        });

                        it('after tomorrow (other year)', () => {
                            const date = shift(today, { years: 1 });

                            expect(formatter.relativeLongDate(date)).toBe(
                                adapter.format(date, `${v.DATE}${w.yearSeparator}${v.YEAR}`)
                            );
                        });

                        it('with milliseconds', () => {
                            expect(formatter.relativeLongDateTime(today, { milliseconds: true })).toBe(
                                `${w.today}, ${adapter.format(today, `${v.TIME}:${v.SECONDS}${v.MILLISECONDS}`)}`
                            );
                        });

                        it('with seconds', () => {
                            expect(formatter.relativeLongDateTime(today, { seconds: true })).toBe(
                                `${w.today}, ${adapter.format(today, `${v.TIME}:${v.SECONDS}`)}`
                            );
                        });
                    });
                });

                describe('absolute formats', () => {
                    describe('Absolute short (absoluteShortDate/Time method)', () => {
                        it('absoluteShortDate', () => {
                            expect(formatter.absoluteShortDate(today)).toBe(adapter.format(today, v.SHORT_DATE));
                        });

                        it('absoluteShortDate (current year forced shown)', () => {
                            expect(formatter.absoluteShortDate(today, true)).toBe(
                                adapter.format(today, `${v.SHORT_DATE}${w.yearSeparator}${v.YEAR}`)
                            );
                        });

                        it('absoluteShortDate (other year)', () => {
                            const date = adapter.createDate(2015);

                            expect(formatter.absoluteShortDate(date)).toBe(
                                adapter.format(date, `${v.SHORT_DATE}${w.yearSeparator}${v.YEAR}`)
                            );
                        });

                        it('absoluteShortDateTime', () => {
                            expect(formatter.absoluteShortDateTime(today)).toBe(
                                adapter.format(today, `${v.SHORT_DATE}, ${v.TIME}`)
                            );
                        });

                        it('absoluteShortDateTime (current year forced shown)', () => {
                            expect(formatter.absoluteShortDateTime(today, { currYear: true })).toBe(
                                adapter.format(today, `${v.SHORT_DATE}${w.yearSeparator}${v.YEAR}, ${v.TIME}`)
                            );
                        });

                        it('absoluteShortDateTime (other year)', () => {
                            const date = adapter.createDate(2015);

                            expect(formatter.absoluteShortDateTime(date)).toBe(
                                adapter.format(date, `${v.SHORT_DATE}${w.yearSeparator}${v.YEAR}, ${v.TIME}`)
                            );
                        });

                        it('absoluteShortDateTime with milliseconds', () => {
                            expect(formatter.absoluteShortDateTime(today, { milliseconds: true })).toBe(
                                adapter.format(today, `${v.SHORT_DATE}, ${v.TIME}:${v.SECONDS}${v.MILLISECONDS}`)
                            );
                        });

                        it('absoluteShortDateTime with milliseconds (current year forced shown)', () => {
                            expect(formatter.absoluteShortDateTime(today, { milliseconds: true, currYear: true })).toBe(
                                adapter.format(
                                    today,
                                    `${v.SHORT_DATE}${w.yearSeparator}${v.YEAR}, ${v.TIME}:${v.SECONDS}${v.MILLISECONDS}`
                                )
                            );
                        });

                        it('absoluteShortDateTime with seconds', () => {
                            expect(formatter.absoluteShortDateTime(today, { seconds: true })).toBe(
                                adapter.format(today, `${v.SHORT_DATE}, ${v.TIME}:${v.SECONDS}`)
                            );
                        });

                        it('absoluteShortDateTime with seconds (current year forced shown)', () => {
                            expect(formatter.absoluteShortDateTime(today, { seconds: true, currYear: true })).toBe(
                                adapter.format(
                                    today,
                                    `${v.SHORT_DATE}${w.yearSeparator}${v.YEAR}, ${v.TIME}:${v.SECONDS}`
                                )
                            );
                        });
                    });

                    describe('Absolute long (absoluteLongDate/Time method)', () => {
                        it('absoluteLongDate', () => {
                            expect(formatter.absoluteLongDate(today)).toBe(adapter.format(today, v.DATE));
                        });

                        it('absoluteLongDate (current year forced shown)', () => {
                            expect(formatter.absoluteLongDate(today, true)).toBe(
                                adapter.format(today, `${v.DATE}${w.yearSeparator}${v.YEAR}`)
                            );
                        });

                        it('absoluteLongDate (other year)', () => {
                            const date = adapter.createDate(2015);

                            expect(formatter.absoluteLongDate(date)).toBe(
                                adapter.format(date, `${v.DATE}${w.yearSeparator}${v.YEAR}`)
                            );
                        });

                        it('absoluteLongDateTime', () => {
                            expect(formatter.absoluteLongDateTime(today)).toBe(
                                adapter.format(today, `${v.DATE}, ${v.TIME}`)
                            );
                        });

                        it('absoluteLongDateTime (current year forced shown)', () => {
                            expect(formatter.absoluteLongDateTime(today, { currYear: true })).toBe(
                                adapter.format(today, `${v.DATE}${w.yearSeparator}${v.YEAR}, ${v.TIME}`)
                            );
                        });

                        it('absoluteLongDateTime (other year)', () => {
                            const date = adapter.createDate(2015);

                            expect(formatter.absoluteLongDateTime(date)).toBe(
                                adapter.format(date, `${v.DATE}${w.yearSeparator}${v.YEAR}, ${v.TIME}`)
                            );
                        });

                        it('absoluteLongDateTime with milliseconds', () => {
                            expect(formatter.absoluteLongDateTime(today, { milliseconds: true })).toBe(
                                adapter.format(today, `${v.DATE}, ${v.TIME}:${v.SECONDS}${v.MILLISECONDS}`)
                            );
                        });

                        it('absoluteLongDateTime with milliseconds (current year forced shown)', () => {
                            expect(formatter.absoluteLongDateTime(today, { milliseconds: true, currYear: true })).toBe(
                                adapter.format(
                                    today,
                                    `${v.DATE}${w.yearSeparator}${v.YEAR}, ${v.TIME}:${v.SECONDS}${v.MILLISECONDS}`
                                )
                            );
                        });

                        it('absoluteLongDateTime with seconds', () => {
                            expect(formatter.absoluteLongDateTime(today, { seconds: true })).toBe(
                                adapter.format(today, `${v.DATE}, ${v.TIME}:${v.SECONDS}`)
                            );
                        });

                        it('absoluteLongDateTime with seconds (current year forced shown)', () => {
                            expect(formatter.absoluteLongDateTime(today, { seconds: true, currYear: true })).toBe(
                                adapter.format(today, `${v.DATE}${w.yearSeparator}${v.YEAR}, ${v.TIME}:${v.SECONDS}`)
                            );
                        });
                    });
                });

                describe('range formats', () => {
                    /** the first of the month "today" falls in, so start and end share a month */
                    const firstOfMonth = () =>
                        adapter.createDateTime(FIXED_TODAY.year, FIXED_TODAY.month, 1, 0, 0, 0, 0);
                    /** mid-January of the same year, so start and end differ in month but not in year */
                    const midJanuary = () => adapter.createDateTime(FIXED_TODAY.year, 0, 15, 0, 0, 0, 0);
                    const withYear = (token: string) => `${token}${w.yearSeparator}${v.YEAR}`;
                    /**
                     * A range inside one month drops the repeated month from one end, and which end keeps
                     * the bare day follows the order the locale writes dates in: "1–11 июня" against
                     * "Jun 1–11".
                     */
                    const dayLeads = () => v.DATE.startsWith(v.DAY);

                    describe('closed range', () => {
                        const closedDate = (
                            label: string,
                            method: string,
                            token: () => string,
                            call: (start: D, end: D) => string
                        ) => {
                            describe(`Range ${label} (${method} method)`, () => {
                                it(method, () => {
                                    const start = firstOfMonth();
                                    const end = shift(start, { days: 10 });
                                    const [startFormat, endFormat] = dayLeads() ? [v.DAY, token()] : [token(), v.DAY];

                                    expect(call(start, end)).toBe(
                                        `${adapter.format(start, startFormat)}${v.DASH}${adapter.format(
                                            end,
                                            endFormat
                                        )}`
                                    );
                                });

                                it(`${method} (other month)`, () => {
                                    const start = midJanuary();
                                    const end = shift(start, { months: 1 });

                                    expect(call(start, end)).toBe(
                                        `${adapter.format(start, token())}${v.LONG_DASH}${adapter.format(end, token())}`
                                    );
                                });

                                it(`${method} (startDate is other year)`, () => {
                                    const start = shift(today, { years: -1 });

                                    expect(call(start, today)).toBe(
                                        `${adapter.format(start, withYear(token()))}${v.LONG_DASH}${adapter.format(
                                            today,
                                            withYear(token())
                                        )}`
                                    );
                                });

                                it(`${method} (endDate is other year)`, () => {
                                    const end = shift(today, { years: 1 });

                                    expect(call(today, end)).toBe(
                                        `${adapter.format(today, withYear(token()))}${v.LONG_DASH}${adapter.format(
                                            end,
                                            withYear(token())
                                        )}`
                                    );
                                });
                            });
                        };

                        const closedDateTime = (
                            label: string,
                            method: string,
                            token: () => string,
                            call: (start: D, end: D, options?: { seconds?: boolean; milliseconds?: boolean }) => string
                        ) => {
                            describe(`Range ${label} (${method} method)`, () => {
                                const dateTime = () => `${token()}, ${v.TIME}`;

                                it(method, () => {
                                    const start = firstOfMonth();
                                    const end = shift(start, { days: 10 });

                                    expect(call(start, end)).toBe(
                                        `${adapter.format(start, dateTime())}${v.LONG_DASH}${adapter.format(
                                            end,
                                            dateTime()
                                        )}`
                                    );
                                });

                                it(`${method} (same day)`, () => {
                                    const end = shift(today, { minutes: 1 });

                                    expect(call(today, end)).toBe(
                                        `${adapter.format(today, v.TIME)}${v.DASH}${adapter.format(
                                            end,
                                            `${v.TIME}, ${token()}`
                                        )}`
                                    );
                                });

                                it(`${method} (same day, other year)`, () => {
                                    const start = shift(today, { years: -1 });
                                    const end = shift(start, { minutes: 1 });

                                    expect(call(start, end)).toBe(
                                        `${adapter.format(start, v.TIME)}${v.DASH}${adapter.format(
                                            end,
                                            `${v.TIME}, ${withYear(token())}`
                                        )}`
                                    );
                                });

                                it(`${method} (other month)`, () => {
                                    const start = midJanuary();
                                    const end = shift(start, { months: 1 });

                                    expect(call(start, end)).toBe(
                                        `${adapter.format(start, dateTime())}${v.LONG_DASH}${adapter.format(
                                            end,
                                            dateTime()
                                        )}`
                                    );
                                });

                                it(`${method} (startDate is other year)`, () => {
                                    const start = shift(today, { years: -1 });
                                    const format = `${withYear(token())}, ${v.TIME}`;

                                    expect(call(start, today)).toBe(
                                        `${adapter.format(start, format)}${v.LONG_DASH}${adapter.format(today, format)}`
                                    );
                                });

                                it(`${method} (endDate is other year)`, () => {
                                    const end = shift(today, { years: 1 });
                                    const format = `${withYear(token())}, ${v.TIME}`;

                                    expect(call(today, end)).toBe(
                                        `${adapter.format(today, format)}${v.LONG_DASH}${adapter.format(end, format)}`
                                    );
                                });

                                it(`${method} (with seconds)`, () => {
                                    const start = firstOfMonth();
                                    const end = shift(start, { days: 10 });
                                    const format = `${dateTime()}:${v.SECONDS}`;

                                    expect(call(start, end, { seconds: true })).toBe(
                                        `${adapter.format(start, format)}${v.LONG_DASH}${adapter.format(end, format)}`
                                    );
                                });

                                it(`${method} (with milliseconds)`, () => {
                                    const start = firstOfMonth();
                                    const end = shift(start, { days: 10 });
                                    const format = `${dateTime()}:${v.SECONDS}${v.MILLISECONDS}`;

                                    expect(call(start, end, { milliseconds: true })).toBe(
                                        `${adapter.format(start, format)}${v.LONG_DASH}${adapter.format(end, format)}`
                                    );
                                });
                            });
                        };

                        closedDate(
                            'short',
                            'rangeShortDate',
                            () => v.SHORT_DATE,
                            (s, e) => formatter.rangeShortDate(s, e)
                        );
                        closedDateTime(
                            'short',
                            'rangeShortDateTime',
                            () => v.SHORT_DATE,
                            (s, e, o) => formatter.rangeShortDateTime(s, e, o)
                        );
                        closedDate(
                            'long',
                            'rangeLongDate',
                            () => v.DATE,
                            (s, e) => formatter.rangeLongDate(s, e)
                        );

                        // The long datetime range is the one closed range spelled as prose rather than
                        // joined with a dash: "С 1 июня, 00:00 по 11 июня, 00:00".
                        describe('Range long (rangeLongDateTime method)', () => {
                            /**
                             * The connecting words are concatenated around `format()` rather than embedded in the
                             * format string: a literal inside a format string has to be escaped in the dialect of
                             * whichever adapter renders it (`'from'` for luxon, `[from]` for moment).
                             */
                            const acrossDays = (start: D, end: D, format: string) =>
                                `${w.longRange.open}${adapter.format(start, format)}${w.longRange.join}${adapter.format(
                                    end,
                                    format
                                )}`;

                            const withinDay = (start: D, end: D, dateFormat: string) =>
                                `${adapter.format(start, dateFormat)}, ${w.longRange.sameDayOpen}${adapter.format(
                                    start,
                                    v.TIME
                                )}${w.longRange.join}${adapter.format(end, v.TIME)}`;

                            it('rangeLongDateTime', () => {
                                const start = firstOfMonth();
                                const end = shift(start, { days: 10 });

                                expect(formatter.rangeLongDateTime(start, end)).toBe(
                                    acrossDays(start, end, `${v.DATE}, ${v.TIME}`)
                                );
                            });

                            it('rangeLongDateTime (same day)', () => {
                                const end = shift(today, { minutes: 1 });

                                expect(formatter.rangeLongDateTime(today, end)).toBe(withinDay(today, end, v.DATE));
                            });

                            it('rangeLongDateTime (same day, other year)', () => {
                                const start = shift(today, { years: -1 });
                                const end = shift(start, { minutes: 1 });

                                expect(formatter.rangeLongDateTime(start, end)).toBe(
                                    withinDay(start, end, withYear(v.DATE))
                                );
                            });

                            it('rangeLongDateTime (other month)', () => {
                                const start = midJanuary();
                                const end = shift(start, { months: 1 });

                                expect(formatter.rangeLongDateTime(start, end)).toBe(
                                    acrossDays(start, end, `${v.DATE}, ${v.TIME}`)
                                );
                            });

                            it('rangeLongDateTime (startDate is other year)', () => {
                                const start = shift(today, { years: -1 });

                                expect(formatter.rangeLongDateTime(start, today)).toBe(
                                    acrossDays(start, today, `${withYear(v.DATE)}, ${v.TIME}`)
                                );
                            });

                            it('rangeLongDateTime (endDate is other year)', () => {
                                const end = shift(today, { years: 1 });

                                expect(formatter.rangeLongDateTime(today, end)).toBe(
                                    acrossDays(today, end, `${withYear(v.DATE)}, ${v.TIME}`)
                                );
                            });
                        });
                        closedDateTime(
                            'middle',
                            'rangeMiddleDateTime',
                            () => v.DATE,
                            (s, e, o) => formatter.rangeMiddleDateTime(s, e, o)
                        );
                    });

                    describe('opened range', () => {
                        const opened = (
                            label: string,
                            method: string,
                            token: () => string,
                            withTime: boolean,
                            call: (
                                start: D | null,
                                end?: D | null,
                                options?: { seconds?: boolean; milliseconds?: boolean }
                            ) => string
                        ) => {
                            describe(`Range ${label} (${method} method)`, () => {
                                /** the year qualifies the date, so it lands before the time, not after it */
                                const shape = (date: string) => (withTime ? `${date}, ${v.TIME}` : date);
                                const withOpenedYear = (token: string) => `${token}${w.openedYearSeparator}${v.YEAR}`;

                                it('throw Error', () => {
                                    expect(() => call(null)).toThrow('Invalid date');
                                });

                                it(`${method} (only startDate)`, () => {
                                    expect(call(today)).toBe(
                                        `${w.from}${v.NBSP}${adapter.format(today, shape(token()))}`
                                    );
                                });

                                it(`${method} (only endDate)`, () => {
                                    expect(call(null, today)).toBe(
                                        `${w.until}${v.NBSP}${adapter.format(today, shape(token()))}`
                                    );
                                });

                                it(`${method} (startDate is other year)`, () => {
                                    const start = shift(today, { years: -1 });

                                    expect(call(start)).toBe(
                                        `${w.from}${v.NBSP}${adapter.format(start, shape(withOpenedYear(token())))}`
                                    );
                                });

                                it(`${method} (endDate is other year)`, () => {
                                    const end = shift(today, { years: 1 });

                                    expect(call(null, end)).toBe(
                                        `${w.until}${v.NBSP}${adapter.format(end, shape(withOpenedYear(token())))}`
                                    );
                                });

                                if (withTime) {
                                    it(`${method} (with seconds)`, () => {
                                        const format = `${shape(token())}:${v.SECONDS}`;

                                        expect(call(today, null, { seconds: true })).toBe(
                                            `${w.from}${v.NBSP}${adapter.format(today, format)}`
                                        );
                                    });

                                    it(`${method} (with milliseconds)`, () => {
                                        const format = `${shape(token())}:${v.SECONDS}${v.MILLISECONDS}`;

                                        expect(call(today, null, { milliseconds: true })).toBe(
                                            `${w.from}${v.NBSP}${adapter.format(today, format)}`
                                        );
                                    });
                                }
                            });
                        };

                        opened(
                            'short',
                            'rangeShortDate',
                            () => v.SHORT_DATE,
                            false,
                            (s, e) => formatter.rangeShortDate(s, e ?? undefined)
                        );
                        opened(
                            'short',
                            'rangeShortDateTime',
                            () => v.SHORT_DATE,
                            true,
                            (s, e, o) => formatter.rangeShortDateTime(s, e, o)
                        );
                        opened(
                            'long',
                            'rangeLongDate',
                            () => v.DATE,
                            false,
                            (s, e) => formatter.rangeLongDate(s, e)
                        );
                        opened(
                            'long',
                            'rangeLongDateTime',
                            () => v.DATE,
                            true,
                            (s, e, o) => formatter.rangeLongDateTime(s, e ?? undefined, o)
                        );
                    });
                });

                describe('Time duration', () => {
                    const d = durationWords[locale];
                    const pr = new Intl.PluralRules(locale);

                    /** every duration below is measured backwards from this instant */
                    const anchor = () => adapter.createDateTime(2023, 9, 10, 15, 0, 0, 0);
                    const before = (amount: DurationObjectUnits): D => {
                        const negated: DurationObjectUnits = {};

                        for (const [unit, value] of Object.entries(amount)) {
                            negated[unit as keyof DurationObjectUnits] = -value;
                        }

                        return shift(anchor(), negated);
                    };

                    describe('Number format', () => {
                        const seconds = 25;
                        const milliseconds = 125;
                        const minutes = 2;
                        const ms = d.shortestMillisecondsSeparator;

                        it('seconds', () => {
                            const start = before({ seconds, milliseconds });

                            expect(formatter.durationShortest(start, anchor())).toBe(`0:${seconds}`);
                        });

                        it('seconds and milliseconds', () => {
                            const start = before({ seconds, milliseconds });

                            expect(formatter.durationShortest(start, anchor(), true, true)).toBe(
                                `0:${seconds}${ms}${milliseconds}`
                            );
                        });

                        it('minutes and seconds', () => {
                            const start = before({ minutes, seconds, milliseconds });

                            expect(formatter.durationShortest(start, anchor())).toBe(`${minutes}:${seconds}`);
                        });

                        it('only minutes < 10 min', () => {
                            const start = before({ minutes, seconds, milliseconds });

                            expect(formatter.durationShortest(start, anchor(), false)).toBe(
                                `0:${String(minutes).padStart(2, '0')}`
                            );
                        });

                        it('only minutes > 10 min', () => {
                            const start = before({ minutes: 35, seconds, milliseconds });

                            expect(formatter.durationShortest(start, anchor(), false)).toBe('0:35');
                        });

                        it('minutes, seconds and milliseconds', () => {
                            const start = before({ minutes, seconds, milliseconds });

                            expect(formatter.durationShortest(start, anchor(), true, true)).toBe(
                                `${minutes}:${seconds}${ms}${milliseconds}`
                            );
                        });

                        it('hours, minutes and seconds', () => {
                            const hours = 5;
                            const start = before({ hours, minutes, seconds, milliseconds });

                            expect(formatter.durationShortest(start, anchor())).toBe(
                                `${hours}:${String(minutes).padStart(2, '0')}:${seconds}`
                            );
                        });
                    });

                    const textFormat = (
                        form: 'long' | 'short',
                        call: (start: D, end: D, units?: DurationUnitKey[], fraction?: boolean) => string
                    ) => {
                        const { units, separator } = d[form];
                        const named = (value: number, unit: DurationUnitKey) =>
                            `${value} ${units[unit][pr.select(value)]}`;
                        const pair = (first: string, second: string) => `${first}${separator}${second}`;
                        /** `it`, unless the case rests on a unit this adapter only approximates */
                        const testing = (...used: DurationUnitKey[]) =>
                            used.some((unit) => approximateDurationUnits.includes(unit)) ? it.skip : it;

                        for (const value of [1, 2, 5, 21, 33, 45, 120, 365]) {
                            for (const unit of [
                                'years',
                                'months',
                                'weeks',
                                'days',
                                'hours',
                                'minutes',
                                'seconds'
                            ] as DurationUnitKey[]) {
                                testing(unit)(`plural unit: ${value} ${unit}`, () => {
                                    const start = before({ [unit]: value });

                                    expect(call(start, anchor(), [unit])).toBe(named(value, unit));
                                });
                            }
                        }

                        it('minutes and seconds', () => {
                            const start = before({ minutes: 10, seconds: 23 });

                            expect(call(start, anchor())).toBe(pair(named(10, 'minutes'), named(23, 'seconds')));
                        });

                        it('hours and minutes', () => {
                            const start = before({ hours: 4, minutes: 10 });

                            expect(call(start, anchor())).toBe(pair(named(4, 'hours'), named(10, 'minutes')));
                        });

                        it('hours and minutes (more then 24 hours)', () => {
                            const start = before({ hours: 32, minutes: 10 });

                            expect(call(start, anchor(), ['hours', 'minutes'])).toBe(
                                pair(named(32, 'hours'), named(10, 'minutes'))
                            );
                        });

                        it('days and hours', () => {
                            const start = before({ days: 2, hours: 4 });

                            expect(call(start, anchor())).toBe(pair(named(2, 'days'), named(4, 'hours')));
                        });

                        it('days and hours (more than 1 week)', () => {
                            const start = before({ days: 10, hours: 4 });

                            expect(call(start, anchor(), ['days', 'hours'])).toBe(
                                pair(named(10, 'days'), named(4, 'hours'))
                            );
                        });

                        it('weeks and days', () => {
                            const start = before({ weeks: 3, days: 2 });

                            expect(call(start, anchor())).toBe(pair(named(3, 'weeks'), named(2, 'days')));
                        });

                        it('weeks and days (more than 1 month)', () => {
                            const start = before({ weeks: 6, days: 2 });

                            expect(call(start, anchor(), ['weeks', 'days'])).toBe(
                                pair(named(6, 'weeks'), named(2, 'days'))
                            );
                        });

                        testing('months')('months and weeks', () => {
                            const start = before({ months: 7, weeks: 3 });

                            expect(call(start, anchor())).toBe(pair(named(7, 'months'), named(3, 'weeks')));
                        });

                        testing('years', 'months')('years and months', () => {
                            const start = before({ years: 1, months: 7 });

                            expect(call(start, anchor())).toBe(pair(named(1, 'years'), named(7, 'months')));
                        });

                        const fractionCase = (
                            unit: DurationUnitKey,
                            amount: DurationObjectUnits,
                            intPart: number,
                            expectedValue: number
                        ) => {
                            testing(unit)(`units with fractions: ${unit}: ${expectedValue}`, () => {
                                const start = before(amount);
                                // a half step reads as a plural the rules have no category for, so the
                                // template falls back to the many/other form
                                const word =
                                    intPart === 1
                                        ? units[unit]['few'] || units[unit]['other']
                                        : units[unit][pr.select(intPart)];

                                expect(call(start, anchor(), [unit], true)).toBe(
                                    `${new Intl.NumberFormat(locale).format(expectedValue)} ${word}`
                                );
                            });
                        };

                        fractionCase('months', { months: 1, weeks: 1 }, 1, 1);
                        fractionCase('months', { months: 1, weeks: 3 }, 1, 1.5);
                        fractionCase('months', { months: 2, weeks: 3 }, 2, 2.5);
                        fractionCase('months', { months: 5, weeks: 3 }, 5, 5.5);
                        fractionCase('months', { months: 11, weeks: 3 }, 11, 11.5);
                        fractionCase('months', { months: 21, days: 16 }, 21, 21.5);

                        fractionCase('years', { years: 1, months: 5 }, 1, 1);
                        fractionCase('years', { years: 1, months: 6 }, 1, 1.5);
                        fractionCase('years', { years: 2, months: 7 }, 2, 2.5);
                        fractionCase('years', { years: 5, months: 8 }, 5, 5.5);
                        fractionCase('years', { years: 11, months: 9 }, 11, 11.5);
                        fractionCase('years', { years: 21, months: 10 }, 21, 21.5);
                    };

                    describe('Text long format', () => {
                        textFormat('long', (start, end, units, fraction) =>
                            formatter.durationLong(start, end, units, fraction)
                        );
                    });

                    describe('Text short format', () => {
                        // 45 renders through the zero-padding branch, 111 through the three-digit one
                        for (const milliseconds of [45, 111]) {
                            it(`seconds and milliseconds: ${milliseconds}`, () => {
                                const seconds = 23;
                                const start = before({ seconds, milliseconds });
                                const shown = String(milliseconds).padStart(3, '0');

                                expect(formatter.durationShort(start, anchor(), ['seconds', 'milliseconds'])).toBe(
                                    `${seconds}${d.short.millisecondsSeparator}${shown} ${
                                        d.short.units.seconds[pr.select(seconds)]
                                    }`
                                );
                            });
                        }

                        textFormat('short', (start, end, units, fraction) =>
                            formatter.durationShort(start, end, units, fraction)
                        );
                    });
                });

                /**
                 * Every expectation above derives what it expects from `adapter.config.variables`, which
                 * means a wrong token in a locale config would move the actual and the expected string
                 * together and still pass. These snapshots are the other half: they pin the literal text,
                 * so such a change shows up as a diff rather than as silence. `today` is fixed, so the
                 * output does not drift with the clock.
                 */
                it('renders every format', () => {
                    const otherYear = adapter.createDateTime(2015, 2, 7, 9, 5, 3, 45);
                    const sameMonth = adapter.createDateTime(FIXED_TODAY.year, FIXED_TODAY.month, 1, 8, 30, 0, 0);
                    const tenDaysOn = shift(sameMonth, { days: 10 });
                    const minuteOn = shift(today, { minutes: 1 });
                    const durationEnd = shift(today, {
                        days: 400,
                        hours: 5,
                        minutes: 2,
                        seconds: 25,
                        milliseconds: 125
                    });

                    expect({
                        relativeShortDate: {
                            yesterday: formatter.relativeShortDate(shift(today, { days: -1 })),
                            today: formatter.relativeShortDate(today),
                            tomorrow: formatter.relativeShortDate(shift(today, { days: 1 })),
                            farPast: formatter.relativeShortDate(otherYear),
                            withSeconds: formatter.relativeShortDateTime(today, { seconds: true }),
                            withMilliseconds: formatter.relativeShortDateTime(today, { milliseconds: true })
                        },
                        relativeLongDate: {
                            yesterday: formatter.relativeLongDate(shift(today, { days: -1 })),
                            farPast: formatter.relativeLongDate(otherYear),
                            withMilliseconds: formatter.relativeLongDateTime(today, { milliseconds: true })
                        },
                        absolute: {
                            shortDate: formatter.absoluteShortDate(today),
                            shortDateCurrentYear: formatter.absoluteShortDate(today, true),
                            shortDateOtherYear: formatter.absoluteShortDate(otherYear),
                            shortDateTime: formatter.absoluteShortDateTime(today),
                            shortDateTimeWithMilliseconds: formatter.absoluteShortDateTime(otherYear, {
                                milliseconds: true
                            }),
                            longDate: formatter.absoluteLongDate(today),
                            longDateOtherYear: formatter.absoluteLongDate(otherYear),
                            longDateTime: formatter.absoluteLongDateTime(today),
                            longDateTimeWithSeconds: formatter.absoluteLongDateTime(otherYear, { seconds: true })
                        },
                        closedRange: {
                            shortDateSameMonth: formatter.rangeShortDate(sameMonth, tenDaysOn),
                            shortDateOtherYear: formatter.rangeShortDate(otherYear, today),
                            shortDateTime: formatter.rangeShortDateTime(sameMonth, tenDaysOn),
                            shortDateTimeSameDay: formatter.rangeShortDateTime(today, minuteOn),
                            longDate: formatter.rangeLongDate(sameMonth, tenDaysOn),
                            longDateTime: formatter.rangeLongDateTime(sameMonth, tenDaysOn),
                            longDateTimeSameDay: formatter.rangeLongDateTime(today, minuteOn),
                            middleDateTime: formatter.rangeMiddleDateTime(sameMonth, tenDaysOn),
                            middleDateTimeSameDay: formatter.rangeMiddleDateTime(today, minuteOn)
                        },
                        openedRange: {
                            shortDateFrom: formatter.rangeShortDate(today),
                            shortDateUntil: formatter.rangeShortDate(null, today),
                            shortDateUntilOtherYear: formatter.rangeShortDate(null, otherYear),
                            shortDateTimeFrom: formatter.rangeShortDateTime(today),
                            longDateFrom: formatter.rangeLongDate(today),
                            longDateTimeUntil: formatter.rangeLongDateTime(null, today)
                        },
                        duration: {
                            shortest: formatter.durationShortest(today, durationEnd),
                            shortestWithMilliseconds: formatter.durationShortest(today, durationEnd, true, true),
                            short: formatter.durationShort(today, durationEnd),
                            shortYearsFraction: formatter.durationShort(today, durationEnd, ['years'], true),
                            long: formatter.durationLong(today, durationEnd),
                            longDaysHours: formatter.durationLong(today, durationEnd, ['days', 'hours'])
                        }
                    }).toMatchSnapshot();
                });
            });
        }
    });
};

runFormatterSuite('LuxonDateAdapter', (locale) => new LuxonDateAdapter(locale));
/*
 * Moment is the one adapter that does not agree with the others. Its snapshot records what it does
 * today so a change shows up; the differences it captures are these. Only the last is a choice:
 *
 *  - `durationObjectFromDates` measures with `moment.duration(end.diff(start))`, whose year and month
 *    are fixed averages (365.25 and 30.436875 days), so a whole calendar year floors to zero. The
 *    cases resting on those units are skipped below rather than weakened.
 *  - `durationFormat` renders through `moment.utc(ms).format('h:mm:ss')`, which is a timestamp, not a
 *    duration: anything past 24 hours wraps, and `durationShortest` reports 5:02:25 for a duration
 *    the other adapters report as 9605:02:25.
 *  - with no explicit units it keeps every non-zero unit instead of the leading two, so a duration
 *    luxon renders as "1 year 1 month" comes out as "1 year 1 month 4 days 5 hours 2 minutes
 *    25 seconds".
 *  - fractions are not rounded to half steps, so "1 y" becomes "1.0957377989167014 y".
 *  - moment's own ru-RU locale data abbreviates months with a trailing period, so short dates read
 *    "7 мар. 2015" where the other three adapters read "7 мар 2015". That one comes from moment, not
 *    from this repo's locale config, and is the only non-duration difference.
 */
runFormatterSuite('MomentDateAdapter', (locale) => new MomentDateAdapter(locale), {
    approximateDurationUnits: ['years', 'months']
});
// `jest.preset.js` pins TZ=UTC for the whole workspace, so the ambient zone is already fixed; asking
// the native adapter for UTC explicitly keeps this suite pinned even if it is ever run without that.
runFormatterSuite('NativeDateAdapter', (locale) => new NativeDateAdapter(locale, { useUtc: true }));
runFormatterSuite('InternationalizedDateAdapter', (locale) => new InternationalizedDateAdapter(locale));
