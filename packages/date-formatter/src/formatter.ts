import { DateAdapter, DurationUnit } from '@koobiq/date-adapter';
import MessageFormat from '@messageformat/core';

import { enUS } from './templates/en-US';
import { esLA } from './templates/es-LA';
import { faIR } from './templates/fa-IR';
import { ptBR } from './templates/pt-BR';
import { ruRU } from './templates/ru-RU';
import { zhCN } from './templates/zh-CN';

const predefinedLocales: { [localeName: string]: FormatterConfig } = {
    'en-US': enUS,
    'ru-RU': ruRU,
    'es-LA': esLA,
    'pt-BR': ptBR,
    'fa-IR': faIR,
    'zh-CN': zhCN
};

/**
 * interface for absolute date or datetime formatter template
 */
export interface FormatterAbsoluteTemplate {
    variables?: { [name: string]: string };
    DATE: string;
    DATETIME: string;
}

/**
 * interface for range date or datetime formatter template
 */
export interface FormatterRangeTemplate {
    variables?: { [name: string]: string };
    START_DATE: string;
    END_DATE: string;
    DATE: string;
    START_DATETIME: string;
    END_DATETIME: string;
    DATETIME: string;
}

/**
 * interface for relative date or datetime formatter template
 */
export interface FormatterRelativeTemplate {
    variables?: { [name: string]: string };
    BEFORE_YESTERDAY: string;
    YESTERDAY: string;
    TODAY: string;
    TOMORROW: string;
    AFTER_TOMORROW: string;
}

export interface DateTimeOptions {
    seconds?: boolean;
    milliseconds?: boolean;
    currYear?: boolean;
}

export interface FormatterConfig {
    relativeTemplates: {
        short: FormatterRelativeTemplate;
        long: FormatterRelativeTemplate;
    };
    absoluteTemplates: {
        short: FormatterAbsoluteTemplate;
        long: FormatterAbsoluteTemplate;
    };
    rangeTemplates: {
        closedRange: {
            short: FormatterRangeTemplate;
            middle: FormatterRangeTemplate;
            long: FormatterRangeTemplate;
        };
        openedRange: {
            short: FormatterRangeTemplate;
            long: FormatterRangeTemplate;
        };
    };
    durationTemplates: {
        shortest: FormatterDurationNumbersTemplate;
        short: FormatterDurationTemplate;
        long: FormatterDurationTemplate;
    };
}

/**
 * interface for duration of dates numeric formatter template
 */
export interface FormatterDurationNumbersTemplate {
    variables?: { [name: string]: string };
    FULL: string;
    ONLY_MINUTES: string;
}

/**
 * interface for duration of dates text formatter template
 */
export interface FormatterDurationTemplate {
    variables?: { [name: string]: string };
    YEARS: string;
    MONTHS: string;
    WEEKS: string;
    DAYS: string;
    HOURS: string;
    MINUTES: string;
    SECONDS: string;
    SEPARATOR: string;
    YEARS_FRACTION: string;
    MONTHS_FRACTION: string;
}

export class DateFormatter<D> {
    config: FormatterConfig;

    protected readonly invalidDateErrorText: string = 'Invalid date';

    protected messageFormat: MessageFormat;

    constructor(
        protected readonly adapter: DateAdapter<D>,
        localeName: string
    ) {
        this.config = predefinedLocales[localeName];

        const rtl = this.adapter.config.name == 'fa-IR';

        this.messageFormat = new MessageFormat(localeName, { biDiSupport: rtl });
    }

    setLocale(localeName: string): void {
        this.config = predefinedLocales[localeName];

        const rtl = this.adapter.config.name == 'fa-IR';

        this.messageFormat = new MessageFormat(localeName, { biDiSupport: rtl });

        this.adapter.setLocale(localeName);
    }

    /**
     * @param date - date
     * @param template - template
     * @param seconds - use seconds
     * @param milliseconds - use milliseconds
     * @returns relative date by template
     */
    relativeDate(date: D, template: FormatterRelativeTemplate, seconds = false, milliseconds = false): string {
        if (!this.adapter.isDateInstance(date)) {
            throw new Error(this.invalidDateErrorText);
        }

        let newTemplate;

        const templateVariables = {
            ...this.adapter.config.variables,
            ...template.variables
        };

        if (this.isBeforeYesterday(date)) {
            newTemplate = template.BEFORE_YESTERDAY;
        } else if (this.isYesterday(date)) {
            newTemplate = template.YESTERDAY;
        } else if (this.isToday(date)) {
            newTemplate = template.TODAY;
        } else if (this.isTomorrow(date)) {
            newTemplate = template.TOMORROW;
        } else if (this.isAfterTomorrow(date)) {
            newTemplate = template.AFTER_TOMORROW;
        }

        const variables = this.compileVariables(date, templateVariables);

        variables.SHOW_SECONDS = seconds ? 'yes' : 'no';
        variables.SHOW_MILLISECONDS = milliseconds ? 'yes' : 'no';

        return this.messageFormat.compile(newTemplate as string)(variables);
    }

