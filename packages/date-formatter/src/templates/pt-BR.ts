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

export const ptBR: FormatterConfig = {
    relativeTemplates: {
        short: {
            BEFORE_YESTERDAY: `{CURRENT_YEAR, select, yes{{SHORT_DATE}, {TIME}} other{{SHORT_DATE} {YEAR}, {TIME}}}${SECONDS_TEMPLATE}`,
            YESTERDAY: `Ontem, {TIME}${SECONDS_TEMPLATE}`,
            TODAY: `Hoje, {TIME}${SECONDS_TEMPLATE}`,
            TOMORROW: `Amanhã, {TIME}${SECONDS_TEMPLATE}`,
            AFTER_TOMORROW: `{CURRENT_YEAR, select, yes{{SHORT_DATE}, {TIME}} other{{SHORT_DATE} {YEAR}, {TIME}}}${SECONDS_TEMPLATE}`
        },
        long: {
            BEFORE_YESTERDAY: `{CURRENT_YEAR, select, yes{{DATE}, {TIME}} other{{DATE} de {YEAR}, {TIME}}}${SECONDS_TEMPLATE}`,
            YESTERDAY: `Ontem, {TIME}${SECONDS_TEMPLATE}`,
            TODAY: `Hoje, {TIME}${SECONDS_TEMPLATE}`,
            TOMORROW: `Amanhã, {TIME}${SECONDS_TEMPLATE}`,
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
                DATE: `{START_DATE}{LONG_DASH}{END_DATE}`,

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
                DATETIME: `{START_DATETIME}{LONG_DASH}{END_DATETIME}`
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
                DATE: `{START_DATE}{LONG_DASH}{END_DATE}`,

                START_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}, {TIME}}
                                other{{DATE} de {YEAR}, {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{
                            CURRENT_YEAR,
                            select,
                                yes{{TIME}${SECONDS_TEMPLATE}, {DATE}}
                                other{{TIME}${SECONDS_TEMPLATE}, {DATE} de {YEAR}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}, {TIME}}
                                other{{DATE} de {YEAR}, {TIME}}
                        }${SECONDS_TEMPLATE}}
                }`,
                DATETIME: `{START_DATETIME}{LONG_DASH}{END_DATETIME}`
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
                DATE: `{START_DATE}{LONG_DASH}{END_DATE}`,

                START_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}, das{NBSP}{TIME}}
                                other{{DATE} de {YEAR}, das{NBSP}{TIME}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{De{NBSP}{DATE}, {TIME}}
                                other{De{NBSP}{DATE} de {YEAR}, {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{às{NBSP}{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{a{NBSP}{DATE}, {TIME}}
                                other{a{NBSP}{DATE} de {YEAR}, {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                DATETIME: `{START_DATETIME} {END_DATETIME}`
            }
        },
        openedRange: {
            short: {
                START_DATE: `{
                    CURRENT_YEAR,
                    select,
                        yes{{SHORT_DATE}}
                        other{{SHORT_DATE} {YEAR}}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{SHORT_DATE}} other{{SHORT_DATE} {YEAR}}}',
                DATE: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{De{NBSP}{START_DATE}}
                        other{A{NBSP}{END_DATE}}
                }`,

                START_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{SHORT_DATE}, {TIME}}
                        other{{SHORT_DATE} {YEAR}, {TIME}}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{SHORT_DATE}, {TIME}}
                        other{{SHORT_DATE} {YEAR}, {TIME}}
                }${SECONDS_TEMPLATE}`,
                DATETIME: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{De{NBSP}{START_DATETIME}}
                        other{A{NBSP}{END_DATETIME}}
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
                        onlyStart{De{NBSP}{START_DATE}}
                        other{A{NBSP}{END_DATE}}
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
                        onlyStart{De{NBSP}{START_DATETIME}}
                        other{A{NBSP}{END_DATETIME}}
                }`
            }
        }
    },
    durationTemplates: {
        shortest: {
            FULL: '{D}{SHOW_MILLISECONDS, select, yes{,{MILLISECONDS, number, ::integer-width/000}} other {}}',
            ONLY_MINUTES: '{HOURS}:{MINUTES, number, ::integer-width/00}'
        },
        long: {
            SEPARATOR: ' e ',
            YEARS: `{years, plural,
                =1 {# ano}
                other {# anos}
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
                =1 {# dia}
                other {# dias}
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
                =1 {{years, number, ::#,#} ano}
                other {{years, number, ::#,#} anos}
            }`,
            MONTHS_FRACTION: `{floorValue, plural,
                =1 {{months, number, ::#,#} mes}
                other {{months, number, ::#,#} meses}
            }`
        },
        short: {
            SEPARATOR: ' e ',
            YEARS: `{years, plural,
                one {# ano}
                other {# anos}
            }`,
            MONTHS: `{months} me`,
            WEEKS: `{weeks} sem`,
            DAYS: `{days} d`,
            HOURS: `{hours} h`,
            MINUTES: `{minutes} min`,
            SECONDS: `{SHOW_MILLISECONDS, select, yes
                {{seconds},{milliseconds, number, ::integer-width/000} seg}
                other
                {{seconds} seg}
            }`,
            YEARS_FRACTION: `{floorValue, plural,
                =1 {{years, number, ::#,#} ano}
                other {{years, number, ::#,#} anos}
            }`,
            MONTHS_FRACTION: `{floorValue, plural,
                =1 {{months, number, ::#,#} me}
                other {{months, number, ::#,#} me}
            }`
        }
    }
};
