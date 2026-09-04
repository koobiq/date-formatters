import { DateUnit, DurationObjectUnits } from '@koobiq/date-adapter';

import { NativeDateAdapter } from './adapter';

// Every assertion below runs the adapter in UTC mode, so the snapshots and the ISO expectations pin
// the adapter's own behaviour rather than the ambient zone. Local-time behaviour has its own describe
// at the bottom.
const utc = (year: number, month = 0, day = 1, hours = 0, minutes = 0, seconds = 0, milliseconds = 0): Date =>
    new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));

describe('NativeDateAdapter', () => {
    let adapter: NativeDateAdapter;
    let assertValidDate: (d: Date | null, valid: boolean) => void;

    beforeEach(() => {
        adapter = new NativeDateAdapter('en-US', { useUtc: true });
        adapter.setLocale('en-US');

        assertValidDate = (d: Date | null, valid: boolean) => {
            expect(adapter.isDateInstance(d)).not.toBeNull();

            expect(adapter.isValid(d!)).toBe(valid);
        };
    });

    it('should get year', () => {
        expect(adapter.getYear(utc(2017, 0, 1))).toBe(2017);
    });

    it('should get month', () => {
        expect(adapter.getMonth(utc(2017, 0, 1))).toBe(0);
    });

    it('should get date', () => {
        expect(adapter.getDate(utc(2017, 0, 1))).toBe(1);
    });

    it('should get day of week', () => {
        expect(adapter.getDayOfWeek(utc(2017, 0, 1))).toBe(0);
    });

    it('should get same day of week in a locale with a different first day of the week', () => {
        adapter.setLocale('es-LA');

        expect(adapter.getDayOfWeek(utc(2017, 0, 1))).toBe(0);
    });

    it('should get time parts', () => {
        const date = adapter.createDateTime(2011, 11, 11, 11, 22, 33, 444);

        expect(adapter.getHours(date)).toBe(11);
        expect(adapter.getMinutes(date)).toBe(22);
        expect(adapter.getSeconds(date)).toBe(33);
        expect(adapter.getMilliseconds(date)).toBe(444);
        expect(adapter.getTime(date)).toBe(Date.UTC(2011, 11, 11, 11, 22, 33, 444));
    });

    it('should get long month names', () => {
        expect(adapter.getMonthNames('long')).toEqual([
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]);
    });

    it('should get short month names en', () => {
        expect(adapter.getMonthNames('short')).toEqual([
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ]);
    });

    it('should get short month names ru', () => {
        adapter.setLocale('ru-RU');

        expect(adapter.getMonthNames('short')).toEqual([
            'янв',
            'фев',
            'март',
            'апр',
            'май',
            'июнь',
            'июль',
            'авг',
            'сен',
            'окт',
            'ноя',
            'дек'
        ]);
    });

    it('should get narrow month names', () => {
        expect(adapter.getMonthNames('narrow')).toEqual(['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']);
    });

    it('should get date names', () => {
        expect(adapter.getDateNames()).toEqual(Array.from({ length: 31 }, (_, i) => `${i + 1}`));
    });

    it('should get day of week names', () => {
        expect(adapter.getDayOfWeekNames('long')).toEqual([
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ]);
        expect(adapter.getDayOfWeekNames('short')).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
        expect(adapter.getDayOfWeekNames('narrow')).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
    });

    it('should get year name', () => {
        expect(adapter.getYearName(adapter.createDate(2017))).toBe('2017');
    });

    it('should get first day of week per locale', () => {
        expect(adapter.getFirstDayOfWeek()).toBe(0);

        adapter.setLocale('ru-RU');
        expect(adapter.getFirstDayOfWeek()).toBe(1);

        adapter.setLocale('fa-IR');
        expect(adapter.getFirstDayOfWeek()).toBe(6);
    });

    it('should get number of days in a month', () => {
        expect(adapter.getNumDaysInMonth(adapter.createDate(2024, 1, 1))).toBe(29);
        expect(adapter.getNumDaysInMonth(adapter.createDate(2023, 1, 1))).toBe(28);
        expect(adapter.getNumDaysInMonth(adapter.createDate(2023, 0, 1))).toBe(31);
    });

    it('should throw on an unsupported locale', () => {
        expect(() => adapter.setLocale('ja-JP')).toThrow('Unsupported locale "ja-JP".');
    });

    it('should not throw on any predefined locale', () => {
        ['en-US', 'ru-RU', 'es-LA', 'pt-BR', 'fa-IR', 'zh-CN', 'tk-TM'].forEach((locale) => {
            expect(() => adapter.setLocale(locale)).not.toThrow();
        });
    });

    it('should create date', () => {
        expect(adapter.toIso8601(adapter.createDate(2017, 0, 1))).toBe('2017-01-01T00:00:00.000Z');
    });

    it('should not create date with over/under-flowed month', () => {
        expect(() => adapter.createDate(2017, 12, 1)).toThrow();
        expect(() => adapter.createDate(2017, -1, 1)).toThrow();
    });

    it('should not create date with over/under-flowed date', () => {
        expect(() => adapter.createDate(2017, 1, 29)).toThrow();
        expect(() => adapter.createDate(2017, 0, 0)).toThrow();
    });

    it('should create date with low year number', () => {
        expect(adapter.getYear(adapter.createDate(89, 0, 1))).toBe(89);
        expect(adapter.getYear(adapter.createDate(0, 0, 1))).toBe(0);
    });

    it('should create date time', () => {
        expect(adapter.toIso8601(adapter.createDateTime(2017, 0, 1, 12, 30, 15, 250))).toBe('2017-01-01T12:30:15.250Z');
    });

    it("should get today's date", () => {
        expect(adapter.sameDate(adapter.today(), new Date())).toBe(true);
    });

    it('should parse string according to given format', () => {
        expect(adapter.toIso8601(adapter.parse('1/2/2017', 'M/d/yyyy')!)).toBe('2017-01-02T00:00:00.000Z');
        expect(adapter.toIso8601(adapter.parse('1/2/2017', 'd/M/yyyy')!)).toBe('2017-02-01T00:00:00.000Z');
        expect(adapter.toIso8601(adapter.parse('01.02.2017', 'dd.MM.yyyy')!)).toBe('2017-02-01T00:00:00.000Z');
        expect(adapter.toIso8601(adapter.parse('2017-02-01 12:30:15', 'yyyy-MM-dd HH:mm:ss')!)).toBe(
            '2017-02-01T12:30:15.000Z'
        );
    });

    it('should parse string by the first matching format of a list', () => {
        expect(adapter.toIso8601(adapter.parse('01.02.2017', ['yyyy-MM-dd', 'dd.MM.yyyy'])!)).toBe(
            '2017-02-01T00:00:00.000Z'
        );
    });

    it('should parse month name according to the current locale', () => {
        adapter.setLocale('ru-RU');

        expect(adapter.toIso8601(adapter.parse('16 марта 2025', 'd MMMM yyyy')!)).toBe('2025-03-16T00:00:00.000Z');
        expect(adapter.toIso8601(adapter.parse('16 мар 2025', 'd MMM yyyy')!)).toBe('2025-03-16T00:00:00.000Z');
    });

    it('should parse number', () => {
        expect(adapter.parse(1485720000000)!.getTime()).toBe(1485720000000);
    });

    it('should clone the date when parsing a Date', () => {
        const date = utc(2017, 0, 1);

        expect(adapter.parse(date)!.getTime()).toBe(date.getTime());
        expect(adapter.parse(date)).not.toBe(date);
    });

    it('should parse ISO 8601 string without a format', () => {
        assertValidDate(adapter.parse('2017-01-01'), true);
        assertValidDate(adapter.parse('1985-04-12T23:20:50.520Z'), true);
    });

    it('should return null for values it cannot parse', () => {
        expect(adapter.parse('')).toBeNull();
        expect(adapter.parse(null)).toBeNull();
        expect(adapter.parse('hello')).toBeNull();
        expect(adapter.parse('1/1/2017')).toBeNull();
        expect(adapter.parse({})).toBeNull();
    });

    it('should return an invalid date when the value does not match the given format', () => {
        assertValidDate(adapter.parse('hello', 'dd.MM.yyyy'), false);
        assertValidDate(adapter.parse('32.01.2017', 'dd.MM.yyyy'), false);
        assertValidDate(adapter.parse('01.13.2017', 'dd.MM.yyyy'), false);
        assertValidDate(adapter.parse('29.02.2023', 'dd.MM.yyyy'), false);
        assertValidDate(adapter.parse('29.02.2024', 'dd.MM.yyyy'), true);
    });

    it('should add years', () => {
        expect(adapter.toIso8601(adapter.addCalendarYears(adapter.createDate(2017, 0, 1), 1))).toBe(
            '2018-01-01T00:00:00.000Z'
        );
        expect(adapter.toIso8601(adapter.addCalendarYears(adapter.createDate(2017, 0, 1), -1))).toBe(
            '2016-01-01T00:00:00.000Z'
        );
    });

    it('should respect leap years when adding years', () => {
        expect(adapter.toIso8601(adapter.addCalendarYears(adapter.createDate(2016, 1, 29), 1))).toBe(
            '2017-02-28T00:00:00.000Z'
        );
        expect(adapter.toIso8601(adapter.addCalendarYears(adapter.createDate(2016, 1, 29), 4))).toBe(
            '2020-02-29T00:00:00.000Z'
        );
    });

    it('should add months', () => {
        expect(adapter.toIso8601(adapter.addCalendarMonths(adapter.createDate(2017, 0, 1), 1))).toBe(
            '2017-02-01T00:00:00.000Z'
        );
        expect(adapter.toIso8601(adapter.addCalendarMonths(adapter.createDate(2017, 0, 1), -1))).toBe(
            '2016-12-01T00:00:00.000Z'
        );
    });

    it('should respect month length differences when adding months', () => {
        expect(adapter.toIso8601(adapter.addCalendarMonths(adapter.createDate(2017, 0, 31), 1))).toBe(
            '2017-02-28T00:00:00.000Z'
        );
        expect(adapter.toIso8601(adapter.addCalendarMonths(adapter.createDate(2017, 2, 31), -1))).toBe(
            '2017-02-28T00:00:00.000Z'
        );
    });

    it('should add days', () => {
        expect(adapter.toIso8601(adapter.addCalendarDays(adapter.createDate(2017, 0, 1), 1))).toBe(
            '2017-01-02T00:00:00.000Z'
        );
        expect(adapter.toIso8601(adapter.addCalendarDays(adapter.createDate(2017, 0, 1), -1))).toBe(
            '2016-12-31T00:00:00.000Z'
        );
    });

    it('should not mutate the date it was given', () => {
        const date = adapter.createDateTime(2017, 0, 1, 10, 0, 0, 0);
        const snapshot = date.getTime();

        adapter.addCalendarYears(date, 1);
        adapter.addCalendarMonths(date, 1);
        adapter.addCalendarDays(date, 1);
        adapter.addCalendarUnits(date, 5, 'hours');
        adapter.startOf(date, 'year');
        adapter.clone(date);

        expect(date.getTime()).toBe(snapshot);
    });

    it('should get days from today`s date', () => {
        const initialDate = adapter.today();
        const startOfDay = adapter.startOf(initialDate, 'day');
        const endOfDay = adapter.addCalendarUnits(adapter.addCalendarDays(startOfDay, 1), -1, 'milliseconds');

        expect(adapter.daysFromToday(adapter.addCalendarDays(initialDate, -2))).toBe(-2);

        expect(adapter.daysFromToday(adapter.addCalendarDays(startOfDay, -1))).toBe(-1);
        expect(adapter.daysFromToday(adapter.addCalendarDays(initialDate, -1))).toBe(-1);
        expect(adapter.daysFromToday(adapter.addCalendarDays(endOfDay, -1))).toBe(-1);

        expect(adapter.daysFromToday(startOfDay)).toBe(0);
        expect(adapter.daysFromToday(initialDate)).toBe(0);
        expect(adapter.daysFromToday(endOfDay)).toBe(0);

        expect(adapter.daysFromToday(adapter.addCalendarDays(startOfDay, 1))).toBe(1);
        expect(adapter.daysFromToday(adapter.addCalendarDays(initialDate, 1))).toBe(1);
        expect(adapter.daysFromToday(adapter.addCalendarDays(endOfDay, 1))).toBe(1);

        expect(adapter.daysFromToday(adapter.addCalendarDays(initialDate, 2))).toBe(2);
    });

    it('should build a duration object from two dates', () => {
        const start = adapter.createDateTime(2024, 0, 15, 10, 0, 0, 0);
        const end = adapter.createDateTime(2024, 0, 16, 12, 30, 15, 125);

        expect(adapter.durationObjectFromDates(start, end, ['days', 'hours', 'minutes', 'seconds'])).toEqual({
            days: 1,
            hours: 2,
            minutes: 30,
            seconds: 15
        });
    });

    it('should build a duration object with the two most significant units when no units are given', () => {
        const start = adapter.createDateTime(2024, 0, 15, 10, 0, 0, 0);
        const end = adapter.createDateTime(2025, 2, 16, 12, 30, 15, 125);

        expect(adapter.durationObjectFromDates(start, end, [])).toEqual({ years: 1, months: 2 });
    });

    it('should convert a duration object to a single unit', () => {
        expect(adapter.durationAs({ hours: 2, minutes: 30 }, 'minutes')).toBe(150);
        expect(adapter.durationAs({ minutes: 1, seconds: 30 }, 'seconds')).toBe(90);
    });

    it('should format a duration object', () => {
        expect(adapter.durationFormat({ hours: 2, minutes: 3, seconds: 4 }, 'h:mm:ss')).toBe('2:03:04');
        expect(adapter.durationFormat({ minutes: 3, seconds: 4 }, 'm:ss')).toBe('3:04');
        expect(adapter.durationFormat({ minutes: 3, seconds: 4, milliseconds: 56 }, 'm:ss.SSS')).toBe('3:04.056');
    });

    it('should let the largest unit of the duration format absorb the rest', () => {
        expect(adapter.durationFormat({ days: 2, hours: 1 }, 'h:mm:ss')).toBe('49:00:00');
    });

    it('should tell whether two dates share a unit', () => {
        const date = adapter.createDateTime(2024, 0, 15, 10, 30, 0, 0);

        expect(adapter.hasSame(date, adapter.createDateTime(2024, 0, 15, 23, 0, 0, 0), 'day')).toBe(true);
        expect(adapter.hasSame(date, adapter.createDateTime(2024, 0, 16, 10, 30, 0, 0), 'day')).toBe(false);
        expect(adapter.hasSame(date, adapter.createDateTime(2024, 0, 31, 0, 0, 0, 0), 'month')).toBe(true);
        expect(adapter.hasSame(date, adapter.createDateTime(2024, 11, 31, 0, 0, 0, 0), 'year')).toBe(true);
        expect(adapter.hasSame(date, adapter.createDateTime(2025, 0, 15, 10, 30, 0, 0), 'year')).toBe(false);
    });

    it('should diff from now', () => {
        expect(adapter.diffNow(adapter.addCalendarDays(adapter.today(), 2), 'days')).toBeCloseTo(2);
        expect(adapter.diffNow(adapter.addCalendarUnits(adapter.today(), -3, 'hours'), 'hours')).toBeCloseTo(-3);
    });

    it('should clone', () => {
        const date = utc(2017, 0, 1);

        expect(adapter.clone(date).getTime()).toBe(date.getTime());
        expect(adapter.clone(date)).not.toBe(date);
    });

    it('should compare dates', () => {
        expect(adapter.compareDate(adapter.createDate(2017), adapter.createDate(2017, 1, 2))).toBeLessThan(0);
        expect(adapter.compareDate(adapter.createDate(2017), adapter.createDate(2017, 2, 1))).toBeLessThan(0);
        expect(adapter.compareDate(adapter.createDate(2017), adapter.createDate(2018))).toBeLessThan(0);
        expect(adapter.compareDate(adapter.createDate(2017), adapter.createDate(2017))).toBe(0);
        expect(adapter.compareDate(adapter.createDate(2018), adapter.createDate(2017))).toBeGreaterThan(0);
        expect(adapter.compareDate(adapter.createDate(2017, 2, 1), adapter.createDate(2017))).toBeGreaterThan(0);
        expect(adapter.compareDate(adapter.createDate(2017, 1, 2), adapter.createDate(2017))).toBeGreaterThan(0);
    });

    it('should clamp date at lower bound', () => {
        expect(adapter.clampDate(adapter.createDate(2017), adapter.createDate(2018), adapter.createDate(2019))).toEqual(
            adapter.createDate(2018)
        );
    });

    it('should clamp date at upper bound', () => {
        expect(adapter.clampDate(adapter.createDate(2020), adapter.createDate(2018), adapter.createDate(2019))).toEqual(
            adapter.createDate(2019)
        );
    });

    it('should clamp date already within bounds', () => {
        expect(
            adapter.clampDate(adapter.createDate(2018, 2, 1), adapter.createDate(2018), adapter.createDate(2019))
        ).toEqual(adapter.createDate(2018, 2, 1));
    });

    it('should count today as a valid date instance', () => {
        const d = adapter.today();

        expect(adapter.isValid(d)).toBe(true);
        expect(adapter.isDateInstance(d)).toBe(true);
    });

    it('should count an invalid date as an invalid date instance', () => {
        const d = adapter.invalid();

        expect(adapter.isValid(d)).toBe(false);
        expect(adapter.isDateInstance(d)).toBe(true);
    });

    it('should count a string as not a date instance', () => {
        expect(adapter.isDateInstance('1/1/2019')).toBe(false);
    });

    it('should create valid dates from valid ISO strings', () => {
        expect(adapter.deserialize('')).toBeNull();
        expect(adapter.deserialize(null)).toBeNull();

        assertValidDate(adapter.deserialize('1985-04-12T23:20:50.520Z'), true);
        assertValidDate(adapter.deserialize('1996-12-19T16:39:57-08:00'), true);
        assertValidDate(adapter.deserialize('1990-13-31T23:59:00Z'), false);
        assertValidDate(adapter.deserialize('1/1/2017'), false);

        assertValidDate(adapter.deserialize(new Date()), true);
        assertValidDate(adapter.deserialize(new Date(NaN)), false);
        assertValidDate(adapter.deserialize(adapter.invalid()), false);
    });

    it('should clone the date when deserializing a Date', () => {
        const date = adapter.createDate(2017);

        expect(adapter.deserialize(date)!.getTime()).toBe(date.getTime());
        expect(adapter.deserialize(date)).not.toBe(date);
    });

    it('should create an invalid date', () => {
        assertValidDate(adapter.invalid(), false);
    });

    it('should calculate startOf properly', () => {
        const dateUnits: DateUnit[] = [
            'year',
            'quarter',
            'month',
            'week',
            'isoWeek',
            'day',
            'hour',
            'minute',
            'second',
            'millisecond'
        ];
        const now = adapter.createDateTime(2011, 11, 11, 11, 11, 11, 11);

        expect(dateUnits.map((unit) => adapter.toIso8601(adapter.startOf(now, unit)))).toMatchSnapshot();
    });

    it('should start the week on the first day of week of the current locale', () => {
        // 2011-12-11 is a Sunday.
        const now = adapter.createDateTime(2011, 11, 11, 11, 11, 11, 11);

        expect(adapter.toIso8601(adapter.startOf(now, 'week'))).toBe('2011-12-11T00:00:00.000Z');
        expect(adapter.toIso8601(adapter.startOf(now, 'isoWeek'))).toBe('2011-12-05T00:00:00.000Z');

        adapter.setLocale('ru-RU');

        expect(adapter.toIso8601(adapter.startOf(now, 'week'))).toBe('2011-12-05T00:00:00.000Z');
    });

    describe('format', () => {
        const date = () => adapter.createDateTime(2025, 2, 17, 12, 51, 13, 299);

        it('should render the DATE variable of every locale', () => {
            const expected: { [locale: string]: string } = {
                'en-US': 'March 17',
                'ru-RU': '17 марта',
                'es-LA': '17 de marzo',
                'pt-BR': '17 de março',
                'fa-IR': 'مارس 17',
                'zh-CN': '3 月 17 日',
                'tk-TM': 'Mart 17'
            };

            Object.keys(expected).forEach((locale) => {
                adapter.setLocale(locale);

                expect(adapter.format(date(), adapter.config.variables['DATE'])).toBe(expected[locale]);
            });
        });

        it('should render the SHORT_DATE variable of every locale', () => {
            const expected: { [locale: string]: string } = {
                'en-US': 'Mar 17',
                'ru-RU': '17 мар',
                'es-LA': '17 mar',
                'pt-BR': '17 mar',
                'fa-IR': 'ما 17',
                'zh-CN': '3 月 17 日',
                'tk-TM': 'Mart 17'
            };

            Object.keys(expected).forEach((locale) => {
                adapter.setLocale(locale);

                expect(adapter.format(date(), adapter.config.variables['SHORT_DATE'])).toBe(expected[locale]);
            });
        });

        it('should render the dateInput format of every locale', () => {
            const expected: { [locale: string]: string } = {
                'en-US': '2025-03-17',
                'ru-RU': '17.03.2025',
                'es-LA': '17/03/2025',
                'pt-BR': '17/03/2025',
                'fa-IR': '2025/03/17',
                'zh-CN': '2025/03/17',
                'tk-TM': '17.03.2025'
            };

            Object.keys(expected).forEach((locale) => {
                adapter.setLocale(locale);

                expect(adapter.format(date(), adapter.config.dateInput)).toBe(expected[locale]);
            });
        });

        it('should render time variables', () => {
            expect(adapter.format(date(), adapter.config.variables['TIME'])).toBe('12:51');
            expect(adapter.format(date(), adapter.config.variables['SECONDS'])).toBe('13');
            expect(adapter.format(date(), adapter.config.variables['MILLISECONDS'])).toBe('.299');

            adapter.setLocale('ru-RU');
            expect(adapter.format(date(), adapter.config.variables['MILLISECONDS'])).toBe(',299');
        });

        it('should pass punctuation variables through untouched', () => {
            expect(adapter.format(date(), adapter.config.variables['DASH'])).toBe('–');
            expect(adapter.format(date(), adapter.config.variables['LONG_DASH'])).toBe(' – ');
            expect(adapter.format(date(), adapter.config.variables['NBSP'])).toBe(' ');
        });

        it('should render every supported token', () => {
            expect(adapter.format(date(), 'yyyy yy M MM d dd H HH m mm s ss SSS')).toBe(
                '2025 25 3 03 17 17 12 12 51 51 13 13 299'
            );
        });

        it('should render weekday tokens', () => {
            expect(adapter.format(date(), 'EEEE EEE EE')).toBe('Monday Mo M');
        });

        it('should render a quoted literal', () => {
            expect(adapter.format(date(), "d 'de' MMMM")).toBe('17 de March');
            expect(adapter.format(date(), "'yyyy'")).toBe('yyyy');
            expect(adapter.format(date(), "''")).toBe("'");
        });

        it('should pad low year numbers', () => {
            expect(adapter.format(adapter.createDate(89, 0, 1), 'yyyy')).toBe('0089');
        });

        it('should throw on an invalid date', () => {
            expect(() => adapter.format(adapter.invalid(), 'yyyy')).toThrow('Cannot format invalid date');
        });
    });

    describe('addCalendarUnits', () => {
        let baseDate: Date;

        beforeEach(() => {
            // Use a fixed date for consistent testing
            baseDate = new Date('2024-01-15T10:30:00.000Z');
        });

        describe('when called with number and unit', () => {
            it('should add years correctly', () => {
                const result = adapter.addCalendarUnits(baseDate, 2, 'years');

                expect(adapter.getYear(result)).toBe(2026);
                expect(adapter.getMonth(result)).toBe(adapter.getMonth(baseDate));
                expect(adapter.getDate(result)).toBe(adapter.getDate(baseDate));
            });

            it('should add months correctly', () => {
                const result = adapter.addCalendarUnits(baseDate, 3, 'months');

                expect(adapter.getYear(result)).toBe(2024);
                expect(adapter.getMonth(result)).toBe(3);
                expect(adapter.getDate(result)).toBe(adapter.getDate(baseDate));
            });

            it('should add weeks correctly', () => {
                expect(adapter.getDate(adapter.addCalendarUnits(baseDate, 2, 'weeks'))).toBe(29);
            });

            it('should add days correctly', () => {
                expect(adapter.getDate(adapter.addCalendarUnits(baseDate, 5, 'days'))).toBe(20);
            });

            it('should add hours correctly', () => {
                expect(adapter.toIso8601(adapter.addCalendarUnits(baseDate, 3, 'hours'))).toMatchSnapshot();
            });

            it('should add minutes correctly', () => {
                expect(adapter.getMinutes(adapter.addCalendarUnits(baseDate, 45, 'minutes'))).toBe(15);
            });

            it('should add seconds correctly', () => {
                expect(adapter.getSeconds(adapter.addCalendarUnits(baseDate, 30, 'seconds'))).toBe(30);
            });

            it('should add milliseconds correctly', () => {
                expect(adapter.getMilliseconds(adapter.addCalendarUnits(baseDate, 500, 'milliseconds'))).toBe(500);
            });

            it('should handle negative values', () => {
                const result = adapter.addCalendarUnits(baseDate, -1, 'months');

                expect(adapter.getYear(result)).toBe(2023);
                expect(adapter.getMonth(result)).toBe(11);
            });

            it('should handle zero values', () => {
                expect(adapter.toIso8601(adapter.addCalendarUnits(baseDate, 0, 'days'))).toBe(
                    adapter.toIso8601(baseDate)
                );
            });

            it('should return original date when only number is provided without unit', () => {
                expect(adapter.toIso8601(adapter.addCalendarUnits(baseDate, 5))).toBe(adapter.toIso8601(baseDate));
            });

            it('should not mutate an invalid date', () => {
                assertValidDate(adapter.addCalendarUnits(adapter.invalid(), 1, 'days'), false);
            });
        });

        describe('when called with DurationObjectUnits object', () => {
            it('should add multiple units from object', () => {
                const duration: DurationObjectUnits = { years: 1, months: 2, days: 3 };
                const result = adapter.addCalendarUnits(baseDate, duration);

                expect(adapter.getYear(result)).toBe(2025);
                expect(adapter.getMonth(result)).toBe(2);
                expect(adapter.getDate(result)).toBe(18);
            });

            it('should handle object with a single unit', () => {
                expect(adapter.toIso8601(adapter.addCalendarUnits(baseDate, { hours: 5 }))).toMatchSnapshot();
            });

            it('should handle object with all units', () => {
                const duration: DurationObjectUnits = {
                    years: 1,
                    months: 1,
                    weeks: 1,
                    days: 1,
                    hours: 1,
                    minutes: 1,
                    seconds: 1,
                    milliseconds: 1
                };

                expect(adapter.toIso8601(adapter.addCalendarUnits(baseDate, duration))).toMatchSnapshot();
            });

            it('should handle quarters', () => {
                const result = adapter.addCalendarUnits(baseDate, { quarters: 2 });

                expect(adapter.getMonth(result)).toBe(6);
            });

            it('should handle empty object', () => {
                expect(adapter.toIso8601(adapter.addCalendarUnits(baseDate, {}))).toBe(adapter.toIso8601(baseDate));
            });

            it('should handle negative values in object', () => {
                const duration: DurationObjectUnits = { months: -3, days: -10 };

                expect(adapter.toIso8601(adapter.addCalendarUnits(baseDate, duration))).toMatchSnapshot();
            });
        });
    });
});

