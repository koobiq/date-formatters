import { DateAdapterConfig } from '@koobiq/date-adapter';

export const zhCN: DateAdapterConfig = {
    name: 'zh-CN',

    variables: {
        SECONDS: 'ss',
        MILLISECONDS: '.SSS',
        MINUTES: 'mm',
        TIME: 'HH:mm',

        DAY: 'D',
        MONTH: 'MMM',
        YEAR: 'YYYY',

        DATE: 'MMMM\u00A0d',
        SHORT_DATE: 'MMM\u00A0d',

        DASH: '\u2013',
        LONG_DASH: '\u202F\u2013\u2009',

        NBSP: '\u00A0'
    },

    dateInput: 'YYYY/MM/DD',

    monthNames: {
        long: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        short: {
            standalone: [
                '1 月',
                '2 月',
                '3 月',
                '4 月',
                '5 月',
                '6 月',
                '7 月',
                '8 月',
                '9 月',
                '10 月',
                '11 月',
                '12 月'
            ],
            formatted: [
                '1 月',
                '2 月',
                '3 月',
                '4 月',
                '5 月',
                '6 月',
                '7 月',
                '8 月',
                '9 月',
                '10 月',
                '11 月',
                '12 月'
            ]
        },
        narrow: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月']
    },

    dayOfWeekNames: {
        long: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        short: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        narrow: ['日', '一', '二', '三', '四', '五', '六']
    },

    firstDayOfWeek: 0
};
