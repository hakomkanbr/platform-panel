import type { Locale } from "../types";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../constants/languages";
import { normalizeLocale } from "../dictionary/languageDetector";

/**
 * Extract a leading locale segment from a URL path if present:
 * `/en/dashboard` -> `en`. This is the stage-1 URL-locale layout used by
 * future localized routes. Returns null when the first segment is not a locale.
 */
export function detectLocaleFromUrl(pathname: string): Locale | null {
  const segments = pathname.split("/").filter(Boolean);
  return normalizeLocale(segments[0]);
}

/**
 * Rebuild a URL, optionally with a locale prefix. Kept separate from the
 * provider so routes and the provider share a single definition of the URL
 * shape.
 */
export function localeUrlPath(
  pathname: string,
  locale: Locale,
  opts: { prefix?: boolean } = {},
): string {
  const base = detectLocaleFromUrl(pathname);
  const rest = base ? pathname.slice(`/${base}`.length) || "/" : pathname;

  if (!opts.prefix) {
    return rest;
  }
  return `/${locale}${rest === "/" ? "" : rest}`;
}

/** Whether a path starts with a locale segment (for route matching). */
export function pathHasLocale(pathname: string): boolean {
  return detectLocaleFromUrl(pathname) !== null;
}

/** Resolve the effective locale for a path, defaulting when no prefix exists. */
export function localeForPath(
  pathname: string,
  fallback: Locale = DEFAULT_LOCALE,
): Locale {
  return detectLocaleFromUrl(pathname) ?? fallback;
}

export { SUPPORTED_LOCALES };