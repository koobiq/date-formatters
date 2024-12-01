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

export const enUS: FormatterConfig = {
    relativeTemplates: {
        short: {
            BEFORE_YESTERDAY: `{CURRENT_YEAR, select, yes{{SHORT_DATE}, {TIME}} other{{SHORT_DATE}, {YEAR}}}${SECONDS_TEMPLATE}`,
            YESTERDAY: `Yesterday, {TIME}${SECONDS_TEMPLATE}`,
            TODAY: `Today, {TIME}${SECONDS_TEMPLATE}`,
            TOMORROW: `Tomorrow, {TIME}${SECONDS_TEMPLATE}`,
            AFTER_TOMORROW: `{CURRENT_YEAR, select, yes{{SHORT_DATE}, {TIME}} other{{SHORT_DATE}, {YEAR}}}${SECONDS_TEMPLATE}`
        },
        long: {
            BEFORE_YESTERDAY: `{CURRENT_YEAR, select, yes{{DATE}, {TIME}} other{{DATE}, {YEAR}}}${SECONDS_TEMPLATE}`,
            YESTERDAY: `Yesterday, {TIME}${SECONDS_TEMPLATE}`,
            TODAY: `Today, {TIME}${SECONDS_TEMPLATE}`,
            TOMORROW: `Tomorrow, {TIME}${SECONDS_TEMPLATE}`,
            AFTER_TOMORROW: `{CURRENT_YEAR, select, yes{{DATE}, {TIME}} other{{DATE}, {YEAR}}}${SECONDS_TEMPLATE}`
        }
    },
    absoluteTemplates: {
        short: {
            DATE: '{CURRENT_YEAR, select, yes{{SHORT_DATE}} other{{SHORT_DATE}, {YEAR}}}',
            DATETIME: `{
                CURRENT_YEAR,
                select,
                    yes{{SHORT_DATE}, {TIME}}
                    other{{SHORT_DATE}, {YEAR}, {TIME}}
            }${SECONDS_TEMPLATE}`
        },
        long: {
            DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{DATE}, {YEAR}}}',
            DATETIME: `{
                CURRENT_YEAR,
                select,
                    yes{{DATE}, {TIME}}
                    other{{DATE}, {YEAR}, {TIME}}
            }${SECONDS_TEMPLATE}`
        }
    },
    rangeTemplates: {
        closedRange: {
            short: {
                START_DATE: '{CURRENT_YEAR, select, yes{{SHORT_DATE}} other{{SHORT_DATE}, {YEAR}}}',
                END_DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{DAY}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{SHORT_DATE}}
                                other{{SHORT_DATE}, {YEAR}}
                        }}
                }`,
                DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{START_DATE}{DASH}{END_DATE}}
                        other{{START_DATE}{LONG_DASH}{END_DATE}}
                }`,

                START_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{SHORT_DATE}, {TIME}}
                                other{{SHORT_DATE}, {YEAR}, {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{
                            CURRENT_YEAR,
                            select,
                                yes{{TIME}${SECONDS_TEMPLATE}, {SHORT_DATE}}
                                other{{TIME}${SECONDS_TEMPLATE}, {SHORT_DATE}, {YEAR}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{SHORT_DATE}, {TIME}}
                                other{{SHORT_DATE}, {YEAR}, {TIME}}
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
                                other{{DATE}, {YEAR}}
                        }}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{DATE}, {YEAR}}}',
                DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{START_DATE}{DASH}{END_DATE}}
                        other{{START_DATE}{LONG_DASH}{END_DATE}}
                }`,

                START_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}, {TIME}}
                                other{{DATE}, {YEAR}, {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{
                            CURRENT_YEAR,
                            select,
                                yes{{TIME}${SECONDS_TEMPLATE}, {DATE}}
                                other{{TIME}${SECONDS_TEMPLATE}, {DATE}, {YEAR}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}, {TIME}}
                                other{{DATE}, {YEAR}, {TIME}}
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
                START_DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{DATE}, {YEAR}}}',
                END_DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{DAY}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}}
                                other{{DATE}, {YEAR}}
                        }}
                }`,
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
                                yes{{DATE}, from{NBSP}{TIME}}
                                other{{DATE}, {YEAR}, from{NBSP}{TIME}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}, {TIME}}
                                other{{DATE}, {YEAR}, {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{to{NBSP}{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}, {TIME}}
                                other{{DATE}, {YEAR}, {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{START_DATETIME} {END_DATETIME}}
                        other{From {START_DATETIME} to{NBSP}{END_DATETIME}}
                }`
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
                        onlyStart{From{NBSP}{START_DATE}}
                        other{Until{NBSP}{END_DATE}}
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
                        onlyStart{From{NBSP}{START_DATETIME}}
                        other{Until{NBSP}{END_DATETIME}}
                }`
            },
            long: {
                START_DATE: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DATE}}
                        other{{DATE} {YEAR}}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{DATE} {YEAR}}}',
                DATE: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{From{NBSP}{START_DATE}}
                        other{Until{NBSP}{END_DATE}}
                }`,

                START_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DATE}, {TIME}}
                        other{{DATE} {YEAR}, {TIME}}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DATE}, {TIME}}
                        other{{DATE} {YEAR}, {TIME}}
                }${SECONDS_TEMPLATE}`,
                DATETIME: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{From{NBSP}{START_DATETIME}}
                        other{Until{NBSP}{END_DATETIME}}
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
            SEPARATOR: ' ',
            YEARS: `{years, plural,
                =1 {# year}
                other {# years}
            }`,
            MONTHS: `{months, plural,
                =1 {# month}
                other {# months}
            }`,
            WEEKS: `{weeks, plural,
                =1 {# week}
                other {# weeks}
            }`,
            DAYS: `{days, plural,
                =1 {# day}
                other {# days}
            }`,
            HOURS: `{hours, plural,
                =1 {# hour}
                other {# hours}
            }`,
            MINUTES: `{minutes, plural,
                =1 {# minute}
                other {# minutes}
            }`,
            SECONDS: `{seconds, plural,
                =1 {# second}
                other {# seconds}
            }`,
            YEARS_FRACTION: `{years} years`,
            MONTHS_FRACTION: `{months} months`
        },
        short: {
            SEPARATOR: ' ',
            YEARS: `{years} y`,
            MONTHS: `{months} mo`,
            WEEKS: `{weeks} w`,
            DAYS: `{days} d`,
            HOURS: `{hours} h`,
            MINUTES: `{minutes} min`,
            SECONDS: `{SHOW_MILLISECONDS, select, yes
                {{seconds}.{milliseconds, number, ::integer-width/000} s}
                other
                {{seconds} s}
            }`,
            YEARS_FRACTION: '{years} y',
            MONTHS_FRACTION: '{months} mo'
        }
    }
};