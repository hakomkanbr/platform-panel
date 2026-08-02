import { useCallback, useMemo } from "react";
import { isFilledMessage, lookup } from "../core/lookup";
import type { Messages, TranslateValues, Translator } from "../types";

function interpolate(message: string, values?: TranslateValues): string {
  if (!values) {
    return message;
  }
  return message.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = values[name];
    return value === undefined ? match : String(value);
  });
}

/**
 * Build a `Translator` bound to a dictionary.
 *
 * The returned callable resolves dotted keys (e.g. `"cms.pages.title"`) and
 * degrades gracefully to the raw key when a translation is missing, so keys
 * always stay visible during development instead of silently disappearing.
 */
export function useTranslator(
  dictionary: Messages | undefined,
): Translator {
  const resolve = useCallback(
    (key: string, values?: TranslateValues): string => {
      const resolved = isFilledMessage(lookup(key, dictionary ?? {}))
        ? (lookup(key, dictionary ?? {}) as string)
        : key;
      return interpolate(resolved, values);
    },
    [dictionary],
  );

  return useMemo(
    () =>
      Object.assign(
        (key: string, values?: TranslateValues): string => resolve(key, values),
        {
          has: (key: string): boolean =>
            isFilledMessage(lookup(key, dictionary ?? {})),
          exists: (key: string): boolean =>
            typeof lookup(key, dictionary ?? {}) === "string",
        },
      ) as Translator,
    [dictionary, resolve],
  );
}