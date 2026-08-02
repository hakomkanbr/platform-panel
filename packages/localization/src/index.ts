// Public API of @repo/localization.
//
// Applications should only ever consume this entrypoint (or one of the
// subpath exports below). No application imports a third-party i18n library
// directly: this package is the single source of truth for translations.

// Constants
export {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_DIRECTION,
  RTL_LOCALES,
  SUPPORTED_LOCALES,
  getDirection,
  isRTL,
  isSupportedLocale,
} from "./constants/languages";
export type { SupportedLocale } from "./constants/languages";

// Types
export type {
  Dictionary,
  GlobalSchema,
  GlobalTranslationKey,
  LocalizationState,
  Locale,
  LocaleDictionaryMap,
  LocaleDirection,
  MessageLeaf,
  Messages,
  PartialLocaleDictionaryMap,
  TranslationKey,
  Translator,
  UserLanguagePreference,
} from "./types";

// Context + provider
export { LocalizationProvider } from "./provider/LocalizationProvider";
export type { LocalizationProviderProps } from "./provider/LocalizationProvider";
export {
  LocalizationContext,
  useLocalization,
} from "./context/localizationContext";
export type { LocalizationContextValue } from "./context/localizationContext";

// Hooks
export { useTranslations } from "./hooks/useTranslations";
export { useLocale } from "./hooks/useLocale";
export { useDirection } from "./hooks/useDirection";
export { useDictionary, useDictionaries } from "./hooks/useDictionary";
export { useTranslator } from "./hooks/useTranslator";

// Dictionary utilities
export { DictionaryLoader } from "./dictionary/DictionaryLoader";
export type {
  DictionaryLoaderOptions,
  LocaleLoader,
} from "./dictionary/DictionaryLoader";
export { mergeMessages } from "./dictionary/mergeTranslations";
export {
  normalizeLocale,
  pickLocale,
} from "./dictionary/languageDetector";
export type { LocaleDetectionInput } from "./dictionary/languageDetector";
export { lookup, hasMessage, isFilledMessage } from "./core/lookup";

// Server (Server Components / SEO)
export { resolveServerLocale, safeLocale } from "./server/locale";
export type { ServerLocaleRequest } from "./server/locale";
export { getMessagesForLocale, getLocaleHtmlAttributes } from "./server/messages";

// Middleware
export {
  detectLocaleFromUrl,
  localeForPath,
  localeUrlPath,
  pathHasLocale,
} from "./middleware/localizedRouting";

// Global dictionaries
export { GLOBAL_DICTIONARIES, getGlobalDictionary } from "./dictionary/globalDictionary";

// Locale switcher control
export { LocaleSwitcher, LOCALE_LABELS } from "./components/LocaleSwitcher";

// Persisted preference (cookie-backed)
export { createCookieLanguagePreference } from "./prefs/cookieLanguagePreference";

// Type augmentation for consumers of placeholder interpolation
export type { TranslateValues } from "./types";