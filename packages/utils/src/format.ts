function parseDate(value?: string | number | Date | null): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export interface CurrencyInfo {
  code: string;
  nameAr: string;
  nameEn: string;
  symbol: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: "SAR", nameAr: "ريال سعودي", nameEn: "Saudi Riyal", symbol: "ر.س", flag: "🇸🇦" },
  { code: "TRY", nameAr: "ليرة تركية", nameEn: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "USD", nameAr: "دولار أمريكي", nameEn: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "AED", nameAr: "درهم إماراتي", nameEn: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "EUR", nameAr: "يورو", nameEn: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "KWD", nameAr: "دينار كويتي", nameEn: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼" },
  { code: "QAR", nameAr: "ريال قطري", nameEn: "Qatari Riyal", symbol: "ر.ق", flag: "🇶🇦" },
  { code: "BHD", nameAr: "دينار بحريني", nameEn: "Bahraini Dinar", symbol: "د.ب", flag: "🇧🇭" },
  { code: "OMR", nameAr: "ريال عماني", nameEn: "Omani Rial", symbol: "ر.ع", flag: "🇴🇲" },
  { code: "JOD", nameAr: "دينار أردني", nameEn: "Jordanian Dinar", symbol: "د.أ", flag: "🇯🇴" },
  { code: "EGP", nameAr: "جنيه مصري", nameEn: "Egyptian Pound", symbol: "ج.م", flag: "🇪🇬" },
  { code: "GBP", nameAr: "جنيه إسترليني", nameEn: "British Pound", symbol: "£", flag: "🇬🇧" },
];

export function getCurrencyInfo(code?: string | null): CurrencyInfo | undefined {
  if (!code) return undefined;
  const clean = code.trim().toUpperCase();
  return SUPPORTED_CURRENCIES.find((c) => c.code === clean);
}

const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function formatCurrency(
  amount?: number | string | null,
  currency = "SAR",
  locale = "en-US",
): string {
  const value = Number(amount ?? 0);
  if (!Number.isFinite(value)) return "\u2014";

  // Clean and normalize currency code if a GUID or invalid string was passed
  let cleanCurrency = (currency || "SAR").trim();
  if (GUID_REGEX.test(cleanCurrency) || cleanCurrency.length !== 3) {
    cleanCurrency = "SAR";
  } else {
    cleanCurrency = cleanCurrency.toUpperCase();
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: cleanCurrency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    const info = getCurrencyInfo(cleanCurrency);
    return `${value.toFixed(2)} ${info?.symbol ?? cleanCurrency}`;
  }
}

export function formatNumber(value?: number | string | null, maximumFractionDigits = 2): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "\u2014";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(n);
}

export function formatPercent(value?: number | string | null, digits = 1): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "\u2014";
  return `${n.toFixed(digits)}%`;
}

export function formatDate(value?: string | number | Date | null): string {
  const d = parseDate(value);
  if (!d) return "\u2014";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(value?: string | number | Date | null): string {
  const d = parseDate(value);
  if (!d) return "\u2014";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatRelativeTime(value?: string | number | Date | null, now = Date.now()): string {
  const d = parseDate(value);
  if (!d) return "\u2014";
  const diff = d.getTime() - now;
  const abs = Math.abs(diff);
  const units: Array<[number, string]> = [
    [1000, "second"],
    [60_000, "minute"],
    [3_600_000, "hour"],
    [86_400_000, "day"],
    [2_592_000_000, "month"],
    [31_536_000_000, "year"],
  ];
  let unit = "second";
  let count = 0;
  for (let i = units.length - 1; i >= 0; i--) {
    const [unitSize, unitName] = units[i]!;
    if (abs >= unitSize) {
      count = Math.floor(abs / unitSize);
      unit = unitName;
      break;
    }
  }
  if (count === 0) return "just now";
  const suffix = diff > 0 ? "from now" : "ago";
  return `${count} ${unit}${count > 1 ? "s" : ""} ${suffix}`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural ?? `${singular}s`}`;
}

export function initial(value?: string | null): string {
  if (!value) return "?";
  return value.trim().charAt(0).toUpperCase();
}

export function truncate(value?: string | null, max = 40): string {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

export function titleCase(value?: string | null): string {
  if (!value) return "";
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getStoreUrl(slug?: string): string {
  const baseUrl =
    (typeof process !== "undefined" &&
      process.env?.NEXT_PUBLIC_STORE_BASE_URL) ||
    "https://store.share2sells.com/store";
  if (!slug) return baseUrl;
  const cleanBase = baseUrl.replace(/\/+$/, "");
  return `${cleanBase}/${encodeURIComponent(slug)}`;
}
