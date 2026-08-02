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
  productStatus: {
    1: "Draft",
    2: "Published",
    3: "Unpublished",
    4: "Archived",
  },
  productVisibility: {
    1: "Public",
    2: "Storefront only",
    3: "Unlisted",
    4: "Private",
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
  priceListStatus: {
    1: "Draft",
    2: "Active",
    3: "Published",
    4: "Archived",
  },
  pricingStatus: {
    1: "Draft",
    2: "Pending approval",
    3: "Approved",
    4: "Rejected",
    5: "Published",
    6: "Archived",
  },
  approvalStatus: {
    1: "None",
    2: "Submitted",
    3: "Approved",
    4: "Rejected",
  },
  priceConstraintType: {
    1: "Minimum quantity",
    2: "Maximum quantity",
    3: "Minimum margin %",
    4: "Maximum discount %",
    5: "Rounding precision",
  },
  priceChangeReason: {
    1: "Created",
    2: "Updated",
    3: "Published",
    4: "Archived",
    5: "Activated",
    6: "Deactivated",
    7: "Submitted for approval",
    8: "Approved",
    9: "Rejected",
    10: "Scheduled",
    11: "Expired",
  },
  weightUnit: {
    1: "Gram",
    2: "Kilogram",
    3: "Ounce",
    4: "Pound",
  },
  dimensionUnit: {
    1: "mm",
    2: "cm",
    3: "m",
    4: "in",
    5: "ft",
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
