import type { Messages } from "../types";

/**
 * Traverse a (merged) dictionary by a dotted key (`common.save`). Returns the
 * string leaf when found, otherwise the fallback (defaults to the key itself
 * so missing translations degrade gracefully and stay visible in the UI).
 */
export function lookup(key: string, dictionary: Messages): string | undefined {
  if (key.length === 0 || !dictionary) {
    return undefined;
  }

  let cursor: Messages | string | undefined = dictionary;

  for (const segment of key.split(".")) {
    if (typeof cursor !== "object" || cursor === null) {
      return undefined;
    }
    const next: Messages | string | undefined = cursor[segment];
    if (next === undefined) {
      return undefined;
    }
    cursor = next;
  }

  return typeof cursor === "string" ? cursor : undefined;
}

/** Whether a string message exists (leaf value present, possibly empty). */
export function hasMessage(key: string, dictionary: Messages): boolean {
  const value = lookup(key, dictionary);
  return typeof value === "string";
}

/** Type guard: the value is a non-empty string message. */
export function isFilledMessage(value: string | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}