import { useLocalization } from "../context/localizationContext";
import type { Locale, Messages } from "../types";

/**
 * Read the fully merged dictionary for the active locale, or for a specific
 * locale when one is provided (useful for server-side pre-rendering helpers
 * and comparisons between locales).
 */
export function useDictionary(locale?: Locale): Messages {
  const ctx = useLocalization();
  const target = locale ?? ctx.locale;
  return ctx.dictionaries[target] ?? {};
}

/** Read every loaded locale dictionary (primarily for diagnostics/tests). */
export function useDictionaries(): Partial<Record<Locale, Messages>> {
  return useLocalization().dictionaries;
}