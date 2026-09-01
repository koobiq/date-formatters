import { DateAdapterConfig } from '@koobiq/date-adapter';

export const esLA: DateAdapterConfig = {
    name: 'es-LA',

    variables: {
        SECONDS: 'ss',
        MILLISECONDS: ':SSS',
        MICROSECONDS: ':SSSSSS',
        MINUTES: 'mm',
        TIME: 'HH:mm',

        DAY: 'D',
        MONTH: 'MMM',
        YEAR: 'YYYY',

        DATE: 'D\u00A0[de]\u00A0MMMM',
        SHORT_DATE: 'D\u00A0MMM',

        DASH: '\u2013',
        LONG_DASH: '\u202F\u2013\u2009',

        NBSP: '\u00A0'
    },

    dateInput: 'DD/MM/YYYY',

    monthNames: {
        long: [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre'
        ],
        short: {
            standalone: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
            formatted: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic']
        },
        narrow: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
    },

    dayOfWeekNames: {
        long: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        short: ['Su', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
        narrow: ['D', 'L', 'M', 'X', 'J', 'V', 'S']
    },

    firstDayOfWeek: 0
};
