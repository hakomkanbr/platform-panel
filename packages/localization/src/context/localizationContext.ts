"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, getDirection } from "../constants/languages";
import type { Locale, LocaleDirection, Messages } from "../types";

/** What the provider exposes to every application through React context. */
export interface LocalizationContextValue {
  /** The currently active locale. */
  locale: Locale;
  /** Text direction for the active locale (supports RTL). */
  direction: LocaleDirection;
  /**
   * Resolved, merged dictionaries per locale. Contains at least the active
   * locale so hooks can read without any asynchronous concern.
   */
  dictionaries: Partial<Record<Locale, Messages>>;
  /** Switch the active locale at runtime. */
  change(locale: Locale): void;
}

const emptyDictionaries: Partial<Record<Locale, Messages>> = {};

function createDefaultContextValue(): LocalizationContextValue {
  return {
    locale: DEFAULT_LOCALE,
    direction: getDirection(DEFAULT_LOCALE),
    dictionaries: emptyDictionaries,
    change: () => undefined,
  };
}

export const LocalizationContext = createContext<LocalizationContextValue>(
  createDefaultContextValue(),
);

/** Read the localization context (throws only if used outside the provider). */
export function useLocalization(): LocalizationContextValue {
  const ctx = useContext(LocalizationContext);
  if (!ctx) {
    throw new Error(
      "useLocalization must be used within a <LocalizationProvider>.",
    );
  }
  return ctx;
}