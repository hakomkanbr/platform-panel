export default function formatMoney(value: number | string): string {
  if (value === null || value === undefined || value === "") return "";

  let num =
    typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;

  if (Number.isNaN(num)) return "";

  // 🔑 Yuvarlama yerine kesme (truncate)
  num = Math.trunc(num * 100) / 100;

  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  return `${formatted} TL`;
}
