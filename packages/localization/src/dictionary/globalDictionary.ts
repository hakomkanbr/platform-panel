import type { LocaleDictionaryMap, Messages } from "../types";
import enCommon from "../../locales/en/common.json";
import enNavigation from "../../locales/en/navigation.json";
import enValidation from "../../locales/en/validation.json";
import enAuth from "../../locales/en/auth.json";
import enErrors from "../../locales/en/errors.json";
import enDashboard from "../../locales/en/dashboard.json";

import arCommon from "../../locales/ar/common.json";
import arNavigation from "../../locales/ar/navigation.json";
import arValidation from "../../locales/ar/validation.json";
import arAuth from "../../locales/ar/auth.json";
import arErrors from "../../locales/ar/errors.json";
import arDashboard from "../../locales/ar/dashboard.json";

import trCommon from "../../locales/tr/common.json";
import trNavigation from "../../locales/tr/navigation.json";
import trValidation from "../../locales/tr/validation.json";
import trAuth from "../../locales/tr/auth.json";
import trErrors from "../../locales/tr/errors.json";
import trDashboard from "../../locales/tr/dashboard.json";

function asMessages(source: unknown): Messages {
  if (typeof source === "object" && source !== null) {
    return source as Messages;
  }
  return {};
}

/**
 * The global, per-locale dictionaries shipped by this package. Every namespace
 * is keyed under its root (e.g. `dashboard.title`), ready to be merged with
 * per-application dictionaries by the loader / provider.
 */
export const GLOBAL_DICTIONARIES: LocaleDictionaryMap = {
  en: {
    common: asMessages(enCommon),
    navigation: asMessages(enNavigation),
    validation: asMessages(enValidation),
    auth: asMessages(enAuth),
    errors: asMessages(enErrors),
    dashboard: asMessages(enDashboard),
  },
  ar: {
    common: asMessages(arCommon),
    navigation: asMessages(arNavigation),
    validation: asMessages(arValidation),
    auth: asMessages(arAuth),
    errors: asMessages(arErrors),
    dashboard: asMessages(arDashboard),
  },
  tr: {
    common: asMessages(trCommon),
    navigation: asMessages(trNavigation),
    validation: asMessages(trValidation),
    auth: asMessages(trAuth),
    errors: asMessages(trErrors),
    dashboard: asMessages(trDashboard),
  },
};

/** The active global dictionary for a given locale. */
export function getGlobalDictionary(locale: keyof LocaleDictionaryMap): Messages {
  return GLOBAL_DICTIONARIES[locale];
}