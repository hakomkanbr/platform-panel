import type { Locale, LocaleDirection } from "../types";

/**
 * The canonical, ordered list of supported locales. Centralising this keeps
 * the set of languages in a single place that every part of the platform
 * (detection, loaders, provider, middleware) refers to.
 */
export const SUPPORTED_LOCALES = ["en", "ar", "tr"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** The fallback used when no other source can determine a locale. */
export const DEFAULT_LOCALE: Locale = "en";

/** Name of the cookie used to persist the active UI locale. */
export const LOCALE_COOKIE_NAME = "locale" as const;

/** Locales that render right-to-left. */
export const RTL_LOCALES: ReadonlySet<Locale> = new Set<Locale>(["ar"]);

/**
 * Explicit direction lookup. Kept as a data map so future locales can be added
 * without changing logic (open/closed principle).
 */
export const LOCALE_DIRECTION: Record<Locale, LocaleDirection> = {
  en: "ltr",
  ar: "rtl",
  tr: "ltr",
};

/** Whether a locale should be rendered right-to-left. */
export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.has(locale);
}

/** Resolve the text direction for a given locale. */
export function getDirection(locale: Locale): LocaleDirection {
  return LOCALE_DIRECTION[locale] ?? "ltr";
}

/** Whether a value corresponds to a supported locale. */
export function isSupportedLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}