    /**
     * @param date - date
     * @returns relative date in short format
     */
    relativeShortDate(date: D): string {
        return this.relativeDate(date, this.config.relativeTemplates.short);
    }

    /**
     * @param date - date
     * @returns relative date in long format
     */
    relativeLongDate(date: D): string {
        return this.relativeDate(date, this.config.relativeTemplates.long);
    }

    /**
     * @param date - date
     * @param options - DateTimeOptions
     * @returns relative date in short format with time
     */
    relativeShortDateTime(date: D, options?: DateTimeOptions): string {
        return this.relativeDate(date, this.config.relativeTemplates.short, options?.seconds, options?.milliseconds);
    }

    /**
     * @param date - date
     * @param options - DateTimeOptions
     * @returns relative date in long format with time
     */
    relativeLongDateTime(date: D, options?: DateTimeOptions): string {
        return this.relativeDate(date, this.config.relativeTemplates.long, options?.seconds, options?.milliseconds);
    }

    /**
     * @param date - date
     * @param params - parameters
     * @param datetime - should time be shown as well
     * @param seconds - should time with seconds be shown as well
     * @param milliseconds - should time with milliseconds be shown as well
     * @param currYear - should current year be shown as well
     */
    absoluteDate(
        date: D,
        params: FormatterAbsoluteTemplate,
        datetime = false,
        seconds = false,
        milliseconds = false,
        currYear = false
    ): string {
        if (!this.adapter.isDateInstance(date)) {
            throw new Error(this.invalidDateErrorText);
        }

        const variables = this.compileVariables(
            date,
            { ...this.adapter.config.variables, ...params.variables },
            currYear
        );

        variables.SHOW_SECONDS = seconds ? 'yes' : 'no';
        variables.SHOW_MILLISECONDS = milliseconds ? 'yes' : 'no';

        const template = datetime ? params.DATETIME : params.DATE;

        return this.messageFormat.compile(template)(variables);
    }

    /**
     * @param date - date
     * @param currYear - should the year be shown forced
     * @returns absolute date in short format
     */
    absoluteShortDate(date: D, currYear = false): string {
        return this.absoluteDate(date, this.config.absoluteTemplates.short, false, false, false, currYear);
    }

    /**
     * @param date - date
     * @param options - DateTimeOptions
     * @returns absolute date in short format with time
     */
    absoluteShortDateTime(date: D, options?: DateTimeOptions): string {
        return this.absoluteDate(
            date,
            this.config.absoluteTemplates.short,
            true,
            options?.seconds,
            options?.milliseconds,
            options?.currYear
        );
    }

    /**
     * @param date - date
     * @param currYear - should the year be shown forced
     * @returns absolute date in long format
     */
    absoluteLongDate(date: D, currYear = false): string {
        return this.absoluteDate(date, this.config.absoluteTemplates.long, false, false, false, currYear);
    }

    /**
     * @param date - date
     * @param options - DateTimeOptions
     * @returns absolute date in long format with time
     */
    absoluteLongDateTime(date: D, options?: DateTimeOptions): string {
        return this.absoluteDate(
            date,
            this.config.absoluteTemplates.long,
            true,
            options?.seconds,
            options?.milliseconds,
            options?.currYear
        );
    }

    /**
     * @param startDate - start date
     * @param endDate - end date
     * @param template - template
     * @returns opened date
     */
    openedRangeDate(startDate: D | null, endDate: D | null, template: FormatterRangeTemplate) {
        if (!this.adapter.isDateInstance(startDate) && !this.adapter.isDateInstance(endDate)) {
            throw new Error(this.invalidDateErrorText);
        }

        const variables = {
            ...this.adapter.config.variables,
            ...template.variables
        };
        let params = {};

        if (startDate) {
            const startDateVariables = this.compileVariables(startDate, variables);

            params = {
                ...variables,
                START_DATE: this.messageFormat.compile(template.START_DATE)(startDateVariables),
                RANGE_TYPE: 'onlyStart'
            };
        } else if (endDate) {
            const endDateVariables = this.compileVariables(endDate, variables);

            params = {
                ...variables,
                END_DATE: this.messageFormat.compile(template.END_DATE)(endDateVariables),
                RANGE_TYPE: 'onlyEnd'
            };
        }

        return this.messageFormat.compile(template.DATE)(params);
    }

