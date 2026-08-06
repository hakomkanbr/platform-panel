"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { message } from "antd";
import { useTranslations } from "@repo/localization";

export type WorkspaceSection = "basicInfo" | "media" | "pricing" | "organization" | "seo" | "variants" | "metadata" | "relations" | "attributes";

export type SectionState = "clean" | "modified" | "uploading" | "unsaved";

export interface ProductWorkspaceState {
  productId: string | null;
  productType: number;
  setProductType: (type: number) => void;
  sections: Record<WorkspaceSection, SectionState>;
  markSectionDirty: (section: WorkspaceSection, state?: SectionState) => void;
  markSectionClean: (section: WorkspaceSection) => void;
  isAnySectionDirty: boolean;
  saveActions: {
    onSaveDraft: () => Promise<void>;
    onSave: () => Promise<void>;
    onSaveAndPublish: () => Promise<void>;
  };
  registerSaveHandler: (section: WorkspaceSection, handler: () => Promise<void>) => void;
  unregisterSaveHandler: (section: WorkspaceSection) => void;
}

const ProductWorkspaceContext = createContext<ProductWorkspaceState | null>(null);

export function ProductWorkspaceProvider({ children, productId, initialType = 1 }: { children: React.ReactNode; productId: string | null; initialType?: number }) {
  const t = useTranslations();
  
  const [productType, setProductType] = useState<number>(initialType);

  const [sections, setSections] = useState<Record<WorkspaceSection, SectionState>>({
    basicInfo: "clean",
    media: "clean",
    pricing: "clean",
    organization: "clean",
    seo: "clean",
    variants: "clean",
    metadata: "clean",
    relations: "clean",
    attributes: "clean"
  });

  const [saveHandlers, setSaveHandlers] = useState<Record<string, () => Promise<void>>>({});

  const markSectionDirty = useCallback((section: WorkspaceSection, state: SectionState = "modified") => {
    setSections(prev => prev[section] !== state ? { ...prev, [section]: state } : prev);
  }, []);

  const markSectionClean = useCallback((section: WorkspaceSection) => {
    setSections(prev => prev[section] !== "clean" ? { ...prev, [section]: "clean" } : prev);
  }, []);

  const registerSaveHandler = useCallback((section: WorkspaceSection, handler: () => Promise<void>) => {
    setSaveHandlers(prev => ({ ...prev, [section]: handler }));
  }, []);

  const unregisterSaveHandler = useCallback((section: WorkspaceSection) => {
    setSaveHandlers(prev => {
      const copy = { ...prev };
      delete copy[section];
      return copy;
    });
  }, []);

  const isAnySectionDirty = useMemo(() => {
    return Object.values(sections).some(state => state !== "clean");
  }, [sections]);

  const executeSaves = useCallback(async (publish: boolean = false) => {
    const dirtySections = Object.entries(sections).filter(([_, state]) => state !== "clean").map(([key]) => key as WorkspaceSection);
    
    if (dirtySections.length === 0 && !publish) {
      message.info(t("catalog.products.workspace.noChanges") || "No changes to save.");
      return;
    }

    const hide = message.loading(t("catalog.products.workspace.saving") || "Saving changes...", 0);
    
    try {
      const promises = dirtySections.map(async (section) => {
        const handler = saveHandlers[section];
        if (handler) {
          await handler();
          markSectionClean(section);
        }
      });

      await Promise.all(promises);

      if (publish && productId) {
         // Publish logic will go here
      }

      hide();
      message.success(t("catalog.products.workspace.saved") || "Changes saved successfully.");
    } catch (e: any) {
      hide();
      message.error(e?.message || t("catalog.products.workspace.error") || "Failed to save some changes.");
      throw e;
    }
  }, [sections, saveHandlers, markSectionClean, t, productId]);

  const value: ProductWorkspaceState = {
    productId,
    productType,
    setProductType,
    sections,
    markSectionDirty,
    markSectionClean,
    isAnySectionDirty,
    registerSaveHandler,
    unregisterSaveHandler,
    saveActions: {
      onSaveDraft: () => executeSaves(false),
      onSave: () => executeSaves(false),
      onSaveAndPublish: () => executeSaves(true),
    }
  };

  return (
    <ProductWorkspaceContext.Provider value={value}>
      {children}
    </ProductWorkspaceContext.Provider>
  );
}

export function useProductWorkspace() {
  const context = useContext(ProductWorkspaceContext);
  if (!context) {
    throw new Error("useProductWorkspace must be used within a ProductWorkspaceProvider");
  }
  return context;
}
