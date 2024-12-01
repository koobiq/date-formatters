import { DateTime } from 'luxon';

import { LuxonDateAdapter } from './adapter';

describe('LuxonDateAdapter', () => {
    let adapter: LuxonDateAdapter;
    let assertValidDate: (d: DateTime | null, valid: boolean) => void;

    beforeEach(() => {
        adapter = new LuxonDateAdapter('en-US');
        adapter.setLocale('en-US');

        assertValidDate = (d: DateTime | null, valid: boolean) => {
            expect(adapter.isDateInstance(d)).not.toBeNull();

            expect(adapter.isValid(d!)).toBe(valid);
        };
    });

    it('should get year', () => {
        expect(adapter.getYear(DateTime.local(2017, 1, 1))).toBe(2017);
    });

    it('should get month', () => {
        expect(adapter.getMonth(DateTime.local(2017, 1, 1))).toBe(0);
    });

    it('should get date', () => {
        expect(adapter.getDate(DateTime.local(2017, 1, 1))).toBe(1);
    });

    it('should get day of week', () => {
        expect(adapter.getDayOfWeek(DateTime.local(2017, 1, 1))).toBe(0);
    });

    it('should get same day of week in a locale with a different first day of the week', () => {
        adapter.setLocale('es-LA');
        expect(adapter.getDayOfWeek(DateTime.local(2017, 1, 1))).toBe(0);
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

    it('should get long month names en', () => {
        adapter.setLocale('en-US');

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

    it('should get date names', () => {
        expect(adapter.getDateNames()).toEqual([
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31'
        ]);
    });

    // TODO: Failing – CircleCI
    xit('should get date names in a different locale', () => {
        adapter.setLocale('ar-AE');

        expect(adapter.getDateNames()).toEqual([
            '١',
            '٢',
            '٣',
            '٤',
            '٥',
            '٦',
            '٧',
            '٨',
            '٩',
            '١٠',
            '١١',
            '١٢',
            '١٣',
            '١٤',
            '١٥',
            '١٦',
            '١٧',
            '١٨',
            '١٩',
            '٢٠',
            '٢١',
            '٢٢',
            '٢٣',
            '٢٤',
            '٢٥',
            '٢٦',
            '٢٧',
            '٢٨',
            '٢٩',
            '٣٠',
            '٣١'
        ]);
    });

    it('should get date names in a different locale', () => {
        adapter.setLocale('ru-RU');

        expect(adapter.getDateNames()).toEqual([
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31'
        ]);
    });

    it('should get long day of week names for ru', () => {
        adapter.setLocale('ru-RU');

        expect(adapter.getDayOfWeekNames('long')).toEqual([
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота'
        ]);
    });

    it('should get day of week names for en', () => {
        adapter.setLocale('en-US');

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

    it('should get day of week names in a different locale', () => {
        adapter.setLocale('ru-RU');

        expect(adapter.getDayOfWeekNames('long')).toEqual([
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота'
        ]);

        expect(adapter.getDayOfWeekNames('short')).toEqual(['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']);

        expect(adapter.getDayOfWeekNames('narrow')).toEqual(['В', 'П', 'В', 'С', 'Ч', 'П', 'С']);
    });

    it('should get year name', () => {
        expect(adapter.getYearName(adapter.createDate(2017))).toBe('2017');
    });

    // TODO: Failing – CircleCI
    xit('should get year name in a different locale', () => {
        adapter.setLocale('fa-IR');

        expect(adapter.getYearName(adapter.createDate(2017))).toBe('٢٠١٧');
    });

    it('should get first day of week in a different locale', () => {
        adapter.setLocale('en-US');

        expect(adapter.getFirstDayOfWeek()).toBe(0);
    });

    it('should get first day of week for ru', () => {
        adapter.setLocale('ru-RU');

        expect(adapter.getFirstDayOfWeek()).toBe(1);
    });

    it('should create DateTime date', () => {
        expect(adapter.createDate(2017).toString()).toEqual(DateTime.local(2017, 1, 1).toString());
    });

    it('should not create DateTime date with month over/under-flow', () => {
        expect(() => adapter.createDate(2017, 12 + 1)).toThrow();
        expect(() => adapter.createDate(2017, -1)).toThrow();
    });

    it('should not create DateTime date with date over/under-flow', () => {
        expect(() => adapter.createDate(2017, 1, 0)).toThrow();
    });

    it('should create invalid DateTime date with date over/under-flow', () => {
        expect(adapter.isValid(adapter.createDate(2017, 1, 30))).toBe(false);
        expect(adapter.isValid(adapter.createDate(2017, 8, 31))).toBe(false);
    });

    it('should create DateTime date with low year number', () => {
        expect(adapter.createDate(-1).year).toBe(-1);
        expect(adapter.createDate(0).year).toBe(0);
        expect(adapter.createDate(50).year).toBe(50);
        expect(adapter.createDate(99).year).toBe(99);
        expect(adapter.createDate(100).year).toBe(100);
    });

    it('should not create DateTime date in utc format', () => {
        expect(adapter.createDate(2017).zone.isUniversal).toBe(false);
    });

    it("should get today's date", () => {
        expect(adapter.sameDate(adapter.today(), DateTime.now())).toBe(true);
    });

    it('should parse string according to given format', () => {
        expect(adapter.parse('1/2/2017', 'L/d/yyyy')!.toString()).toEqual(adapter.createDate(2017, 0, 2).toString());

        expect(adapter.parse('1/2/2017', 'd/L/yyyy')!.toString()).toEqual(adapter.createDate(2017, 1, 1).toString());
    });

    it('should parse number', () => {
        const timestamp = new Date().getTime();

        expect(adapter.parse(timestamp, '')!.toString()).toEqual(DateTime.fromMillis(timestamp).toString());
    });

    it('should parse invalid value as invalid', () => {
        const d = adapter.parse('hello', 'L/d/yyyy');

        expect(d).not.toBeNull();
        expect(adapter.isDateInstance(d)).toBe(true);
        expect(adapter.isValid(d as DateTime)).toBe(false);
    });

    it('should format date according to given format', () => {
        expect(adapter.format(DateTime.local(2017, 1, 2), 'LL/dd/yyyy')).toEqual('01/02/2017');
        expect(adapter.format(DateTime.local(2017, 1, 2), 'dd/LL/yyyy')).toEqual('02/01/2017');
    });

    it('should throw when attempting to format invalid date', () => {
        expect(() => adapter.format(DateTime.local(2001, 0, 0), 'L/d/yyyy')).toThrowError(
            'DateTime: Cannot format invalid date.'
        );
    });

    it('should add years', () => {
        expect(adapter.addCalendarYears(DateTime.local(2017, 1, 1), 1).toString()).toEqual(
            DateTime.local(2018, 1, 1).toString()
        );
        expect(adapter.addCalendarYears(DateTime.local(2017, 1, 1), -1).toString()).toEqual(
            DateTime.local(2016, 1, 1).toString()
        );
    });

    it('should respect leap years when adding years', () => {
        expect(adapter.addCalendarYears(DateTime.local(2016, 2, 29), 1).toString()).toEqual(
            DateTime.local(2017, 2, 28).toString()
        );
        expect(adapter.addCalendarYears(DateTime.local(2016, 2, 29), -1).toString()).toEqual(
            DateTime.local(2015, 2, 28).toString()
        );
    });

    it('should add months', () => {
        expect(adapter.addCalendarMonths(DateTime.local(2017, 1, 1), 1).toString()).toEqual(
            DateTime.local(2017, 2, 1).toString()
        );
        expect(adapter.addCalendarMonths(DateTime.local(2017, 1, 1), -1).toString()).toEqual(
            DateTime.local(2016, 12, 1).toString()
        );
    });

    it('should respect month length differences when adding months', () => {
        expect(adapter.addCalendarMonths(DateTime.local(2017, 1, 31), 1).toString()).toEqual(
            DateTime.local(2017, 2, 28).toString()
        );
        expect(adapter.addCalendarMonths(DateTime.local(2017, 3, 31), -1).toString()).toEqual(
            DateTime.local(2017, 2, 28).toString()
        );
    });

    it('should add days', () => {
        expect(adapter.addCalendarDays(DateTime.local(2017, 1, 1), 1).toString()).toEqual(
            DateTime.local(2017, 1, 2).toString()
        );
        expect(adapter.addCalendarDays(DateTime.local(2017, 1, 1), -1).toString()).toEqual(
            DateTime.local(2016, 12, 31).toString()
        );
    });

    it('should get days from today`s date', () => {
        const initialDate = DateTime.now();

        expect(adapter.daysFromToday(initialDate.minus({ days: 2 }))).toEqual(-2);

        expect(adapter.daysFromToday(initialDate.startOf('day').minus({ days: 1 }))).toEqual(-1);
        expect(adapter.daysFromToday(initialDate.minus({ days: 1 }))).toEqual(-1);
        expect(adapter.daysFromToday(initialDate.endOf('day').minus({ days: 1 }))).toEqual(-1);

        expect(adapter.daysFromToday(initialDate.startOf('day'))).toEqual(0);
        expect(adapter.daysFromToday(initialDate)).toEqual(0);
        expect(adapter.daysFromToday(initialDate.endOf('day'))).toEqual(0);

        expect(adapter.daysFromToday(initialDate.startOf('day').plus({ days: 1 }))).toEqual(1);
        expect(adapter.daysFromToday(initialDate.plus({ days: 1 }))).toEqual(1);
        expect(adapter.daysFromToday(initialDate.endOf('day').plus({ days: 1 }))).toEqual(1);

        expect(adapter.daysFromToday(initialDate.plus({ days: 2 }))).toEqual(2);
    });

    it('should clone', () => {
        const date = DateTime.local(2017, 1, 1);

        expect(adapter.clone(date).toString()).toEqual(date.toString());
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
        const d = DateTime.fromFormat('', '');

        expect(adapter.isValid(d)).toBe(false);
        expect(adapter.isDateInstance(d)).toBe(true);
    });

    it('should count a string as not a date instance', () => {
        const d = '1/1/2019';

        expect(adapter.isDateInstance(d)).toBe(false);
    });

    it('should create valid dates from valid ISO strings', () => {
        expect(adapter.deserialize('')).toBeNull();
        expect(adapter.deserialize(null)).toBeNull();

        assertValidDate(adapter.deserialize('1985-04-12T23:20:50.52Z'), true);
        assertValidDate(adapter.deserialize('1996-12-19T16:39:57-08:00'), true);
        assertValidDate(adapter.deserialize('1937-01-01T12:00:27.87+00:20'), true);
        assertValidDate(adapter.deserialize('1990-13-31T23:59:00Z'), false);
        assertValidDate(adapter.deserialize('1/1/2017'), false);

        assertValidDate(adapter.deserialize(new Date()), true);
        assertValidDate(adapter.deserialize(new Date(NaN)), false);

        assertValidDate(adapter.deserialize(DateTime.now()), true);
        assertValidDate(adapter.deserialize(adapter.invalid()), false);
    });

    it('should create valid dates from valid SQL string', () => {
        expect(adapter.deserialize('')).toBeNull();
        expect(adapter.deserialize(null)).toBeNull();

        assertValidDate(adapter.deserialize('2022-02-02 10:04:08.049306'), true);
        assertValidDate(adapter.deserialize(adapter.invalid()), false);
    });

    it('should clone the date when deserializing a DateTime date', () => {
        const date = adapter.createDate(2017);

        expect(adapter.deserialize(date)?.toString()).toEqual(date.toString());
        expect(adapter.deserialize(date)).not.toBe(date);
    });

    it('should deserialize dates with the correct locale', () => {
        adapter.setLocale('es-LA');

        expect(adapter.deserialize('1985-04-12T23:20:50.52Z')!.locale).toBe('es-LA');
        expect(adapter.deserialize(new Date())?.locale).toBe('es-LA');
        expect(adapter.deserialize(adapter.today())?.locale).toBe('es-LA');
    });

    it('should create an invalid date', () => {
        assertValidDate(adapter.invalid(), false);
    });

    it('setLocale should not modify global DateTime locale', () => {
        expect(DateTime.now().locale).not.toBe('es-LA');

        adapter.setLocale('es-LA');

        expect(DateTime.now().locale).not.toBe('es-LA');
    });

    it('returned DateTime should have correct locale', () => {
        adapter.setLocale('es-LA');

        expect(adapter.createDate(2017).locale).toBe('es-LA');
        expect(adapter.today().locale).toBe('es-LA');
        expect(adapter.clone(adapter.today()).locale).toBe('es-LA');
        expect(adapter.parse('1/1/2017', 'L/d/yyyy')?.locale).toBe('es-LA');
        expect(adapter.addCalendarDays(adapter.today(), 1).locale).toBe('es-LA');
        expect(adapter.addCalendarMonths(adapter.today(), 1).locale).toBe('es-LA');
        expect(adapter.addCalendarYears(adapter.today(), 1).locale).toBe('es-LA');
    });
});
