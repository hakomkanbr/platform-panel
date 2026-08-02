import type { Locale, UserLanguagePreference } from "../types";
import { isSupportedLocale } from "../constants/languages";
import { LOCALE_COOKIE_NAME } from "../constants/languages";

const YEAR_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  for (const part of document.cookie.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) {
      return rest.join("=");
    }
  }
  return undefined;
}

/**
 * A `UserLanguagePreference` backed by a client cookie. SSR-safe: on the
 * server it returns `undefined` so rendering never accesses `document`.
 */
export function createCookieLanguagePreference(
  cookieName: string = LOCALE_COOKIE_NAME,
): UserLanguagePreference {
  return {
    getPreferredLanguage(): Locale | null | undefined {
      const value = readCookie(cookieName);
      return value && isSupportedLocale(value) ? value : undefined;
    },
    setPreferredLanguage(locale: Locale): void {
      if (typeof document === "undefined") {
        return;
      }
      document.cookie = `${cookieName}=${locale}; path=/; max-age=${YEAR_SECONDS}; samesite=lax`;
    },
  };
}