"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LOCALE, getDirection } from "../constants/languages";
import { LocalizationContext } from "../context/localizationContext";
import type {
  Locale,
  Messages,
  PartialLocaleDictionaryMap,
  UserLanguagePreference,
} from "../types";
import { DictionaryLoader } from "../dictionary/DictionaryLoader";
import { mergeMessages } from "../dictionary/mergeTranslations";
import { pickLocale } from "../dictionary/languageDetector";

export interface LocalizationProviderProps {
  /** Controlled active locale. Overrides detection when provided. */
  locale?: Locale;
  /**
   * Uncontrolled initial locale (e.g. resolved from a cookie on the server).
   * Unlike `locale`, the user is still free to change it at runtime.
   */
  initialLocale?: Locale;
  /** Fallback locale used when detection fails. Defaults to `en`. */
  defaultLocale?: Locale;
  /**
   * Synchronously available global dictionaries, keyed by locale (e.g. SSR
   * seeding / the global dictionaries shipped by this package).
   */
  dictionaries?: PartialLocaleDictionaryMap;
  /**
   * Dictionaries contributed by registered applications, keyed by locale.
   * Merged on top of the global `dictionaries`.
   */
  appDictionaries?: PartialLocaleDictionaryMap;
  /** Optional loader used to lazily resolve languages on demand. */
  loader?: DictionaryLoader;
  /** Storage for persisting a user's language choice (optional). */
  preference?: UserLanguagePreference;
  /** Invoked after the active locale changes. */
  onLocaleChange?: (locale: Locale) => void;
  children?: ReactNode;
}

/** Merged dictionary state for a single active locale. */
type DictionariesState = Partial<Record<Locale, Messages>>;

/** Merge global + application dictionaries for one locale. */
function buildForLocale(
  locale: Locale,
  dictionaries?: PartialLocaleDictionaryMap,
  appDictionaries?: PartialLocaleDictionaryMap,
): DictionariesState {
  const result: Partial<Record<Locale, Messages>> = {};
  result[locale] = mergeMessages(
    dictionaries?.[locale] ?? {},
    appDictionaries?.[locale] ?? {},
  );
  return result;
}

function resolveInitialLocale(
  controlled: Locale | undefined,
  initial: Locale | undefined,
  fallback: Locale,
  preference: UserLanguagePreference | undefined,
): Locale {
  if (controlled) {
    return controlled;
  }
  if (initial) {
    return initial;
  }
  return pickLocale({
    userLocale: preference?.getPreferredLanguage() ?? null,
    defaultLocale: fallback,
  });
}

/**
 * Single place that owns the active locale, its merged dictionary and the
 * document `dir` / `lang` attributes.
 *
 * - Automatic RTL: `dir="rtl"` is applied for `ar`, `ltr` otherwise.
 * - Only the active locale's dictionary is materialised.
 * - Applications render localized content; components stay direction-agnostic.
 */
export function LocalizationProvider({
  locale,
  initialLocale,
  defaultLocale,
  dictionaries,
  appDictionaries,
  loader,
  preference,
  onLocaleChange,
  children,
}: LocalizationProviderProps) {
  const fallback = defaultLocale ?? DEFAULT_LOCALE;

  const [activeLocale, setActiveLocale] = useState<Locale>(() =>
    resolveInitialLocale(locale, initialLocale, fallback, preference),
  );

  const [byLocale, setByLocale] = useState<DictionariesState>(() =>
    buildForLocale(activeLocale, dictionaries, appDictionaries),
  );

  // Keep the external (URL / parent) locale in control when provided.
  useEffect(() => {
    if (locale && locale !== activeLocale) {
      setActiveLocale(locale);
    }
  }, [locale, activeLocale]);

  // Reflect direction + language onto the active document element.
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    document.documentElement.dir = getDirection(activeLocale);
    document.documentElement.lang = activeLocale;
  }, [activeLocale]);

  // Lazily resolve the active locale through the optional loader.
  useEffect(() => {
    if (!loader) {
      return;
    }
    void loader.load(activeLocale).then((dictionary) => {
      setByLocale((current) => ({
        ...current,
        [activeLocale]: dictionary,
      }));
    });
  }, [loader, activeLocale]);

  const change = useCallback(
    (next: Locale) => {
      setActiveLocale(next);
      onLocaleChange?.(next);
      preference?.setPreferredLanguage(next);
      setByLocale((current) => ({ ...current, ...buildForLocale(next, dictionaries, appDictionaries) }));
    },
    [appDictionaries, dictionaries, onLocaleChange, preference],
  );

  const value = useMemo(
    () => ({
      locale: activeLocale,
      direction: getDirection(activeLocale),
      dictionaries: byLocale,
      change,
    }),
    [activeLocale, byLocale, change],
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}