import { FormatterConfig } from '../formatter';

const SECONDS_TEMPLATE = `{
    SHOW_MILLISECONDS,
    select,
        yes{{MILLISECONDS}{SECONDS}:}
        other{{
            SHOW_SECONDS,
            select,
                yes{{SECONDS}:}
                other{}
        }}
}`;

export const faIR: FormatterConfig = {
    relativeTemplates: {
        short: {
            BEFORE_YESTERDAY: `{
                CURRENT_YEAR,
                select,
                    yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                    other{{DAY}{NBSP}{MONTH}${SECONDS_TEMPLATE}، {YEAR}}
            }`,
            YESTERDAY: `دیروز، ${SECONDS_TEMPLATE}{TIME}`,
            TODAY: `امروز، ${SECONDS_TEMPLATE}{TIME}`,
            TOMORROW: `فردا، ${SECONDS_TEMPLATE}{TIME}`,
            AFTER_TOMORROW: `{
                CURRENT_YEAR,
                select,
                    yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                    other{{DAY}{NBSP}{MONTH}${SECONDS_TEMPLATE}، {YEAR}}
            }`
        },
        long: {
            BEFORE_YESTERDAY: `{
                CURRENT_YEAR,
                select,
                    yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                    other{{DAY}{NBSP}{MONTH}${SECONDS_TEMPLATE}، {YEAR}}
            }`,
            YESTERDAY: `دیروز، ${SECONDS_TEMPLATE}{TIME}`,
            TODAY: `امروز، ${SECONDS_TEMPLATE}{TIME}`,
            TOMORROW: `فردا، ${SECONDS_TEMPLATE}{TIME}`,
            AFTER_TOMORROW: `{
                CURRENT_YEAR,
                select,
                    yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                    other{{DAY}{NBSP}{MONTH}${SECONDS_TEMPLATE}، {YEAR}}
            }`
        }
    },
    absoluteTemplates: {
        short: {
            DATE: '{CURRENT_YEAR, select, yes{{DAY}{NBSP}{MONTH}} other{{DAY}{NBSP}{MONTH} {YEAR}}}',
            DATETIME: `{
                CURRENT_YEAR,
                select,
                    yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                    other{{DAY}{NBSP}{MONTH} {YEAR}، ${SECONDS_TEMPLATE}{TIME}}
            }`
        },
        long: {
            DATE: '{CURRENT_YEAR, select, yes{{DAY}{NBSP}{MONTH}} other{{DAY}{NBSP}{MONTH} {YEAR}}}',
            DATETIME: `{
                CURRENT_YEAR,
                select,
                    yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                    other{{DAY}{NBSP}{MONTH} {YEAR}، ${SECONDS_TEMPLATE}{TIME}}
            }`
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
                                yes{{DAY}{NBSP}{MONTH}}
                                other{{DAY}{NBSP}{MONTH} {YEAR}}
                        }}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DAY}{NBSP}{MONTH}} other{{DAY}{NBSP}{MONTH} {YEAR}}}',
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
                                yes{${SECONDS_TEMPLATE}{TIME}، {DAY}{NBSP}{MONTH}}
                                other{${SECONDS_TEMPLATE}{TIME}، {DAY}{NBSP}{MONTH} {YEAR}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                                other{{DAY}{NBSP}{MONTH} {YEAR}، ${SECONDS_TEMPLATE}{TIME}}
                        }}
                }`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{${SECONDS_TEMPLATE}{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                                other{{DAY}{NBSP}{MONTH} {YEAR}، ${SECONDS_TEMPLATE}{TIME}}
                        }}
                }`,
                DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{END_DATETIME}{DASH}{START_DATETIME}}
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
                                yes{{DAY}{NBSP}{MONTH}}
                                other{{DAY}{NBSP}{MONTH} {YEAR}}
                        }}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DAY}{NBSP}{MONTH}} other{{DAY}{NBSP}{MONTH} {YEAR}}}',
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
                                yes{${SECONDS_TEMPLATE}{TIME}، {DAY}{NBSP}{MONTH}}
                                other{${SECONDS_TEMPLATE}{TIME}، {DAY}{NBSP}{MONTH} {YEAR}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                                other{{DAY}{NBSP}{MONTH} {YEAR}، ${SECONDS_TEMPLATE}{TIME}}
                        }}
                }`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{${SECONDS_TEMPLATE}{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                                other{{DAY}{NBSP}{MONTH} {YEAR}، ${SECONDS_TEMPLATE}{TIME}}
                        }}
                }`,
                DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{END_DATETIME}{DASH}{START_DATETIME}}
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
                                yes{{DAY}{NBSP}{MONTH}}
                                other{{DAY}{NBSP}{MONTH} {YEAR}}
                        }}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DAY}{NBSP}{MONTH}} other{{DAY}{NBSP}{MONTH} {YEAR}}}',
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
                                yes{{DAY}{NBSP}{MONTH}، از ${SECONDS_TEMPLATE}{TIME}}
                                other{{DAY}{NBSP}{MONTH}{NBSP}{YEAR}، از ${SECONDS_TEMPLATE}{TIME}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                                other{{DAY}{NBSP}{MONTH}{NBSP}{YEAR}، ${SECONDS_TEMPLATE}{TIME}}
                        }}
                }`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{تا ${SECONDS_TEMPLATE}{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DAY}{NBSP}{MONTH}، ${SECONDS_TEMPLATE}{TIME}}
                                other{{DAY}{NBSP}{MONTH}{NBSP}{YEAR}، ${SECONDS_TEMPLATE}{TIME}}
                        }}
                }`,
                DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{START_DATETIME} {END_DATETIME}}
                        other{از {START_DATETIME}{NBSP}تا {END_DATETIME}}
                }`
            }
        },
        openedRange: {
            short: {
                START_DATE: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DAY}{NBSP}{MONTH}}
                        other{{DAY}{NBSP}{MONTH} {YEAR}}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DAY}{NBSP}{MONTH}} other{{DAY}{NBSP}{MONTH} {YEAR}}}',
                DATE: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{از{NBSP}{START_DATE}}
                        other{تا{NBSP}{END_DATE}}
                }`,

                START_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DAY}{NBSP}{MONTH} ${SECONDS_TEMPLATE}{TIME}}
                        other{{DAY}{NBSP}{MONTH} {YEAR}، ${SECONDS_TEMPLATE}{TIME}}
                }`,
                END_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DAY}{NBSP}{MONTH} ${SECONDS_TEMPLATE}{TIME}}
                        other{{DAY}{NBSP}{MONTH} {YEAR}، ${SECONDS_TEMPLATE}{TIME}}
                }`,
                DATETIME: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{از{NBSP}{START_DATETIME}}
                        other{تا{NBSP}{END_DATETIME}}
                }`
            },
            long: {
                START_DATE: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DAY}{NBSP}{MONTH}}
                        other{{DAY}{NBSP}{MONTH} {YEAR}}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DAY}{NBSP}{MONTH}} other{{DAY}{NBSP}{MONTH} {YEAR}}}',
                DATE: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{از{NBSP}{START_DATE}}
                        other{تا{NBSP}{END_DATE}}
                }`,

                START_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DAY}{NBSP}{MONTH} ${SECONDS_TEMPLATE}{TIME}}
                        other{{DAY}{NBSP}{MONTH} {YEAR}، ${SECONDS_TEMPLATE}{TIME}}
                }`,
                END_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DAY}{NBSP}{MONTH} ${SECONDS_TEMPLATE}{TIME}}
                        other{{DAY}{NBSP}{MONTH} {YEAR}، ${SECONDS_TEMPLATE}{TIME}}
                }`,
                DATETIME: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{از{NBSP}{START_DATETIME}}
                        other{تا{NBSP}{END_DATETIME}}
                }`
            }
        }
    },
    durationTemplates: {
        shortest: {
            FULL: '{D}{SHOW_MILLISECONDS, select, yes{{MILLISECONDS, number, ::integer-width/000}٫} other {}}',
            ONLY_MINUTES: '{HOURS, number}:{MINUTES, number, integer}'
        },
        long: {
            SEPARATOR: ' و ',
            YEARS: `{years, plural,
                =1 {سال #}
                other {سالها #}
            }`,
            MONTHS: `{months, plural,
                =1 {ماه #}
                other {ماه ها #}
            }`,
            WEEKS: `{weeks, plural,
                =1 {هفته #}
                other {هفته ها #}
            }`,
            DAYS: `{days, plural,
                =1 {روز #}
                other {روزها #}
            }`,
            HOURS: `ساعت {hours, number, integer}`,
            MINUTES: `ساعت {minutes, number, integer} `,
            SECONDS: `{seconds, plural,
                =1 {# ثانیه}
                other {ثانیه ها #}
            }`,
            YEARS_FRACTION: `{floorValue, plural,
                =1 {سال {years, number, ::# و #}}
                other {سالها {years, number, ::# و #}}
            }`,
            MONTHS_FRACTION: `{floorValue, plural,
                =1 {ماه {months, number, ::# و #}}
                other {ماه ها {months, number, ::# و #}}
            }`
        },
        short: {
            SEPARATOR: ' و ',
            YEARS: `{years, plural,
                =1 {سال #}
                other {سالها #}
            }`,
            MONTHS: `{months, plural,
                =1 {ماه #}
                other {ماه ها #}
            }`,
            WEEKS: `{weeks, plural,
                =1 {هفته #}
                other {هفته ها #}
            }`,
            DAYS: `{days, plural,
                =1 {روز #}
                other {روزها #}
            }`,
            HOURS: `ساعت {hours, number, integer}`,
            MINUTES: `ساعت {minutes, number, integer} `,
            SECONDS: `{SHOW_MILLISECONDS, select, yes
                {{milliseconds, number, ::integer-width/000}٫{seconds, number, integer} ثانیه}
                other
                {{seconds, number, integer} ثانیه}
            }`,
            YEARS_FRACTION: `{floorValue, plural,
                =1 {سال {years, number, ::# و #}}
                other {سالها {years, number, ::# و #}}
            }`,
            MONTHS_FRACTION: `{floorValue, plural,
                =1 {ماه {months, number, ::# و #}}
                other {ماه ها {months, number, ::# و #}}
            }`
        }
    }
};
