import type { ProjectDto } from "@repo/shared-types";
import type { StoreDto } from "@/api/store-settings";
import type { ProjectLanguageDto } from "@/components/languages/types";
import type { CurrencyItem, TenantCurrencySettings } from "@/components/currencies/types";

export type OnboardingStepNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface OnboardingState {
  hasProject: boolean;
  hasStore: boolean;
  hasStoreSettings: boolean;
  hasDefaultLanguage: boolean;
  hasDefaultCurrency: boolean;
  isComplete: boolean;
  resumeStep: OnboardingStepNumber;
}

export interface OnboardingFormData {
  // Step 1
  projectId?: string;
  projectName: string;
  storeId?: string;
  storeName: string;
  storeSlug: string;
  projectDescription?: string;

  // Step 2
  phone?: string;
  whatsAppOrdersEnabled: boolean;
  whatsAppOrderNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;

  // Step 3
  defaultLanguageId?: string;
  defaultLanguageCode?: string;
  defaultLanguageName?: string;
  defaultLanguageFlag?: string;
  defaultLanguageNativeName?: string;
  defaultLanguageRtl?: boolean;

  // Step 4
  defaultCurrencyId?: string;
  defaultCurrencyCode?: string;
  defaultCurrencyName?: string;
  defaultCurrencySymbol?: string;
  defaultCurrencyFlag?: string;
}

export interface OnboardingContextData {
  projects: ProjectDto[];
  activeProject?: ProjectDto;
  store?: StoreDto | null;
  languages?: ProjectLanguageDto[];
  currencyCatalog: CurrencyItem[];
  currencySettings?: TenantCurrencySettings | null;
  isLoading: boolean;
  error?: Error | null;
}
