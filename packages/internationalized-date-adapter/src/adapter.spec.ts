import { CalendarDate, CalendarDateTime, ZonedDateTime } from '@internationalized/date';

import { InternationalizedDateAdapter } from './adapter';

describe('InternationalizedDateAdapter', () => {
    const fixedToday = new CalendarDateTime(2026, 3, 17, 11, 51, 13, 299);

    class FixedTodayAdapter extends InternationalizedDateAdapter {
        override today(): CalendarDateTime {
            return fixedToday;
        }
    }

    const createAdapter = (locale = 'en-US') => new InternationalizedDateAdapter(locale);

    describe('adapter behavior', () => {
        it('exposes locale-derived metadata', () => {
            const adapter = createAdapter('en-US');

            expect(adapter.getMonthNames('long')[2]).toBe('March');
            expect(adapter.getMonthNames('short')[2]).toBe('Mar');
            expect(adapter.getMonthNames('narrow')[2]).toBe('M');
            expect(adapter.getDateNames()[0]).toBe('1');
            expect(adapter.getDateNames()[30]).toBe('31');
            expect(adapter.getDayOfWeekNames('long')[1]).toBe('Monday');
            expect(adapter.getDayOfWeekNames('short')[1]).toBe('Mo');
            expect(adapter.getDayOfWeekNames('narrow')[1]).toBe('M');
            expect(adapter.getFirstDayOfWeek()).toBe(0);
        });

        it('reads basic date parts and calendar info', () => {
            const adapter = createAdapter();
            const value = new CalendarDateTime(2026, 3, 17, 12, 34, 56, 789);

            expect(adapter.getYear(value)).toBe(2026);
            expect(adapter.getMonth(value)).toBe(2);
            expect(adapter.getDate(value)).toBe(17);
            expect(adapter.getYearName(value)).toBe('2026');
            expect(adapter.getNumDaysInMonth(value)).toBe(31);
        });

        it('computes weekday and timestamp using configured timezone', () => {
            const adapter = new InternationalizedDateAdapter('ru-RU', { timeZone: 'UTC' });
            const value = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 515);

            expect(adapter.getDayOfWeek(value)).toBe(1);
            expect(adapter.getTime(value)).toBe(new Date('2026-03-16T11:48:15.515Z').getTime());
        });

        it('reads time parts from CalendarDateTime', () => {
            const adapter = createAdapter();
            const value = new CalendarDateTime(2026, 3, 17, 0, 0, 0, 0);

            expect(adapter.getHours(value)).toBe(0);
            expect(adapter.getMinutes(value)).toBe(0);
            expect(adapter.getSeconds(value)).toBe(0);
            expect(adapter.getMilliseconds(value)).toBe(0);
        });

        it('parses floating date string to midnight', () => {
            const adapter = createAdapter();

            expect(adapter.parse('2026-03-16')).toEqual(new CalendarDateTime(2026, 3, 16, 0, 0, 0, 0));
        });

        it('returns null for unsupported parse values', () => {
            const adapter = createAdapter();

            expect(adapter.parse('invalid-date')).toBeNull();
            expect(adapter.parse({})).toBeNull();
            expect(adapter.parse(null)).toBeNull();
        });

        it('normalizes CalendarDate input in parse', () => {
            const adapter = createAdapter();

            expect(adapter.parse(new CalendarDate(2026, 3, 16))).toEqual(new CalendarDateTime(2026, 3, 16, 0, 0, 0, 0));
        });

        it('parses floating datetime string', () => {
            const adapter = createAdapter();

            expect(adapter.parse('2026-03-16T11:48:15.515')).toEqual(
                new CalendarDateTime(2026, 3, 16, 11, 48, 15, 515)
            );
        });

        it('normalizes native Date and timestamp input in parse', () => {
            const adapter = new InternationalizedDateAdapter('ru-RU', { timeZone: 'UTC' });
            const value = new Date('2026-03-16T15:44:48.417Z');
            const expected = new CalendarDateTime(2026, 3, 16, 15, 44, 48, 417);

            expect(adapter.parse(value)).toEqual(expected);
            expect(adapter.parse(value.getTime())).toEqual(expected);
        });

        it('parses absolute string using configured timezone', () => {
            const adapter = new InternationalizedDateAdapter('ru-RU', { timeZone: 'Europe/Moscow' });

            expect(adapter.parse('2026-03-16T15:44:48.417Z')).toEqual(
                new CalendarDateTime(2026, 3, 16, 18, 44, 48, 417)
            );
        });

        it('normalizes ZonedDateTime input in parse', () => {
            const adapter = createAdapter();
            const value = new ZonedDateTime(2026, 3, 16, 'Europe/Moscow', 3 * 60 * 60 * 1000, 18, 44, 48, 417);

            expect(adapter.parse(value)).toEqual(new CalendarDateTime(2026, 3, 16, 18, 44, 48, 417));
        });

        it('returns today in configured timezone', () => {
            const adapter = new InternationalizedDateAdapter('ru-RU', { timeZone: 'UTC' });
            const now = new Date();
            const expected = new CalendarDateTime(
                now.getUTCFullYear(),
                now.getUTCMonth() + 1,
                now.getUTCDate(),
                0,
                0,
                0,
                0
            );

            expect(adapter.today()).toEqual(expected);
        });

        it('adds calendar units and normalizes startOf', () => {
            const adapter = createAdapter();
            const value = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 515);

            expect(adapter.addCalendarUnits(value, 0)).toEqual(value);
            expect(adapter.addCalendarUnits(value, { months: 1, days: 2 })).toEqual(
                new CalendarDateTime(2026, 4, 18, 11, 48, 15, 515)
            );
            expect(adapter.addCalendarYears(value, 1)).toEqual(new CalendarDateTime(2027, 3, 16, 11, 48, 15, 515));
            expect(adapter.addCalendarMonths(value, 1)).toEqual(new CalendarDateTime(2026, 4, 16, 11, 48, 15, 515));
            expect(adapter.addCalendarDays(value, 2)).toEqual(new CalendarDateTime(2026, 3, 18, 11, 48, 15, 515));
            expect(adapter.startOf(value, 'year')).toEqual(new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0));
            expect(adapter.startOf(value, 'quarter')).toEqual(new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0));
            expect(adapter.startOf(value, 'day')).toEqual(new CalendarDateTime(2026, 3, 16, 0, 0, 0, 0));
            expect(adapter.startOf(value, 'hour')).toEqual(new CalendarDateTime(2026, 3, 16, 11, 0, 0, 0));
            expect(adapter.startOf(value, 'minute')).toEqual(new CalendarDateTime(2026, 3, 16, 11, 48, 0, 0));
            expect(adapter.startOf(value, 'second')).toEqual(new CalendarDateTime(2026, 3, 16, 11, 48, 15, 0));
            expect(adapter.startOf(value, 'millisecond')).toEqual(value);
            expect(adapter.startOf(value, 'month')).toEqual(new CalendarDateTime(2026, 3, 1, 0, 0, 0, 0));
            expect(adapter.startOf(value, 'week')).toEqual(new CalendarDateTime(2026, 3, 15, 0, 0, 0, 0));
            expect(adapter.startOf(new CalendarDateTime(2026, 3, 18, 11, 48, 15, 515), 'isoWeek')).toEqual(
                new CalendarDateTime(2026, 3, 16, 0, 0, 0, 0)
            );
        });

        it('clones date values', () => {
            const adapter = createAdapter();
            const value = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 515);
            const cloned = adapter.clone(value);

            expect(cloned).toEqual(value);
            expect(cloned).not.toBe(value);
        });

        it('creates CalendarDateTime values from date parts', () => {
            const adapter = createAdapter();

            expect(adapter.createDate(2026, 2, 16)).toEqual(new CalendarDateTime(2026, 3, 16, 0, 0, 0, 0));
            expect(adapter.createDateTime(2026, 2, 16, 11, 48, 15, 515)).toEqual(
                new CalendarDateTime(2026, 3, 16, 11, 48, 15, 515)
            );
        });

        it('compares dates by year, month and day', () => {
            const adapter = createAdapter();
            const start = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 515);
            const sameDay = new CalendarDateTime(2026, 3, 16, 18, 0, 0, 0);
            const sameHour = new CalendarDateTime(2026, 3, 16, 11, 59, 0, 0);
            const sameMinute = new CalendarDateTime(2026, 3, 16, 11, 48, 59, 999);
            const nextMonth = new CalendarDateTime(2026, 4, 1, 11, 48, 15, 515);

            expect(adapter.hasSame(start, sameDay, 'year')).toBe(true);
            expect(adapter.hasSame(start, sameDay, 'month')).toBe(true);
            expect(adapter.hasSame(start, sameDay, 'day')).toBe(true);
            expect(adapter.hasSame(start, sameHour, 'hour')).toBe(true);
            expect(adapter.hasSame(start, sameMinute, 'minute')).toBe(true);
            expect(adapter.hasSame(start, sameDay, 'millisecond')).toBe(false);
            expect(adapter.hasSame(start, nextMonth, 'month')).toBe(false);
        });

        it('formats ISO and validates CalendarDateTime instances only', () => {
            const adapter = createAdapter();
            const value = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 515);
            const zonedValue = new ZonedDateTime(2026, 3, 16, 'Europe/Moscow', 3 * 60 * 60 * 1000, 18, 44, 48, 417);

            expect(adapter.toIso8601(value)).toBe('2026-03-16T11:48:15.515Z');
            expect(adapter.isDateInstance(value)).toBe(true);
            expect(adapter.isDateInstance(new CalendarDate(2026, 3, 16))).toBe(false);
            expect(adapter.isDateInstance(zonedValue)).toBe(false);
            expect(adapter.isValid(adapter.invalid())).toBe(false);
        });

        it('calculates relative differences and duration helpers', () => {
            const adapter = new FixedTodayAdapter('ru-RU');
            const start = new CalendarDateTime(2026, 3, 17, 10, 0, 0, 0);
            const end = new CalendarDateTime(2026, 3, 18, 12, 30, 15, 125);

            expect(adapter.diffNow(new CalendarDateTime(2026, 3, 18, 11, 51, 13, 299), 'days')).toBeCloseTo(1);
            expect(adapter.daysFromToday(new CalendarDateTime(2026, 3, 19, 8, 0, 0, 0))).toBe(2);
            expect(adapter.durationObjectFromDates(start, end, ['days', 'hours', 'minutes', 'seconds'], false)).toEqual(
                {
                    days: 1,
                    hours: 2,
                    minutes: 30,
                    seconds: 15
                }
            );
            expect(adapter.durationAs({ hours: 2, minutes: 30 }, 'minutes')).toBe(150);
            expect(adapter.durationFormat({ hours: 2, minutes: 30, seconds: 15 }, 'h:mm:ss')).toBe('2:30:15');
            expect(adapter.durationFormat({ minutes: 2, seconds: 5 }, 'm:ss')).toBe('2:05');
            expect(adapter.durationFormat({ minutes: 2, seconds: 5, milliseconds: 7 }, 'm:ss.SSS')).toBe('2:05.007');
        });

        it('returns the first two non-zero units by default in durationObjectFromDates', () => {
            const adapter = createAdapter();
            const start = new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0);
            const end = new CalendarDateTime(2026, 1, 2, 3, 4, 5, 0);

            expect(adapter.durationObjectFromDates(start, end, [], false)).toEqual({
                days: 1,
                hours: 3
            });
        });

        it('continues decomposition after a fractional month', () => {
            const adapter = createAdapter();
            const start = new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0);
            let end = adapter.addCalendarUnits(start, 1, 'months');
            end = adapter.addCalendarUnits(end, 22, 'days');

            expect(adapter.durationObjectFromDates(start, end, ['months', 'weeks'], true)).toEqual({
                months: 1.5,
                weeks: 1
            });
        });

        it('continues decomposition after a fractional year', () => {
            const adapter = createAdapter();
            const start = new CalendarDateTime(2026, 1, 1, 0, 0, 0, 0);
            let end = adapter.addCalendarUnits(start, 1, 'years');
            end = adapter.addCalendarUnits(end, 7, 'months');

            expect(adapter.durationObjectFromDates(start, end, ['years', 'months'], true)).toEqual({
                years: 1.5,
                months: 1
            });
        });

        it('calculates calendar-based diff for months', () => {
            const adapter = new FixedTodayAdapter('ru-RU');
            const date = new CalendarDateTime(2026, 4, 2, 0, 0, 0, 0);

            expect(adapter.diffNow(date, 'months')).toBeCloseTo(0.5);
        });

        it('calculates calendar-based diff for days', () => {
            const adapter = new FixedTodayAdapter('ru-RU');
            const date = new CalendarDateTime(2026, 3, 17, 12, 51, 13, 299);

            expect(adapter.diffNow(date, 'days')).toBeCloseTo(1 / 24);
        });

        it('calculates fixed-size diff for hours with fraction', () => {
            const adapter = new FixedTodayAdapter('ru-RU');
            const date = new CalendarDateTime(2026, 3, 17, 13, 21, 13, 299);

            expect(adapter.diffNow(date, 'hours')).toBeCloseTo(1.5);
        });

        it('formats custom tokens and rejects invalid values', () => {
            const adapter = createAdapter();
            const value = new CalendarDateTime(2026, 3, 16, 11, 48, 15, 515);

            expect(adapter.format(value, 'yyyy MMMM d HH:mm:ss.SSS')).toBe('2026 March 16 11:48:15.515');
            expect(() => adapter.format(adapter.invalid(), 'yyyy')).toThrow('Cannot format invalid date');
        });
    });
});
