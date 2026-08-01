function autoPrice(product: { basePrice?: number }, attrs: Record<string, string>, effects: Record<string, number>) {
  const base = Number(product.basePrice || 0);
  const addition = Object.entries(attrs).reduce(
    (sum, [typeId, value]) => sum + Number(effects[`${typeId}:${value}`] || 0),
    0,
  );
  return Math.max(0, Number((base + addition).toFixed(2)));
}

export default autoPrice;
