import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "../constants/languages";
import type { Locale } from "../types";
import { normalizeLocale, pickLocale } from "../dictionary/languageDetector";

export interface ServerLocaleRequest {
  /** Cookie bag (e.g. from `next/headers` cookies().getAll()). */
  cookies?: Iterable<{ name: string; value: string }>;
  /** Headers bag, including `accept-language`. */
  headers?: Iterable<{ name: string; value: string }>;
}

/**
 * Resolve the effective locale on the server from persisted cookies and the
 * request's `Accept-Language` header. Designed to be framework agnostic; pass
 * the contents of `cookies()` / `headers()` from Next into it.
 *
 * Priority: URL (future) -> cookie -> user -> browser -> default.
 */
export async function resolveServerLocale(
  request: ServerLocaleRequest,
  options: { defaultLocale?: Locale } = {},
): Promise<Locale> {
  const cookies = new Map<string, string>();
  for (const cookie of (request.cookies ?? []) as any) {
    cookies.set(cookie.name, cookie.value);
  }

  let browserLang: string | undefined;
  for (const header of (request.headers ?? []) as any) {
    if (header.name.toLowerCase() === "accept-language") {
      browserLang = header.value.split(",")[0]?.trim();
      break;
    }
  }

  return pickLocale({
    cookieLocale: cookies.get(LOCALE_COOKIE_NAME) ?? null,
    browserLocales: browserLang ? [browserLang] : null,
    defaultLocale: options.defaultLocale ?? DEFAULT_LOCALE,
  });
}

/** Normalize an arbitrary value into a supported locale (or the default). */
export function safeLocale(
  value: unknown,
  fallback: Locale = DEFAULT_LOCALE,
): Locale {
  const normalized = normalizeLocale(
    typeof value === "string" ? value : null,
  );
  return normalized ?? fallback;
}
