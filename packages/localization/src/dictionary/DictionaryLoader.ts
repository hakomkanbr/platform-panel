import type { Locale, Messages } from "../types";
import { isSupportedLocale } from "../constants/languages";
import { mergeMessages } from "./mergeTranslations";

/**
 * Loader signature used to obtain a dictionary for a locale. Implementations
 * may read from static files, dynamic imports, an API, or a bundler manifest.
 * Being async leaves room for lazy loading of the active language only.
 */
export type LocaleLoader = (locale: Locale) => Promise<Messages>;

export type DictionaryLoaderOptions = {
  /** Async producer per locale (optional until every locale is wired). */
  loaders?: Partial<Record<Locale, LocaleLoader>>;
  /** Synchronously available, pre-resolved dictionaries (SSR seeds). */
  staticMap?: Partial<Record<Locale, Messages>>;
};

/**
 * Loader and cache that resolves the merged dictionary for a single active
 * locale. Only the requested locale is evaluated, which keeps every other
 * language out of the initial bundle and supports runtime switching.
 */
export class DictionaryLoader {
  private readonly loaders: Partial<Record<Locale, LocaleLoader>>;
  private readonly cache = new Map<Locale, Messages>();

  constructor(options: DictionaryLoaderOptions = {}) {
    this.loaders = { ...(options.loaders ?? {}) };
    this.seedStatic(options.staticMap);
  }

  /** Register additional async loaders (e.g. when an application mounts). */
  registerLoaders(loaders?: Partial<Record<Locale, LocaleLoader>>): this {
    if (loaders) {
      Object.assign(this.loaders, loaders);
    }
    return this;
  }

  /** Seed synchronous dictionaries into the cache (SSR / static seeding). */
  seedStatic(staticMap?: Partial<Record<Locale, Messages>>): this {
    if (staticMap) {
      for (const key of Object.keys(staticMap)) {
        if (isSupportedLocale(key)) {
          const dictionary = staticMap[key];
          if (dictionary) {
            this.cache.set(key, dictionary);
          }
        }
      }
    }
    return this;
  }

  /** Merge additional messages into an already-resolved locale. */
  merge(locale: Locale, additional: Messages): this {
    const existing = this.cache.get(locale) ?? {};
    this.cache.set(locale, mergeMessages(existing, additional));
    return this;
  }

  /** Whether a dictionary is already loaded / cached for a locale. */
  has(locale: Locale): boolean {
    return this.cache.has(locale);
  }

  /** Resolve and cache the dictionary for a locale (lazy when possible). */
  async load(locale: Locale): Promise<Messages> {
    const cached = this.cache.get(locale);
    if (cached) {
      return cached;
    }

    const loader = this.loaders[locale];
    const loaded = loader ? await loader(locale) : {};
    const resolved = mergeMessages({}, loaded);
    this.cache.set(locale, resolved);
    return resolved;
  }

  /** Access the resolved dictionary synchronously, when already present. */
  peek(locale: Locale): Messages | undefined {
    return this.cache.get(locale);
  }

  /** Drop cached entries so memory reflects only the active locale. */
  release(locale: Locale): this {
    this.cache.delete(locale);
    return this;
  }

  /** Returns the known locale keys (those with a loader or static entry). */
  locales(): Locale[] {
    const keys = new Set<Locale>([
      ...Object.keys(this.loaders).filter(isSupportedLocale),
      ...Array.from(this.cache.keys()),
    ]);
    return Array.from(keys);
  }
}