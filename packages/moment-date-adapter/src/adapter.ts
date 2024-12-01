/* eslint-disable no-case-declarations */
import { DateAdapter, DateAdapterConfig, DurationObjectUnits, DurationUnit } from '@koobiq/date-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment, unitOfTime } from 'moment';

import 'moment/locale/fa';

import { enUS } from './locales/en-US';
import { esLA } from './locales/es-LA';
import { faIR } from './locales/fa-IR';
import { ptBR } from './locales/pt-BR';
import { ruRU } from './locales/ru-RU';
import { zhCN } from './locales/zh-CN';

const predefinedLocales = [enUS, ruRU, esLA, ptBR, zhCN, faIR];

const moment = _rollupMoment || _moment;
/* set default locale, so imported locales won't overwrite it */
moment.locale('en');

/** Configurable options for {@see MomentDateAdapter}. */
export interface MomentDateAdapterOptions {
    /**
     * Turns the use of utc dates on or off.
     * {@default false}
     */
    useUtc?: boolean;
    /**
     * whether should parse method try guess date format
     * {@default false}
     */
    findDateFormat?: boolean;
}

const momentToStandardLangMap: { [lang: string]: string } = {
    ru: 'ru-RU',
    en: 'en-US',
    fa: 'fa-IR'
};

const standardLangToMomentMap: { [lang: string]: string } = Object.fromEntries(
    Object.entries(momentToStandardLangMap).map(([key, value]) => [value, key])
);

export class MomentDateAdapter extends DateAdapter<Moment> {
    protected predefinedLocales: { [name: string]: DateAdapterConfig } = {};

    protected localeData!: {
        firstDayOfWeek: number;
        longMonths: string[];
        shortMonths: string[];
        dates: string[];
        longDaysOfWeek: string[];
        shortDaysOfWeek: string[];
        narrowDaysOfWeek: string[];
    };

    constructor(
        localeName: string,
        protected readonly options?: MomentDateAdapterOptions
    ) {
        super();

        this.addLocales(predefinedLocales);

        this.setLocale(localeName || moment.locale());
    }

    setLocale(localeName: string): void {
        /* change standard locale to moment-specific for farsi to output localized date */
        super.setLocale(standardLangToMomentMap[localeName] || localeName);

        this.config = this.predefinedLocales[momentToStandardLangMap[localeName] || localeName];

        const localeData = {
            dates: Array.from({ length: 31 }, (_, i) => this.createDate(2017, 0, i + 1).format('D')),
            firstDayOfWeek: this.config.firstDayOfWeek,

            longMonths: this.config.monthNames.long,
            shortMonths: this.config.monthNames.short.standalone,

            narrowDaysOfWeek: this.config.dayOfWeekNames.narrow,
            shortDaysOfWeek: this.config.dayOfWeekNames.short,
            longDaysOfWeek: this.config.dayOfWeekNames.long
        };

        this.updateLocaleData(localeData);
    }

    getLocaleData() {
        return this.localeData;
    }

    addLocales(locales: DateAdapterConfig[]) {
        locales.forEach(this.addLocale);
    }

    addLocale = (locale: DateAdapterConfig) => {
        if (!locale.name) {
            return;
        }

        this.predefinedLocales[locale.name] = locale;
    };

    setLocaleData(localeData: typeof this.localeData): void {
        this.localeData = localeData;
    }

    updateLocaleData(localeData: typeof this.localeData): void {
        this.localeData = { ...this.localeData, ...localeData };
    }

    getYear(date: Moment): number {
        return this.clone(date).year();
    }

    getMonth(date: Moment): number {
        return this.clone(date).month();
    }

    getDate(date: Moment): number {
        return this.clone(date).date();
    }

    getHours(date: Moment): number {
        return this.clone(date).hours();
    }

    getMinutes(date: Moment): number {
        return this.clone(date).minutes();
    }

    getSeconds(date: Moment): number {
        return this.clone(date).seconds();
    }

    getMilliseconds(date: Moment): number {
        return this.clone(date).milliseconds();
    }

    getTime(date: Moment): number {
        return date.valueOf();
    }

    getDayOfWeek(date: Moment): number {
        return this.clone(date).day();
    }

    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        // Moment.js doesn't support narrow month names
        return style === 'long' ? this.localeData.longMonths : this.localeData.shortMonths;
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

    getYearName(date: Moment): string {
        return this.clone(date).format('YYYY');
    }

    getFirstDayOfWeek(): number {
        return this.localeData.firstDayOfWeek;
    }