    /**
     * @param startDate - start date
     * @param endDate - end date
     * @param template - template
     * @param seconds - should time with seconds be shown as well
     * @param milliseconds - should time with milliseconds be shown as well
     * @returns opened date
     */
    openedRangeDateTime(
        startDate: D | null,
        endDate: D | null,
        template: FormatterRangeTemplate,
        seconds = false,
        milliseconds = false
    ) {
        if (!this.adapter.isDateInstance(startDate) && !this.adapter.isDateInstance(endDate)) {
            throw new Error(this.invalidDateErrorText);
        }

        const variables = {
            ...this.adapter.config.variables,
            ...template.variables
        };
        let params = {};

        if (startDate) {
            const startDateVariables = this.compileVariables(startDate, variables);
            startDateVariables.SHOW_SECONDS = seconds ? 'yes' : 'no';
            startDateVariables.SHOW_MILLISECONDS = milliseconds ? 'yes' : 'no';

            params = {
                ...variables,
                START_DATETIME: this.messageFormat.compile(template.START_DATETIME)(startDateVariables),
                RANGE_TYPE: 'onlyStart'
            };
        } else if (endDate) {
            const endDateVariables = this.compileVariables(endDate, variables);
            endDateVariables.SHOW_SECONDS = seconds ? 'yes' : 'no';
            endDateVariables.SHOW_MILLISECONDS = milliseconds ? 'yes' : 'no';

            params = {
                ...variables,
                END_DATETIME: this.messageFormat.compile(template.END_DATETIME)(endDateVariables),
                RANGE_TYPE: 'onlyEnd'
            };
        }

        return this.messageFormat.compile(template.DATETIME)(params);
    }

    /**
     * @param startDate - start date
     * @param endDate - end date
     * @param template - template
     * @returns range date in template format
     */
    rangeDate(startDate: D, endDate: D, template: FormatterRangeTemplate): string {
        if (!this.adapter.isDateInstance(startDate) || !this.adapter.isDateInstance(endDate)) {
            throw new Error(this.invalidDateErrorText);
        }

        const variables = {
            ...this.adapter.config.variables,
            ...template.variables
        };
        const sameMonth = this.hasSame(startDate, endDate, 'month');

        const startDateVariables = this.compileVariables(startDate, variables);
        startDateVariables.SAME_MONTH = sameMonth;

        const endDateVariables = this.compileVariables(endDate, variables);
        endDateVariables.SAME_MONTH = sameMonth;

        const bothCurrentYear = startDateVariables.CURRENT_YEAR === 'yes' && endDateVariables.CURRENT_YEAR === 'yes';
        startDateVariables.CURRENT_YEAR = bothCurrentYear ? 'yes' : 'no';
        endDateVariables.CURRENT_YEAR = bothCurrentYear ? 'yes' : 'no';

        const params = {
            ...variables,
            START_DATE: this.messageFormat.compile(template.START_DATE)(startDateVariables),
            END_DATE: this.messageFormat.compile(template.END_DATE)(endDateVariables),
            SAME_MONTH: sameMonth
        };

        return this.messageFormat.compile(template.DATE)(params);
    }

