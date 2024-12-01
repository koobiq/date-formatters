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

export const zhCN: FormatterConfig = {
    relativeTemplates: {
        short: {
            BEFORE_YESTERDAY: `{CURRENT_YEAR, select, yes{{SHORT_DATE} {TIME}} other{{YEAR}  {SHORT_DATE}}}${SECONDS_TEMPLATE}`,
            YESTERDAY: `昨天 {TIME}${SECONDS_TEMPLATE}`,
            TODAY: `今天 {TIME}${SECONDS_TEMPLATE}`,
            TOMORROW: `明天 {TIME}${SECONDS_TEMPLATE}`,
            AFTER_TOMORROW: `{CURRENT_YEAR, select, yes{{SHORT_DATE} {TIME}} other{{YEAR} {SHORT_DATE}}}${SECONDS_TEMPLATE}`
        },
        long: {
            BEFORE_YESTERDAY: `{CURRENT_YEAR, select, yes{{DATE} {TIME}} other{{YEAR} {DATE}}}${SECONDS_TEMPLATE}`,
            YESTERDAY: `昨天 {TIME}${SECONDS_TEMPLATE}`,
            TODAY: `今天 {TIME}${SECONDS_TEMPLATE}`,
            TOMORROW: `明天 {TIME}${SECONDS_TEMPLATE}`,
            AFTER_TOMORROW: `{CURRENT_YEAR, select, yes{{DATE} {TIME}} other{{YEAR} {DATE}}}${SECONDS_TEMPLATE}`
        }
    },
    absoluteTemplates: {
        short: {
            DATE: '{CURRENT_YEAR, select, yes{{SHORT_DATE}} other{{YEAR} {SHORT_DATE}}}',
            DATETIME: `{
                CURRENT_YEAR,
                select,
                    yes{{SHORT_DATE}{NBSP}{TIME}}
                    other{{YEAR}{NBSP}{SHORT_DATE}{NBSP}{TIME}}
            }${SECONDS_TEMPLATE}`
        },
        long: {
            DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{YEAR}{NBSP}{DATE}}}',
            DATETIME: `{
                CURRENT_YEAR,
                select,
                    yes{{DATE}{NBSP}{TIME}}
                    other{{YEAR}{NBSP}{DATE}{NBSP}{TIME}}
            }${SECONDS_TEMPLATE}`
        }
    },
    rangeTemplates: {
        closedRange: {
            short: {
                START_DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{
                            CURRENT_YEAR,
                            select,
                                yes{{MONTH} {DAY}}
                                other{{YEAR} {MONTH} {DAY}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{SHORT_DATE}}
                                other{{YEAR}{SHORT_DATE}}
                        }}
                }`,
                END_DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{DAY}{NBSP}日}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{SHORT_DATE}}
                                other{{YEAR} {SHORT_DATE}}
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
                        yes{{SHORT_DATE}{NBSP}{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{SHORT_DATE}{NBSP}{TIME}}
                                other{{YEAR} {SHORT_DATE}{NBSP}{TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{SHORT_DATE}{NBSP}{TIME}}
                                other{{YEAR} {SHORT_DATE}{NBSP}{TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
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
                        yes{{MONTH} {DAY}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}}
                                other{{YEAR} {DATE}}
                        }}
                }`,
                END_DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{DAY}{NBSP}日}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}}
                                other{{YEAR}{DATE}}
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
                        yes{{DATE}{NBSP}{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}{NBSP}{TIME}}
                                other{{YEAR} {DATE}{NBSP}{TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}{NBSP}{TIME}}
                                other{{YEAR} {DATE}{NBSP}{TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
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
                        yes{{
                            CURRENT_YEAR,
                            select,
                                yes{{MONTH} {DAY}}
                                other{{YEAR} {MONTH} {DAY}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}}
                                other{{YEAR} {DATE}}
                        }}
                }`,
                END_DATE: `{
                    SAME_MONTH,
                    select,
                        yes{{DAY}{NBSP}日}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}}
                                other{{YEAR} {DATE}}
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
                                yes{{DATE}从{NBSP}{TIME}}
                                other{{YEAR} {DATE}从{NBSP}{TIME}}
                        }}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}{NBSP}{TIME}}
                                other{{YEAR} {DATE}{NBSP}{TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{至{NBSP}{TIME}}
                        other{{
                            CURRENT_YEAR,
                            select,
                                yes{{DATE}{NBSP}{TIME}}
                                other{{YEAR} {DATE}{NBSP}{TIME}}
                        }}
                }${SECONDS_TEMPLATE}`,
                DATETIME: `{
                    SAME_DAY,
                    select,
                        yes{{START_DATETIME} {END_DATETIME}}
                        other{从 {START_DATETIME} 至{NBSP}{END_DATETIME}}
                }`
            }
        },
        openedRange: {
            short: {
                START_DATE: `{
                    CURRENT_YEAR,
                    select,
                        yes{{SHORT_DATE}}
                        other{{YEAR} {SHORT_DATE}}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{SHORT_DATE}} other{{YEAR}{NBSP}{SHORT_DATE}}}',
                DATE: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{从{NBSP}{START_DATE}}
                        other{至{NBSP}{END_DATE}}
                }`,

                START_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{SHORT_DATE}{NBSP}{TIME}}
                        other{{YEAR}{NBSP}{SHORT_DATE}{NBSP}{TIME}}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{SHORT_DATE}{NBSP}{TIME}}
                        other{{YEAR}{NBSP}{SHORT_DATE}{NBSP}{TIME}}
                }${SECONDS_TEMPLATE}`,
                DATETIME: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{从{NBSP}{START_DATETIME}}
                        other{至{NBSP}{NBSP}{END_DATETIME}}
                }`
            },
            long: {
                START_DATE: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DATE}}
                        other{{YEAR}{NBSP}{DATE}}
                }`,
                END_DATE: '{CURRENT_YEAR, select, yes{{DATE}} other{{YEAR}{NBSP}{DATE}}}',
                DATE: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{从{NBSP}{START_DATE}}
                        other{至{NBSP}{END_DATE}}
                }`,

                START_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DATE}{NBSP}{TIME}}
                        other{{YEAR}{NBSP}{DATE}{NBSP}{TIME}}
                }${SECONDS_TEMPLATE}`,
                END_DATETIME: `{
                    CURRENT_YEAR,
                    select,
                        yes{{DATE}{NBSP}{TIME}}
                        other{{YEAR}{NBSP}{DATE}{NBSP}{TIME}}
                }${SECONDS_TEMPLATE}`,
                DATETIME: `{
                    RANGE_TYPE,
                    select,
                        onlyStart{从{NBSP}{START_DATETIME}}
                        other{至{NBSP}{END_DATETIME}}
                }`
            }
        }
    },
    durationTemplates: {
        shortest: {
            FULL: '{D}{SHOW_MILLISECONDS, select, yes{.{MILLISECONDS, number, ::integer-width/000}} other {}}',
            ONLY_MINUTES: '{HOURS}:{MINUTES, number, ::integer-width/00}'
        },
        long: {
            SEPARATOR: ' ',
            YEARS: `{years} 年`,
            MONTHS: `{months} 个月`,
            WEEKS: `{weeks} 周`,
            DAYS: `{days} 天`,
            HOURS: `{hours} 小时`,
            MINUTES: `{minutes} 分`,
            SECONDS: `{seconds} 秒`,
            YEARS_FRACTION: `{years} 年`,
            MONTHS_FRACTION: `{months} 个月`
        },
        short: {
            SEPARATOR: ' ',
            YEARS: `{years} 年`,
            MONTHS: `{months} 个月`,
            WEEKS: `{weeks} 周`,
            DAYS: `{days} 天`,
            HOURS: `{hours} 小时`,
            MINUTES: `{minutes} 分`,
            SECONDS: `{SHOW_MILLISECONDS, select, yes
                {{seconds}.{milliseconds, number, ::integer-width/000} 秒}
                other
                {{seconds} 秒}
            }`,
            YEARS_FRACTION: '{years} 年',
            MONTHS_FRACTION: '{months} 个月'
        }
    }
};
