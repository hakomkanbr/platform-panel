export { getMessagesForLocale, getLocaleHtmlAttributes } from "./messages";
export {
  resolveServerLocale,
  safeLocale,
} from "./locale";
export type { ServerLocaleRequest } from "./locale";
export { LOCALE_COOKIE_NAME } from "../constants/languages";

// Future server-side capabilities (pluralization, date/currency formatting,
// relative time, number formatting, SEO metadata, localized routes) will be
// added through this entrypoint without changing existing consumers.
export type { Locale, LocaleDirection, Messages } from "../types";