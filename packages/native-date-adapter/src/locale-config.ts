import { DateAdapterConfig } from '@koobiq/date-adapter';

/**
 * Locale config used by {@see NativeDateAdapter}.
 *
 * The adapter renders dates from this config only, without touching `Intl`, so the output is identical
 * in every runtime. That requires one extra array the shared `DateAdapterConfig` does not carry: the long
 * month names in the form they take inside a formatted date, which differs from the standalone form in
 * several locales (`Март` standalone vs `марта` inside `16 марта 2025`).
 */
export interface NativeDateAdapterConfig extends DateAdapterConfig {
    monthNames: DateAdapterConfig['monthNames'] & {
        /** Long month names as used inside a formatted date. Rendered by the `MMMM` token. */
        longFormatted: string[];
    };
}
