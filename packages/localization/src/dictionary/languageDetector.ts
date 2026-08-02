import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../constants/languages";
import type { Locale } from "../types";

/**
 * Normalise a raw candidate (e.g. "en-US", "ar_EG", "en") to the base locale
 * code used by the platform ("en", "ar", "tr"). Returns null when it does not
 * map to a supported locale.
 */
export function normalizeLocale(
  candidate: string | null | undefined,
): Locale | null {
  if (!candidate) {
    return null;
  }

  // Accept "en-US", "en_US", "en" etc. and stop at the first region tag.
  const base = candidate
    .toLowerCase()
    .split(/[-_]/)[0]
    ?.trim();

  if (base && (SUPPORTED_LOCALES as readonly string[]).includes(base)) {
    return base as Locale;
  }

  return null;
}

export interface LocaleDetectionInput {
  /** Future: locale derived from the URL segment. */
  urlLocale?: string | null;
  /** Locale stored in a cookie. */
  cookieLocale?: string | null;
  /** Locale read from the logged-in user profile. */
  userLocale?: string | null;
  /** Ordered list of the client's accepted languages. */
  browserLocales?: readonly string[] | null;
  /** Fallback used when nothing can be inferred. */
  defaultLocale?: Locale;
}

/**
 * Resolve the active locale using the documented priority order:
 *
*   1. URL locale (future)
 *   2. Cookie
 *   3. Logged-in user preference
 *   4. Browser language
 *   5. Default language
 */
export function pickLocale(input: LocaleDetectionInput): Locale {
  const configured = input.defaultLocale ?? DEFAULT_LOCALE;

  const candidates = [
    normalizeLocale(input.urlLocale ?? null),
    normalizeLocale(input.cookieLocale ?? null),
    normalizeLocale(input.userLocale ?? null),
    ...(input.browserLocales ?? [])
      .map((lang) => normalizeLocale(lang))
      .filter((locale): locale is Locale => locale !== null),
  ];

  for (const locale of candidates) {
    if (locale) {
      return locale;
    }
  }

  return configured;
}