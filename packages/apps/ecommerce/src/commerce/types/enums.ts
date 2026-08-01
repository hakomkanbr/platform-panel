/**
 * Numeric enum values from the backend Swagger contract
 * (Modules.*.Domain.Enums.*). The numeric values map to the
 * backend wire format; labels are a friendly display mapping.
 */

export const enumLabels: Record<string, Record<number, string>> = {
  productType: {
    1: "Physical",
    2: "Digital",
    3: "Service",
    4: "Subscription",
    5: "Virtual",
    6: "Gift Card",
    7: "Downloadable",
    8: "Event Ticket",
    9: "Rental",
    10: "Other",
  },
  productStructure: {
    1: "Simple",
    2: "Configurable",
    3: "Bundle",
    4: "Grouped",
    5: "Digital",
  },
  brandStatus: {
    1: "Active",
    2: "Inactive",
  },
  categoryStatus: {
    1: "Active",
    2: "Inactive",
  },
  tagStatus: {
    1: "Active",
    2: "Inactive",
  },
  attributeValueType: {
    1: "Text",
    2: "Number",
    3: "Decimal",
    4: "Boolean",
    5: "Date",
    6: "Rich Text",
  },
  optionInputType: {
    1: "Text",
    2: "Select",
    3: "Radio",
    4: "Checkbox",
    5: "Swatch",
  },
  mediaType: {
    1: "Image",
    2: "Video",
    3: "Document",
    4: "Audio",
    5: "3D Model",
    6: "Other",
  },
  relationType: {
    1: "Related",
    2: "Upsell",
    3: "Cross-sell",
    4: "Accessory",
    5: "Replacement",
    6: "Bundle",
    7: "Similar",
  },
  taxMode: {
    1: "Inclusive",
    2: "Exclusive",
  },
  priceConstraintType: {
    1: "Minimum",
    2: "Maximum",
    3: "Fixed",
    4: "Range",
    5: "Formula",
  },
};

export function enumLabel(map: string, value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "\u2014";
  const n = Number(value);
  const label = enumLabels[map]?.[n];
  return label ?? String(value);
}

export function enumOptions(map: string): Array<{ value: number; label: string }> {
  return Object.entries(enumLabels[map] ?? {}).map(([value, label]) => ({
    value: Number(value),
    label,
  }));
}