    /**
     * @param startDate - start date
     * @param endDate - end date
     * @param template - template
     * @param seconds - use seconds
     * @param milliseconds - use milliseconds
     * @returns range date in template format with time
     */
    rangeDateTime(
        startDate: D,
        endDate: D,
        template: FormatterRangeTemplate,
        seconds = false,
        milliseconds = false
    ): string {
        if (!this.adapter.isDateInstance(startDate) || !this.adapter.isDateInstance(endDate)) {
            throw new Error(this.invalidDateErrorText);
        }

        const variables = {
            ...this.adapter.config.variables,
            ...template.variables
        };

        const sameMonth = this.hasSame(startDate, endDate, 'month');
        const sameDay = this.hasSame(startDate, endDate, 'day');

        const startDateVariables = this.compileVariables(startDate, variables);
        startDateVariables.SAME_MONTH = sameMonth;
        startDateVariables.SAME_DAY = sameDay;
        startDateVariables.SHOW_SECONDS = seconds ? 'yes' : 'no';
        startDateVariables.SHOW_MILLISECONDS = milliseconds ? 'yes' : 'no';

        const endDateVariables = this.compileVariables(endDate, variables);
        endDateVariables.SAME_MONTH = sameMonth;
        endDateVariables.SAME_DAY = sameDay;
        endDateVariables.SHOW_SECONDS = seconds ? 'yes' : 'no';
        endDateVariables.SHOW_MILLISECONDS = milliseconds ? 'yes' : 'no';

        const bothCurrentYear = startDateVariables.CURRENT_YEAR === 'yes' && endDateVariables.CURRENT_YEAR === 'yes';
        startDateVariables.CURRENT_YEAR = bothCurrentYear ? 'yes' : 'no';
        endDateVariables.CURRENT_YEAR = bothCurrentYear ? 'yes' : 'no';

        const params = {
            ...variables,
            START_DATETIME: this.messageFormat.compile(template.START_DATETIME)(startDateVariables),
            END_DATETIME: this.messageFormat.compile(template.END_DATETIME)(endDateVariables),
            SAME_MONTH: sameMonth,
            SAME_DAY: sameDay
        };

        return this.messageFormat.compile(template.DATETIME)(params);
    }

    /**
     * @param startDate - start date
     * @param endDate - end date
     * @returns range date in short format
     */
    rangeShortDate(startDate: D | null, endDate?: D): string {
        const rangeTemplates = this.config.rangeTemplates;

        if (startDate && endDate) {
            return this.rangeDate(startDate, endDate, rangeTemplates.closedRange.short);
        }

        return this.openedRangeDate(startDate, endDate || null, rangeTemplates.openedRange.short);
    }

    /**
     * @param startDate - start date
     * @param endDate - end date
     * @param options - DateTimeOptions
     * @returns range date in short format with time
     */
    rangeShortDateTime(startDate: D | null, endDate?: D | null, options?: DateTimeOptions): string {
        const rangeTemplates = this.config.rangeTemplates;

        if (startDate && endDate) {
            return this.rangeDateTime(
                startDate,
                endDate,
                rangeTemplates.closedRange.short,
                options?.seconds,
                options?.milliseconds
            );
        }

        return this.openedRangeDateTime(
            startDate,
            endDate || null,
            rangeTemplates.openedRange.short,
            options?.seconds,
            options?.milliseconds
        );
    }

    /**
     * @param startDate - start date
     * @param endDate - end date
     * @returns range date in long format
     */
    rangeLongDate(startDate: D | null, endDate?: D | null): string {
        const rangeTemplates = this.config.rangeTemplates;

        if (startDate && endDate) {
            return this.rangeDate(startDate, endDate, rangeTemplates.closedRange.long);
        }

        return this.openedRangeDate(startDate, endDate || null, rangeTemplates.openedRange.long);
    }

    /**
     * @param startDate - start date
     * @param endDate - end date
     * @param options - DateTimeOptions
     * @returns range date in long format with time
     */
    rangeLongDateTime(startDate: D | null, endDate?: D, options?: DateTimeOptions): string {
        const rangeTemplates = this.config.rangeTemplates;

        if (startDate && endDate) {
            return this.rangeDateTime(
                startDate,
                endDate,
                rangeTemplates.closedRange.long,
                options?.seconds,
                options?.milliseconds
            );
        }

        return this.openedRangeDateTime(startDate, endDate || null, rangeTemplates.openedRange.long);
    }

    /**
     * @param startDate - start date
     * @param endDate - end date
     * @param options - DateTimeOptions
     * @returns range middle date with time
     */
    rangeMiddleDateTime(startDate: D, endDate: D, options?: DateTimeOptions): string {
        return this.rangeDateTime(
            startDate,
            endDate,
            this.config.rangeTemplates.closedRange.middle,
            options?.seconds,
            options?.milliseconds
        );
    }

