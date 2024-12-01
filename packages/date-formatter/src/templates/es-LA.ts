import { FormatterConfig } from '../formatter';

const SECONDS_TEMPLATE = `{
    SHOW_MILLISECONDS,
    select,
        yes{:{SECONDS}{MILLISECONDS}}
        other{{
            SHOW_SECONDS,
            select,
                yes{:{SECONDS}}
                other{}
        }}
}`;

export const esLA: FormatterConfig = {
    relativeTemplates: {
        short: {
            BEFORE_YESTERDAY: `{CURRENT_YEAR, select, yes{{SHORT_DATE}, {TIME}} other{{SHORT_DATE} {YEAR}}}${SECONDS_TEMPLATE}`,
            YESTERDAY: `Ayer, {TIME}${SECONDS_TEMPLATE}`,
            TODAY: `Hoy, {TIME}${SECONDS_TEMPLATE}`,
            TOMORROW: `Mañana, {TIME}${SECONDS_TEMPLATE}`,
            AFTER_TOMORROW: `{CURRENT_YEAR, select, yes{{SHORT_DATE}, {TIME}} other{{SHORT_DATE} {YEAR}, {TIME}}}${SECONDS_TEMPLATE}`
        },
        long: {
            BEFORE_YESTERDAY: `{CURRENT_YEAR, select, yes{{DATE}, {TIME}} other{{DATE} de {YEAR}, {TIME}}}${SECONDS_TEMPLATE}`,
            YESTERDAY: `Ayer, {TIME}${SECONDS_TEMPLATE}`,
            TODAY: `Hoy, {TIME}${SECONDS_TEMPLATE}`,
            TOMORROW: `Mañana, {TIME}${SECONDS_TEMPLATE}`,
            AFTER_TOMORROW: `{CURRENT_YEAR, select, yes{{DATE}, {TIME}} other{{DATE} de {YEAR}, {TIME}}}${SECONDS_TEMPLATE}`
        }
    },
    absoluteTemplates: {
        short: {
            DATE: '{CURRENT_YEAR, select, yes{{SHORT_DATE}} other{{SHORT_DATE} {YEAR}}}',
            DATETIME: `{
                CURRENT_YEAR,
                select,
                    yes{{SHORT_DATE}, {TIME}}
                    other{{SHORT_DATE} {YEAR}, {TIME}}
            }${SECONDS_TEMPLATE}`
        },
        long: {
            DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{DATE} de {YEAR}}}',
            DATETIME: `{
                CURRENT_YEAR,
                select,
                    yes{{DATE}, {TIME}}
                    other{{DATE} de {YEAR}, {TIME}}
            }${SECONDS_TEMPLATE}`
        }
    },
    rangeTemplates: {
        closedRange: {
            short: {
                START_DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{DAY}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{SHORT_DATE}}
                                other{{SHORT_DATE} {YEAR}}
                        }}
                }`,
                END_DATE: `{
                    CURRENT_YEAR,
                    select,
                        yes{{SHORT_DATE}}
                        other{{SHORT_DATE} {YEAR}}
                }`,
                DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{START_DATE}{DASH}{END_DATE}}
                        other{{START_DATE}{LONG_DASH}{END_DATE}}
                }`,

                START_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{SHORT_DATE}, {TIME}}
                        other{{SHORT_DATE} {YEAR}, {TIME}}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{TIME}${SECONDS_TEMPLATE}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{SHORT_DATE}, {TIME}}
                                other{{SHORT_DATE} {YEAR}, {TIME}}
                        }${SECONDS_TEMPLATE}}
                }`,
                DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{START_DATETIME}{DASH}{END_DATETIME}}
                        other{{START_DATETIME}{LONG_DASH}{END_DATETIME}}
                }`
            },
            middle: {
                START_DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{DAY}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}}
                                other{{DATE} de {YEAR}}
                        }}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{DATE} de {YEAR}}}',
                DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{START_DATE}{DASH}{END_DATE}}
                        other{{START_DATE}{LONG_DASH}{END_DATE}}
                }`,

                START_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DATE}, {TIME}}
                        other{{DATE} de {YEAR}, {TIME}}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{TIME}${SECONDS_TEMPLATE}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}, {TIME}}
                                other{{DATE} de {YEAR}, {TIME}}
                        }${SECONDS_TEMPLATE}}
                }`,
                DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{START_DATETIME}{DASH}{END_DATETIME}}
                        other{{START_DATETIME}{LONG_DASH}{END_DATETIME}}
                }`
            },
            long: {
                START_DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{DAY}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}}
                                other{{DATE} de {YEAR}}
                        }}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{DATE} de {YEAR}}}',
                DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{START_DATE}{DASH}{END_DATE}}
                        other{{START_DATE}{LONG_DASH}{END_DATE}}
                }`,

                START_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}{NBSP}desde las{NBSP}{TIME}}
                                other{{DATE} de {YEAR}{NBSP}desde las{NBSP}{TIME}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{Desde el{NBSP}{DATE} a las {TIME}}
                                other{Desde el{NBSP}{DATE} de {YEAR} a las {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{hasta las{NBSP}{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{hasta el{NBSP}{DATE} a las {TIME}}
                                other{hasta el{NBSP}{DATE} de {YEAR} a las {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                DATETIME: `{START_DATETIME}{NBSP}{END_DATETIME}`
            }
        },
        openedRange: {
            short: {
                START_DATE: `{
                    CURRENT_YEAR,
                    select,
                        yes{{SHORT_DATE}}
                        other{{SHORT_DATE} de {YEAR}}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{SHORT_DATE}} other{{SHORT_DATE} de {YEAR}}}',
                DATE: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{Desde el{NBSP}{START_DATE}}
                        other{Hasta el{NBSP}{END_DATE}}
                }`,

                START_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{SHORT_DATE}, {TIME}}
                        other{{SHORT_DATE} de {YEAR}, {TIME}}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{SHORT_DATE}, {TIME}}
                        other{{SHORT_DATE} de {YEAR}, {TIME}}
                }${SECONDS_TEMPLATE}`,
                DATETIME: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{Desde el{NBSP}{START_DATETIME}}
                        other{Hasta el{NBSP}{END_DATETIME}}
                }`
            },
            long: {
                START_DATE: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DATE}}
                        other{{DATE} de {YEAR}}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{DATE} de {YEAR}}}',
                DATE: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{Desde el{NBSP}{START_DATE}}
                        other{Hasta el{NBSP}{END_DATE}}
                }`,

                START_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DATE}, {TIME}}
                        other{{DATE} de {YEAR}, {TIME}}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DATE}, {TIME}}
                        other{{DATE} de {YEAR}, {TIME}}
                }${SECONDS_TEMPLATE}`,
                DATETIME: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{Desde el{NBSP}{START_DATETIME}}
                        other{Hasta el{NBSP}{END_DATETIME}}
                }`
            }
        }
    },
    durationTemplates: {
        shortest: {
            FULL: '{D}{SHOW_MILLISECONDS, select, yes{:{MILLISECONDS, number, ::integer-width/000}} other {}}',
            ONLY_MINUTES: '{HOURS}:{MINUTES, number, ::integer-width/00}'
        },
        long: {
            SEPARATOR: ', ',
            YEARS: `{years, plural,
                =1 {# año}
                other {# años}
            }`,
            MONTHS: `{months, plural,
                =1 {# mes}
                other {# meses}
            }`,
            WEEKS: `{weeks, plural,
                =1 {# semana}
                other {# semanas}
            }`,
            DAYS: `{days, plural,
                =1 {# día}
                other {# días}
            }`,
            HOURS: `{hours, plural,
                =1 {# hora}
                other {# horas}
            }`,
            MINUTES: `{minutes, plural,
                =1 {# minuto}
                other {# minutos}
            }`,
            SECONDS: `{seconds, plural,
                =1 {# segundo}
                other {# segundos}
            }`,
            YEARS_FRACTION: `{floorValue, plural,
                =1 {{years, number, ::#,#} año}
                other {{years, number, ::#,#} años}
            }`,
            MONTHS_FRACTION: `{floorValue, plural,
                =1 {{months, number, ::#,#} mes}
                other {{months, number, ::#,#} meses}
            }`
        },
        short: {
            SEPARATOR: ', ',
            YEARS: `{years, plural,
                one {# año}
                other {# años}
            }`,
            MONTHS: `{months, plural,
                =1 {# mes}
                other {# meses}
            }`,
            WEEKS: `{weeks, plural,
                =1 {# semana}
                other {# semanas}
            }`,
            DAYS: `{days} d`,
            HOURS: `{hours} h`,
            MINUTES: `{minutes} min`,
            SECONDS: `{SHOW_MILLISECONDS, select, yes
                {{seconds},{milliseconds, number, ::integer-width/000} s}
                other
                {{seconds} s}
            }`,
            YEARS_FRACTION: `{floorValue, plural,
                =1 {{years, number, ::#,#} año}
                other {{years, number, ::#,#} años}
            }`,
            MONTHS_FRACTION: `{floorValue, plural,
                =1 {{months, number, ::#,#} mes}
                other {{months, number, ::#,#} meses}
            }`
        }
    }
};
