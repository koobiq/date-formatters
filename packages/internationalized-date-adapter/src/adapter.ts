import {
    CalendarDate,
    CalendarDateTime,
    DateValue,
    fromDate as fromNativeDate,
    getLocalTimeZone,
    isSameDay,
    isSameMonth,
    isSameYear,
    parseAbsolute,
    parseAbsoluteToLocal,
    parseDate,
    parseDateTime,
    startOfMonth,
    startOfWeek,
    startOfYear,
    toCalendarDateTime,
    today,
    ZonedDateTime
} from '@internationalized/date';
import { DateAdapter, DateAdapterConfig, DateUnit, DurationObjectUnits, DurationUnit } from '@koobiq/date-adapter';

import { enUS } from './locales/en-US';
import { ruRU } from './locales/ru-RU';

const predefinedLocales = [enUS, ruRU];
const durationUnitSizes: Record<DurationUnit, number> = {
    years: 365 * 24 * 60 * 60 * 1000,
    quarters: 91 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    hours: 60 * 60 * 1000,
    minutes: 60 * 1000,
    seconds: 1000,
    milliseconds: 1
};

function refineEstimate(estimate: number, fits: (value: number) => boolean): number {
    let result = Math.max(estimate, 0);

    while (result > 0 && !fits(result)) {
        result -= 1;
    }

    while (fits(result + 1)) {
        result += 1;
    }

    return result;
}

function isCalendarUnit(unit: DurationUnit): unit is 'years' | 'quarters' | 'months' | 'weeks' | 'days' {
    return ['years', 'quarters', 'months', 'weeks', 'days'].includes(unit);
}

type LocaleData = {
    firstDayOfWeek: number;
    longMonths: string[];
    shortMonths: string[];
    dates: string[];
    longDaysOfWeek: string[];
    shortDaysOfWeek: string[];
    narrowDaysOfWeek: string[];
};

export interface InternationalizedDateAdapterOptions {
    timeZone?: string;
}

export class InternationalizedDateAdapter extends DateAdapter<CalendarDateTime> {
    protected predefinedLocales: { [name: string]: DateAdapterConfig } = {};

    protected localeData!: LocaleData;

    constructor(
        localeName: string,
        protected readonly options: InternationalizedDateAdapterOptions = {}
    ) {
        super();

        this.addLocales(predefinedLocales);
        this.setLocale(localeName);
    }

    override setLocale(localeName: string): void {
        super.setLocale(localeName);

        this.config = this.predefinedLocales[localeName];

        if (!this.config) {
            throw Error(`Unsupported locale "${localeName}".`);
        }

        this.localeData = {
            dates: Array.from({ length: 31 }, (_, i) => `${i + 1}`),
            firstDayOfWeek: this.config.firstDayOfWeek,
            longMonths: this.config.monthNames.long,
            shortMonths: this.config.monthNames.short.standalone,
            narrowDaysOfWeek: this.config.dayOfWeekNames.narrow,
            shortDaysOfWeek: this.config.dayOfWeekNames.short,
            longDaysOfWeek: this.config.dayOfWeekNames.long
        };
    }

    addLocales(locales: DateAdapterConfig[]) {
        locales.forEach(this.addLocale);
    }

    addLocale = (locale: DateAdapterConfig) => {
        if (locale.name) {
            this.predefinedLocales[locale.name] = locale;
        }
    };

    getYear(date: CalendarDateTime): number {
        return date.year;
    }

    getMonth(date: CalendarDateTime): number {
        return date.month - 1;
    }

    getDate(date: CalendarDateTime): number {
        return date.day;
    }

    getDayOfWeek(date: CalendarDateTime): number {
        return this.toJsDate(date).getUTCDay();
    }

    getHours(date: CalendarDateTime): number {
        return date.hour;
    }

    getMinutes(date: CalendarDateTime): number {
        return date.minute;
    }

    getSeconds(date: CalendarDateTime): number {
        return date.second;
    }

    getMilliseconds(date: CalendarDateTime): number {
        return date.millisecond;
    }

    getTime(date: CalendarDateTime): number {
        return this.toJsDate(date).getTime();
    }

    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (style === 'long') {
            return this.localeData.longMonths;
        }

        if (style === 'narrow') {
            return this.config.monthNames.narrow;
        }

