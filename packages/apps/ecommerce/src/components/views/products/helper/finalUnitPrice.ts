import autoPrice from "./autoPrice";

function finalUnitPrice(product: { basePrice?: number }, row: { attrs?: Record<string, string>; overridePrice?: string | number }, effects: Record<string, number>) {
  const override = row?.overridePrice;
  if (override !== "" && override !== null && override !== undefined && Number(override) > 0) return Number(override);
  return autoPrice(product, row?.attrs || {}, effects);
}

export default finalUnitPrice;
