import { DateAdapterConfig } from '@koobiq/date-adapter';

export const tkTM: DateAdapterConfig = {
    name: 'tk-TM',

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
            'Ýanwar',
            'Fewral',
            'Mart',
            'Aprel',
            'Maý',
            'Iýun',
            'Iýul',
            'Awgust',
            'Sentýabr',
            'Oktýabr',
            'Noýabr',
            'Dekabr'
        ],
        short: {
            standalone: ['ýan', 'few', 'mart', 'apr', 'maý', 'iýun', 'iýul', 'awg', 'sen', 'okt', 'noý', 'dek'],
            formatted: ['ýan', 'few', 'mart', 'apr', 'maý', 'iýun', 'iýul', 'awg', 'sen', 'okt', 'noý', 'dek']
        },
        narrow: ['Ý', 'F', 'M', 'A', 'M', 'I', 'I', 'A', 'S', 'O', 'N', 'D']
    },

    dayOfWeekNames: {
        long: ['Ýekşenbe', 'Duşenbe', 'Sişenbe', 'Çarşenbe', 'Penşenbe', 'Anna', 'Şenbe'],
        short: ['Ýk', 'Dş', 'Sş', 'Çr', 'Pn', 'An', 'Şn'],
        narrow: ['Ý', 'D', 'S', 'Ç', 'P', 'A', 'Ş']
    },

    firstDayOfWeek: 1
};
