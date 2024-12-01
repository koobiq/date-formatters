import { LuxonDateAdapter } from '@koobiq/luxon-date-adapter';
import { DateTime, Settings, SystemZone } from 'luxon';

import { DateFormatter } from './formatter';

describe('DateFormatter', () => {
    const locales = [
        {
            locale: 'en-US',
            secondsText: 's',
            msShortDelimiter: '.',
            msShortestDelimiter: ','
        },
        {
            locale: 'es-LA',
            secondsText: 's',
            msShortDelimiter: ',',
            msShortestDelimiter: ':'
        },
        {
            locale: 'pt-BR',
            secondsText: 'seg',
            msShortDelimiter: ',',
            msShortestDelimiter: ','
        },
        {
            locale: 'ru-RU',
            secondsText: 'с',
            msShortDelimiter: ',',
            msShortestDelimiter: ','
        },
        {
            locale: 'zh-CN',
            secondsText: '秒',
            msShortDelimiter: '.',
            msShortestDelimiter: '.'
        }
    ];

    locales.forEach((data) => {
        describe(`get milliseconds duration with ${data.locale} locale`, () => {
            let formatter: DateFormatter<DateTime>;

            beforeEach(() => {
                formatter = new DateFormatter(new LuxonDateAdapter(data.locale), data.locale);
            });

            it('should short format duration get milliseconds', () => {
                const withMillisecondsResult = formatter.durationShort(
                    DateTime.local(2017, 1, 1, 3, 2, 30, 10),
                    DateTime.local(2017, 1, 1, 3, 2, 30, 40),
                    ['seconds', 'milliseconds']
                );
                const zeroMillisecondsResult = formatter.durationShort(
                    DateTime.local(2017, 1, 1, 3, 2, 30, 0),
                    DateTime.local(2017, 1, 1, 3, 2, 30, 0),
                    ['seconds', 'milliseconds']
                );
                const noMillisecondsResult = formatter.durationShort(
                    DateTime.local(2017, 1, 1, 3, 2, 30, 0),
                    DateTime.local(2017, 1, 1, 3, 2, 30, 0),
                    ['seconds']
                );

                expect(withMillisecondsResult).toBe(`0${data.msShortDelimiter}030 ${data.secondsText}`);
                expect(zeroMillisecondsResult).toBe(`0 ${data.secondsText}`);
                expect(noMillisecondsResult).toBe(`0 ${data.secondsText}`);
            });

            it('should shortest format duration get milliseconds', () => {
                const withMillisecondsResult = formatter.durationShortest(
                    DateTime.local(2017, 1, 1, 3, 2, 30, 10),
                    DateTime.local(2017, 1, 1, 3, 2, 30, 40),
                    true,
                    true
                );
                const zeroMillisecondsResult = formatter.durationShortest(
                    DateTime.local(2017, 1, 1, 3, 2, 30, 0),
                    DateTime.local(2017, 1, 1, 3, 2, 30, 0),
                    true,
                    true
                );
                const noMillisecondsResult = formatter.durationShortest(
                    DateTime.local(2017, 1, 1, 3, 2, 30, 10),
                    DateTime.local(2017, 1, 1, 3, 2, 30, 40),
                    true,
                    false
                );

                expect(withMillisecondsResult).toBe(`0:00${data.msShortestDelimiter}030`);
                expect(zeroMillisecondsResult).toBe(`0:00${data.msShortestDelimiter}000`);
                expect(noMillisecondsResult).toBe('0:00');
            });
        });
    });

    describe('core', () => {
        const defaultLocale = 'en-US';
        let adapter: LuxonDateAdapter;
        let formatter: DateFormatter<DateTime>;

        beforeEach(() => {
            adapter = new LuxonDateAdapter(defaultLocale);
            formatter = new DateFormatter(adapter, defaultLocale);
        })

        afterEach(() => {
            Settings.defaultZone = new SystemZone();
        });

        it('should change locale without reinitialization', () => {
            const date = adapter.createDate(2011, 11, 11);

            expect(formatter.absoluteLongDate(date)).toBe('December 11, 2011');

            formatter.setLocale('ru-RU');

            expect(formatter.absoluteLongDate(date)).toBe('11 декабря 2011');
        });

        it('should return formatted date in the same timezone as initialized', () => {
            Settings.defaultZone = 'UTC+7';
            const date1 = DateTime.fromObject({
                day: 22,
                month: 7,
                year: 2022,
                hour: 12,
                minute: 34,
                second: 22,
                millisecond: 123,
            }).setZone('UTC+3', { keepLocalTime: true });

            expect(date1.toISO()).toMatchSnapshot('ISO 8601-compliant string from Luxon');
            expect(formatter.absoluteLongDateTime(date1)).toMatchSnapshot();
        });
    })
});
