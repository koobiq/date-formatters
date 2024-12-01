import { DateAdapter, DateAdapterConfig, DurationUnit } from '@koobiq/date-adapter';
import {
    DateTime,
    DateTimeOptions,
    DateTimeUnit,
    Duration,
    DurationObjectUnits,
    Interval,
    LocaleOptions,
    Settings,
    SystemZone
} from 'luxon';

import { enUS } from './locales/en-US';
import { esLA } from './locales/es-LA';
import { faIR } from './locales/fa-IR';
import { ptBR } from './locales/pt-BR';
import { ruRU } from './locales/ru-RU';
import { zhCN } from './locales/zh-CN';

const predefinedLocales = [enUS, ruRU, esLA, ptBR, zhCN, faIR];

/** Configurable options for {@see LuxonDateAdapter}. */
export interface LuxonDateAdapterOptions {
    /**
     * Turns the use of utc dates on or off.
     * {@default false}
     */
    useUtc: boolean;
}

export class LuxonDateAdapter extends DateAdapter<DateTime> {
    protected predefinedLocales: { [name: string]: DateAdapterConfig } = {};

    protected localeOptions!: LocaleOptions;
    protected dateTimeOptions!: DateTimeOptions;

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
        protected readonly options?: LuxonDateAdapterOptions
    ) {
        super();

        this.addLocales(predefinedLocales);

        this.setLocale(localeName);
    }

    override setLocale(localeName: string): void {
        super.setLocale(localeName);

        this.config = this.predefinedLocales[localeName];

        this.localeOptions = { locale: this.config.name };

        this.dateTimeOptions = {
            zone: this.options?.useUtc ? 'UTC' : undefined
        };

        const localeData: any = {
            dates: Array.from(
                { length: 31 },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                (_, i) => this.createDate(2000, 0, i + 1).toFormat('d')
            ),
            firstDayOfWeek: this.config.firstDayOfWeek,

            longMonths: this.config.monthNames.long,
            shortMonths: this.config.monthNames.short.standalone,

            narrowDaysOfWeek: this.config.dayOfWeekNames.narrow,
            shortDaysOfWeek: this.config.dayOfWeekNames.short,
            longDaysOfWeek: this.config.dayOfWeekNames.long
        };

        this.updateLocaleData(localeData);
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

    getLocaleData() {
        return this.localeData;
    }

    setLocaleData(localeData: typeof this.localeData): void {
        this.localeData = localeData;
    }

    updateLocaleData(localeData: typeof this.localeData): void {
        this.localeData = { ...this.localeData, ...localeData };
    }

    getYear(date: DateTime): number {
        return date.year;
    }

    getMonth(date: DateTime): number {
        return date.month - 1;
    }

    getDate(date: DateTime): number {
        return date.day;
    }

    getHours(date: DateTime): number {
        return date.hour;
    }

    getMinutes(date: DateTime): number {
        return date.minute;
    }

    getSeconds(date: DateTime): number {
        return date.second;
    }

    getMilliseconds(date: DateTime): number {
        return date.millisecond;
    }

    getTime(date: DateTime): number {
        return date.valueOf();
    }

    getDayOfWeek(date: DateTime): number {
        if (date.weekday === 7) {
            return 0;
        }

        return date.weekday;
    }

    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
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

    getYearName(date: DateTime): string {
        return date.toFormat('yyyy');
    }

    getFirstDayOfWeek(): number {
        return this.localeData.firstDayOfWeek;
    }

    getNumDaysInMonth(date: DateTime): number {
        return date.daysInMonth as number;
    }

    clone(date: DateTime): DateTime {
        return date.setLocale(date.locale as string);
    }

    createDate(year: number, month = 0, day = 1): DateTime {
        if (month < 0 || month > 11) {
            throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
        }

        if (day < 1) {
            throw Error(`Invalid day "${day}". Date has to be greater than 0.`);
        }

        return this.reconfigure(DateTime.fromObject({ year, month: month + 1, day }));
    }

    createDateTime(
        year: number,
        month: number,
        date: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number
    ): DateTime {
        return this.createDate(year, month, date).set({
            hour,
            minute,
            second,
            millisecond
        });
    }

    today(): DateTime {
        return this.reconfigure(DateTime.now());
    }

    parse(value: any, parseFormat?: string): DateTime | null {
        if (value) {
            if (typeof value === 'string') {
                if (parseFormat) {
                    return this.reconfigure(DateTime.fromFormat(value, parseFormat));
                } else if (DateTime.fromISO(value).isValid) {
                    return this.reconfigure(DateTime.fromISO(value));
                } else if (DateTime.fromRFC2822(value).isValid) {
                    return this.reconfigure(DateTime.fromRFC2822(value));
                } else if (DateTime.fromSQL(value).isValid) {
                    return this.reconfigure(DateTime.fromSQL(value));
                }
            } else if (typeof value === 'number') {
                return this.reconfigure(DateTime.fromMillis(value));
            } else if (value instanceof Date) {
                return this.reconfigure(DateTime.fromJSDate(value));
            }
        }

        return null;
    }

    format(date: DateTime, displayFormat: string): string {
        if (!this.isValid(date)) {
            throw Error('DateTime: Cannot format invalid date.');
        }

        const reconfiguredDate = this.reconfigure(date);

        if (this.locale === 'ru-RU' && displayFormat?.search(/([^M]|^)MMM([^M]|$)/) !== -1) {
            return this.formatShortMonthForRULocale(reconfiguredDate, displayFormat, this.dateTimeOptions);
        } else if (this.locale === 'pt-BR') {
            return this.formatShortMonthForPTLocale(reconfiguredDate, displayFormat, this.dateTimeOptions);
        }

        return reconfiguredDate.toFormat(displayFormat, this.dateTimeOptions);
    }

    addCalendarYears(date: DateTime, years: number): DateTime {
        return date.plus({ years });
    }

    addCalendarMonths(date: DateTime, months: number): DateTime {
        return date.plus({ months });
    }

    addCalendarDays(date: DateTime, days: number): DateTime {
        return date.plus({ days });
    }

    toIso8601(date: DateTime): string {
        return date.toISO() as string;
    }

    /** https://www.ietf.org/rfc/rfc3339.txt */
    override deserialize(value: any): DateTime | null {
        if (this.isDateInstance(value)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            return value.setLocale(this.locale);
        }

        let date;
        if (value instanceof Date) {
            date = this.reconfigure(DateTime.fromJSDate(value));
        } else if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            date = this.parse(value);
        }

        if (date && this.isValid(date)) {
            return date;
        }

        return super.deserialize(value);
    }

    isDateInstance(obj: any): boolean {
        return DateTime.isDateTime(obj);
    }

    isValid(date: DateTime): boolean {
        return date.isValid;
    }

    invalid(): DateTime {
        return DateTime.fromObject({ month: 0 });
    }

    hasSame(startDate: DateTime, endDate: DateTime, unit: DateTimeUnit): boolean {
        return startDate.hasSame(endDate, unit);
    }

    diffNow(date: DateTime, unit: DurationUnit): number {
        return date.diffNow(unit)[unit];
    }

    daysFromToday(date: DateTime): number {
        const today = this.today().startOf('day');

        return date.startOf('day').diff(today, 'day').days;
    }

    durationObjectFromDates(
        startDate: DateTime,
        endDate: DateTime,
        units: DurationUnit[] | string[] = [],
        fraction = false
    ): DurationObjectUnits {
        const allUnits: DurationUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

        const duration = Interval.fromDateTimes(startDate, endDate).toDuration(
            units.length ? (units as DurationUnit[]) : allUnits
        );

        // todo здесь по умолчанию берется 2 старших элемента, это сомнительное решение и возможно нужно будет переделать.
        // в новой версии luxon появился rescale, возможно он лучше решит эту задачу
        if (!units.length) {
            const maxUnitsNumber = 2;
            const firstNoZeroUnitIndex = allUnits.findIndex((unit) => duration.get(unit) > 0);

            units.push(...allUnits.splice(firstNoZeroUnitIndex, maxUnitsNumber).filter((unit) => duration.get(unit)));
        }

        const unitsWithFraction = ['years', 'months'];

        return duration
            .shiftTo(...(units as DurationUnit[]))
            .mapUnits((x, u) => {
                return fraction && unitsWithFraction.includes(u as string) ? Math.floor(x * 2) / 2 : Math.floor(x);
            })
            .toObject();
    }

    durationAs(durationObject: DurationObjectUnits, unit: DurationUnit): number {
        return Duration.fromObject(durationObject).as(unit);
    }

    durationFormat(durationObject: DurationObjectUnits, displayFormat: string): string {
        return Duration.fromObject(durationObject, { locale: this.locale as string }).toFormat(displayFormat);
    }

    private reconfigure(date: DateTime): DateTime {
        return date.reconfigure(this.localeOptions).setZone(this.dateTimeOptions.zone || date.zone);
    }

    // we need to do this strange things because Intl has ugly reduction for russian months
    private formatShortMonthForRULocale(date: DateTime, displayFormat: string, options: LocaleOptions) {
        return date
            .toFormat(displayFormat, options)
            .replace('февр', this.config.monthNames.short.formatted[1])
            .replace(/июн.?/, this.config.monthNames.short.formatted[5])
            .replace(/июл.?/, this.config.monthNames.short.formatted[6])
            .replace('сент', this.config.monthNames.short.formatted[8])
            .replace('нояб', this.config.monthNames.short.formatted[10])
            .replace(/(\W)\./, '$1');
    }

    private formatShortMonthForPTLocale(date: DateTime, displayFormat: string, options: LocaleOptions) {
        return date.toFormat(displayFormat, options).replace('.', '');
    }
}
