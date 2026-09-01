import { NativeDateAdapterConfig } from '../locale-config';

export const ptBR: NativeDateAdapterConfig = {
    name: 'pt-BR',

    variables: {
        SECONDS: 'ss',
        MILLISECONDS: ',SSS',
        MINUTES: 'mm',
        TIME: 'HH:mm',

        DAY: 'd',
        MONTH: 'MMM',
        YEAR: 'yyyy',

        DATE: "d\u00A0'de'\u00A0MMMM",
        SHORT_DATE: 'd\u00A0MMM',

        DASH: '\u2013',
        LONG_DASH: '\u202F\u2013\u2009',

        NBSP: '\u00A0'
    },

    dateInput: 'dd/MM/yyyy',

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
        longFormatted: [
            'janeiro',
            'fevereiro',
            'março',
            'abril',
            'maio',
            'junho',
            'julho',
            'agosto',
            'setembro',
            'outubro',
            'novembro',
            'dezembro'
        ],
        short: {
            standalone: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            formatted: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
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
