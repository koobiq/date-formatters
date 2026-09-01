import { DateAdapter, DateUnit, DurationObjectUnits, DurationUnit } from '@koobiq/date-adapter';

import { NativeDateAdapterConfig } from './locale-config';
import { enUS } from './locales/en-US';
import { esLA } from './locales/es-LA';
import { faIR } from './locales/fa-IR';
import { ptBR } from './locales/pt-BR';
import { ruRU } from './locales/ru-RU';
import { tkTM } from './locales/tk-TM';
import { zhCN } from './locales/zh-CN';

const predefinedLocales = [enUS, ruRU, esLA, ptBR, zhCN, faIR, tkTM];

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

/** Duration units from largest to smallest. */
const orderedDurationUnits: DurationUnit[] = [
    'years',
    'quarters',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
    'milliseconds'
];

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

/**
 * Tokens understood by `format` and by format-driven `parse`, longest alternative first so that
 * `MMMM` wins over `MMM` and `dd` over `d`. The leading alternative captures single-quoted literals
 * (`"d 'de' MMMM"`), matching the LDML convention the locale configs are written in.
 */
const formatTokens = /'([^']*)'|yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|EEE|EE|HH|H|mm|m|SSS|ss|s/g;

/** Tokens understood by `durationFormat`. */
const durationTokens = /'([^']*)'|(dd|d|hh|h|mm|m|ss|s|SSS)/g;

const durationTokenUnits: { [token: string]: DurationUnit } = {
    dd: 'days',
    d: 'days',
    hh: 'hours',
    h: 'hours',
    mm: 'minutes',
    m: 'minutes',
    ss: 'seconds',
    s: 'seconds',
    SSS: 'milliseconds'
};

/**
 * Matches a date-only or date-time ISO 8601 string and captures its components. `Date.parse` accepts
 * far more than the spec requires, the extras differ between engines, and — worse — it fixes the
 * interpretation zone by the *shape* of the string (date-only is UTC, a zone-less date-time is
 * local), which would ignore the adapter's own `useUtc` setting. So the string is matched here and
 * the components are assembled through `fromParts` instead.
 */
const iso8601 = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

/** Day-of-month labels; identical for every locale, so built once. */
const dateNames = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

type LocaleData = {
    firstDayOfWeek: number;
    longMonths: string[];
    shortMonths: string[];
    narrowMonths: string[];
    longFormattedMonths: string[];
    shortFormattedMonths: string[];
    dates: string[];
    longDaysOfWeek: string[];
    shortDaysOfWeek: string[];
    narrowDaysOfWeek: string[];
};

/** Wall-clock components of a date, read in the time zone the adapter is configured for. */
type DateParts = {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
};

type ParseTarget =
    | 'year'
    | 'shortYear'
    | 'monthNumber'
    | 'monthLong'
    | 'monthShort'
    | 'day'
    | 'hours'
    | 'minutes'
    | 'seconds'
    | 'milliseconds';

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

/** Configurable options for {@see NativeDateAdapter}. */
export interface NativeDateAdapterOptions {
    /**
     * Turns the use of utc dates on or off. When on, every component is read from and written to the
     * UTC side of the `Date`; when off, the host time zone is used.
     * {@default false}
     */
    useUtc?: boolean;
}

/**
 * A `DateAdapter` over the built-in `Date`, with no runtime dependencies.
 *
 * Month and weekday names come from the locale config rather than `Intl`, so the rendered output is
 * identical in every runtime. `Date` is mutable, so every method here returns a new instance and
 * never writes to its argument.
 */
export class NativeDateAdapter extends DateAdapter<Date> {
    override config!: NativeDateAdapterConfig;

    protected predefinedLocales: { [name: string]: NativeDateAdapterConfig } = {};

    protected localeData!: LocaleData;

    constructor(
        localeName: string,
        protected readonly options: NativeDateAdapterOptions = {}
    ) {
        super();

        this.addLocales(predefinedLocales);
        this.setLocale(localeName);
    }

