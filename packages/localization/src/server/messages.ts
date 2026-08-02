import type { Locale, Messages } from "../types";
import { DictionaryLoader } from "../dictionary/DictionaryLoader";
import { isRTL } from "../constants/languages";

/**
 * Load the fully resolved dictionary for a locale on the server, keeping the
 * active language isolated from every other locale. Useful for Server
 * Components that render a page directly from resolved messages.
 */
export async function getMessagesForLocale(
  loader: DictionaryLoader,
  locale: Locale,
): Promise<Messages> {
  return loader.load(locale);
}

/**
 * Convenience metadata helper: given a locale, produce the `lang`/`dir`
 * attributes a `<html>` root should carry. Extend with title/description
 * descriptors when SEO requirements arrive.
 */
export function getLocaleHtmlAttributes(locale: Locale): {
  lang: Locale;
  dir: "rtl" | "ltr";
} {
  return {
    lang: locale,
    dir: isRTL(locale) ? "rtl" : "ltr",
  };
}