describe('NativeDateAdapter in local time', () => {
    let adapter: NativeDateAdapter;

    beforeEach(() => {
        adapter = new NativeDateAdapter('en-US');
    });

    it('should read components from the host time zone', () => {
        const date = new Date(2017, 0, 1, 13, 45, 30, 250);

        expect(adapter.getYear(date)).toBe(2017);
        expect(adapter.getMonth(date)).toBe(0);
        expect(adapter.getDate(date)).toBe(1);
        expect(adapter.getHours(date)).toBe(13);
        expect(adapter.getMinutes(date)).toBe(45);
        expect(adapter.getSeconds(date)).toBe(30);
        expect(adapter.getMilliseconds(date)).toBe(250);
    });

    it('should create dates in the host time zone', () => {
        expect(adapter.createDateTime(2017, 0, 1, 13, 45, 30, 250).getTime()).toBe(
            new Date(2017, 0, 1, 13, 45, 30, 250).getTime()
        );
    });

    it('should truncate to local midnight', () => {
        const date = adapter.startOf(new Date(2017, 5, 15, 13, 45, 30, 250), 'day');

        expect(adapter.getHours(date)).toBe(0);
        expect(adapter.getDate(date)).toBe(15);
        expect(date.getTime()).toBe(new Date(2017, 5, 15).getTime());
    });

    it('should format from local components', () => {
        expect(adapter.format(new Date(2025, 2, 17, 12, 51, 13, 299), 'yyyy-MM-dd HH:mm:ss.SSS')).toBe(
            '2025-03-17 12:51:13.299'
        );
    });
});

