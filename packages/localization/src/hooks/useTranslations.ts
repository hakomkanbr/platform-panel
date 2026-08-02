import { useLocalization } from "../context/localizationContext";
import { useTranslator } from "./useTranslator";
import type { Messages, Translator } from "../types";

/**
 * Primary translation hook. Returns a `t` function bound to the active
 * locale's merged dictionary.
 *
 * @example
 * const t = useTranslations();
 * t("common.save"); // => "Save" (falls back to the key when missing)
 */
export function useTranslations(): Translator {
  const { locale, dictionaries } = useLocalization();
  const dictionary: Messages | undefined = dictionaries[locale];
  return useTranslator(dictionary);
}