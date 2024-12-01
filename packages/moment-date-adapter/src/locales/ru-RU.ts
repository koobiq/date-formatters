import { DateAdapterConfig } from '@koobiq/date-adapter';

export const ruRU: DateAdapterConfig = {
    name: 'ru-RU',

    variables: {
        SECONDS: 'ss',
        MILLISECONDS: ',SSS',
        MICROSECONDS: ',SSSSSS',
        MINUTES: 'mm',
        TIME: 'HH:mm',

        DAY: 'D',
        MONTH: 'MMM',
        YEAR: 'YYYY',

        DATE: 'D\u00A0MMMM',
        SHORT_DATE: 'D\u00A0MMM',

        DASH: '\u2013',
        LONG_DASH: '\u202F\u2014\u2009',

        NBSP: '\u00A0'
    },

    dateInput: 'DD.MM.YYYY',

    monthNames: {
        long: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ],
        short: {
            standalone: ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сен', 'окт', 'ноя', 'дек'],
            formatted: ['янв', 'фев', 'мар', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек']
        },
        narrow: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д']
    },

    dayOfWeekNames: {
        long: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        short: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        narrow: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С']
    },

    firstDayOfWeek: 1
};