    override setLocale(localeName: string): void {
        // Validated before anything is written, so a rejected locale leaves the adapter untouched
        // rather than half-updated.
        const config = this.predefinedLocales[localeName];

        if (!config) {
            throw Error(`Unsupported locale "${localeName}".`);
        }

        super.setLocale(localeName);

        this.config = config;

        // The name arrays are copied, not aliased: `predefinedLocales` holds module-level singletons
        // shared by every adapter in the process, and these arrays are handed out by the `get*Names`
        // accessors, so a caller sorting one in place would otherwise corrupt every other instance.
        this.localeData = {
            dates: dateNames.slice(),
            firstDayOfWeek: config.firstDayOfWeek,

            longMonths: config.monthNames.long.slice(),
            shortMonths: config.monthNames.short.standalone.slice(),
            narrowMonths: config.monthNames.narrow.slice(),
            longFormattedMonths: config.monthNames.longFormatted.slice(),
            shortFormattedMonths: config.monthNames.short.formatted.slice(),

            narrowDaysOfWeek: config.dayOfWeekNames.narrow.slice(),
            shortDaysOfWeek: config.dayOfWeekNames.short.slice(),
            longDaysOfWeek: config.dayOfWeekNames.long.slice()
        };
    }

    addLocales(locales: NativeDateAdapterConfig[]) {
        locales.forEach(this.addLocale);
    }

    addLocale = (locale: NativeDateAdapterConfig) => {
        if (!locale.name) {
            return;
        }

        this.predefinedLocales[locale.name] = locale;
    };

    getLocaleData(): LocaleData {
        return this.localeData;
    }

    setLocaleData(localeData: LocaleData): void {
        this.localeData = localeData;
    }

    updateLocaleData(localeData: Partial<LocaleData>): void {
        this.localeData = { ...this.localeData, ...localeData };
    }

    getYear(date: Date): number {
        return this.options.useUtc ? date.getUTCFullYear() : date.getFullYear();
    }

    getMonth(date: Date): number {
        return this.options.useUtc ? date.getUTCMonth() : date.getMonth();
    }

    getDate(date: Date): number {
        return this.options.useUtc ? date.getUTCDate() : date.getDate();
    }

    getDayOfWeek(date: Date): number {
        return this.options.useUtc ? date.getUTCDay() : date.getDay();
    }

    getHours(date: Date): number {
        return this.options.useUtc ? date.getUTCHours() : date.getHours();
    }

    getMinutes(date: Date): number {
        return this.options.useUtc ? date.getUTCMinutes() : date.getMinutes();
    }

    getSeconds(date: Date): number {
        return this.options.useUtc ? date.getUTCSeconds() : date.getSeconds();
    }

    getMilliseconds(date: Date): number {
        return this.options.useUtc ? date.getUTCMilliseconds() : date.getMilliseconds();
    }

    getTime(date: Date): number {
        return date.getTime();
    }

    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (style === 'long') {
            return this.localeData.longMonths;
        }

