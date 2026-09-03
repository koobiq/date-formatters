import { CalendarDate, CalendarDateTime } from '@internationalized/date';
import { InternationalizedDateAdapter } from '@koobiq/internationalized-date-adapter';
import { NativeDateAdapter } from '@koobiq/native-date-adapter';

import { DateFormatter } from './formatter';

describe('DateFormatter with InternationalizedDateAdapter', () => {
    const currentYear = new Date().getUTCFullYear();
    const fixedToday = new CalendarDateTime(2026, 3, 17, 11, 51, 13, 299);

    class FixedTodayAdapter extends InternationalizedDateAdapter {
        override today(): CalendarDateTime {
            return fixedToday;
        }
    }

    const createFormatter = (locale = 'en-US') => {
        const adapter = new InternationalizedDateAdapter(locale);
        const formatter = new DateFormatter(adapter, locale);

        return { adapter, formatter };
    };

    const createRelativeFormatter = (locale = 'en-US') => {
        const adapter = new FixedTodayAdapter(locale);
        const formatter = new DateFormatter(adapter, locale);

        return { adapter, formatter };
    };

    describe('absolute date', () => {
        describe('long format', () => {
            it('formats absoluteLongDate from CalendarDate', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(currentYear, 3, 17, 0, 0, 0, 0);

                expect(formatter.absoluteLongDate(value)).toBe('March 17');
            });

            it('formats absoluteLongDate (current year)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(currentYear, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteLongDate(value)).toBe('March 17');
            });

            it('formats absoluteLongDate (not current year)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(2025, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteLongDate(value)).toBe('March 17, 2025');
            });

            it('formats absoluteLongDateTime (current year)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(currentYear, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteLongDateTime(value)).toBe('March 17, 12:51');
            });

            it('formats absoluteLongDateTime (current year) (with seconds)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(currentYear, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteLongDateTime(value, { seconds: true })).toBe('March 17, 12:51:13');
            });

            it('formats absoluteLongDateTime (current year) (with milliseconds)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(currentYear, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteLongDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'March 17, 12:51:13.311'
                );
            });

            it('formats absoluteLongDateTime (not current year)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(2025, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteLongDateTime(value)).toBe('March 17, 2025, 12:51');
            });

            it('formats absoluteLongDateTime (not current year) (with seconds)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(2025, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteLongDateTime(value, { seconds: true })).toBe('March 17, 2025, 12:51:13');
            });

            it('formats absoluteLongDateTime (not current year) (with milliseconds)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(2025, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteLongDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'March 17, 2025, 12:51:13.311'
                );
            });
        });

        describe('short format', () => {
            it('formats absoluteShortDate from CalendarDate', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(currentYear, 3, 17, 0, 0, 0, 0);

                expect(formatter.absoluteShortDate(value)).toBe('Mar 17');
            });

            it('formats absoluteShortDate (current year)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(currentYear, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteShortDate(value)).toBe('Mar 17');
            });

            it('formats absoluteShortDate (not current year)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(2025, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteShortDate(value)).toBe('Mar 17, 2025');
            });

            it('formats absoluteShortDateTime (current year)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(currentYear, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteShortDateTime(value)).toBe('Mar 17, 12:51');
            });

            it('formats absoluteShortDateTime (current year) (with seconds)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(currentYear, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteShortDateTime(value, { seconds: true })).toBe('Mar 17, 12:51:13');
            });

            it('formats absoluteShortDateTime (current year) (with milliseconds)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(currentYear, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteShortDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'Mar 17, 12:51:13.311'
                );
            });

            it('formats absoluteShortDateTime (not current year)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(2025, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteShortDateTime(value)).toBe('Mar 17, 2025, 12:51');
            });

            it('formats absoluteShortDateTime (not current year) (with seconds)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(2025, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteShortDateTime(value, { seconds: true })).toBe('Mar 17, 2025, 12:51:13');
            });

            it('formats absoluteShortDateTime (not current year) (with milliseconds)', () => {
                const { formatter } = createFormatter();
                const value = new CalendarDateTime(2025, 3, 17, 12, 51, 13, 311);

                expect(formatter.absoluteShortDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'Mar 17, 2025, 12:51:13.311'
                );
            });
        });
    });

    describe('relative date', () => {
        describe('long format', () => {
            it('formats Before yesterday (not current year)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2025, 3, 15, 12, 51, 13, 299);

                expect(formatter.relativeLongDate(value)).toBe('March 15, 2025');
            });

            it('formats Before yesterday (current year)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 15, 12, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value)).toBe('March 15, 12:51');
            });

            it('formats Before yesterday (current year) (with seconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 15, 12, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value, { seconds: true })).toBe('March 15, 12:51:13');
            });

            it('formats Before yesterday (current year) (with milliseconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 15, 12, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'March 15, 12:51:13.299'
                );
            });

            it('formats Yesterday', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 16, 12, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value)).toBe('Yesterday, 12:51');
            });

            it('formats Yesterday (with seconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 16, 12, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value, { seconds: true })).toBe('Yesterday, 12:51:13');
            });

            it('formats Yesterday (with milliseconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 16, 12, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'Yesterday, 12:51:13.299'
                );
            });

            it('formats Today', () => {
                const { formatter } = createRelativeFormatter();

                expect(formatter.relativeLongDateTime(fixedToday)).toBe('Today, 11:51');
            });

            it('formats Today (with seconds)', () => {
                const { formatter } = createRelativeFormatter();

                expect(formatter.relativeLongDateTime(fixedToday, { seconds: true })).toBe('Today, 11:51:13');
            });

            it('formats Today (with milliseconds)', () => {
                const { formatter } = createRelativeFormatter();

                expect(formatter.relativeLongDateTime(fixedToday, { seconds: true, milliseconds: true })).toBe(
                    'Today, 11:51:13.299'
                );
            });

            it('formats Tomorrow', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 18, 13, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value)).toBe('Tomorrow, 13:51');
            });

            it('formats Tomorrow (with seconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 18, 13, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value, { seconds: true })).toBe('Tomorrow, 13:51:13');
            });

            it('formats Tomorrow (with milliseconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 18, 13, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'Tomorrow, 13:51:13.299'
                );
            });

            it('formats After tomorrow (current year)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 19, 12, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value)).toBe('March 19, 12:51');
            });

            it('formats After tomorrow (current year) (with seconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 19, 12, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value, { seconds: true })).toBe('March 19, 12:51:13');
            });

            it('formats After tomorrow (current year) (with milliseconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 19, 12, 51, 13, 299);

                expect(formatter.relativeLongDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'March 19, 12:51:13.299'
                );
            });

            it('formats After tomorrow (not current year)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2027, 3, 19, 12, 51, 13, 299);

                expect(formatter.relativeLongDate(value)).toBe('March 19, 2027');
            });
        });

        describe('short format', () => {
            it('formats Before yesterday (not current year)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2025, 3, 15, 12, 51, 13, 306);

                expect(formatter.relativeShortDate(value)).toBe('Mar 15, 2025');
            });

            it('formats Before yesterday (current year)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 15, 12, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value)).toBe('Mar 15, 12:51');
            });

            it('formats Before yesterday (current year) (with seconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 15, 12, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value, { seconds: true })).toBe('Mar 15, 12:51:13');
            });

            it('formats Before yesterday (current year) (with milliseconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 15, 12, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'Mar 15, 12:51:13.306'
                );
            });

            it('formats Yesterday', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 16, 12, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value)).toBe('Yesterday, 12:51');
            });

            it('formats Yesterday (with seconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 16, 12, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value, { seconds: true })).toBe('Yesterday, 12:51:13');
            });

            it('formats Yesterday (with milliseconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 16, 12, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'Yesterday, 12:51:13.306'
                );
            });

            it('formats Today', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 17, 11, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value)).toBe('Today, 11:51');
            });

            it('formats Today (with seconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 17, 11, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value, { seconds: true })).toBe('Today, 11:51:13');
            });

            it('formats Today (with milliseconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 17, 11, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'Today, 11:51:13.306'
                );
            });

            it('formats Tomorrow', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 18, 13, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value)).toBe('Tomorrow, 13:51');
            });

            it('formats Tomorrow (with seconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 18, 13, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value, { seconds: true })).toBe('Tomorrow, 13:51:13');
            });

            it('formats Tomorrow (with milliseconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 18, 13, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'Tomorrow, 13:51:13.306'
                );
            });

            it('formats After tomorrow (current year)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 19, 12, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value)).toBe('Mar 19, 12:51');
            });

            it('formats After tomorrow (current year) (with seconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 19, 12, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value, { seconds: true })).toBe('Mar 19, 12:51:13');
            });

            it('formats After tomorrow (current year) (with milliseconds)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2026, 3, 19, 12, 51, 13, 306);

                expect(formatter.relativeShortDateTime(value, { seconds: true, milliseconds: true })).toBe(
                    'Mar 19, 12:51:13.306'
                );
            });

            it('formats After tomorrow (not current year)', () => {
                const { formatter } = createRelativeFormatter();
                const value = new CalendarDateTime(2027, 3, 19, 12, 51, 13, 306);

                expect(formatter.relativeShortDate(value)).toBe('Mar 19, 2027');
            });
        });
    });

    describe('date range', () => {
        describe('closed range', () => {
            describe('long format', () => {
                it('formats rangeLongDate (current month)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 1, 0, 0, 0, 0);
                    const end = new CalendarDateTime(2026, 3, 10, 0, 0, 0, 0);

                    expect(formatter.rangeLongDate(start, end)).toBe('March 1–10');
                });

                it('formats rangeLongDate (not current month)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0);
                    const end = new CalendarDateTime(2026, 2, 10, 0, 0, 0, 0);

                    expect(formatter.rangeLongDate(start, end)).toBe('January 1 – February 10');
                });

                it('formats rangeLongDate (start date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2025, 1, 1, 0, 0, 0, 0);
                    const end = new CalendarDateTime(2026, 2, 10, 0, 0, 0, 0);

                    expect(formatter.rangeLongDate(start, end)).toBe('January 1, 2025 – February 10, 2026');
                });

                it('formats rangeLongDate (end date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0);
                    const end = new CalendarDateTime(2027, 2, 10, 0, 0, 0, 0);

                    expect(formatter.rangeLongDate(start, end)).toBe('January 1, 2026 – February 10, 2027');
                });

                it('formats rangeLongDateTime (the same day, current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 10, 10, 14, 13, 316);
                    const end = new CalendarDateTime(2026, 3, 10, 11, 28, 13, 316);

                    expect(formatter.rangeLongDateTime(start, end)).toBe('March 10, from 10:14 to 11:28');
                });

                it('formats rangeLongDateTime (the same day, current year) (with seconds)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 10, 10, 14, 13, 316);
                    const end = new CalendarDateTime(2026, 3, 10, 11, 28, 13, 316);

                    expect(formatter.rangeLongDateTime(start, end, { seconds: true })).toBe(
                        'March 10, from 10:14:13 to 11:28:13'
                    );
                });

                it('formats rangeLongDateTime (the same day, current year) (with milliseconds)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 10, 10, 14, 13, 316);
                    const end = new CalendarDateTime(2026, 3, 10, 11, 28, 13, 316);

                    expect(formatter.rangeLongDateTime(start, end, { seconds: true, milliseconds: true })).toBe(
                        'March 10, from 10:14:13.316 to 11:28:13.316'
                    );
                });

                it('formats rangeLongDateTime (the same day, not current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2025, 1, 11, 10, 14, 13, 316);
                    const end = new CalendarDateTime(2025, 1, 11, 11, 28, 13, 316);

                    expect(formatter.rangeLongDateTime(start, end)).toBe('January 11, 2025, from 10:14 to 11:28');
                });

                it('formats rangeLongDateTime (not current month)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 1, 1, 10, 14, 13, 316);
                    const end = new CalendarDateTime(2026, 2, 1, 11, 28, 13, 316);

                    expect(formatter.rangeLongDateTime(start, end)).toBe('From January 1, 10:14 to February 1, 11:28');
                });

                it('formats rangeLongDateTime (start date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2025, 1, 1, 10, 14, 13, 316);
                    const end = new CalendarDateTime(2026, 2, 1, 11, 28, 13, 316);

                    expect(formatter.rangeLongDateTime(start, end)).toBe(
                        'From January 1, 2025, 10:14 to February 1, 2026, 11:28'
                    );
                });

                it('formats rangeLongDateTime (end date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 1, 1, 10, 14, 13, 316);
                    const end = new CalendarDateTime(2027, 2, 1, 11, 28, 13, 316);

                    expect(formatter.rangeLongDateTime(start, end)).toBe(
                        'From January 1, 2026, 10:14 to February 1, 2027, 11:28'
                    );
                });
            });

            describe('short format', () => {
                it('formats rangeShortDate (current month)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 1, 0, 0, 0, 0);
                    const end = new CalendarDateTime(2026, 3, 10, 0, 0, 0, 0);

                    expect(formatter.rangeShortDate(start, end)).toBe('Mar 1–10');
                });

                it('formats rangeShortDate (not current month)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0);
                    const end = new CalendarDateTime(2026, 2, 10, 0, 0, 0, 0);

                    expect(formatter.rangeShortDate(start, end)).toBe('Jan 1 – Feb 10');
                });

                it('formats rangeShortDate (start date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2025, 1, 1, 0, 0, 0, 0);
                    const end = new CalendarDateTime(2026, 2, 10, 0, 0, 0, 0);

                    expect(formatter.rangeShortDate(start, end)).toBe('Jan 1, 2025 – Feb 10, 2026');
                });

                it('formats rangeShortDate (end date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0);
                    const end = new CalendarDateTime(2027, 2, 10, 0, 0, 0, 0);

                    expect(formatter.rangeShortDate(start, end)).toBe('Jan 1, 2026 – Feb 10, 2027');
                });

                it('formats rangeShortDateTime (the same day, current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 10, 10, 14, 13, 543);
                    const end = new CalendarDateTime(2026, 3, 10, 11, 28, 13, 543);

                    expect(formatter.rangeShortDateTime(start, end)).toBe('10:14–11:28, Mar 10');
                });

                it('formats rangeShortDateTime (the same day, current year) (with seconds)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 10, 10, 14, 13, 543);
                    const end = new CalendarDateTime(2026, 3, 10, 11, 28, 13, 543);

                    expect(formatter.rangeShortDateTime(start, end, { seconds: true })).toBe(
                        '10:14:13–11:28:13, Mar 10'
                    );
                });

                it('formats rangeShortDateTime (the same day, current year) (with milliseconds)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 10, 10, 14, 13, 543);
                    const end = new CalendarDateTime(2026, 3, 10, 11, 28, 13, 543);

                    expect(formatter.rangeShortDateTime(start, end, { seconds: true, milliseconds: true })).toBe(
                        '10:14:13.543–11:28:13.543, Mar 10'
                    );
                });

                it('formats rangeShortDateTime (the same day, not current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2025, 1, 11, 10, 14, 13, 543);
                    const end = new CalendarDateTime(2025, 1, 11, 11, 28, 13, 543);

                    expect(formatter.rangeShortDateTime(start, end)).toBe('10:14–11:28, Jan 11, 2025');
                });

                it('formats rangeShortDateTime (not current month)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 1, 1, 10, 14, 13, 543);
                    const end = new CalendarDateTime(2026, 2, 1, 11, 28, 13, 543);

                    expect(formatter.rangeShortDateTime(start, end)).toBe('Jan 1, 10:14 – Feb 1, 11:28');
                });

                it('formats rangeShortDateTime (start date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2025, 1, 1, 10, 14, 13, 543);
                    const end = new CalendarDateTime(2026, 2, 1, 11, 28, 13, 543);

                    expect(formatter.rangeShortDateTime(start, end)).toBe('Jan 1, 2025, 10:14 – Feb 1, 2026, 11:28');
                });

                it('formats rangeShortDateTime (end date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 1, 1, 10, 14, 13, 543);
                    const end = new CalendarDateTime(2027, 2, 1, 11, 28, 13, 543);

                    expect(formatter.rangeShortDateTime(start, end)).toBe('Jan 1, 2026, 10:14 – Feb 1, 2027, 11:28');
                });
            });

            describe('middle format', () => {
                it('formats rangeMiddleDateTime', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 1, 11, 48, 15, 540);
                    const end = new CalendarDateTime(2026, 3, 10, 11, 48, 15, 540);

                    expect(formatter.rangeMiddleDateTime(start, end)).toBe('March 1, 11:48 – March 10, 11:48');
                });

                it('formats rangeMiddleDateTime (with seconds)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 1, 11, 48, 15, 540);
                    const end = new CalendarDateTime(2026, 3, 10, 11, 48, 15, 540);

                    expect(formatter.rangeMiddleDateTime(start, end, { seconds: true })).toBe(
                        'March 1, 11:48:15 – March 10, 11:48:15'
                    );
                });

                it('formats rangeMiddleDateTime (with milliseconds)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 1, 11, 48, 15, 540);
                    const end = new CalendarDateTime(2026, 3, 10, 11, 48, 15, 540);

                    expect(formatter.rangeMiddleDateTime(start, end, { seconds: true, milliseconds: true })).toBe(
                        'March 1, 11:48:15.540 – March 10, 11:48:15.540'
                    );
                });

                it('formats rangeMiddleDateTime (the same day)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 10, 10, 14, 15, 540);
                    const end = new CalendarDateTime(2026, 3, 10, 10, 28, 15, 540);

                    expect(formatter.rangeMiddleDateTime(start, end)).toBe('10:14–10:28, March 10');
                });

                it('formats rangeMiddleDateTime (the same day) (with seconds)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 10, 10, 14, 15, 540);
                    const end = new CalendarDateTime(2026, 3, 10, 10, 28, 15, 540);

                    expect(formatter.rangeMiddleDateTime(start, end, { seconds: true })).toBe(
                        '10:14:15–10:28:15, March 10'
                    );
                });

                it('formats rangeMiddleDateTime (the same day) (with milliseconds)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 10, 10, 14, 15, 540);
                    const end = new CalendarDateTime(2026, 3, 10, 10, 28, 15, 540);

                    expect(formatter.rangeMiddleDateTime(start, end, { seconds: true, milliseconds: true })).toBe(
                        '10:14:15.540–10:28:15.540, March 10'
                    );
                });

                it('formats rangeMiddleDateTime (the same day, not current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2025, 1, 11, 10, 14, 15, 540);
                    const end = new CalendarDateTime(2025, 1, 11, 11, 28, 15, 540);

                    expect(formatter.rangeMiddleDateTime(start, end)).toBe('10:14–11:28, January 11, 2025');
                });

                it('formats rangeMiddleDateTime (not current month)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 1, 1, 10, 14, 15, 540);
                    const end = new CalendarDateTime(2026, 2, 1, 11, 28, 15, 540);

                    expect(formatter.rangeMiddleDateTime(start, end)).toBe('January 1, 10:14 – February 1, 11:28');
                });

                it('formats rangeMiddleDateTime (start date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2025, 1, 1, 10, 14, 15, 540);
                    const end = new CalendarDateTime(2026, 1, 1, 11, 28, 15, 540);

                    expect(formatter.rangeMiddleDateTime(start, end)).toBe(
                        'January 1, 2025, 10:14 – January 1, 2026, 11:28'
                    );
                });

                it('formats rangeMiddleDateTime (end date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 1, 1, 10, 14, 15, 540);
                    const end = new CalendarDateTime(2027, 1, 1, 11, 28, 15, 540);

                    expect(formatter.rangeMiddleDateTime(start, end)).toBe(
                        'January 1, 2026, 10:14 – January 1, 2027, 11:28'
                    );
                });
            });
        });

        describe('opened range', () => {
            describe('long format', () => {
                it('formats opened long date range (only start)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDate(start, null)).toBe('From March 16');
                });

                it('formats opened long date range (only end)', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDate(null, end)).toBe('Until March 16');
                });

                it('formats opened long date range (only start, start date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2027, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDate(start, null)).toBe('From March 16 2027');
                });

                it('formats opened long date range (only end, end date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2027, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDate(null, end)).toBe('Until March 16 2027');
                });

                it('formats opened long datetime range (only start)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDateTime(start, undefined)).toBe('From March 16, 11:48');
                });

                it('formats opened long datetime range (only start) with seconds', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDateTime(start, undefined, { seconds: true })).toBe(
                        'From March 16, 11:48:15'
                    );
                });

                it('formats opened long datetime range (only start) with milliseconds', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDateTime(start, undefined, { seconds: true, milliseconds: true })).toBe(
                        'From March 16, 11:48:15.547'
                    );
                });

                it('formats opened long datetime range (only start, start date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2027, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDateTime(start, undefined)).toBe('From March 16 2027, 11:48');
                });

                it('formats opened long datetime range (only end)', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDateTime(null, end)).toBe('Until March 16, 11:48');
                });

                it('formats opened long datetime range (only end) with seconds', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDateTime(null, end, { seconds: true })).toBe('Until March 16, 11:48:15');
                });

                it('formats opened long datetime range (only end) with milliseconds', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDateTime(null, end, { seconds: true, milliseconds: true })).toBe(
                        'Until March 16, 11:48:15.547'
                    );
                });

                it('formats opened long datetime range (only end, end date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2027, 3, 16, 11, 48, 15, 547);

                    expect(formatter.rangeLongDateTime(null, end)).toBe('Until March 16 2027, 11:48');
                });
            });

            describe('short format', () => {
                it('formats opened short date range (only start)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDate(start, undefined)).toBe('From Mar 16');
                });

                it('formats opened short date range (only end)', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDate(null, end)).toBe('Until Mar 16');
                });

                it('formats opened short date range (only start, start date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2027, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDate(start, undefined)).toBe('From Mar 16 2027');
                });

                it('formats opened short date range (only end, end date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2027, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDate(null, end)).toBe('Until Mar 16 2027');
                });

                it('formats opened short datetime range (only start)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDateTime(start, undefined)).toBe('From Mar 16, 11:48');
                });

                it('formats opened short datetime range (only start) with seconds', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDateTime(start, undefined, { seconds: true })).toBe(
                        'From Mar 16, 11:48:15'
                    );
                });

                it('formats opened short datetime range (only start) with milliseconds', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDateTime(start, undefined, { seconds: true, milliseconds: true })).toBe(
                        'From Mar 16, 11:48:15.548'
                    );
                });

                it('formats opened short datetime range (only start, start date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const start = new CalendarDateTime(2027, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDateTime(start, undefined)).toBe('From Mar 16 2027, 11:48');
                });

                it('formats opened short datetime range (only end)', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDateTime(null, end)).toBe('Until Mar 16, 11:48');
                });

                it('formats opened short datetime range (only end) with seconds', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDateTime(null, end, { seconds: true })).toBe('Until Mar 16, 11:48:15');
                });

                it('formats opened short datetime range (only end) with milliseconds', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDateTime(null, end, { seconds: true, milliseconds: true })).toBe(
                        'Until Mar 16, 11:48:15.548'
                    );
                });

                it('formats opened short datetime range (only end, end date is not in current year)', () => {
                    const { formatter } = createRelativeFormatter();
                    const end = new CalendarDateTime(2027, 3, 16, 11, 48, 15, 548);

                    expect(formatter.rangeShortDateTime(null, end)).toBe('Until Mar 16 2027, 11:48');
                });
            });
        });
    });

    describe('duration', () => {
        const durationStart = new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0);

        const addDuration = (
            adapter: InternationalizedDateAdapter,
            value: CalendarDateTime,
            amount: number,
            unit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'
        ) => adapter.addCalendarUnits(value, amount, unit) as CalendarDateTime;

        describe('the shortest format', () => {
            it('formats Seconds', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 25, 'seconds');

                expect(formatter.durationShortest(durationStart, end)).toBe('0:25');
            });

            it('formats Seconds and milliseconds', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 25, 'seconds');
                end = addDuration(adapter, end, 125, 'milliseconds');

                expect(formatter.durationShortest(durationStart, end, true, true)).toBe('0:25,125');
            });

            it('formats Minutes and seconds', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 2, 'minutes');
                end = addDuration(adapter, end, 25, 'seconds');

                expect(formatter.durationShortest(durationStart, end)).toBe('2:25');
                expect(formatter.durationShortest(durationStart, end, false)).toBe('0:02');
            });

            it('formats Hours, minutes and seconds', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 48, 'hours');
                end = addDuration(adapter, end, 2, 'minutes');
                end = addDuration(adapter, end, 25, 'seconds');

                expect(formatter.durationShortest(durationStart, end)).toBe('48:02:25');
                expect(formatter.durationShortest(durationStart, end, false)).toBe('48:02');
            });
        });

        describe('long format', () => {
            it('formats Seconds', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 21, 'seconds');

                expect(formatter.durationLong(durationStart, end)).toBe('21 seconds');
            });

            it('formats Minutes and seconds', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 1, 'minutes');
                end = addDuration(adapter, end, 25, 'seconds');

                expect(formatter.durationLong(durationStart, end)).toBe('1 minute 25 seconds');
            });

            it('formats Minutes', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 22, 'minutes');

                expect(formatter.durationLong(durationStart, end)).toBe('22 minutes');
            });

            it('formats Minutes (more than hour)', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 120, 'minutes');

                expect(formatter.durationLong(durationStart, end, ['minutes'])).toBe('120 minutes');
            });

            it('formats Hours and minutes', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 1, 'hours');
                end = addDuration(adapter, end, 21, 'minutes');

                expect(formatter.durationLong(durationStart, end)).toBe('1 hour 21 minutes');
            });

            it('formats Hours and minutes (more than day)', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 32, 'hours');
                end = addDuration(adapter, end, 20, 'minutes');

                expect(formatter.durationLong(durationStart, end, ['hours', 'minutes'])).toBe('32 hours 20 minutes');
            });

            it('formats Hours', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 32, 'hours');

                expect(formatter.durationLong(durationStart, end, ['hours'])).toBe('32 hours');
            });

            it('formats Days and hours', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 1, 'days');
                end = addDuration(adapter, end, 8, 'hours');

                expect(formatter.durationLong(durationStart, end)).toBe('1 day 8 hours');
            });

            it('formats Days', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 2, 'days');

                expect(formatter.durationLong(durationStart, end)).toBe('2 days');
            });

            it('formats Days (more than week)', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 21, 'days');

                expect(formatter.durationLong(durationStart, end, ['days'])).toBe('21 days');
            });

            it('formats Weeks and days', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 2, 'weeks');
                end = addDuration(adapter, end, 1, 'days');

                expect(formatter.durationLong(durationStart, end)).toBe('2 weeks 1 day');
            });

            it('formats Weeks', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 2, 'weeks');

                expect(formatter.durationLong(durationStart, end)).toBe('2 weeks');
            });

            it('formats Months and weeks', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 1, 'months');
                end = addDuration(adapter, end, 3, 'weeks');

                expect(formatter.durationLong(durationStart, end)).toBe('1 month 3 weeks');
            });

            it('formats Months', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 2, 'months');

                expect(formatter.durationLong(durationStart, end)).toBe('2 months');
            });

            it('formats Months with fraction', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 1, 'months');
                end = addDuration(adapter, end, 15, 'days');

                expect(formatter.durationLong(durationStart, end, ['months'], true)).toBe('1.5 months');
            });

            it('does not add month fraction below half-step', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 1, 'months');
                end = addDuration(adapter, end, 14, 'days');

                expect(formatter.durationLong(durationStart, end, ['months'], true)).toBe('1 months');
            });

            it('formats Years and months', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 3, 'years');
                end = addDuration(adapter, end, 11, 'months');

                expect(formatter.durationLong(durationStart, end)).toBe('3 years 11 months');
            });

            it('formats Years', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 5, 'years');

                expect(formatter.durationLong(durationStart, end)).toBe('5 years');
            });

            it('does not treat a leap-year boundary as a full year too early', () => {
                const { formatter } = createFormatter();
                const start = new CalendarDateTime(2023, 3, 1, 0, 0, 0, 0);
                const end = new CalendarDateTime(2024, 2, 29, 0, 0, 0, 0);

                expect(formatter.durationLong(start, end)).toBe('11 months 4 weeks');
            });

            it('formats Years with fraction', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 5, 'years');
                end = addDuration(adapter, end, 6, 'months');

                expect(formatter.durationLong(durationStart, end, ['years'], true)).toBe('5.5 years');
            });

            it('does not add year fraction below half-step', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 5, 'years');
                end = addDuration(adapter, end, 5, 'months');

                expect(formatter.durationLong(durationStart, end, ['years'], true)).toBe('5 years');
            });
        });

        describe('short format', () => {
            it('formats Seconds and milliseconds', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 21, 'seconds');
                end = addDuration(adapter, end, 365, 'milliseconds');

                expect(formatter.durationShort(durationStart, end, ['seconds', 'milliseconds'])).toBe('21.365 s');
            });

            it('formats Seconds', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 21, 'seconds');

                expect(formatter.durationShort(durationStart, end)).toBe('21 s');
            });

            it('formats Minutes and seconds', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 1, 'minutes');
                end = addDuration(adapter, end, 25, 'seconds');

                expect(formatter.durationShort(durationStart, end)).toBe('1 min 25 s');
            });

            it('formats Minutes', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 22, 'minutes');

                expect(formatter.durationShort(durationStart, end)).toBe('22 min');
            });

            it('formats Minutes (more than hour)', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 120, 'minutes');

                expect(formatter.durationShort(durationStart, end, ['minutes'])).toBe('120 min');
            });

            it('formats Hours and minutes', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 1, 'hours');
                end = addDuration(adapter, end, 21, 'minutes');

                expect(formatter.durationShort(durationStart, end)).toBe('1 h 21 min');
            });

            it('formats Hours and minutes (more than day)', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 32, 'hours');
                end = addDuration(adapter, end, 20, 'minutes');

                expect(formatter.durationShort(durationStart, end, ['hours', 'minutes'])).toBe('32 h 20 min');
            });

            it('formats Hours', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 32, 'hours');

                expect(formatter.durationShort(durationStart, end, ['hours'])).toBe('32 h');
            });

            it('formats Days and hours', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 1, 'days');
                end = addDuration(adapter, end, 8, 'hours');

                expect(formatter.durationShort(durationStart, end)).toBe('1 d 8 h');
            });

            it('formats Days', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 2, 'days');

                expect(formatter.durationShort(durationStart, end)).toBe('2 d');
            });

            it('formats Days (more than week)', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 15, 'days');

                expect(formatter.durationShort(durationStart, end, ['days'])).toBe('15 d');
            });

            it('formats Weeks and days', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 2, 'weeks');
                end = addDuration(adapter, end, 1, 'days');

                expect(formatter.durationShort(durationStart, end)).toBe('2 w 1 d');
            });

            it('formats Weeks', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 2, 'weeks');

                expect(formatter.durationShort(durationStart, end)).toBe('2 w');
            });

            it('formats Months and weeks', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 1, 'months');
                end = addDuration(adapter, end, 3, 'weeks');

                expect(formatter.durationShort(durationStart, end)).toBe('1 mo 3 w');
            });

            it('formats Months', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 2, 'months');

                expect(formatter.durationShort(durationStart, end)).toBe('2 mo');
            });

            it('formats Months with fraction', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 2, 'months');
                end = addDuration(adapter, end, 15, 'days');

                expect(formatter.durationShort(durationStart, end, ['months'], true)).toBe('2.5 mo');
            });

            it('does not add short month fraction below half-step', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 2, 'months');
                end = addDuration(adapter, end, 14, 'days');

                expect(formatter.durationShort(durationStart, end, ['months'], true)).toBe('2 mo');
            });

            it('formats Years and months', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 3, 'years');
                end = addDuration(adapter, end, 11, 'months');

                expect(formatter.durationShort(durationStart, end)).toBe('3 y 11 mo');
            });

            it('formats Years', () => {
                const { formatter, adapter } = createFormatter();
                const end = addDuration(adapter, durationStart, 5, 'years');

                expect(formatter.durationShort(durationStart, end)).toBe('5 y');
            });

            it('formats Years with fraction', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 5, 'years');
                end = addDuration(adapter, end, 6, 'months');

                expect(formatter.durationShort(durationStart, end, ['years'], true)).toBe('5.5 y');
            });

            it('does not add short year fraction below half-step', () => {
                const { formatter, adapter } = createFormatter();
                let end = addDuration(adapter, durationStart, 5, 'years');
                end = addDuration(adapter, end, 5, 'months');

                expect(formatter.durationShort(durationStart, end, ['years'], true)).toBe('5 y');
            });
        });
    });

    it('changes locale without formatter reinitialization', () => {
        const { formatter } = createFormatter('en-US');
        const value = new CalendarDateTime(2025, 3, 16, 11, 48, 15, 515);

        expect(formatter.absoluteLongDate(value)).toBe('March 16, 2025');

        formatter.setLocale('ru-RU');

        expect(formatter.absoluteLongDate(value)).toBe('16 марта 2025');
    });
});

describe('DateFormatter with NativeDateAdapter', () => {
    const nbsp = '\u00A0';

    const createAdapter = () => {
        const adapter = new NativeDateAdapter('en-US', { useUtc: true });

        adapter.setLocale('en-US');

        return adapter;
    };

    it('should render an absolute long date the same way the other adapters do', () => {
        const adapter = createAdapter();
        const value = adapter.createDateTime(2025, 2, 17, 12, 51, 13, 299);

        expect(new DateFormatter(adapter, 'en-US').absoluteLongDate(value)).toBe(`March${nbsp}17, 2025`);

        adapter.setLocale('ru-RU');
        expect(new DateFormatter(adapter, 'ru-RU').absoluteLongDate(value)).toBe(`17${nbsp}марта 2025`);
    });

    it('should render a duration', () => {
        const adapter = createAdapter();
        const start = adapter.createDateTime(2024, 0, 15, 10, 0, 0, 0);
        const end = adapter.createDateTime(2024, 0, 16, 12, 30, 15, 0);

        expect(new DateFormatter(adapter, 'en-US').durationShortest(start, end)).toBe('26:30:15');
    });
});
