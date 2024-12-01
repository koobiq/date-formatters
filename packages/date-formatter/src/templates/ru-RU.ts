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

export const ruRU: FormatterConfig = {
    relativeTemplates: {
        short: {
            BEFORE_YESTERDAY: `{CURRENT_YEAR, select, yes{{SHORT_DATE}, {TIME}} other{{SHORT_DATE} {YEAR}}}${SECONDS_TEMPLATE}`,
            YESTERDAY: `Вчера, {TIME}${SECONDS_TEMPLATE}`,
            TODAY: `Сегодня, {TIME}${SECONDS_TEMPLATE}`,
            TOMORROW: `Завтра, {TIME}${SECONDS_TEMPLATE}`,
            AFTER_TOMORROW: `{CURRENT_YEAR, select, yes{{SHORT_DATE}, {TIME}} other{{SHORT_DATE} {YEAR}}}${SECONDS_TEMPLATE}`
        },
        long: {
            BEFORE_YESTERDAY: `{CURRENT_YEAR, select, yes{{DATE}, {TIME}} other{{DATE} {YEAR}}}${SECONDS_TEMPLATE}`,
            YESTERDAY: `Вчера, {TIME}${SECONDS_TEMPLATE}`,
            TODAY: `Сегодня, {TIME}${SECONDS_TEMPLATE}`,
            TOMORROW: `Завтра, {TIME}${SECONDS_TEMPLATE}`,
            AFTER_TOMORROW: `{CURRENT_YEAR, select, yes{{DATE}, {TIME}} other{{DATE} {YEAR}}}${SECONDS_TEMPLATE}`
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
            DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{DATE} {YEAR}}}',
            DATETIME: `{
                CURRENT_YEAR,
                select,
                    yes{{DATE}, {TIME}}
                    other{{DATE} {YEAR}, {TIME}}
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
                END_DATE: '{CURRENT_YEAR, select, yes{{SHORT_DATE}} other{{SHORT_DATE} {YEAR}}}',
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
                                other{{SHORT_DATE} {YEAR}, {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{
                            CURRENT_YEAR,
                            select,
                                yes{{TIME}${SECONDS_TEMPLATE}, {SHORT_DATE}}
                                other{{TIME}${SECONDS_TEMPLATE}, {SHORT_DATE} {YEAR}}
                        }}
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
                                other{{DATE} {YEAR}}
                        }}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{DATE} {YEAR}}}',
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
                                other{{DATE} {YEAR}, {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{
                            CURRENT_YEAR,
                            select,
                                yes{{TIME}${SECONDS_TEMPLATE}, {DATE}}
                                other{{TIME}${SECONDS_TEMPLATE}, {DATE} {YEAR}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}, {TIME}}
                                other{{DATE} {YEAR}, {TIME}}
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
                                other{{DATE} {YEAR}}
                        }}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{DATE} {YEAR}}}',
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
                                yes{{DATE}, с{NBSP}{TIME}}
                                other{{DATE} {YEAR}, с{NBSP}{TIME}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}, {TIME}}
                                other{{DATE} {YEAR}, {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{по{NBSP}{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}, {TIME}}
                                other{{DATE} {YEAR}, {TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{START_DATETIME} {END_DATETIME}}
                        other{С{NBSP}{START_DATETIME} по{NBSP}{END_DATETIME}}
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
                        onlyStart{С{NBSP}{START_DATE}}
                        other{По{NBSP}{END_DATE}}
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
                        onlyStart{С{NBSP}{START_DATETIME}}
                        other{По{NBSP}{END_DATETIME}}
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
                        onlyStart{С{NBSP}{START_DATE}}
                        other{По{NBSP}{END_DATE}}
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
                        onlyStart{С{NBSP}{START_DATETIME}}
                        other{По{NBSP}{END_DATETIME}}
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
            SEPARATOR: ' и ',
            YEARS: `{years, plural,
                one {# год}
                few {# года}
                many {# лет}
                other {}
            }`,
            MONTHS: `{months, plural,
                one {# месяц}
                few {# месяца}
                many {# месяцев}
                other {}
            }`,
            WEEKS: `{weeks, plural,
                one {# неделя}
                few {# недели}
                many {# недель}
                other {}
            }`,
            DAYS: `{days, plural,
                one {# день}
                few {# дня}
                many {# дней}
                other {}
            }`,
            HOURS: `{hours, plural,
                one {# час}
                few {# часа}
                many {# часов}
                other {}
            }`,
            MINUTES: `{minutes, plural,
                one {# минута}
                few {# минуты}
                many {# минут}
                other {}
            }`,
            SECONDS: `{seconds, plural,
                one {# секунда}
                few {# секунды}
                many {# секунд}
                other {}
            }`,
            YEARS_FRACTION: `{floorValue, plural,
                =1 {{years, number, ::#,#} года}
                one {{years, number, ::#,#} год}
                few {{years, number, ::#,#} года}
                other {{years, number, ::#,#} лет}
            }`,
            MONTHS_FRACTION: `{floorValue, plural,
                =1 {{months, number, ::#,#} месяца}
                one {{months, number, ::#,#} месяц}
                few {{months, number, ::#,#} месяца}
                other {{months, number, ::#,#} месяцев}
            }`
        },
        short: {
            SEPARATOR: ' ',
            YEARS: `{years, plural,
                one {# г}
                few {# г}
                many {# л}
                other {}
            }`,
            MONTHS: `{months} мес`,
            WEEKS: `{weeks} нед`,
            DAYS: `{days} д`,
            HOURS: `{hours} ч`,
            MINUTES: `{minutes} мин`,
            SECONDS: `{SHOW_MILLISECONDS, select, yes
                {{seconds},{milliseconds, number, ::integer-width/000} с}
                other
                {{seconds} с}
            }`,
            YEARS_FRACTION: `{floorValue, plural,
                one {{years, number, ::#,#} г}
                few {{years, number, ::#,#} г}
                other {{years, number, ::#,#} л}
            }`,
            MONTHS_FRACTION: `{floorValue, plural,
                =1 {{months, number, ::#,#} мес}
                other {{months, number, ::#,#} мес}
            }`
        }
    }
};
