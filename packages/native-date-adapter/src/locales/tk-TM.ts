import { NativeDateAdapterConfig } from '../locale-config';

export const tkTM: NativeDateAdapterConfig = {
    name: 'tk-TM',

    variables: {
        SECONDS: 'ss',
        MILLISECONDS: ',SSS',
        MINUTES: 'mm',
        TIME: 'HH:mm',

        DAY: 'd',
        MONTH: 'MMM',
        YEAR: 'yyyy',

        DATE: 'MMMM\u00A0d',
        SHORT_DATE: 'MMM\u00A0d',

        DASH: '\u2013',
        LONG_DASH: '\u202F\u2014\u2009',

        NBSP: '\u00A0'
    },

    dateInput: 'dd.MM.yyyy',

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
        longFormatted: [
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
            formatted: ['Ýan', 'Few', 'Mart', 'Apr', 'Maý', 'Iýun', 'Iýul', 'Awg', 'Sen', 'Okt', 'Noý', 'Dek']
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
