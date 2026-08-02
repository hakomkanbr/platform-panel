export interface ProjectLanguageDto {
  id: string;
  projectId: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  enabled: boolean;
  isDefault: boolean;
  order: number;
  translationCompletion: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProjectLanguageRequest {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: number;
}

export interface UpdateProjectLanguageRequest {
  name?: string;
  nativeName?: string;
  flag?: string;
  rtl?: boolean;
  enabled?: boolean;
  order?: number;
}

export interface ReorderLanguagesRequest {
  items: { id: string; order: number }[];
}

export const LANGUAGE_FLAGS: Record<string, string> = {
  en: "🇬🇧",
  ar: "🇸🇦",
  tr: "🇹🇷",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
  pt: "🇵🇹",
  ru: "🇷🇺",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ko: "🇰🇷",
  hi: "🇮🇳",
  ur: "🇵🇰",
  fa: "🇮🇷",
  it: "🇮🇹",
  nl: "🇳🇱",
  pl: "🇵🇱",
  sv: "🇸🇪",
  da: "🇩🇰",
  fi: "🇫🇮",
  no: "🇳🇴",
  cs: "🇨🇿",
  sk: "🇸🇰",
  hu: "🇭🇺",
  ro: "🇷🇴",
  bg: "🇧🇬",
  el: "🇬🇷",
  he: "🇮🇱",
  th: "🇹🇭",
  vi: "🇻🇳",
};

export const LANGUAGES: { code: string; name: string; nativeName: string; rtl: number }[] = [
  { code: "en", name: "English", nativeName: "English", rtl: 0 },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: 1 },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", rtl: 0 },
  { code: "fr", name: "French", nativeName: "Français", rtl: 0 },
  { code: "de", name: "German", nativeName: "Deutsch", rtl: 0 },
  { code: "es", name: "Spanish", nativeName: "Español", rtl: 0 },
  { code: "pt", name: "Portuguese", nativeName: "Português", rtl: 0 },
  { code: "ru", name: "Russian", nativeName: "Русский", rtl: 0 },
  { code: "zh", name: "Chinese", nativeName: "中文", rtl: 0 },
  { code: "ja", name: "Japanese", nativeName: "日本語", rtl: 0 },
  { code: "ko", name: "Korean", nativeName: "한국어", rtl: 0 },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", rtl: 0 },
  { code: "ur", name: "Urdu", nativeName: "اردو", rtl: 1 },
  { code: "fa", name: "Persian", nativeName: "فارسی", rtl: 1 },
  { code: "it", name: "Italian", nativeName: "Italiano", rtl: 0 },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", rtl: 0 },
  { code: "pl", name: "Polish", nativeName: "Polski", rtl: 0 },
  { code: "sv", name: "Swedish", nativeName: "Svenska", rtl: 0 },
  { code: "da", name: "Danish", nativeName: "Dansk", rtl: 0 },
  { code: "fi", name: "Finnish", nativeName: "Suomi", rtl: 0 },
  { code: "no", name: "Norwegian", nativeName: "Norsk", rtl: 0 },
  { code: "cs", name: "Czech", nativeName: "Čeština", rtl: 0 },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", rtl: 0 },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", rtl: 0 },
  { code: "ro", name: "Romanian", nativeName: "Română", rtl: 0 },
  { code: "bg", name: "Bulgarian", nativeName: "Български", rtl: 0 },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", rtl: 0 },
  { code: "he", name: "Hebrew", nativeName: "עברית", rtl: 1 },
  { code: "th", name: "Thai", nativeName: "ไทย", rtl: 0 },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", rtl: 0 },
];
