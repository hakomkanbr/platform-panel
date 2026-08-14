/**
 * Core localization types.
 *
 * This module is intentionally free of framework imports (React, Next) so the
 * same types can be shared between Client Components, Server Components and
 * plain server code (middleware / API routes).
 */

/** Locales supported by the platform. */
export type Locale = "en" | "ar" | "tr";

/** Text direction associated with a locale. */
export type LocaleDirection = "ltr" | "rtl";

/**
 * A nested dictionary where each leaf is a localized string and every non-leaf
 * key maps to another nested dictionary. This structure supports namespaces
 * such as `cms.pages.title` and can be extended with new namespaces on demand.
 */
export interface Messages {
  [key: string]: Messages | string;
}

/** A single locale's dictionary. */
export type Dictionary = Messages;

/** The leaf value of a dictionary: a localized string. */
export type MessageLeaf = string;

/** Collection of dictionaries for every supported locale. */
export type LocaleDictionaryMap = Record<Locale, Dictionary>;

/** A dictionary for only some locales (useful for partial/optional payloads). */
export type PartialLocaleDictionaryMap = Partial<LocaleDictionaryMap>;

/**
 * Recursively derives every dot-notation path that exists in a dictionary.
 * Example: `{ common: { save: "x" } }` -> `"common" | "common.save"`.
 *
 * Schemas whose nodes expose a broad index signature (such as the loose
 * `Messages` type) degrade to `string` so any key compiles, while concrete
 * schemas yield precise literal keys. This keeps `t()` type-safe without `any`,
 * regardless of how strictly a caller models its dictionary.
 */
type HasIndexSignature<S> = string extends keyof S ? true : false;

export type TranslationKey<
  Schema extends object,
  Prefix extends string = "",
> = HasIndexSignature<Schema> extends true
  ? string
  : {
      [K in keyof Schema & string]: Schema[K] extends string
        ? `${Prefix}${K}`
        : Schema[K] extends Record<string, unknown>
          ? `${Prefix}${K}` | TranslationKey<Schema[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`;
    }[keyof Schema & string];

/**
 * The namespaces that every application can rely on (global dictionaries
 * shipped by this package). When apps load, they are merged on top of these
 * roots.
 */
export interface GlobalSchema {
  common: Messages;
  navigation: Messages;
  validation: Messages;
  auth: Messages;
  errors: Messages;
  dashboard: Messages;
  catalog: Messages;
  pricing: Messages;
  settings: Messages;
}

/** All valid top-level dotted keys of the global dictionaries. */
export type GlobalTranslationKey = TranslationKey<GlobalSchema>;

/** Values interpolated into `{placeholder}` tokens of a message. */
export type TranslateValues = Record<string, string | number>;

/**
 * The translator function surfaced by `useTranslations`.
 *
 * It is callable (`t("common.save")`) and exposes a few helpers while keeping
 * a clearly typed signature. Schema defaults to the global schema but callers
 * may supply a narrower schema for stricter completions.
 */
export interface Translator<Schema extends object = GlobalSchema> {
  /**
   * Resolve a dot-notation key to the translated string. Missing keys or keys
   * without a concrete value gracefully fall back to the key itself. `{name}`
   * placeholders are replaced by the provided `values`.
   */
  (key: TranslationKey<Schema>, values?: TranslateValues): string;
  /** Whether a key resolves to a concrete message (not empty). */
  has(key: string): boolean;
  /** Whether a key exists in the dictionary (may be empty). */
  exists(key: string): boolean;
}

/**
 * A minimal, framework-independent representation of the localization state
 * exposed through React context (see provider/useLocalization).
 */
export interface LocalizationState {
  locale: Locale;
  direction: LocaleDirection;
  /** The fully resolved, merged dictionary for the active locale. */
  dictionary: Messages;
}

/**
 * Storage abstraction for persisting a user's locale preference.
 *
 * No backend is implemented yet: implementors decide how to read / write the
 * value (cookie, API, DB). This keeps the provider decoupled from transport.
 */
export interface UserLanguagePreference {
  /** Get the stored preference, or null/undefined when unset. */
  getPreferredLanguage(): Locale | null | undefined;
  /** Persist a new preference. */
  setPreferredLanguage(locale: Locale): void;
}
