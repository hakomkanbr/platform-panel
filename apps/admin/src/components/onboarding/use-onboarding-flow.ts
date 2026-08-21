"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { useTenantId, useProjects, useCreateProject, useCanConsume } from "@repo/hooks";
import { appsApi } from "@repo/api-client";
import { storeSettingsApi, type StoreDto } from "@/api/store-settings";
import { languageService } from "@/components/languages/service";
import { currenciesService } from "@/components/currencies/service";
import { useTranslations } from "@repo/localization";
import { LANGUAGES, LANGUAGE_FLAGS, type ProjectLanguageDto } from "@repo/shared-types";
import type {
  OnboardingState,
  OnboardingFormData,
  OnboardingStepNumber,
} from "./types";

const PROJECT_COOKIE = "ProjectId";
const SLUG_COOKIE = "SiteSlug";

function setCookie(name: string, value: string, days = 30) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]!) : null;
}

export function detectOnboardingState(
  projects: any[],
  activeProject: any,
  store: StoreDto | null | undefined,
  languages: ProjectLanguageDto[] | undefined,
  currencySettings: any
): OnboardingState {
  const hasProject = !!activeProject && !!activeProject.id;
  const hasStore = !!store && !!store.id;
  const settings = store?.settings;

  // Store settings are considered populated once store and its settings object exist
  const hasStoreSettings = hasStore && !!settings;

  // Default language is configured if defaultLanguageId is set in StoreSettings OR project has an active default language
  const hasDefaultLanguage =
    hasStore &&
    (!!settings?.defaultLanguageId ||
      (Array.isArray(languages) && languages.some((l) => l.isDefault && l.enabled)));

  // Default currency is configured if defaultCurrencyId/currencyCode is set in StoreSettings OR tenant currency settings has baseCurrencyCode
  const hasDefaultCurrency =
    hasStore &&
    ((!!settings?.defaultCurrencyId && !!settings?.currencyCode) ||
      (!!currencySettings?.baseCurrencyCode && currencySettings.baseCurrencyCode.length > 0));

  const isComplete =
    hasProject &&
    hasStore &&
    hasStoreSettings &&
    hasDefaultLanguage &&
    hasDefaultCurrency;

  let resumeStep: OnboardingStepNumber = 1;
  if (!hasProject) {
    resumeStep = 1;
  } else if (!hasStore) {
    resumeStep = 1; // Store creation for existing project
  } else if (!hasStoreSettings) {
    resumeStep = 2;
  } else if (!hasDefaultLanguage) {
    resumeStep = 3;
  } else if (!hasDefaultCurrency) {
    resumeStep = 4;
  } else if (!isComplete) {
    resumeStep = 5;
  } else {
    resumeStep = 7;
  }

  return {
    hasProject,
    hasStore,
    hasStoreSettings,
    hasDefaultLanguage,
    hasDefaultCurrency,
    isComplete,
    resumeStep,
  };
}