    getNumDaysInMonth(date: Moment): number {
        return this.clone(date).daysInMonth();
    }

    clone(date: Moment): Moment {
        return date.clone().locale(this.locale);
    }

    createDate(year: number, month = 0, date = 1): Moment {
        // Moment.js will create an invalid date if any of the components are out of bounds, but we
        // explicitly check each case, so we can throw more descriptive errors.
        if (month < 0 || month > 11) {
            throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
        }

        if (date < 1) {
            throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
        }

        const result = this.createMoment({ year, month, date }).locale(this.locale);

        // If the result isn't valid, the date must have been out of bounds for this month.
        if (!result.isValid()) {
            throw Error(`Invalid date "${date}" for month with index "${month}".`);
        }

        return result;
    }

    createDateTime(
        year: number,
        month: number,
        date: number,
        hours: number,
        minutes: number,
        seconds: number,
        milliseconds: number
    ): Moment {
        const newDate = this.createDate(year, month, date);

        newDate.hours(hours);
        newDate.minutes(minutes);
        newDate.seconds(seconds);
        newDate.milliseconds(milliseconds);

        return newDate;
    }

    today(): Moment {
        return this.createMoment().locale(this.locale);
    }

    parse(value: any, parseFormat: string | string[]): Moment | null {
        if (value) {
            if (typeof value === 'string') {
                if (this.options?.findDateFormat) {
                    return this.findFormat(value);
                }

                return parseFormat
                    ? this.createMoment(value, parseFormat, this.locale)
                    : this.createMoment(value).locale(this.locale);
            }

            return this.createMoment(value).locale(this.locale);
        }

        return null;
    }

    format(date: Moment, displayFormat: string): string {
        // tslint:disable:no-parameter-reassignment
        const newDate = this.clone(date);
        if (!this.isValid(newDate)) {
            throw Error('MomentDateAdapter: Cannot format invalid date.');
        }

        return newDate.format(displayFormat);
    }

    addCalendarYears(date: Moment, years: number): Moment {
        return this.clone(date).add({ years });
    }

    addCalendarMonths(date: Moment, months: number): Moment {
        return this.clone(date).add({ months });
    }

    addCalendarDays(date: Moment, days: number): Moment {
        return this.clone(date).add({ days });
    }

    toIso8601(date: Moment): string {
        return this.clone(date).format();
    }

    /** https://www.ietf.org/rfc/rfc3339.txt */
    deserialize(value: any): Moment | null {
        let date;
        if (value instanceof Date) {
            date = this.createMoment(value).locale(this.locale);
        } else if (this.isDateInstance(value)) {
            // Note: assumes that cloning also sets the correct locale.
            return this.clone(value);
        }

        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            date = this.createMoment(value, moment.ISO_8601).locale(this.locale);
        }

        if (date && this.isValid(date)) {
            return this.createMoment(date).locale(this.locale);
        }

