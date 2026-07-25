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
  rtl: boolean;
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

export const LANGUAGES: { code: string; name: string; nativeName: string; rtl: boolean }[] = [
  { code: "en", name: "English", nativeName: "English", rtl: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", rtl: false },
  { code: "fr", name: "French", nativeName: "Français", rtl: false },
  { code: "de", name: "German", nativeName: "Deutsch", rtl: false },
  { code: "es", name: "Spanish", nativeName: "Español", rtl: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", rtl: false },
  { code: "ru", name: "Russian", nativeName: "Русский", rtl: false },
  { code: "zh", name: "Chinese", nativeName: "中文", rtl: false },
  { code: "ja", name: "Japanese", nativeName: "日本語", rtl: false },
  { code: "ko", name: "Korean", nativeName: "한국어", rtl: false },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", rtl: false },
  { code: "ur", name: "Urdu", nativeName: "اردو", rtl: true },
  { code: "fa", name: "Persian", nativeName: "فارسی", rtl: true },
  { code: "it", name: "Italian", nativeName: "Italiano", rtl: false },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", rtl: false },
  { code: "pl", name: "Polish", nativeName: "Polski", rtl: false },
  { code: "sv", name: "Swedish", nativeName: "Svenska", rtl: false },
  { code: "da", name: "Danish", nativeName: "Dansk", rtl: false },
  { code: "fi", name: "Finnish", nativeName: "Suomi", rtl: false },
  { code: "no", name: "Norwegian", nativeName: "Norsk", rtl: false },
  { code: "cs", name: "Czech", nativeName: "Čeština", rtl: false },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", rtl: false },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", rtl: false },
  { code: "ro", name: "Romanian", nativeName: "Română", rtl: false },
  { code: "bg", name: "Bulgarian", nativeName: "Български", rtl: false },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", rtl: false },
  { code: "he", name: "Hebrew", nativeName: "עברית", rtl: true },
  { code: "th", name: "Thai", nativeName: "ไทย", rtl: false },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", rtl: false },
];
