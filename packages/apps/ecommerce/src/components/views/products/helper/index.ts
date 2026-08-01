import type { DiscountRuleForm } from "@/types";

interface RangeRule {
  useRange?: boolean;
  from?: string | number | null;
  to?: string | number | null;
}

export function rangeMatch(rule: RangeRule | null | undefined, qty: number): boolean {
  if (!rule) return true;
  if (rule.useRange === false) return true;
  const from = rule.from === "" || rule.from === null || rule.from === undefined ? 0 : Number(rule.from);
  const to = rule.to === "" || rule.to === null || rule.to === undefined ? Infinity : Number(rule.to);
  return qty >= from && qty <= to;
}

export function rangeLabel(rule: RangeRule): string {
  if (rule.useRange === false) return "All quantities";
  const from = rule.from === "" || rule.from === null || rule.from === undefined ? "Unlimited" : rule.from;
  const to = rule.to === "" || rule.to === null || rule.to === undefined ? "Unlimited" : rule.to;
  return `${from} - ${to}`;
}

export function scopeLabel(scope: string): string {
  if (scope === "urun") return "Product Based";
  if (scope === "kategori") return "Category Based";
  if (scope === "product") return "Product";
  if (scope === "category") return "Category";
  if (scope === "quantity") return "Quantity Based";
  return scope;
}

export function bestDiscount(qty: number, productName: string, productCategory: string, rules: DiscountRuleForm[]) {
  const priority: Record<string, number> = { urun: 3, product: 3, kategori: 2, category: 2, quantity: 1, adet: 1 };
  return rules
    .filter((rule) => {
      if (!rule.active) return false;
      if (!rangeMatch(rule, qty)) return false;
      if (rule.scope === "product" || rule.scope === "urun") return rule.target === productName;
      if (rule.scope === "category" || rule.scope === "kategori") return rule.target === productCategory;
      return true;
    })
    .sort((a, b) => (priority[b.scope] || 0) - (priority[a.scope] || 0) || Number(b.rate || 0) - Number(a.rate || 0))[0];
}

export function calculateDiscounts(
  unit: number,
  mainRule: any,
  special: any,
  qty: number,
) {
  const mainRate = Number(mainRule?.rate || 0);
  const mainAmount = (unit * mainRate) / 100;
  const specialActive = Boolean(special?.active && rangeMatch(special, qty) && Number(special.value || 0) > 0);

  if (!specialActive) {
    return {
      mainAmount,
      specialAmount: 0,
      totalAmount: mainAmount,
      totalRate: unit ? (mainAmount / unit) * 100 : 0,
      finalUnit: Math.max(0, unit - mainAmount),
      specialApplied: false,
    };
  }

  const specialValue = Number(special.value || 0);
  const maxTotalRate = Number(special.maxTotalRate || 0);
  const maxTotalAmount = maxTotalRate > 0 ? (unit * maxTotalRate) / 100 : Infinity;

  if (!special.combine) {
    const specialOnly = special.type === "amount" || special.type === "fixed" ? specialValue : (unit * specialValue) / 100;
    const capped = Math.min(specialOnly, maxTotalAmount);
    return {
      mainAmount: 0,
      specialAmount: capped,
      totalAmount: capped,
      totalRate: unit ? (capped / unit) * 100 : 0,
      finalUnit: Math.max(0, unit - capped),
      specialApplied: true,
    };
  }

  const afterMain = Math.max(0, unit - mainAmount);
  const rawSpecial = special.type === "amount" || special.type === "fixed" ? specialValue : (afterMain * specialValue) / 100;
  const totalCapped = Math.min(mainAmount + rawSpecial, maxTotalAmount);
  const specialAmount = Math.max(0, totalCapped - mainAmount);

  return {
    mainAmount,
    specialAmount,
    totalAmount: totalCapped,
    totalRate: unit ? (totalCapped / unit) * 100 : 0,
    finalUnit: Math.max(0, unit - totalCapped),
    specialApplied: true,
  };
}