    /**
     * @param startDate - start date
     * @param endDate - end date
     * @param seconds - add seconds to formatted value
     * @param milliseconds - add milliseconds to formatted value
     * @returns formatted duration as string like 48:02:25
     */
    durationShortest(startDate: D, endDate: D, seconds = true, milliseconds = false): string {
        this.checkDates(startDate, endDate);

        if (startDate > endDate) {
            throw new Error(this.invalidDateErrorText);
        }

        const durationObject = this.adapter.durationObjectFromDates(startDate, endDate, [
            'hours',
            'minutes',
            'seconds',
            'milliseconds'
        ]);

        if (seconds) {
            const displayFormat = durationObject.hours ? 'h:mm:ss' : 'm:ss';

            return this.compileMessage(this.config.durationTemplates.shortest.FULL, {
                D: this.adapter.durationFormat(durationObject, displayFormat),
                SHOW_MILLISECONDS: milliseconds ? 'yes' : 'no',
                MILLISECONDS: durationObject.milliseconds
            });
        }

        const roundedSeconds = Math.floor(this.adapter.durationAs(durationObject, 'seconds'));

        return roundedSeconds - (roundedSeconds % 60)
            ? this.compileMessage(this.config.durationTemplates.shortest.ONLY_MINUTES, {
                  HOURS: durationObject.hours,
                  MINUTES: durationObject.minutes
              })
            : '';
    }

    /**
     * @param startDate - start date
     * @param endDate - end date
     * @param units - if defined, units to show will be specified
     * @param fraction - shows fraction part for years and months
     * @param template - specify template
     * @returns formatted duration as string
     */
    duration(
        startDate: D,
        endDate: D,
        units: DurationUnit[],
        fraction: boolean,
        template: FormatterDurationTemplate
    ): string {
        this.checkDates(startDate, endDate);

        if (startDate > endDate) {
            throw new Error(this.invalidDateErrorText);
        }

        const values: any = this.adapter.durationObjectFromDates(startDate, endDate, units, fraction);
        const variables: { [name: string]: string | number } = { ...values };
        variables['SHOW_MILLISECONDS'] = values.milliseconds ? 'yes' : 'no';

        return Object.keys(values)
            .filter((unit) => unit !== 'milliseconds')
            .reduce<string[]>((acc, unit, index, arr) => {
                if (fraction) {
                    variables['floorValue'] = Math.floor(values[unit]);
                    acc.push(this.compileMessage((template as any)[`${unit.toUpperCase()}_FRACTION`], variables));
                } else {
                    if (arr.length > 1 && index === arr.length - 1) {
                        acc.push(this.compileMessage(template.SEPARATOR, variables));
                    }

                    acc.push(this.compileMessage((template as any)[unit.toUpperCase()], variables));
                }

                return acc;
            }, [])
            .filter((text) => !!text)
            .join('');
    }

    durationLong(startDate: D, endDate: D, units: DurationUnit[] = [], fraction = false): string {
        return this.duration(startDate, endDate, units, fraction, this.config.durationTemplates.long);
    }

    durationShort(startDate: D, endDate: D, units: DurationUnit[] = [], fraction = false): string {
        return this.duration(startDate, endDate, units, fraction, this.config.durationTemplates.short);
    }

    private checkDates(...args: any[]) {
        args.forEach((date) => {
            if (!this.adapter.isDateInstance(date) || !this.adapter.isValid(date)) {
                throw new Error(this.invalidDateErrorText);
            }
        });
    }

    private compileMessage(message: string, variables: any): string {
        return this.messageFormat.compile(message)(variables);
    }

    /**
     * @param date - date for compile
     * @param variables - date template variables
     * @param currYearForced - param for absolute days formatting
     * @returns compiledVariables
     */
    private compileVariables(date: D, variables: any, currYearForced = false): any {
        const compiledVariables: any = {};

        for (const key in variables) {
            // eslint-disable-next-line no-prototype-builtins
            if (!variables.hasOwnProperty(key)) {
                continue;
            }

            const value = variables[key];
            compiledVariables[key] = this.adapter.format(date, value);
        }

        compiledVariables.CURRENT_YEAR = (currYearForced && 'no') || this.hasSame(date, this.adapter.today(), 'year');

        return compiledVariables;
    }

    private isBeforeYesterday(date: D): boolean {
        return this.adapter.daysFromToday(date) <= -2;
    }

    private isYesterday(date: D): boolean {
        return this.adapter.daysFromToday(date) === -1;
    }

    private isToday(date: D): boolean {
        return this.adapter.daysFromToday(date) === 0;
    }

    private isTomorrow(date: any): boolean {
        return this.adapter.daysFromToday(date) === 1;
    }

    private isAfterTomorrow(date: D): boolean {
        return this.adapter.daysFromToday(date) >= 2;
    }

    private hasSame(startDate: D, endDate: D, unit: string): string {
        return this.adapter.hasSame(startDate, endDate, unit) ? 'yes' : 'no';
    }
}
