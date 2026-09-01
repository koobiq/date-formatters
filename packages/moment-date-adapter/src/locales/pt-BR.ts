import { DateAdapterConfig } from '@koobiq/date-adapter';

export const ptBR: DateAdapterConfig = {
    name: 'pt-BR',

    variables: {
        SECONDS: 'ss',
        MILLISECONDS: ',SSS',
        MINUTES: 'mm',
        TIME: 'HH:mm',

        DAY: 'd',
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
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro'
        ],
        short: {
            standalone: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            formatted: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
    },

    dayOfWeekNames: {
        long: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        short: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        narrow: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
    },

    firstDayOfWeek: 0
};
