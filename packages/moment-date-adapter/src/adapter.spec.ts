import { DurationObjectUnits } from '@koobiq/date-adapter';
import moment from 'moment';

import { MomentDateAdapter } from './adapter';
import { enUS } from './locales/en-US';
import { esLA } from './locales/es-LA';
import { faIR } from './locales/fa-IR';
import { ptBR } from './locales/pt-BR';
import { ruRU } from './locales/ru-RU';
import { zhCN } from './locales/zh-CN';

const JAN = 0,
    FEB = 1,
    MAR = 2,
    DEC = 11;

const predefinedLocales = [enUS, ruRU, esLA, ptBR, zhCN, faIR].map(({ name }) => name);

describe('MomentDateAdapter', () => {
    let adapter: MomentDateAdapter;
    let assertValidDate: (d: moment.Moment | null, valid: boolean) => void;

    beforeEach(() => {
        moment.locale('en');
        adapter = new MomentDateAdapter('en');
        adapter.setLocale('en');

        assertValidDate = (d: moment.Moment | null, valid: boolean) => {
            expect(adapter.isDateInstance(d)).not.toBeNull();

            expect(adapter.isValid(d!)).toBe(valid);
        };
    });

    it('should throw error when try to set locale not from predefined locales', () => {
        const legacyLocaleIds = ['ru', 'en'];

        [...predefinedLocales, ...legacyLocaleIds].forEach((localeId) => {
            expect(() => adapter.setLocale(localeId)).not.toThrowError();
        });

        ['ar-AE', 'jp', 'fr', 'ja', 'ja-JP'].forEach((localeId) => {
            expect(() => adapter.setLocale(localeId)).toThrowError();
        });
    });

    it('should get year', () => {
        expect(adapter.getYear(moment([2017, JAN, 1]))).toBe(2017);
    });

    it('should get month', () => {
        expect(adapter.getMonth(moment([2017, JAN, 1]))).toBe(0);
    });

    it('should get date', () => {
        expect(adapter.getDate(moment([2017, JAN, 1]))).toBe(1);
    });

    it('should get day of week', () => {
        expect(adapter.getDayOfWeek(moment([2017, JAN, 1]))).toBe(0);
    });

    it('should get same day of week in a locale with a different first day of the week', () => {
        adapter.setLocale('en-US');
        expect(adapter.getDayOfWeek(moment([2017, JAN, 1]))).toBe(0);
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
        adapter.setLocale('ru');

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
        adapter.setLocale('en');

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

    it('should get date names in a different locale', () => {
        adapter.setLocale('ru');

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
        adapter.setLocale('ru');

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
        adapter.setLocale('en');

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
        adapter.setLocale('ru');

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
        expect(adapter.getYearName(moment([2017, JAN, 1]))).toBe('2017');
    });

    it('should get first day of week for ru', () => {
        adapter.setLocale('ru');

        expect(adapter.getFirstDayOfWeek()).toBe(1);
    });

    it('should create Moment date', () => {
        expect(adapter.createDate(2017, JAN, 1).format()).toEqual(moment([2017, JAN, 1]).format());
    });

    it('should not create Moment date with month over/under-flow', () => {
        expect(() => adapter.createDate(2017, DEC + 1, 1)).toThrow();
        expect(() => adapter.createDate(2017, JAN - 1, 1)).toThrow();
    });

    it('should not create Moment date with date over/under-flow', () => {
        expect(() => adapter.createDate(2017, JAN, 32)).toThrow();
        expect(() => adapter.createDate(2017, JAN, 0)).toThrow();
    });

    it('should create Moment date with low year number', () => {
        expect(adapter.createDate(-1, JAN, 1).year()).toBe(-1);
        expect(adapter.createDate(0, JAN, 1).year()).toBe(0);
        expect(adapter.createDate(50, JAN, 1).year()).toBe(50);
        expect(adapter.createDate(99, JAN, 1).year()).toBe(99);
        expect(adapter.createDate(100, JAN, 1).year()).toBe(100);
    });

    it('should not create Moment date in utc format', () => {
        expect(adapter.createDate(2017, JAN, 5).isUTC()).toEqual(false);
    });

    it("should get today's date", () => {
        expect(adapter.sameDate(adapter.today(), moment())).toBe(true);
    });

    it('should parse string according to given format', () => {
        expect(adapter.parse('1/2/2017', 'MM/DD/YYYY')!.format()).toEqual(moment([2017, JAN, 2]).format());
        expect(adapter.parse('1/2/2017', 'DD/MM/YYYY')!.format()).toEqual(moment([2017, FEB, 1]).format());
    });

    it('should parse number', () => {
        const timestamp = new Date().getTime();
        expect(adapter.parse(timestamp, 'MM/DD/YYYY')!.format()).toEqual(moment(timestamp).format());
    });

    it('should parse invalid value as invalid', () => {
        const d = adapter.parse('hello', 'MM/DD/YYYY');
        expect(d).not.toBeNull();
        expect(adapter.isDateInstance(d)).toBe(true);

        expect(adapter.isValid(d as moment.Moment)).toBe(false);
    });

    it('should format date according to given format', () => {
        expect(adapter.format(moment([2017, JAN, 2]), 'MM/DD/YYYY')).toEqual('01/02/2017');
        expect(adapter.format(moment([2017, JAN, 2]), 'DD/MM/YYYY')).toEqual('02/01/2017');
    });

    it('should throw when attempting to format invalid date', () => {
        expect(() => adapter.format(moment(NaN), 'MM/DD/YYYY')).toThrowError(
            /MomentDateAdapter: Cannot format invalid date\./
        );
    });

    it('should add years', () => {
        expect(adapter.addCalendarYears(moment([2017, JAN, 1]), 1).format()).toEqual(moment([2018, JAN, 1]).format());
        expect(adapter.addCalendarYears(moment([2017, JAN, 1]), -1).format()).toEqual(moment([2016, JAN, 1]).format());
    });

    it('should respect leap years when adding years', () => {
        expect(adapter.addCalendarYears(moment([2016, FEB, 29]), 1).format()).toEqual(moment([2017, FEB, 28]).format());
        expect(adapter.addCalendarYears(moment([2016, FEB, 29]), -1).format()).toEqual(
            moment([2015, FEB, 28]).format()
        );
    });

    it('should add months', () => {
        expect(adapter.addCalendarMonths(moment([2017, JAN, 1]), 1).format()).toEqual(moment([2017, FEB, 1]).format());
        expect(adapter.addCalendarMonths(moment([2017, JAN, 1]), -1).format()).toEqual(moment([2016, DEC, 1]).format());
    });

    it('should respect month length differences when adding months', () => {
        expect(adapter.addCalendarMonths(moment([2017, JAN, 31]), 1).format()).toEqual(
            moment([2017, FEB, 28]).format()
        );
        expect(adapter.addCalendarMonths(moment([2017, MAR, 31]), -1).format()).toEqual(
            moment([2017, FEB, 28]).format()
        );
    });

    it('should add days', () => {
        expect(adapter.addCalendarDays(moment([2017, JAN, 1]), 1).format()).toEqual(moment([2017, JAN, 2]).format());
        expect(adapter.addCalendarDays(moment([2017, JAN, 1]), -1).format()).toEqual(moment([2016, DEC, 31]).format());
    });

    it('should get days from today`s date', () => {
        expect(adapter.daysFromToday(moment().add(-2, 'days'))).toEqual(-2);

        expect(adapter.daysFromToday(moment().startOf('day').add(-1, 'days'))).toEqual(-1);
        expect(adapter.daysFromToday(moment().add(-1, 'days'))).toEqual(-1);
        expect(adapter.daysFromToday(moment().endOf('day').add(-1, 'days'))).toEqual(-1);

        expect(adapter.daysFromToday(moment().startOf('day'))).toEqual(0);
        expect(adapter.daysFromToday(moment())).toEqual(0);
        expect(adapter.daysFromToday(moment().endOf('day'))).toEqual(0);

        expect(adapter.daysFromToday(moment().startOf('day').add(1, 'days'))).toEqual(1);
        expect(adapter.daysFromToday(moment().add(1, 'days'))).toEqual(1);
        expect(adapter.daysFromToday(moment().endOf('day').add(1, 'days'))).toEqual(1);

        expect(adapter.daysFromToday(moment().add(2, 'days'))).toEqual(2);
    });

    it('should get not empty duration from start, end range without specified unit', () => {
        let durationObjectFromDate: DurationObjectUnits;

        durationObjectFromDate = adapter.durationObjectFromDates(moment(), moment().add(15, 'days'), []);

        expect(durationObjectFromDate).toEqual({ weeks: 2, days: 1 } as DurationObjectUnits);

        durationObjectFromDate = adapter.durationObjectFromDates(moment(), moment().add(15.5, 'days'), []);
        console.log(durationObjectFromDate);
        expect(durationObjectFromDate).toEqual({ weeks: 2, days: 2 } as DurationObjectUnits);
    });

    it('should get duration as a specified unit', () => {
        const durationObject: DurationObjectUnits = {
            years: 2
        };
        expect(adapter.durationAs(durationObject, 'years')).toEqual(durationObject.years);
        expect(adapter.durationAs(durationObject, 'months')).toEqual(2 * 12);
        expect(Math.floor(adapter.durationAs(durationObject, 'weeks'))).toEqual(2 * 52);
        expect(adapter.durationAs(durationObject, 'days')).toEqual(2 * 365);
    });

    it('should clone', () => {
        const date = moment([2017, JAN, 1]);
        expect(adapter.clone(date).format()).toEqual(date.format());
        expect(adapter.clone(date)).not.toBe(date);
    });

    it('should compare dates', () => {
        expect(adapter.compareDate(moment([2017, JAN, 1]), moment([2017, JAN, 2]))).toBeLessThan(0);
        expect(adapter.compareDate(moment([2017, JAN, 1]), moment([2017, FEB, 1]))).toBeLessThan(0);
        expect(adapter.compareDate(moment([2017, JAN, 1]), moment([2018, JAN, 1]))).toBeLessThan(0);
        expect(adapter.compareDate(moment([2017, JAN, 1]), moment([2017, JAN, 1]))).toBe(0);
        expect(adapter.compareDate(moment([2018, JAN, 1]), moment([2017, JAN, 1]))).toBeGreaterThan(0);
        expect(adapter.compareDate(moment([2017, FEB, 1]), moment([2017, JAN, 1]))).toBeGreaterThan(0);
        expect(adapter.compareDate(moment([2017, JAN, 2]), moment([2017, JAN, 1]))).toBeGreaterThan(0);
    });

    it('should clamp date at lower bound', () => {
        expect(adapter.clampDate(moment([2017, JAN, 1]), moment([2018, JAN, 1]), moment([2019, JAN, 1]))).toEqual(
            moment([2018, JAN, 1])
        );
    });

    it('should clamp date at upper bound', () => {
        expect(adapter.clampDate(moment([2020, JAN, 1]), moment([2018, JAN, 1]), moment([2019, JAN, 1]))).toEqual(
            moment([2019, JAN, 1])
        );
    });

    it('should clamp date already within bounds', () => {
        expect(adapter.clampDate(moment([2018, FEB, 1]), moment([2018, JAN, 1]), moment([2019, JAN, 1]))).toEqual(
            moment([2018, FEB, 1])
        );
    });

    it('should count today as a valid date instance', () => {
        const d = moment();
        expect(adapter.isValid(d)).toBe(true);
        expect(adapter.isDateInstance(d)).toBe(true);
    });

    it('should count an invalid date as an invalid date instance', () => {
        const d = moment(NaN);
        expect(adapter.isValid(d)).toBe(false);
        expect(adapter.isDateInstance(d)).toBe(true);
    });

    it('should count a string as not a date instance', () => {
        const d = '1/1/2019';
        expect(adapter.isDateInstance(d)).toBe(false);
    });

    it('should create valid dates from valid ISO strings', () => {
        assertValidDate(adapter.deserialize('1985-04-12T23:20:50.52Z'), true);
        assertValidDate(adapter.deserialize('1996-12-19T16:39:57-08:00'), true);
        assertValidDate(adapter.deserialize('1937-01-01T12:00:27.87+00:20'), true);
        assertValidDate(adapter.deserialize('1990-13-31T23:59:00Z'), false);
        assertValidDate(adapter.deserialize('1/1/2017'), false);
        expect(adapter.deserialize('')).toBeNull();
        expect(adapter.deserialize(null)).toBeNull();
        assertValidDate(adapter.deserialize(new Date()), true);
        assertValidDate(adapter.deserialize(new Date(NaN)), false);
        assertValidDate(adapter.deserialize(moment()), true);
        assertValidDate(adapter.deserialize(moment.invalid()), false);
    });

    it('should create valid dates from valid SQL string', () => {
        expect(adapter.deserialize('')).toBeNull();
        expect(adapter.deserialize(null)).toBeNull();

        assertValidDate(adapter.deserialize('2022-02-02 10:04:08.049306'), true);
        assertValidDate(adapter.deserialize(adapter.invalid()), false);
    });

    it('should clone the date when deserializing a Moment date', () => {
        const date = moment([2017, JAN, 1]);
        expect(adapter.deserialize(date)!.format()).toEqual(date.format());
        expect(adapter.deserialize(date)).not.toBe(date);
    });

    it('should create an invalid date', () => {
        assertValidDate(adapter.invalid(), false);
    });

    /* TODO: now only predefined languages supported, check these languages later */
    xit('should deserialize dates with the correct locale', () => {
        adapter.setLocale('ja');
        expect(adapter.deserialize('1985-04-12T23:20:50.52Z')!.locale()).toBe('ja');
        expect(adapter.deserialize(new Date())!.locale()).toBe('ja');
        expect(adapter.deserialize(moment())!.locale()).toBe('ja');
    });

    xit('setLocale should not modify global moment locale', () => {
        expect(moment.locale()).toBe('en');
        adapter.setLocale('ja-JP');
        expect(moment.locale()).toBe('en');
    });

    xit('returned Moments should have correct locale', () => {
        adapter.setLocale('ja-JP');
        expect(adapter.createDate(2017, JAN, 1).locale()).toBe('ja');
        expect(adapter.today().locale()).toBe('ja');
        expect(adapter.clone(moment()).locale()).toBe('ja');
        expect(adapter.parse('1/1/2017', 'MM/DD/YYYY')!.locale()).toBe('ja');
        expect(adapter.addCalendarDays(moment(), 1).locale()).toBe('ja');
        expect(adapter.addCalendarMonths(moment(), 1).locale()).toBe('ja');
        expect(adapter.addCalendarYears(moment(), 1).locale()).toBe('ja');
    });

    xit('should get year name in a different locale', () => {
        adapter.setLocale('ar-AE');

        expect(adapter.getYearName(moment([2017, JAN, 1]))).toBe('٢٠١٧');
    });

    xit('should get first day of week in a different locale', () => {
        adapter.setLocale('fr');

        expect(adapter.getFirstDayOfWeek()).toBe(1);
    });

    xit('should get day of week names in a different locale', () => {
        adapter.setLocale('ja-JP');

        expect(adapter.getDayOfWeekNames('long')).toEqual([
            '日曜日',
            '月曜日',
            '火曜日',
            '水曜日',
            '木曜日',
            '金曜日',
            '土曜日'
        ]);
    });

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
});

describe('MomentDateAdapter findDateFormat = true', () => {
    let adapter: MomentDateAdapter;

    beforeEach(() => {
        moment.locale('en');
        adapter = new MomentDateAdapter('en', { findDateFormat: true });
        adapter.setLocale('en');
    });

    it('should findDateFormat for en and ru and return error for others', () => {
        const supportedLocalesForFindFormat = ['ru', 'en', 'ru-RU', 'en-US'];
        const notSupportedLocalesForFindFormat = predefinedLocales.filter(
            (locale) => !supportedLocalesForFindFormat.includes(locale)
        );

        supportedLocalesForFindFormat.forEach((localeId) => {
            adapter.setLocale(localeId);
            expect(() => adapter.parse('03/06/2019', '')).not.toThrowError();
        });

        notSupportedLocalesForFindFormat.forEach((localeId) => {
            adapter.setLocale(localeId);
            expect(() => adapter.parse('03/06/2019', '')).toThrowError();
        });
    });

    it('should parse ISO', () => {
        adapter.setLocale('ru');
        const utcDate = new Date(2019, 5, 3, 14, 50, 30);
        utcDate.setMinutes(utcDate.getMinutes() - utcDate.getTimezoneOffset());
        expect(adapter.parse('2019-06-03T14:50:30.000Z', '')!.toDate()).toEqual(utcDate);
    });

    it('should parse dashed date', () => {
        adapter.setLocale('ru');
        // finishing year
        expect(adapter.parse('03-06-2019', '')!.toDate()).toEqual(new Date(2019, 5, 3));
        expect(adapter.parse('03-06-19', '')!.toDate()).toEqual(new Date(2019, 5, 3));
        // leading year
        expect(adapter.parse('2019-06-03', '')!.toDate()).toEqual(new Date(2019, 5, 3));

        adapter.setLocale('en');
        // finishing year
        expect(adapter.parse('03-06-2019', '')!.toDate()).toEqual(new Date(2019, 5, 3));
        // short year
        expect(adapter.parse('03-06-19', '')!.toDate()).toEqual(new Date(2019, 5, 3));

        // leading year
        expect(adapter.parse('2019-06-03', '')!.toDate()).toEqual(new Date(2019, 5, 3));
    });

    it('should parse slashed date', () => {
        adapter.setLocale('ru');
        expect(adapter.parse('03/06/2019', '')!.toDate()).toEqual(new Date(2019, 5, 3));
        // short year
        expect(adapter.parse('03/06/19', '')!.toDate()).toEqual(new Date(2019, 5, 3));

        adapter.setLocale('en');
        // US by default
        expect(adapter.parse('03/06/2019', '')!.toDate()).toEqual(new Date(2019, 2, 6));

        // short year
        expect(adapter.parse('03/06/19', '')!.toDate()).toEqual(new Date(2019, 2, 6));

        // month order guessing
        expect(adapter.parse('23/06/2019', '')!.toDate()).toEqual(new Date(2019, 5, 23));
    });

    it('should parse doted date', () => {
        adapter.setLocale('ru');
        expect(adapter.parse('03.06.2019', '')!.toDate()).toEqual(new Date(2019, 5, 3));
        expect(adapter.parse('03.06.19', '')!.toDate()).toEqual(new Date(2019, 5, 3));

        adapter.setLocale('en');
        expect(adapter.parse('03.06.2019', '')!.toDate()).toEqual(new Date(2019, 5, 3));
        expect(adapter.parse('03.06.19', '')!.toDate()).toEqual(new Date(2019, 5, 3));
    });

    it('should parse long formatted date', () => {
        adapter.setLocale('ru');
        expect(adapter.parse('3 июня 2019', '')!.toDate()).toEqual(new Date(2019, 5, 3));

        expect(adapter.parse('6 фев 2019', '')!.toDate()).toEqual(new Date(2019, 1, 6));

        adapter.setLocale('en');
        expect(adapter.parse('June 3rd 2019', '')!.toDate()).toEqual(new Date(2019, 5, 3));

        expect(adapter.parse('Feb 6th 2019', '')!.toDate()).toEqual(new Date(2019, 1, 6));

        expect(adapter.parse('3 June 2019', '')!.toDate()).toEqual(new Date(2019, 5, 3));

        expect(adapter.parse('6 Feb 2019', '')!.toDate()).toEqual(new Date(2019, 1, 6));
    });

    it('should parse unix timestamp', () => {
        adapter.setLocale('ru');
        const utcDate = new Date(2019, 5, 3, 14, 50, 30);
        utcDate.setMinutes(utcDate.getMinutes() - utcDate.getTimezoneOffset());
        expect(adapter.parse('1559573430', '')!.toDate()).toEqual(utcDate);
    });
});