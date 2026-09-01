import { DateAdapterConfig } from '@koobiq/date-adapter';

export const faIR: DateAdapterConfig = {
    name: 'fa-IR',

    variables: {
        SECONDS: 'ss',
        MILLISECONDS: '٫SSS',
        MICROSECONDS: '٫SSSSSS',
        MINUTES: 'mm',
        TIME: 'HH:mm',

        DAY: 'D',
        MONTH: 'MMMM',
        YEAR: 'YYYY',

        DATE: 'MMMM\u00A0D',
        SHORT_DATE: 'MMM\u00A0D',

        DASH: '\u2013',
        LONG_DASH: '\u202F\u2013\u2009',

        NBSP: '\u00A0'
    },

    dateInput: 'YYYY/MM/DD',

    monthNames: {
        long: ['ژانويه', 'فوريه', 'مارس', 'آوريل', 'مه', 'ژوئن', 'ژوئنه', 'اوت', 'سپتامبر', 'أكتبر', 'اكتبر', 'دسامبر'],
        short: {
            standalone: ['ژان', 'فو', 'ما', 'اپر', 'مه', 'ژون', 'ژول', 'اوت', 'سپ', 'اک', 'نو', 'دس'],
            formatted: ['ژان', 'فو', 'ما', 'اپر', 'مه', 'ژون', 'ژول', 'اوت', 'سپ', 'اک', 'نو', 'دس']
        },
        narrow: ['ژان', 'فو', 'ما', 'اپر', 'مه', 'ژون', 'ژول', 'اوت', 'سپ', 'اک', 'نو', 'دس']
    },

    dayOfWeekNames: {
        long: ['یک‌شنبه', 'دو‌شنبه', 'سه‌شنبه', 'چهار‌شنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'],
        short: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
        narrow: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش']
    },

    firstDayOfWeek: 0
};
