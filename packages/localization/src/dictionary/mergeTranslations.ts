import type { Messages } from "../types";

/** Narrowing guard for a nested dictionary object. */
function isMessages(value: unknown): value is Messages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Deep merge dictionaries. Later sources override earlier ones on scalar
 * leaves, while nested objects are merged recursively. This is what lets the
 * global dictionaries be combined with per-application dictionaries without
 * any namespace being clobbered.
 */
export function mergeMessages(
  ...sources: Array<Messages | undefined>
): Messages {
  const merged: Messages = {};

  for (const source of sources) {
    if (!source) {
      continue;
    }

    for (const key of Object.keys(source)) {
      const incoming = source[key];
      const existing = merged[key];

      if (isMessages(incoming)) {
        merged[key] = isMessages(existing)
          ? mergeMessages(existing, incoming)
          : { ...incoming };
      } else if (typeof incoming === "string") {
        merged[key] = incoming;
      }
    }
  }

  return merged;
}