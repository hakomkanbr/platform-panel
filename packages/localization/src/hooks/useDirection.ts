import { useLocalization } from "../context/localizationContext";
import type { LocaleDirection } from "../types";

/**
 * Read the text direction for the active locale. Components should generally
 * not need this — the provider already sets `dir` on the document — but it is
 * exposed for edge cases (thirds, absolute tooltips, placement of icons).
 */
export function useDirection(): LocaleDirection {
  return useLocalization().direction;
}