        return this.localeData.shortMonths;
    }

    getDateNames(): string[] {
        return this.localeData.dates;
    }

    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (style === 'long') {
            return this.localeData.longDaysOfWeek;
        }

        if (style === 'short') {
            return this.localeData.shortDaysOfWeek;
        }

        return this.localeData.narrowDaysOfWeek;
    }

    getYearName(date: CalendarDateTime): string {
        return `${date.year}`;
    }

    getFirstDayOfWeek(): number {
        return this.localeData.firstDayOfWeek;
    }

    getNumDaysInMonth(date: CalendarDateTime): number {
        return date.calendar.getDaysInMonth(date);
    }

    clone(date: CalendarDateTime): CalendarDateTime {
        return date.copy();
    }

    createDate(year: number, month = 0, day = 1): CalendarDateTime {
        // @internationalized/date silently fixes invalid input.
        return toCalendarDateTime(new CalendarDate(year, month + 1, day));
    }

    createDateTime(
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number
    ): CalendarDateTime {
        // @internationalized/date silently fixes invalid input.
        return new CalendarDateTime(year, month + 1, day, hour, minute, second, millisecond);
    }

    today(): CalendarDateTime {
        return toCalendarDateTime(today(this.timeZone));
    }

    parse(value: any): CalendarDateTime | null {
        if (!value) {
            return null;
        }

        if (this.isCalendarDateValue(value)) {
            return toCalendarDateTime(value);
        }

        if (value instanceof Date) {
            return toCalendarDateTime(fromNativeDate(value, this.timeZone));
        }

        if (typeof value === 'number') {
            return toCalendarDateTime(fromNativeDate(new Date(value), this.timeZone));
        }

        if (typeof value === 'string') {
            try {
                if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    return toCalendarDateTime(parseDate(value));
                }

                if (!/[zZ]|[+-]\d{2}:\d{2}$/.test(value)) {
                    return parseDateTime(value);
                }

                if (this.options.timeZone) {
                    return toCalendarDateTime(parseAbsolute(value, this.options.timeZone));
                }

                return toCalendarDateTime(parseAbsoluteToLocal(value));
            } catch {
                return null;
            }
        }

        return null;
    }

    format(date: CalendarDateTime, displayFormat: string): string {
        if (!this.isValid(date)) {
            throw Error('InternationalizedDateAdapter: Cannot format invalid date.');
        }

        if (displayFormat === this.config.variables['DATE']) {
            return this.composeDate(date, 'long');
        }

        if (displayFormat === this.config.variables['SHORT_DATE']) {
            return this.composeDate(date, 'short');
        }

        return displayFormat.replace(/yyyy|MMMM|MMM|HH|mm|ss|SSS|d/g, (token) => this.formatToken(date, token));
    }

    addCalendarUnits(
        date: CalendarDateTime,
        amount: number | DurationObjectUnits,
        unit?: DurationUnit
    ): CalendarDateTime {
        if (typeof amount === 'number') {
            if (!unit) {
                return this.clone(date);
            }

            return this.addByUnit(date, amount, unit);
        }

        return Object.entries(amount).reduce((acc, [currentUnit, value]) => {
            if (!value) {
                return acc;
            }

            return this.addByUnit(acc, value, currentUnit as DurationUnit);
        }, this.clone(date));
    }

    addCalendarYears(date: CalendarDateTime, years: number): CalendarDateTime {
        return this.addByUnit(date, years, 'years');
    }

    addCalendarMonths(date: CalendarDateTime, months: number): CalendarDateTime {
        return this.addByUnit(date, months, 'months');
    }

    addCalendarDays(date: CalendarDateTime, days: number): CalendarDateTime {
        return this.addByUnit(date, days, 'days');
    }

    toIso8601(date: CalendarDateTime): string {
        return this.toJsDate(date).toISOString();
    }

    isDateInstance(obj: any): boolean {
        // @internationalized/date has no built-in runtime type check for CalendarDateTime.
        return this.isCalendarDateTimeInstance(obj);
    }

    isValid(date: CalendarDateTime): boolean {
        return (
            this.isDateInstance(date) &&
            [date.year, date.month, date.day, date.hour, date.minute, date.second, date.millisecond].every((value) =>
                Number.isFinite(value)
            )
        );
    }

    invalid(): CalendarDateTime {
        return new CalendarDateTime(Number.NaN, Number.NaN, Number.NaN, 0, 0, 0, 0);
    }

    hasSame(startDate: CalendarDateTime, endDate: CalendarDateTime, unit: string): boolean {
        switch (unit) {
            case 'year':
                return isSameYear(startDate, endDate);
            case 'month':
                return isSameMonth(startDate, endDate);
            case 'day':
                return isSameDay(startDate, endDate);
            case 'hour':
                return this.getTime(this.startOf(startDate, 'hour')) === this.getTime(this.startOf(endDate, 'hour'));
            case 'minute':
                return (
                    this.getTime(this.startOf(startDate, 'minute')) === this.getTime(this.startOf(endDate, 'minute'))
                );
            default:
                return this.getTime(startDate) === this.getTime(endDate);
        }
    }

    durationAs(durationObject: DurationObjectUnits, unit: DurationUnit): number {
        const totalMilliseconds = (Object.entries(durationObject) as [DurationUnit, number][]).reduce(
            (sum, [currentUnit, value]) => sum + value * durationUnitSizes[currentUnit],
            0
        );

        return totalMilliseconds / durationUnitSizes[unit];
    }

    durationFormat(durationObject: DurationObjectUnits, displayFormat: any): string {
        const hours = durationObject.hours ?? 0;
        const minutes = durationObject.minutes ?? 0;
        const seconds = durationObject.seconds ?? 0;
        const milliseconds = durationObject.milliseconds ?? 0;

        switch (displayFormat) {
            case 'h:mm:ss':
                return `${hours}:${this.pad(minutes)}:${this.pad(seconds)}`;
            case 'm:ss':
                return `${minutes}:${this.pad(seconds)}`;
            case 'm:ss.SSS':
                return `${minutes}:${this.pad(seconds)}.${this.pad(milliseconds, 3)}`;
            default:
                return `${hours}:${this.pad(minutes)}:${this.pad(seconds)}`;
        }
    }

    startOf(date: CalendarDateTime, unit: DateUnit): CalendarDateTime {
        switch (unit) {
            case 'year':
                return this.startOfTime(startOfYear(date), 'day');
            case 'quarter':
                return this.startOfTime(
                    startOfMonth(date).set({
                        month: Math.floor((date.month - 1) / 3) * 3 + 1,
                        day: 1
                    }),
                    'day'
                );
            case 'month':
                return this.startOfTime(startOfMonth(date), 'day');
            case 'week':
                return this.startOfTime(startOfWeek(date, this.locale), 'day');
            case 'isoWeek':
                return this.startOfTime(startOfWeek(date, this.locale, 'mon'), 'day');
            case 'day':
                return this.startOfTime(date, 'day');
            case 'hour':
                return this.startOfTime(date, 'hour');
            case 'minute':
                return this.startOfTime(date, 'minute');
            case 'second':
                return this.startOfTime(date, 'second');
            case 'millisecond':
                return this.clone(date);
        }
    }

    diffNow(date: CalendarDateTime, unit: DurationUnit): number {
        return this.diffCalendarUnits(this.today(), date, unit, true);
    }

    daysFromToday(date: CalendarDateTime): number {
        return this.diffCalendarUnits(this.startOf(this.today(), 'day'), this.startOf(date, 'day'), 'days');
    }

    // Adds a single duration unit to a CalendarDateTime.
    private addByUnit(date: CalendarDateTime, amount: number, unit: DurationUnit): CalendarDateTime {
        switch (unit) {
            case 'years':
                return date.add({ years: amount });
            case 'quarters':
                return date.add({ months: amount * 3 });
            case 'months':
                return date.add({ months: amount });
            case 'weeks':
                return date.add({ weeks: amount });
            case 'days':
                return date.add({ days: amount });
            case 'hours':
                return date.add({ hours: amount });
            case 'minutes':
                return date.add({ minutes: amount });
            case 'seconds':
                return date.add({ seconds: amount });
            case 'milliseconds':
                return date.add({ milliseconds: amount });
        }
    }

    // Builds a localized date-only string using the configured day/month order.
    private composeDate(date: CalendarDateTime, style: 'long' | 'short'): string {
        const day = `${date.day}`;
        const month =
            style === 'long' ? this.formatLongMonth(date) : this.config.monthNames.short.formatted[this.getMonth(date)];

        if (this.config.variables['DATE'].startsWith('d') || this.config.variables['SHORT_DATE'].startsWith('d')) {
            return `${day}${this.config.variables['NBSP']}${month}`;
        }

        return `${month}${this.config.variables['NBSP']}${day}`;
    }

    // Extracts the long month name from Intl output for the current locale.
    private formatLongMonth(date: CalendarDateTime): string {
        const formatter = new Intl.DateTimeFormat(this.locale, {
            month: 'long',
            day: 'numeric',
            timeZone: this.timeZone
        });

        const parts = formatter.formatToParts(this.toJsDate(date));
        return parts.find(({ type }) => type === 'month')?.value ?? this.config.monthNames.long[this.getMonth(date)];
    }

    // Formats a single supported token used by the adapter format patterns.
    private formatToken(date: CalendarDateTime, token: string): string {
        switch (token) {
            case 'yyyy':
                return `${date.year}`;
            case 'MMMM':
                return this.formatLongMonth(date);
            case 'MMM':
                return this.config.monthNames.short.formatted[this.getMonth(date)];
            case 'HH':
                return this.pad(date.hour);
            case 'mm':
                return this.pad(date.minute);
            case 'ss':
                return this.pad(date.second);
            case 'SSS':
                return this.pad(date.millisecond, 3);
            case 'd':
                return `${date.day}`;
            default:
                return token;
        }
    }

    // Left-pads numeric values such as hours, minutes, and milliseconds.
    private pad(value: number, length = 2): string {
        return `${value}`.padStart(length, '0');
    }

    // Converts CalendarDateTime to a native Date in the adapter time zone.
    private toJsDate(date: CalendarDateTime): Date {
        return date.toDate(this.timeZone);
    }

    // Resets smaller time parts to get the start of the requested unit.
    private startOfTime(date: CalendarDateTime, unit: 'day' | 'hour' | 'minute' | 'second'): CalendarDateTime {
        switch (unit) {
            case 'day':
                return date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            case 'hour':
                return date.set({ minute: 0, second: 0, millisecond: 0 });
            case 'minute':
                return date.set({ second: 0, millisecond: 0 });
            case 'second':
                return date.set({ millisecond: 0 });
        }
    }

    // Returns the configured time zone or the system time zone by default.
    private get timeZone(): string {
        return this.options.timeZone ?? getLocalTimeZone();
    }

    // Returns the signed number of units between two dates.
    private diffCalendarUnits(
        start: CalendarDateTime,
        end: CalendarDateTime,
        unit: DurationUnit,
        showFraction = false
    ): number {
        if (isCalendarUnit(unit)) {
            const comparison = this.compareDateTime(start, end);

            if (comparison === 0) {
                return 0;
            }

            const isForward = comparison < 0;
            const earlier = isForward ? start : end;
            const later = isForward ? end : start;

            const monthEstimate = (later.year - earlier.year) * 12 + (later.month - earlier.month);
            let estimate: number;

            switch (unit) {
                case 'years':
                    estimate = later.year - earlier.year;
                    break;
                case 'quarters':
                    estimate = Math.floor(monthEstimate / 3);
                    break;
                case 'months':
                    estimate = monthEstimate;
                    break;
                case 'weeks':
                case 'days':
                    estimate = Math.floor((this.getTime(later) - this.getTime(earlier)) / durationUnitSizes[unit]);
                    break;
            }

            const count = refineEstimate(estimate, (value) => {
                const candidate = this.addCalendarUnits(earlier, value, unit);
                return this.compareDateTime(candidate, later) <= 0;
            });

            const cursor = this.addCalendarUnits(earlier, count, unit);

            if (showFraction && (unit === 'years' || unit === 'months')) {
                const halfStep =
                    unit === 'years'
                        ? this.addCalendarUnits(cursor, 6, 'months')
                        : this.addCalendarUnits(cursor, 15, 'days');

                const value = count + (this.compareDateTime(halfStep, later) <= 0 ? 0.5 : 0);

                return isForward ? value : -value;
            }

            if (!showFraction) {
                return isForward ? count : -count;
            }

            if (this.compareDateTime(cursor, later) === 0) {
                return isForward ? count : -count;
            }

            const nextUnit = this.addCalendarUnits(cursor, 1, unit);
            const fraction =
                (this.getTime(later) - this.getTime(cursor)) / (this.getTime(nextUnit) - this.getTime(cursor));
            const value = count + fraction;

            return isForward ? value : -value;
        }

        const value = (this.getTime(end) - this.getTime(start)) / durationUnitSizes[unit];

        return showFraction ? value : Math.floor(value);
    }

    durationObjectFromDates(
        start: CalendarDateTime,
        end: CalendarDateTime,
        units: DurationUnit[],
        showFraction = false
    ): DurationObjectUnits {
        const orderedUnits: DurationUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
        const requestedUnits = units.length ? units : orderedUnits;
        const preserveRequestedUnits = units.length > 0;
        const result: DurationObjectUnits = {};

        let cursor = this.clone(start);

        requestedUnits.forEach((unit, index) => {
            const isFractionalFirstUnit = showFraction && index === 0 && (unit === 'years' || unit === 'months');
            const value = Math.max(this.diffCalendarUnits(cursor, end, unit, isFractionalFirstUnit), 0);

            if (preserveRequestedUnits || value > 0) {
                result[unit] = value;
            }

            cursor = isFractionalFirstUnit
                ? this.addFractionalCalendarUnits(cursor, value, unit)
                : this.addCalendarUnits(cursor, value, unit);
        });

        if (preserveRequestedUnits) {
            return result;
        }

        const firstUnits = Object.entries(result)
            .filter(([, value]) => !!value)
            .slice(0, 2) as [DurationUnit, number][];

        return firstUnits.reduce<DurationObjectUnits>((acc, [unit, value]) => {
            acc[unit] = value;
            return acc;
        }, {});
    }

    // Advances the date by whole years/months and the supported half-step when present.
    private addFractionalCalendarUnits(
        date: CalendarDateTime,
        value: number,
        unit: 'years' | 'months'
    ): CalendarDateTime {
        const wholeUnits = Math.floor(value);
        let result = this.addCalendarUnits(date, wholeUnits, unit);

        if (value - wholeUnits >= 0.5) {
            result =
                unit === 'years'
                    ? this.addCalendarUnits(result, 6, 'months')
                    : this.addCalendarUnits(result, 15, 'days');
        }

        return result;
    }

    // Checks whether a value is DateValue.
    private isCalendarDateValue(obj: any): obj is DateValue {
        return (
            this.isCalendarDateInstance(obj) ||
            this.isCalendarDateTimeInstance(obj) ||
            this.isZonedDateTimeInstance(obj)
        );
    }

    // Checks whether a value has the common base API shared by date values.
    private hasDateValueBase(obj: any): boolean {
        return (
            !!obj &&
            typeof obj === 'object' &&
            typeof obj.copy === 'function' &&
            typeof obj.add === 'function' &&
            typeof obj.subtract === 'function' &&
            typeof obj.set === 'function' &&
            typeof obj.cycle === 'function' &&
            typeof obj.toDate === 'function' &&
            typeof obj.compare === 'function' &&
            typeof obj.year === 'number' &&
            typeof obj.month === 'number' &&
            typeof obj.day === 'number' &&
            !!obj.calendar
        );
    }

    // Checks whether a value is a CalendarDate.
    private isCalendarDateInstance(obj: any): obj is CalendarDate {
        return (
            obj instanceof CalendarDate ||
            (this.hasDateValueBase(obj) &&
                obj.hour === undefined &&
                obj.minute === undefined &&
                obj.second === undefined &&
                obj.millisecond === undefined &&
                obj.timeZone === undefined &&
                obj.offset === undefined)
        );
    }

    // Checks whether a value is a CalendarDateTime.
    private isCalendarDateTimeInstance(obj: any): obj is CalendarDateTime {
        return (
            obj instanceof CalendarDateTime ||
            (this.hasDateValueBase(obj) &&
                typeof obj.hour === 'number' &&
                typeof obj.minute === 'number' &&
                typeof obj.second === 'number' &&
                typeof obj.millisecond === 'number' &&
                obj.timeZone === undefined &&
                obj.offset === undefined)
        );
    }

    // Checks whether a value is a ZonedDateTime.
    private isZonedDateTimeInstance(obj: any): obj is ZonedDateTime {
        return (
            obj instanceof ZonedDateTime ||
            (this.hasDateValueBase(obj) &&
                typeof obj.hour === 'number' &&
                typeof obj.minute === 'number' &&
                typeof obj.second === 'number' &&
                typeof obj.millisecond === 'number' &&
                typeof obj.timeZone === 'string' &&
                typeof obj.offset === 'number')
        );
    }
}