        if (style === 'narrow') {
            return this.localeData.narrowMonths;
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

    getYearName(date: Date): string {
        return `${this.getYear(date)}`;
    }

    getFirstDayOfWeek(): number {
        return this.localeData.firstDayOfWeek;
    }

    getNumDaysInMonth(date: Date): number {
        return this.daysInMonth(this.getYear(date), this.getMonth(date));
    }

    clone(date: Date): Date {
        return new Date(date.getTime());
    }

    createDate(year: number, month = 0, date = 1): Date {
        if (month < 0 || month > 11) {
            throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
        }

        if (date < 1) {
            throw Error(`Invalid day "${date}". Date has to be greater than 0.`);
        }

        // Native Date rolls an out-of-range day over into a later month instead of rejecting it, and
        // a large enough overflow lands back on the same month index a year later, so the day is
        // range-checked up front rather than inferred from the result.
        if (date > this.daysInMonth(year, month)) {
            throw Error(`Invalid day "${date}" for month "${month}".`);
        }

        return this.fromParts({
            year,
            month,
            day: date,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0
        });
    }

    createDateTime(
        year: number,
        month: number,
        date: number,
        hours: number,
        minutes: number,
        seconds: number,
        milliseconds: number
    ): Date {
        this.createDate(year, month, date);

        // Without these checks the time components roll over silently, so `createDateTime(…, 25, …)`
        // would quietly return the next day rather than being rejected.
        if (hours < 0 || hours > 23) {
            throw Error(`Invalid hours "${hours}". Hours have to be between 0 and 23.`);
        }

        if (minutes < 0 || minutes > 59) {
            throw Error(`Invalid minutes "${minutes}". Minutes have to be between 0 and 59.`);
        }

        if (seconds < 0 || seconds > 59) {
            throw Error(`Invalid seconds "${seconds}". Seconds have to be between 0 and 59.`);
        }

        if (milliseconds < 0 || milliseconds > 999) {
            throw Error(`Invalid milliseconds "${milliseconds}". Milliseconds have to be between 0 and 999.`);
        }

        return this.fromParts({ year, month, day: date, hours, minutes, seconds, milliseconds });
    }

    today(): Date {
        return new Date();
    }

    parse(value: any, parseFormat?: string | string[]): Date | null {
        if (!value) {
            return null;
        }

        if (value instanceof Date) {
            return this.clone(value);
        }

        if (typeof value === 'number') {
            return new Date(value);
        }

        if (typeof value !== 'string') {
            return null;
        }

        if (parseFormat) {
            const formats = Array.isArray(parseFormat) ? parseFormat : [parseFormat];

            for (const format of formats) {
                const parsed = this.parseWithFormat(value, format);

                if (parsed) {
                    return parsed;
                }
            }

            return this.invalid();
        }

        return this.parseIso8601(value);
    }

    /**
     * Builds a date from an ISO 8601 string. An explicit offset (including `Z`) pins the instant, so
     * it is handed to `Date.parse`; without one the components are wall-clock in the adapter's own
     * zone, which is what both the moment and luxon adapters do for the same input.
     */
    private parseIso8601(value: string): Date | null {
        const match = iso8601.exec(value);

        if (!match) {
            return null;
        }

        const [, year, month, day, hours, minutes, seconds, milliseconds, offset] = match;
        const parts: DateParts = {
            year: Number(year),
            month: Number(month) - 1,
            day: Number(day),
            hours: Number(hours ?? 0),
            minutes: Number(minutes ?? 0),
            seconds: Number(seconds ?? 0),
            milliseconds: Number((milliseconds ?? '').padEnd(3, '0'))
        };

        // `Date.parse` would silently roll `2025-02-30` over into March; the format-driven path
        // rejects that date, so the ISO path rejects it too.
        if (
            parts.month > 11 ||
            parts.day < 1 ||
            parts.day > this.daysInMonth(parts.year, parts.month) ||
            parts.hours > 23 ||
            parts.minutes > 59 ||
            parts.seconds > 59
        ) {
            return null;
        }

        return offset ? new Date(Date.parse(value)) : this.fromParts(parts);
    }

    format(date: Date, displayFormat: string): string {
        if (!this.isValid(date)) {
            throw Error('NativeDateAdapter: Cannot format invalid date.');
        }

        if (typeof displayFormat !== 'string') {
            throw Error(`NativeDateAdapter: Cannot format with a non-string format "${displayFormat}".`);
        }

        const parts = this.toParts(date);
        const dayOfWeek = this.getDayOfWeek(date);

        return displayFormat.replace(formatTokens, (token: string, literal: string | undefined) =>
            literal === undefined ? this.formatToken(parts, dayOfWeek, token) : literal || `'`
        );
    }

    addCalendarUnits(date: Date, amount: number | DurationObjectUnits, unit?: DurationUnit): Date {
        if (typeof amount === 'number') {
            if (!unit) {
                return this.clone(date);
            }

            return this.addByUnit(date, amount, unit);
        }

        // Applied largest unit first, not in key order: `{months: 1, days: 1}` and `{days: 1, months: 1}`
        // have to agree, and month arithmetic clamps, so the order changes the result.
        return orderedDurationUnits.reduce((acc, currentUnit) => {
            const value = amount[currentUnit];

            return value ? this.addByUnit(acc, value, currentUnit) : acc;
        }, this.clone(date));
    }

    addCalendarYears(date: Date, years: number): Date {
        return this.addCalendarMonths(date, years * 12);
    }

    addCalendarMonths(date: Date, months: number): Date {
        const parts = this.toParts(date);
        const totalMonths = parts.year * 12 + parts.month + months;
        const year = Math.floor(totalMonths / 12);
        const month = totalMonths - year * 12;

        // Flipping calendar pages must land on the closest existing day: Jan 31 + 1 month is Feb 28.
        return this.fromParts({ ...parts, year, month, day: Math.min(parts.day, this.daysInMonth(year, month)) });
    }

    addCalendarDays(date: Date, days: number): Date {
        const parts = this.toParts(date);

        return this.fromParts({ ...parts, day: parts.day + days });
    }

    toIso8601(date: Date): string {
        if (!this.isValid(date)) {
            throw Error('NativeDateAdapter: Cannot serialize invalid date.');
        }

        return date.toISOString();
    }

    /** https://www.ietf.org/rfc/rfc3339.txt */
    override deserialize(value: any): Date | null {
        if (value instanceof Date) {
            return this.clone(value);
        }

        if (typeof value === 'string') {
            if (!value) {
                return null;
            }

            const date = this.parse(value);

            if (date && this.isValid(date)) {
                return date;
            }
        }

        return super.deserialize(value);
    }

    isDateInstance(obj: any): boolean {
        return obj instanceof Date;
    }

    isValid(date: Date): boolean {
        return this.isDateInstance(date) && !Number.isNaN(date.getTime());
    }

    invalid(): Date {
        return new Date(Number.NaN);
    }

    hasSame(startDate: Date, endDate: Date, unit: string): boolean {
        if (!dateUnits.includes(unit as DateUnit)) {
            return this.getTime(startDate) === this.getTime(endDate);
        }

        // Week boundaries depend on the locale's first day, so they go through `startOf`; every other
        // unit is a plain component comparison, which avoids materializing two throwaway dates on a
        // path a calendar grid hits once per rendered cell.
        if (unit === 'week' || unit === 'isoWeek') {
            return (
                this.getTime(this.startOf(startDate, unit as DateUnit)) ===
                this.getTime(this.startOf(endDate, unit as DateUnit))
            );
        }

        const start = this.toParts(startDate);
        const end = this.toParts(endDate);

        if (start.year !== end.year) {
            return false;
        }

        switch (unit as DateUnit) {
            case 'year':
                return true;
            case 'quarter':
                return Math.floor(start.month / 3) === Math.floor(end.month / 3);
            case 'month':
                return start.month === end.month;
            case 'day':
                return start.month === end.month && start.day === end.day;
            case 'hour':
                return start.month === end.month && start.day === end.day && start.hours === end.hours;
            case 'minute':
                return (
                    start.month === end.month &&
                    start.day === end.day &&
                    start.hours === end.hours &&
                    start.minutes === end.minutes
                );
            case 'second':
                return (
                    start.month === end.month &&
                    start.day === end.day &&
                    start.hours === end.hours &&
                    start.minutes === end.minutes &&
                    start.seconds === end.seconds
                );
            default:
                return this.getTime(startDate) === this.getTime(endDate);
        }
    }

    diffNow(date: Date, unit: DurationUnit): number {
        return this.diffCalendarUnits(this.today(), date, unit, true);
    }

    daysFromToday(date: Date): number {
        // Counted from the calendar components rather than from elapsed milliseconds: on a DST
        // spring-forward day local midnight may not exist, so `startOf(…, 'day')` lands at 01:00 and a
        // wall-clock diff would report tomorrow as today.
        return this.dayNumber(date) - this.dayNumber(this.today());
    }

    /** Days since the epoch for the date's calendar day, independent of any zone offset. */
    private dayNumber(date: Date): number {
        const parts = this.toParts(date);
        // Assigned through the setter rather than `Date.UTC`, which maps years 0-99 onto 1900-1999.
        const utc = new Date(0);

        utc.setUTCFullYear(parts.year, parts.month, parts.day);

        return Math.round(utc.getTime() / durationUnitSizes.days);
    }

    durationObjectFromDates(
        start: Date,
        end: Date,
        units: DurationUnit[] = [],
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

        // Without an explicit unit list only the two most significant non-zero units are reported.
        const reported = (Object.entries(result) as [DurationUnit, number][])
            .filter(([, value]) => !!value)
            .slice(0, 2);

        // A span shorter than the smallest unit has no non-zero unit at all. Reporting nothing would
        // render an empty label, so it is reported as zero of the smallest unit instead.
        if (!reported.length) {
            return { [orderedUnits[orderedUnits.length - 1]]: 0 };
        }

        return reported.reduce<DurationObjectUnits>((acc, [unit, value]) => {
            acc[unit] = value;

            return acc;
        }, {});
    }

    durationAs(durationObject: DurationObjectUnits, unit: DurationUnit): number {
        const totalMilliseconds = (Object.entries(durationObject) as [DurationUnit, number][]).reduce(
            (sum, [currentUnit, value]) => sum + value * durationUnitSizes[currentUnit],
            0
        );

        return totalMilliseconds / durationUnitSizes[unit];
    }

    durationFormat(durationObject: DurationObjectUnits, displayFormat: string): string {
        const format = typeof displayFormat === 'string' ? displayFormat : 'h:mm:ss';
        const used: { [unit: string]: boolean } = {};

        // A fresh regex so the shared module-level one keeps no `lastIndex` state across calls.
        const scan = new RegExp(durationTokens.source, 'g');
        let match = scan.exec(format);

        while (match) {
            if (match[1] === undefined) {
                used[durationTokenUnits[match[2]]] = true;
            }

            match = scan.exec(format);
        }

        // The largest unit present in the format absorbs everything above it, so `h:mm:ss` of a
        // two-day duration renders as `48:00:00` rather than dropping the days. The sign is taken out
        // first: flooring a negative total would borrow a whole unit and render its complement.
        const values: { [unit: string]: number } = {};
        const total = this.durationAs(durationObject, 'milliseconds');
        const sign = total < 0 ? '-' : '';
        let rest = Math.floor(Math.abs(total));

        (['days', 'hours', 'minutes', 'seconds', 'milliseconds'] as DurationUnit[]).forEach((unit) => {
            if (!used[unit]) {
                return;
            }

            values[unit] = Math.floor(rest / durationUnitSizes[unit]);
            rest -= values[unit] * durationUnitSizes[unit];
        });

        let signed = false;

        return format.replace(durationTokens, (token: string, literal: string | undefined) => {
            if (literal !== undefined) {
                return literal || `'`;
            }

            const value = values[durationTokenUnits[token]] || 0;
            // Only the first rendered unit carries the sign.
            const prefix = signed ? '' : sign;

            signed = true;

            return prefix + this.pad(value, token.length);
        });
    }

    /** "Set" given date to the beginning of the given unit. */
    startOf(date: Date, unit: DateUnit): Date {
        const parts = this.toParts(date);
        const startOfDay = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

        switch (unit) {
            case 'year':
                return this.fromParts({ ...parts, ...startOfDay, month: 0, day: 1 });
            case 'quarter':
                return this.fromParts({ ...parts, ...startOfDay, month: Math.floor(parts.month / 3) * 3, day: 1 });
            case 'month':
                return this.fromParts({ ...parts, ...startOfDay, day: 1 });
            case 'week':
                return this.startOfWeek(date, this.getFirstDayOfWeek());
            case 'isoWeek':
                return this.startOfWeek(date, 1);
            case 'day':
                return this.fromParts({ ...parts, ...startOfDay });
            case 'hour':
                return this.fromParts({ ...parts, minutes: 0, seconds: 0, milliseconds: 0 });
            case 'minute':
                return this.fromParts({ ...parts, seconds: 0, milliseconds: 0 });
            case 'second':
                return this.fromParts({ ...parts, milliseconds: 0 });
            case 'millisecond':
                return this.clone(date);
        }
    }

    /** Reads the wall-clock components of a date in the configured time zone. */
    private toParts(date: Date): DateParts {
        return {
            year: this.getYear(date),
            month: this.getMonth(date),
            day: this.getDate(date),
            hours: this.getHours(date),
            minutes: this.getMinutes(date),
            seconds: this.getSeconds(date),
            milliseconds: this.getMilliseconds(date)
        };
    }

    /**
     * Builds a date from wall-clock components in the configured time zone. Out-of-range day values
     * roll over, which is what the calendar arithmetic below relies on. The components are assigned
     * through setters rather than the `Date` constructor because the constructor maps years 0-99
     * onto 1900-1999.
     */
    private fromParts(parts: DateParts): Date {
        const date = new Date(0);

        if (this.options.useUtc) {
            date.setUTCFullYear(parts.year, parts.month, parts.day);
            date.setUTCHours(parts.hours, parts.minutes, parts.seconds, parts.milliseconds);
        } else {
            date.setFullYear(parts.year, parts.month, parts.day);
            date.setHours(parts.hours, parts.minutes, parts.seconds, parts.milliseconds);
        }

        return date;
    }

    private daysInMonth(year: number, month: number): number {
        const date = new Date(0);

        date.setUTCFullYear(year, month + 1, 0);

        return date.getUTCDate();
    }

    private startOfWeek(date: Date, firstDayOfWeek: number): Date {
        const startOfDay = this.startOf(date, 'day');
        const offset = (this.getDayOfWeek(startOfDay) - firstDayOfWeek + 7) % 7;

        return this.addCalendarDays(startOfDay, -offset);
    }

    /** Renders a single supported token. Anything unrecognized is passed through untouched. */
    private formatToken(parts: DateParts, dayOfWeek: number, token: string): string {
        switch (token) {
            case 'yyyy':
                return this.pad(parts.year, 4);
            case 'yy':
                return this.pad(parts.year % 100, 2);
            case 'MMMM':
                return this.localeData.longFormattedMonths[parts.month];
            case 'MMM':
                return this.localeData.shortFormattedMonths[parts.month];
            case 'MM':
                return this.pad(parts.month + 1, 2);
            case 'M':
                return `${parts.month + 1}`;
            case 'dd':
                return this.pad(parts.day, 2);
            case 'd':
                return `${parts.day}`;
            case 'EEEE':
                return this.localeData.longDaysOfWeek[dayOfWeek];
            case 'EEE':
                return this.localeData.shortDaysOfWeek[dayOfWeek];
            case 'EE':
                return this.localeData.narrowDaysOfWeek[dayOfWeek];
            case 'HH':
                return this.pad(parts.hours, 2);
            case 'H':
                return `${parts.hours}`;
            case 'mm':
                return this.pad(parts.minutes, 2);
            case 'm':
                return `${parts.minutes}`;
            case 'ss':
                return this.pad(parts.seconds, 2);
            case 's':
                return `${parts.seconds}`;
            case 'SSS':
                return this.pad(parts.milliseconds, 3);
            default:
                return token;
        }
    }

    /** Turns a display format into a regular expression and reads the components out of a match. */
    private parseWithFormat(value: string, format: string): Date | null {
        const targets: ParseTarget[] = [];
        let pattern = '';
        let cursor = 0;

        const capture = (source: string, target: ParseTarget) => {
            pattern += `(${source})`;
            targets.push(target);
        };

        format.replace(formatTokens, (token: string, literal: string | undefined, offset: number) => {
            pattern += escapeRegExp(format.slice(cursor, offset));
            cursor = offset + token.length;

            if (literal !== undefined) {
                pattern += escapeRegExp(literal || `'`);

                return token;
            }

            switch (token) {
                case 'yyyy':
                    capture('\\d{4}', 'year');
                    break;
                case 'yy':
                    capture('\\d{2}', 'shortYear');
                    break;
                case 'MMMM':
                    capture(this.namesSource(this.localeData.longFormattedMonths), 'monthLong');
                    break;
                case 'MMM':
                    capture(this.namesSource(this.localeData.shortFormattedMonths), 'monthShort');
                    break;
                case 'MM':
                case 'M':
                    capture('\\d{1,2}', 'monthNumber');
                    break;
                case 'dd':
                case 'd':
                    capture('\\d{1,2}', 'day');
                    break;
                case 'HH':
                case 'H':
                    capture('\\d{1,2}', 'hours');
                    break;
                case 'mm':
                case 'm':
                    capture('\\d{1,2}', 'minutes');
                    break;
                case 'ss':
                case 's':
                    capture('\\d{1,2}', 'seconds');
                    break;
                case 'SSS':
                    capture('\\d{1,3}', 'milliseconds');
                    break;
                case 'EEEE':
                    pattern += `(?:${this.namesSource(this.localeData.longDaysOfWeek)})`;
                    break;
                case 'EEE':
                    pattern += `(?:${this.namesSource(this.localeData.shortDaysOfWeek)})`;
                    break;
                case 'EE':
                    pattern += `(?:${this.namesSource(this.localeData.narrowDaysOfWeek)})`;
                    break;
                default:
                    pattern += escapeRegExp(token);
            }

            return token;
        });

        pattern += escapeRegExp(format.slice(cursor));

        const match = new RegExp(`^\\s*${pattern}\\s*$`, 'i').exec(value);

        if (!match) {
            return null;
        }

        const parts: DateParts = { year: 1970, month: 0, day: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

        for (let i = 0; i < targets.length; i++) {
            if (!this.applyParsedPart(parts, targets[i], match[i + 1])) {
                return null;
            }
        }

        if (parts.day > this.daysInMonth(parts.year, parts.month)) {
            return null;
        }

        return this.fromParts(parts);
    }

    /** Writes one matched group into the parsed components, reporting whether it was in range. */
    private applyParsedPart(parts: DateParts, target: ParseTarget, raw: string): boolean {
        if (target === 'monthLong' || target === 'monthShort') {
            const names =
                target === 'monthLong' ? this.localeData.longFormattedMonths : this.localeData.shortFormattedMonths;
            const index = names.findIndex((name) => name.toLowerCase() === raw.toLowerCase());

            if (index < 0) {
                return false;
            }

            parts.month = index;

            return true;
        }

        const value = Number(raw);

        switch (target) {
            case 'year':
                parts.year = value;

                return true;
            case 'shortYear':
                // Same pivot moment and luxon use: 00-68 is 20xx, 69-99 is 19xx.
                parts.year = value + (value <= 68 ? 2000 : 1900);

                return true;
            case 'monthNumber':
                parts.month = value - 1;

                return value >= 1 && value <= 12;
            case 'day':
                parts.day = value;

                return value >= 1 && value <= 31;
            case 'hours':
                parts.hours = value;

                return value <= 23;
            case 'minutes':
                parts.minutes = value;

                return value <= 59;
            case 'seconds':
                parts.seconds = value;

                return value <= 59;
            case 'milliseconds':
                parts.milliseconds = value;

                return true;
        }
    }

    private namesSource(names: string[]): string {
        // Longest first, so that `10 月` is not shortened to `1 月` by an earlier alternative.
        return names
            .slice()
            .sort((a, b) => b.length - a.length)
            .map(escapeRegExp)
            .join('|');
    }

    private pad(value: number, length: number): string {
        const sign = value < 0 ? '-' : '';

        return sign + `${Math.abs(value)}`.padStart(length, '0');
    }

    /** Adds a single duration unit. Calendar units flip pages, time units move by elapsed milliseconds. */
    private addByUnit(date: Date, amount: number, unit: DurationUnit): Date {
        switch (unit) {
            case 'years':
                return this.addCalendarYears(date, amount);
            case 'quarters':
                return this.addCalendarMonths(date, amount * 3);
            case 'months':
                return this.addCalendarMonths(date, amount);
            case 'weeks':
                return this.addCalendarDays(date, amount * 7);
            case 'days':
                return this.addCalendarDays(date, amount);
            case 'hours':
            case 'minutes':
            case 'seconds':
            case 'milliseconds':
                return new Date(date.getTime() + amount * durationUnitSizes[unit]);
            default:
                // The base class types the unit as a bare string on several call paths, so an
                // unrecognized one has to fail here rather than fall through and return undefined.
                throw Error(`Unsupported duration unit "${unit}". Duration units are plural, e.g. "days".`);
        }
    }

    /** Returns the signed number of units between two dates. */
    private diffCalendarUnits(start: Date, end: Date, unit: DurationUnit, showFraction = false): number {
        if (!isCalendarUnit(unit)) {
            const value = (this.getTime(end) - this.getTime(start)) / durationUnitSizes[unit];

            return showFraction ? value : Math.floor(value);
        }

        const comparison = this.compareDateTime(start, end);

        if (comparison === 0) {
            return 0;
        }

        const isForward = comparison < 0;
        const earlier = isForward ? start : end;
        const later = isForward ? end : start;

        const monthEstimate =
            (this.getYear(later) - this.getYear(earlier)) * 12 + (this.getMonth(later) - this.getMonth(earlier));
        let estimate: number;

        switch (unit) {
            case 'years':
                estimate = this.getYear(later) - this.getYear(earlier);
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

        const count = refineEstimate(
            estimate,
            (value) => this.compareDateTime(this.addCalendarUnits(earlier, value, unit), later) <= 0
        );

        const cursor = this.addCalendarUnits(earlier, count, unit);

        if (showFraction && (unit === 'years' || unit === 'months')) {
            const halfStep =
                unit === 'years'
                    ? this.addCalendarUnits(cursor, 6, 'months')
                    : this.addCalendarUnits(cursor, 15, 'days');
            const value = count + (this.compareDateTime(halfStep, later) <= 0 ? 0.5 : 0);

            return isForward ? value : -value;
        }

        if (!showFraction || this.compareDateTime(cursor, later) === 0) {
            return isForward ? count : -count;
        }

        const nextUnit = this.addCalendarUnits(cursor, 1, unit);
        const fraction = (this.getTime(later) - this.getTime(cursor)) / (this.getTime(nextUnit) - this.getTime(cursor));
        const value = count + fraction;

        return isForward ? value : -value;
    }

    /** Advances the date by whole years/months and the supported half-step when present. */
    private addFractionalCalendarUnits(date: Date, value: number, unit: 'years' | 'months'): Date {
        const wholeUnits = Math.floor(value);
        const result = this.addCalendarUnits(date, wholeUnits, unit);

        if (value - wholeUnits < 0.5) {
            return result;
        }

        return unit === 'years'
            ? this.addCalendarUnits(result, 6, 'months')
            : this.addCalendarUnits(result, 15, 'days');
    }
}