        return super.deserialize(value);
    }

    isDateInstance(obj: any): boolean {
        return moment.isMoment(obj);
    }

    isValid(date: Moment): boolean {
        return this.clone(date).isValid();
    }

    invalid(): Moment {
        return moment.invalid();
    }

    hasSame(startDate: Moment, endDate: Moment, unit: unitOfTime.Diff): boolean {
        return startDate.isSame(endDate, unit);
    }

    diffNow(date: Moment, unit: unitOfTime.Diff): number {
        return date.diff(this.today(), unit);
    }

    daysFromToday(date: Moment): number {
        const today = this.today().clone().startOf('day');

        return date.clone().startOf('day').diff(today, 'days');
    }

    durationObjectFromDates(start: Moment, end: Moment, units: DurationUnit[], fraction = false): DurationObjectUnits {
        const allUnits: DurationUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

        const duration = moment.duration(end.diff(start));

        return (units.length ? units : allUnits).reduce<DurationObjectUnits>((sum, currentValue: DurationUnit) => {
            const unitsWithFraction = ['years', 'months'];

            const durationUnitValue: number =
                fraction && unitsWithFraction.includes(currentValue)
                    ? duration.as(currentValue as unitOfTime.Base)
                    : Math.floor(duration.as(currentValue as unitOfTime.Base));

            if (units.length || durationUnitValue > 0) {
                duration.subtract(durationUnitValue, currentValue);
                sum[currentValue] = durationUnitValue;
            }

            return sum;
        }, {});
    }

    durationAs(durationObject: DurationObjectUnits, unit: DurationUnit): number {
        return moment.duration(durationObject).as(unit as unitOfTime.Base);
    }

    durationFormat(durationObject: DurationObjectUnits, displayFormat: any): string {
        return moment.utc(moment.duration(durationObject).asMilliseconds()).format(displayFormat);
    }

    /** Creates a Moment instance while respecting the current UTC settings. */
    private createMoment(...args: any[]): Moment {
        return this.options?.useUtc ? moment.utc(...args) : moment(...args);
    }

    private isNumeric(value: any): boolean {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    private findFormat(value: string): Moment | null {
        if (!value) {
            return null;
        }

        // default test - iso
        const isoDate = this.createMoment(value, moment.ISO_8601, this.locale);

        if (isoDate.isValid()) {
            return isoDate;
        }

        if (this.isNumeric(value)) {
            // unix time sec
            return this.createMoment(value, 'X', this.locale);
        }

        // long months naming: D MMM YYYY, MMM Do YYYY with short case support
        if (
            /^\d{1,2}\s\S+\s(\d{2}|\d{4})$/.test(value.trim()) ||
            /^\S+\s\d{1,2}[a-z]{2}\s(\d{2}|\d{4})$/.test(value.trim())
        ) {
            return this.parseWithSpace(value);
        }

        // slash notation: DD/MM/YYYY, MM/DD/YYYY with short case support
        if (/^\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})$/.test(value)) {
            return this.parseWithSlash(value);
        }

        // dash notation: DD-MM-YYYY, YYYY-DD-MM with short case support
        if (/(^(\d{1,2}|\d{4})-\d{1,2}-\d{1,2}$)|(^\d{1,2}-\d{1,2}-(\d{2}|\d{4})$)/.test(value)) {
            return this.parseWithDash(value);
        }

        // dot notation: DD.MM.YYYY with short case support
        if (/^\d{1,2}\.\d{1,2}\.(\d{2}|\d{4})$/.test(value)) {
            return this.parseWithDot(value);
        }

        return null;
    }

    private parseWithSpace(value: string): Moment | null {
        switch (this.locale) {
            case 'ru':
                return this.createMoment(value, 'DD MMMM YYYY', this.locale);
            case 'en':
                // 16 Feb 2019 vs Feb 16th 2019, covers Feb and February cases
                if (this.isNumeric(value[0])) {
                    return this.createMoment(value, 'D MMMM YYYY', this.locale);
                }

                return this.createMoment(value, 'MMMM Do YYYY', this.locale);
            default:
                throw new Error(`Locale ${this.locale} is not supported`);
        }
    }

    private parseWithSlash(value: string): Moment | null {
        switch (this.locale) {
            case 'ru':
                return this.createMoment(value, 'DD/MM/YYYY', this.locale);
            case 'en':
                // US vs UK
                const parts = value.split('/');
                const datePartsCount = 3;
                if (parts.length !== datePartsCount) {
                    return null;
                }

                const firstPart = parts[0].trim();
                const secondPart = parts[1].trim();

                if (!this.isNumeric(firstPart) || !this.isNumeric(secondPart)) {
                    return null;
                }

                const monthsInYears = 12;

                const canFirstBeMonth = +firstPart <= monthsInYears;
                const canSecondByMonth = +secondPart <= monthsInYears;

                // first two parts cannot be month
                if (!canFirstBeMonth && !canSecondByMonth) {
                    return null;
                }

                const canDetermineWhereMonth = canFirstBeMonth && canSecondByMonth;

                // use US format by default
                if (canDetermineWhereMonth) {
                    return this.createMoment(value, 'MM/DD/YYYY', this.locale);
                }

                return canFirstBeMonth && !canSecondByMonth
                    ? this.createMoment(value, 'MM/DD/YYYY', this.locale)
                    : this.createMoment(value, 'DD/MM/YYYY', this.locale);
            default:
                throw new Error(`Locale ${this.locale} is not supported`);
        }
    }

    private parseWithDash(value: string): Moment | null {
        // leading year vs finishing year
        const parts = value.split('-');
        if (parts[0].length === 0) {
            return null;
        }

        const maxDayOrMonthCharsCount = 2;

        return parts[0].length <= maxDayOrMonthCharsCount
            ? this.createMoment(value, 'DD-MM-YYYY', this.locale)
            : this.createMoment(value, 'YYYY-MM-DD', this.locale);
    }

    private parseWithDot(value: string): Moment | null {
        // covers two cases YYYY and YY (for current year)
        return this.createMoment(value, 'DD.MM.YYYY', this.locale);
    }
}
