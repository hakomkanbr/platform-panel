import { useLocalization } from "../context/localizationContext";
import type { Locale } from "../types";

/** Read the currently active locale. */
export function useLocale(): Locale {
  return useLocalization().locale;
}