import type { LocaleDictionaryMap, Messages } from "../types";
import enCommon from "../../locales/en/common.json";
import enNavigation from "../../locales/en/navigation.json";
import enValidation from "../../locales/en/validation.json";
import enAuth from "../../locales/en/auth.json";
import enErrors from "../../locales/en/errors.json";
import enDashboard from "../../locales/en/dashboard.json";
import enCatalog from "../../locales/en/catalog.json";
import enPricing from "../../locales/en/pricing.json";
import enSettings from "../../locales/en/settings.json";
import enOrders from "../../locales/en/orders.json";
import enCustomers from "../../locales/en/customers.json";

import arCommon from "../../locales/ar/common.json";
import arNavigation from "../../locales/ar/navigation.json";
import arValidation from "../../locales/ar/validation.json";
import arAuth from "../../locales/ar/auth.json";
import arErrors from "../../locales/ar/errors.json";
import arDashboard from "../../locales/ar/dashboard.json";
import arCatalog from "../../locales/ar/catalog.json";
import arPricing from "../../locales/ar/pricing.json";
import arSettings from "../../locales/ar/settings.json";
import arOrders from "../../locales/ar/orders.json";
import arCustomers from "../../locales/ar/customers.json";

import trCommon from "../../locales/tr/common.json";
import trNavigation from "../../locales/tr/navigation.json";
import trValidation from "../../locales/tr/validation.json";
import trAuth from "../../locales/tr/auth.json";
import trErrors from "../../locales/tr/errors.json";
import trDashboard from "../../locales/tr/dashboard.json";
import trCatalog from "../../locales/tr/catalog.json";
import trPricing from "../../locales/tr/pricing.json";
import trSettings from "../../locales/tr/settings.json";
import trOrders from "../../locales/tr/orders.json";
import trCustomers from "../../locales/tr/customers.json";

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
    catalog: asMessages(enCatalog),
    pricing: asMessages(enPricing),
    settings: asMessages(enSettings),
    orders: asMessages(enOrders),
    customers: asMessages(enCustomers),
  },
  ar: {
    common: asMessages(arCommon),
    navigation: asMessages(arNavigation),
    validation: asMessages(arValidation),
    auth: asMessages(arAuth),
    errors: asMessages(arErrors),
    dashboard: asMessages(arDashboard),
    catalog: asMessages(arCatalog),
    pricing: asMessages(arPricing),
    settings: asMessages(arSettings),
    orders: asMessages(arOrders),
    customers: asMessages(arCustomers),
  },
  tr: {
    common: asMessages(trCommon),
    navigation: asMessages(trNavigation),
    validation: asMessages(trValidation),
    auth: asMessages(trAuth),
    errors: asMessages(trErrors),
    dashboard: asMessages(trDashboard),
    catalog: asMessages(trCatalog),
    pricing: asMessages(trPricing),
    settings: asMessages(trSettings),
    orders: asMessages(trOrders),
    customers: asMessages(trCustomers),
  },
};

/** The active global dictionary for a given locale. */
export function getGlobalDictionary(locale: keyof LocaleDictionaryMap): Messages {
  return GLOBAL_DICTIONARIES[locale];
}