describe('NativeDateAdapter regressions', () => {
    let adapter: NativeDateAdapter;

    beforeEach(() => {
        adapter = new NativeDateAdapter('en-US', { useUtc: true });
    });

    describe('ISO 8601 parsing', () => {
        it('should read a date-only string as a calendar date, not as a UTC instant', () => {
            const local = new NativeDateAdapter('en-US');

            expect(local.format(local.parse('2025-03-17')!, 'yyyy-MM-dd')).toBe('2025-03-17');
            expect(adapter.format(adapter.parse('2025-03-17')!, 'yyyy-MM-dd')).toBe('2025-03-17');
        });

        it('should honour an explicit offset', () => {
            expect(adapter.toIso8601(adapter.parse('2025-03-17T12:30+03:00')!)).toBe('2025-03-17T09:30:00.000Z');
        });

        it('should reject a day that does not exist in the month', () => {
            expect(adapter.parse('2025-02-30')).toBeNull();
            expect(adapter.toIso8601(adapter.parse('2025-02-28')!)).toBe('2025-02-28T00:00:00.000Z');
        });
    });

    describe('addCalendarUnits', () => {
        it('should apply units largest-first regardless of key order', () => {
            const base = adapter.createDate(2024, 0, 30);
            const expected = '2024-03-01T00:00:00.000Z';

            expect(adapter.toIso8601(adapter.addCalendarUnits(base, { months: 1, days: 1 }))).toBe(expected);
            expect(adapter.toIso8601(adapter.addCalendarUnits(base, { days: 1, months: 1 }))).toBe(expected);
        });

        it('should reject a singular unit rather than returning undefined', () => {
            expect(() => adapter.addCalendarUnits(adapter.createDate(2025, 0, 1), 1, 'day' as any)).toThrow();
        });
    });

    describe('durationFormat', () => {
        it('should not borrow a unit from a negative duration', () => {
            expect(adapter.durationFormat({ hours: -1, minutes: -30 }, 'h:mm:ss')).toBe('-1:30:00');
            expect(adapter.durationFormat({ hours: 1, minutes: 30 }, 'h:mm:ss')).toBe('1:30:00');
        });

        it('should render a day token instead of passing it through', () => {
            expect(adapter.durationFormat({ days: 2 }, 'd h:mm')).toBe('2 0:00');
            expect(adapter.durationFormat({ days: 2 }, 'h:mm:ss')).toBe('48:00:00');
        });
    });

    describe('validation', () => {
        it('should reject a day overflow that lands back on the same month', () => {
            expect(() => adapter.createDate(2024, 0, 367)).toThrow();
            expect(adapter.toIso8601(adapter.createDate(2024, 0, 31))).toBe('2024-01-31T00:00:00.000Z');
        });

        it('should reject out-of-range time components', () => {
            expect(() => adapter.createDateTime(2017, 0, 1, 25, 0, 0, 0)).toThrow();
            expect(() => adapter.createDateTime(2017, 0, 1, 0, 60, 0, 0)).toThrow();
        });

        it('should throw a descriptive error when serializing an invalid date', () => {
            expect(() => adapter.toIso8601(adapter.invalid())).toThrow('Cannot serialize invalid date');
        });

        it('should reject a non-string display format', () => {
            expect(() => adapter.format(adapter.createDate(2025, 0, 1), undefined as any)).toThrow();
        });
    });

    describe('two-digit years', () => {
        it('should pivot yy at 68', () => {
            expect(adapter.getYear(adapter.parse('31.12.99', 'dd.MM.yy')!)).toBe(1999);
            expect(adapter.getYear(adapter.parse('31.12.25', 'dd.MM.yy')!)).toBe(2025);
        });

        it('should not accept a two-digit year for yyyy', () => {
            expect(adapter.isValid(adapter.parse('16.03.25', 'dd.MM.yyyy')!)).toBe(false);
            expect(adapter.toIso8601(adapter.parse('16.03.2025', 'dd.MM.yyyy')!)).toBe('2025-03-16T00:00:00.000Z');
        });
    });

    describe('locale data', () => {
        it('should not let one adapter corrupt another through a returned array', () => {
            const other = new NativeDateAdapter('en-US', { useUtc: true });

            other.getDayOfWeekNames('long').sort();
            other.getMonthNames('narrow').sort();

            expect(adapter.format(adapter.createDate(2025, 2, 19), 'EEEE')).toBe('Wednesday');
            expect(adapter.format(adapter.createDate(2025, 2, 19), 'MMMM')).toBe('March');
        });

        it('should honour a firstDayOfWeek override in startOf', () => {
            adapter.updateLocaleData({ firstDayOfWeek: 1 });

            expect(adapter.getFirstDayOfWeek()).toBe(1);
            expect(adapter.toIso8601(adapter.startOf(adapter.createDate(2025, 2, 16), 'week'))).toBe(
                '2025-03-10T00:00:00.000Z'
            );
        });

        it('should stay usable after a rejected locale', () => {
            const ru = new NativeDateAdapter('ru-RU', { useUtc: true });

            expect(() => ru.setLocale('ja-JP')).toThrow();
            expect(ru.format(ru.createDate(2025, 2, 17), 'MMMM')).toBe('марта');
        });
    });

    describe('daysFromToday', () => {
        it('should count calendar days across a DST spring-forward', () => {
            // Local-time adapter: 2018-11-04 has no local midnight in America/Sao_Paulo, so a
            // wall-clock diff via startOf('day') under-counts every day from there on.
            const local = new NativeDateAdapter('en-US');
            const spy = jest.spyOn(local, 'today').mockReturnValue(new Date(2018, 10, 4, 12, 0, 0));

            expect(local.daysFromToday(new Date(2018, 10, 5, 12, 0, 0))).toBe(1);
            expect(local.daysFromToday(new Date(2018, 10, 10, 12, 0, 0))).toBe(6);
            expect(local.daysFromToday(new Date(2018, 10, 4, 23, 0, 0))).toBe(0);
            expect(local.daysFromToday(new Date(2018, 10, 3, 1, 0, 0))).toBe(-1);

            spy.mockRestore();
        });
    });

    describe('durationObjectFromDates', () => {
        it('should report zero of the smallest unit for a sub-second span', () => {
            const start = adapter.createDateTime(2025, 11, 31, 23, 59, 59, 999);
            const end = adapter.createDateTime(2026, 0, 1, 0, 0, 0, 1);

            // Reporting {} here would render an empty duration label.
            expect(adapter.durationObjectFromDates(start, end)).toEqual({ seconds: 0 });
        });
    });

    describe('hasSame', () => {
        it('should compare by calendar unit', () => {
            expect(
                adapter.hasSame(
                    adapter.createDateTime(2024, 0, 15, 10, 30, 0, 0),
                    adapter.createDateTime(2024, 0, 15, 23, 0, 0, 0),
                    'day'
                )
            ).toBe(true);
            expect(adapter.hasSame(adapter.createDate(2024, 0, 15), adapter.createDate(2024, 0, 16), 'day')).toBe(
                false
            );
            expect(adapter.hasSame(adapter.createDate(2024, 0, 15), adapter.createDate(2024, 2, 1), 'quarter')).toBe(
                true
            );
            expect(adapter.hasSame(adapter.createDate(2024, 0, 15), adapter.createDate(2024, 4, 1), 'quarter')).toBe(
                false
            );
            expect(adapter.hasSame(adapter.createDate(2024, 0, 15), adapter.createDate(2025, 0, 15), 'year')).toBe(
                false
            );
        });
    });
});
