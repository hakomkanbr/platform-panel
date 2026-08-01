import type { ProductSetupData, VariantType, VariantRow, DiscountRuleForm } from "@/types";

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export function validate(
  product: ProductSetupData,
  types: VariantType[],
  rows: VariantRow[],
  discounts: DiscountRuleForm[],
  effects: Record<string, number>,
  specialDiscount: any,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!product.name?.trim()) errors.push("Product name is required.");
  if (!product.categoryId && !product.category) errors.push("Category is required.");
  if (!product.basePrice || Number(product.basePrice) <= 0) errors.push("Base price must be greater than 0.");

  if (types.length > 0 && rows.length === 0) errors.push("Generate variant rows before publishing.");
  if (!rows.some((r) => r.active)) warnings.push("No active variant rows. Product won't be visible.");
  if (!rows.some((r) => r.stock)) warnings.push("No variants in stock.");

  const emptySku = rows.filter((r) => !r.sku?.trim());
  if (emptySku.length > 0) errors.push(`Empty SKUs found in ${emptySku.length} row(s).`);

  const duplicateSkus = rows.map((r) => r.sku?.trim()).filter(Boolean);
  const dupes = duplicateSkus.filter((sku, i) => sku && duplicateSkus.indexOf(sku) !== i);
  if (dupes.length > 0) errors.push(`Duplicate SKUs found: ${[...new Set(dupes)].join(", ")}`);

  if (discounts.some((d) => Number(d.rate) > 100)) errors.push("Discount rate cannot exceed 100%.");
  if (discounts.some((d) => d.useRange && d.from && d.to && new Date(d.from) >= new Date(d.to)))
    errors.push("Discount range start must be before end.");
  if (product.stepQty < 1) errors.push("Increment step must be 1 or greater.");
  if (product.minQty < 1) errors.push("Minimum quantity must be at least 1.");

  return { errors, warnings };
}