export function useOnboardingFlow() {
  const t = useTranslations();
  const tenantId = useTenantId();
  const queryClient = useQueryClient();

  // Queries
  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    refetch: refetchProjects,
  } = useProjects(tenantId);
  const projects = useMemo(() => projectsData ?? [], [projectsData]);

  const createProjectMutation = useCreateProject();
  const canConsumeMutation = useCanConsume();

  const cookieProjectId = typeof window !== "undefined" ? getCookie(PROJECT_COOKIE) : null;
  const activeProject =
    projects.find((p) => p.id === cookieProjectId) || projects[0];

  const activeProjectId = activeProject?.id;

  const {
    data: store,
    isLoading: isStoreLoading,
    refetch: refetchStore,
  } = useQuery({
    queryKey: ["store-settings", activeProjectId],
    queryFn: () => storeSettingsApi.getStoreByProject(activeProjectId!),
    enabled: !!activeProjectId,
    retry: 1,
  });

  const {
    data: languagesData,
    isLoading: isLanguagesLoading,
    refetch: refetchLanguages,
  } = useQuery({
    queryKey: ["project-languages", activeProjectId],
    queryFn: () => languageService.list(activeProjectId!),
    enabled: !!activeProjectId,
    retry: 1,
  });
  const languages = useMemo(() => languagesData ?? [], [languagesData]);

  const { data: currencyCatalogData, isLoading: isCatalogLoading } = useQuery({
    queryKey: ["currency-catalog"],
    queryFn: () => currenciesService.getCatalog(true),
    staleTime: 5 * 60 * 1000,
  });
  const currencyCatalog = useMemo(
    () => currencyCatalogData ?? [],
    [currencyCatalogData],
  );

  const {
    data: currencySettings,
    isLoading: isCurrencySettingsLoading,
    refetch: refetchCurrencySettings,
  } = useQuery({
    queryKey: ["tenant-currencies", activeProjectId],
    queryFn: () => currenciesService.getTenantSettings(activeProjectId),
    enabled: !!activeProjectId,
    retry: 1,
  });

  const isLoadingData =
    isProjectsLoading ||
    (!!activeProjectId && isStoreLoading) ||
    (!!activeProjectId && isLanguagesLoading) ||
    isCatalogLoading;

  // Onboarding state calculation
  const onboardingState = useMemo(
    () =>
      detectOnboardingState(
        projects,
        activeProject,
        store,
        languages,
        currencySettings
      ),
    [projects, activeProject, store, languages, currencySettings]
  );

  const [currentStep, setCurrentStep] = useState<OnboardingStepNumber>(1);
  const [hasInitializedStep, setHasInitializedStep] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<OnboardingFormData>({
    projectId: undefined,
    projectName: "",
    storeId: undefined,
    storeName: "",
    storeSlug: "",
    projectDescription: "",
    phone: "",
    whatsAppOrdersEnabled: false,
    whatsAppOrderNumber: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
    defaultLanguageId: undefined,
    defaultLanguageCode: "ar",
    defaultLanguageName: "Arabic",
    defaultLanguageNativeName: "العربية",
    defaultLanguageFlag: "🇸🇦",
    defaultLanguageRtl: true,
    defaultCurrencyId: undefined,
    defaultCurrencyCode: "SAR",
    defaultCurrencyName: "Saudi Riyal",
    defaultCurrencySymbol: "﷼",
    defaultCurrencyFlag: "🇸🇦",
    isMarketplaceMember: true,
  });

  // Initialize and synchronize Form Data with backend state
  useEffect(() => {
    if (isLoadingData) return;

    if (!hasInitializedStep) {
      if (onboardingState.isComplete) {
        setCurrentStep(7);
      } else {
        setCurrentStep(
          onboardingState.resumeStep <= 6 ? onboardingState.resumeStep : 1
        );
      }
      setHasInitializedStep(true);
    }

    // Populate data from active backend resources if not already entered
    setFormData((prev) => {
      const defaultLang = languages.find((l) => l.isDefault) || languages[0];
      const settings = store?.settings;
      const baseCode =
        settings?.currencyCode || currencySettings?.baseCurrencyCode || "SAR";
      const matchedCurrency = currencyCatalog.find((c) => c.code === baseCode);

      return {
        ...prev,
        projectId: activeProject?.id || prev.projectId,
        projectName: prev.projectName || activeProject?.name || "",
        storeId: store?.id || prev.storeId,
        storeName: prev.storeName || store?.name || activeProject?.name || "",
        storeSlug: prev.storeSlug || store?.slug || activeProject?.slug || "",
        projectDescription:
          prev.projectDescription ||
          store?.description ||
          activeProject?.description ||
          "",
        phone: prev.phone || settings?.phone || "",
        whatsAppOrdersEnabled:
          prev.whatsAppOrdersEnabled ||
          settings?.whatsAppOrdersEnabled ||
          false,
        whatsAppOrderNumber:
          prev.whatsAppOrderNumber || settings?.whatsAppOrderNumber || "",
        country: prev.country || settings?.country || "",
        city: prev.city || settings?.city || "",
        address: prev.address || settings?.address || "",
        postalCode: prev.postalCode || settings?.postalCode || "",
        defaultLanguageId:
          prev.defaultLanguageId ||
          settings?.defaultLanguageId ||
          defaultLang?.id,
        defaultLanguageCode:
          prev.defaultLanguageCode || defaultLang?.code || "ar",
        defaultLanguageName:
          prev.defaultLanguageName || defaultLang?.name || "Arabic",
        defaultLanguageNativeName:
          prev.defaultLanguageNativeName || defaultLang?.nativeName || "العربية",
        defaultLanguageFlag:
          prev.defaultLanguageFlag || defaultLang?.flag || "🇸🇦",
        defaultLanguageRtl:
          prev.defaultLanguageRtl !== undefined
            ? prev.defaultLanguageRtl
            : defaultLang?.rtl ?? true,
        defaultCurrencyId:
          prev.defaultCurrencyId ||
          settings?.defaultCurrencyId ||
          matchedCurrency?.id,
        defaultCurrencyCode:
          prev.defaultCurrencyCode || baseCode,
        defaultCurrencyName:
          prev.defaultCurrencyName || matchedCurrency?.nameAr || matchedCurrency?.nameEn || "ريال سعودي",
        defaultCurrencySymbol:
          prev.defaultCurrencySymbol || matchedCurrency?.symbol || "﷼",
        defaultCurrencyFlag:
          prev.defaultCurrencyFlag || matchedCurrency?.flagIcon || "🇸🇦",
        isMarketplaceMember:
          prev.isMarketplaceMember !== undefined
            ? prev.isMarketplaceMember
            : activeProject?.isMarketplaceMember ?? true,
      };
    });
  }, [
    isLoadingData,
    hasInitializedStep,
    onboardingState,
    activeProject,
    store,
    languages,
    currencySettings,
    currencyCatalog,
  ]);

  const updateFormData = useCallback(
    (updates: Partial<OnboardingFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
      setError(null);
    },
    []
  );

  // Step 1: Create or reuse Project and Store
  const submitStep1 = async (values: {
    projectName: string;
    storeName: string;
    storeSlug: string;
    projectDescription?: string;
  }) => {
    setSubmitting(true);
    setError(null);
    try {
      let currentProjectId = formData.projectId || activeProjectId;

      // 1. Create Project if not already existing
      if (!currentProjectId) {
        // Quota check
        const limitCheck = await canConsumeMutation.mutateAsync({
          tenantId: tenantId || "current",
          capabilityCode: "max_projects",
          requestedAmount: 1,
        });

        if (!limitCheck.allowed) {
          throw new Error(
            limitCheck.message ||
              "Project limit reached for your current plan."
          );
        }

        const projectResult = await createProjectMutation.mutateAsync({
          request: {
            name: values.projectName.trim(),
            description: values.projectDescription?.trim() || "",
          },
          tenantId,
        });

        currentProjectId = (projectResult as any)?.data || projectResult;
        if (!currentProjectId || typeof currentProjectId !== "string") {
          throw new Error(t("settings.onboarding.errors.createProjectFailed"));
        }

        setCookie(PROJECT_COOKIE, currentProjectId);
        setCookie(SLUG_COOKIE, values.storeSlug.trim());
      }

      // 2. Create Store if not already existing for this project
      let currentStoreId = formData.storeId || store?.id;
      if (!currentStoreId && currentProjectId) {
        const createdStore = await storeSettingsApi.createStore(
          currentProjectId,
          {
            name: values.storeName.trim(),
            slug: values.storeSlug.trim(),
            description: values.projectDescription?.trim() || "",
            projectId: currentProjectId,
          }
        );

        if (createdStore && createdStore.id) {
          currentStoreId = createdStore.id;
        }
      }

      // Update Form State
      updateFormData({
        projectId: currentProjectId,
        projectName: values.projectName.trim(),
        storeId: currentStoreId,
        storeName: values.storeName.trim(),
        storeSlug: values.storeSlug.trim(),
        projectDescription: values.projectDescription?.trim() || "",
      });

      // Refetch cache
      await Promise.all([refetchProjects(), refetchStore()]);

      setCurrentStep(2);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("settings.onboarding.errors.createProjectFailed");
      setError(msg);
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Save Store Information & Contact
  const submitStep2 = async (values: {
    phone?: string;
    whatsAppOrdersEnabled: boolean;
    whatsAppOrderNumber?: string;
    country?: string;
    city?: string;
    address?: string;
    postalCode?: string;
  }) => {
    setSubmitting(true);
    setError(null);
    try {
      const pid = formData.projectId || activeProjectId;
      const sid = formData.storeId || store?.id;

      if (!pid || !sid) {
        throw new Error("Missing Project or Store ID.");
      }

      await storeSettingsApi.updateSettings(sid, pid, {
        phone: values.phone?.trim() || null,
        whatsAppOrdersEnabled: values.whatsAppOrdersEnabled,
        whatsAppOrderNumber: values.whatsAppOrdersEnabled
          ? values.whatsAppOrderNumber?.trim() || null
          : null,
        country: values.country?.trim() || null,
        city: values.city?.trim() || null,
        address: values.address?.trim() || null,
        postalCode: values.postalCode?.trim() || null,
        defaultLanguageId: formData.defaultLanguageId || store?.settings?.defaultLanguageId || null,
        defaultCurrencyId: formData.defaultCurrencyId || store?.settings?.defaultCurrencyId || null,
        currencyCode: formData.defaultCurrencyCode || store?.settings?.currencyCode || null,
      });

      updateFormData(values);
      await refetchStore();
      setCurrentStep(3);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("settings.onboarding.errors.saveSettingsFailed");
      setError(msg);
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Register & Set Default Language
  const submitStep3 = async (languageData: {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    rtl: boolean;
  }) => {
    setSubmitting(true);
    setError(null);
    try {
      const pid = formData.projectId || activeProjectId;
      const sid = formData.storeId || store?.id;

      if (!pid) throw new Error("Missing Project ID.");

      // Check if language is already in project languages
      let projectLang = languages.find(
        (l) => l.code.toLowerCase() === languageData.code.toLowerCase()
      );

      if (!projectLang) {
        projectLang = await languageService.create(pid, {
          code: languageData.code,
          name: languageData.name,
          nativeName: languageData.nativeName,
          flag: languageData.flag,
          rtl: languageData.rtl ? 1 : 0,
        });
      }

      if (projectLang && projectLang.id) {
        await languageService.setDefault(pid, projectLang.id);
        if (!projectLang.enabled) {
          await languageService.enable(pid, projectLang.id);
        }

        if (sid) {
          await storeSettingsApi.updateSettings(sid, pid, {
            phone: formData.phone?.trim() || store?.settings?.phone || null,
            whatsAppOrdersEnabled: formData.whatsAppOrdersEnabled ?? store?.settings?.whatsAppOrdersEnabled ?? false,
            whatsAppOrderNumber: formData.whatsAppOrdersEnabled
              ? (formData.whatsAppOrderNumber?.trim() || store?.settings?.whatsAppOrderNumber || null)
              : null,
            country: formData.country?.trim() || store?.settings?.country || null,
            city: formData.city?.trim() || store?.settings?.city || null,
            address: formData.address?.trim() || store?.settings?.address || null,
            postalCode: formData.postalCode?.trim() || store?.settings?.postalCode || null,
            defaultLanguageId: projectLang.id,
            defaultCurrencyId: formData.defaultCurrencyId || store?.settings?.defaultCurrencyId || null,
            currencyCode: formData.defaultCurrencyCode || store?.settings?.currencyCode || null,
          });
        }
      }

      updateFormData({
        defaultLanguageId: projectLang?.id,
        defaultLanguageCode: languageData.code,
        defaultLanguageName: languageData.name,
        defaultLanguageNativeName: languageData.nativeName,
        defaultLanguageFlag: languageData.flag,
        defaultLanguageRtl: languageData.rtl,
      });

      await Promise.all([refetchLanguages(), refetchStore()]);
      setCurrentStep(4);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("settings.onboarding.errors.setLanguageFailed");
      setError(msg);
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 4: Configure Default Currency
  const submitStep4 = async (currencyData: {
    id?: string;
    code: string;
    name: string;
    symbol: string;
    flag: string;
  }) => {
    setSubmitting(true);
    setError(null);
    try {
      const pid = formData.projectId || activeProjectId;
      const sid = formData.storeId || store?.id;

      if (!pid) throw new Error("Missing Project ID.");

      // Update Tenant Currency Settings
      await currenciesService.updateTenantSettings(
        {
          baseCurrencyCode: currencyData.code,
          allowMultiCurrency: true,
          autoUpdateExchangeRates: true,
          exchangeRateProvider: 2,
          enabledCurrencies: [
            {
              currencyCode: currencyData.code,
              isPaymentEnabled: true,
              customExchangeRate: 1,
            },
          ],
        },
        pid
      );

      // Update Store Settings
      if (sid) {
        await storeSettingsApi.updateSettings(sid, pid, {
          phone: formData.phone?.trim() || store?.settings?.phone || null,
          whatsAppOrdersEnabled: formData.whatsAppOrdersEnabled ?? store?.settings?.whatsAppOrdersEnabled ?? false,
          whatsAppOrderNumber: formData.whatsAppOrdersEnabled
            ? (formData.whatsAppOrderNumber?.trim() || store?.settings?.whatsAppOrderNumber || null)
            : null,
          country: formData.country?.trim() || store?.settings?.country || null,
          city: formData.city?.trim() || store?.settings?.city || null,
          address: formData.address?.trim() || store?.settings?.address || null,
          postalCode: formData.postalCode?.trim() || store?.settings?.postalCode || null,
          defaultLanguageId: formData.defaultLanguageId || store?.settings?.defaultLanguageId || null,
          defaultCurrencyId: currencyData.id || null,
          currencyCode: currencyData.code,
        });
      }

      updateFormData({
        defaultCurrencyId: currencyData.id,
        defaultCurrencyCode: currencyData.code,
        defaultCurrencyName: currencyData.name,
        defaultCurrencySymbol: currencyData.symbol,
        defaultCurrencyFlag: currencyData.flag,
      });

      await Promise.all([refetchCurrencySettings(), refetchStore()]);
      setCurrentStep(5);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("settings.onboarding.errors.setCurrencyFailed");
      setError(msg);
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 5: Configure Marketplace Membership
  const submitStep5 = async (values: { isMarketplaceMember: boolean }) => {
    setSubmitting(true);
    setError(null);
    try {
      const pid = formData.projectId || activeProjectId;
      if (!pid) throw new Error("Missing Project ID.");

      await appsApi.setMarketplaceMember(
        pid,
        values.isMarketplaceMember,
        tenantId || undefined
      );

      updateFormData({
        isMarketplaceMember: values.isMarketplaceMember,
      });

      await refetchProjects();
      setCurrentStep(6);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("settings.onboarding.errors.setMarketplaceFailed");
      setError(msg);
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 6: Final Verification & Complete Setup
  const completeOnboarding = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const pid = formData.projectId || activeProjectId;
      const sid = formData.storeId || store?.id;

      if (pid && sid) {
        // Guarantee all form settings are explicitly saved
        await storeSettingsApi.updateSettings(sid, pid, {
          phone: formData.phone?.trim() || null,
          whatsAppOrdersEnabled: !!formData.whatsAppOrdersEnabled,
          whatsAppOrderNumber: formData.whatsAppOrdersEnabled
            ? (formData.whatsAppOrderNumber?.trim() || null)
            : null,
          country: formData.country?.trim() || null,
          city: formData.city?.trim() || null,
          address: formData.address?.trim() || null,
          postalCode: formData.postalCode?.trim() || null,
          defaultLanguageId: formData.defaultLanguageId || null,
          defaultCurrencyId: formData.defaultCurrencyId || null,
          currencyCode: formData.defaultCurrencyCode || null,
        });

        if (formData.isMarketplaceMember !== undefined) {
          try {
            await appsApi.setMarketplaceMember(
              pid,
              formData.isMarketplaceMember,
              tenantId || undefined
            );
          } catch {
            // non-fatal if already set
          }
        }
      }

      const [
        freshProjectsRes,
        freshStoreRes,
        freshLanguagesRes,
        freshCurrenciesRes,
      ] = await Promise.all([
        refetchProjects(),
        refetchStore(),
        refetchLanguages(),
        refetchCurrencySettings(),
      ]);

      const freshProjects = freshProjectsRes.data || [];
      const freshActiveProject =
        freshProjects.find((p) => p.id === (formData.projectId || activeProjectId)) ||
        freshProjects[0];
      const freshStore = freshStoreRes.data;
      const freshLanguages = freshLanguagesRes.data || [];
      const freshCurrencies = freshCurrenciesRes.data;

      const state = detectOnboardingState(
        freshProjects,
        freshActiveProject,
        freshStore,
        freshLanguages,
        freshCurrencies
      );

      if (!state.isComplete) {
        setCurrentStep(state.resumeStep <= 6 ? state.resumeStep : 1);
        throw new Error(t("settings.onboarding.errors.verificationFailed"));
      }

      // Invalidate all related React Query caches
      await queryClient.invalidateQueries();

      // Move to success screen
      setCurrentStep(7);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("settings.onboarding.errors.verificationFailed");
      setError(msg);
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const goToPreviousStep = () => {
    setError(null);
    if (currentStep > 1 && currentStep <= 6) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStepNumber);
    }
  };

  return {
    onboardingState,
    currentStep,
    setCurrentStep,
    formData,
    updateFormData,
    submitting,
    error,
    isLoadingData,
    currencyCatalog,
    projectLanguages: languages,
    activeProject,
    store,
    submitStep1,
    submitStep2,
    submitStep3,
    submitStep4,
    submitStep5,
    completeOnboarding,
    goToPreviousStep,
  };
}
