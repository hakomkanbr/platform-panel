/**
 * Slug generation and validation utility functions.
 * Supports multilingual characters (Latin, Arabic, Turkish, digits) with strict URL standards.
 */

export function generateSlug(text: string): string {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF-]+/g, "-") // replace non-alphanumeric/spaces with '-'
    .replace(/_+/g, "-") // replace underscore with '-'
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphens
}

export function validateSlug(slug: string, t?: (key: string) => string): string | null {
  if (!slug || !slug.trim()) {
    return t?.("catalog.products.create.slugRequired") || "Slug is required";
  }

  const trimmed = slug.trim();

  if (trimmed.length > 100) {
    return t?.("catalog.products.create.slugTooLong") || "Slug cannot exceed 100 characters";
  }

  if (/[A-Z]/.test(trimmed)) {
    return t?.("catalog.products.create.slugLowercaseOnly") || "Slug must be in lowercase (no capital letters)";
  }

  if (/\s/.test(trimmed)) {
    return t?.("catalog.products.create.slugNoSpaces") || "Slug cannot contain spaces";
  }

  if (trimmed.startsWith("-") || trimmed.endsWith("-")) {
    return t?.("catalog.products.create.slugNoLeadingTrailingDashes") || "Slug cannot start or end with a hyphen";
  }

  if (/--+/.test(trimmed)) {
    return t?.("catalog.products.create.slugNoConsecutiveDashes") || "Slug cannot contain consecutive hyphens";
  }

  // Allow unicode letters (including Arabic, etc.), digits, and single hyphens
  if (!/^[a-z0-9\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+(?:-[a-z0-9\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)*$/.test(trimmed)) {
    return (
      t?.("catalog.products.create.slugInvalidChars") ||
      "Slug can only contain letters, numbers, and hyphens"
    );
  }

  return null;
}

export const slugRule = (t?: (key: string) => string) => ({
  validator: async (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(
        new Error(t?.("catalog.products.create.slugRequired") || "Slug is required")
      );
    }
    const errorMsg = validateSlug(value, t);
    if (errorMsg) {
      return Promise.reject(new Error(errorMsg));
    }
    return Promise.resolve();
  },
});
