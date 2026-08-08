import type {
  ApiKeyAccessLevel,
  ApiKeyPermission,
} from "./types";

export interface AccessLevelOption {
  value: ApiKeyAccessLevel;
  label: string;
  description: string;
}

export const ACCESS_LEVEL_OPTIONS: AccessLevelOption[] = [
  {
    value: "read_only",
    label: "Read Only",
    description: "Basic public store data — products and categories.",
  },
  {
    value: "standard_read",
    label: "Standard Read",
    description: "Products, categories, orders, customers, and inventory.",
  },
  {
    value: "custom_read",
    label: "Custom Read",
    description: "Select the specific read permissions this key needs.",
  },
];

export const READ_ONLY_RESOURCES = ["catalog:products", "catalog:categories"];

export const STANDARD_READ_RESOURCES = [
  "catalog:products",
  "catalog:categories",
  "orders",
  "customers",
  "inventory",
];

export function presetPermissions(level: ApiKeyAccessLevel): ApiKeyPermission[] {
  const resources =
    level === "read_only"
      ? READ_ONLY_RESOURCES
      : level === "standard_read"
        ? STANDARD_READ_RESOURCES
        : [];
  return resources.map((resource) => ({ resource, actions: ["read"] }));
}

export function resolveAccessLevel(
  permissions: ApiKeyPermission[],
): ApiKeyAccessLevel {
  if (permissions.some((p) => p.actions.some((action) => action !== "read"))) {
    return "custom_read";
  }
  const set = new Set(permissions.map((p) => p.resource));
  const key = Array.from(set).sort().join(",");
  const standardKey = [...STANDARD_READ_RESOURCES].sort().join(",");
  const readOnlyKey = [...READ_ONLY_RESOURCES].sort().join(",");
  if (key === standardKey) return "standard_read";
  if (key === readOnlyKey) return "read_only";
  return "custom_read";
}

export function accessLevelLabel(level: ApiKeyAccessLevel): string {
  switch (level) {
    case "read_only":
      return "Read Only";
    case "standard_read":
      return "Standard Read";
    case "custom_read":
      return "Custom Read";
    default:
      return "Read Only";
  }
}

export function scopeLabel(scope: "current_project" | "marketplace_projects"): string {
  return scope === "marketplace_projects" ? "Marketplace" : "This store";
}