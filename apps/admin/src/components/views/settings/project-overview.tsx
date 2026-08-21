"use client";

import React, { useState } from "react";
import { Spin, Button, Typography, Space, Empty, Row, Col, message } from "antd";
import { useRouter } from "next/navigation";
import { useTenantId, useUpdateProject } from "@repo/hooks";
import { useTranslations } from "@repo/localization";
import { PageTransition } from "@repo/ui";
import { useActiveProject } from "./use-active-project";
import { useStoreSettings, useCreateStore, useUpdateStoreSettings, useUpdateStore } from "@/api/use-store-settings";
import StoreHeader from "./store-header";
import ProjectInformation from "./project-information";
import StoreInformation from "./store-information";
import StoreSettingsTabs from "./store-settings-tabs";
import ProjectEditModal from "./project-edit-modal";
import StoreEditModal, { type StoreInfoFormValues } from "./store-edit-modal";

import { useQueryClient } from "@tanstack/react-query";

const { Text } = Typography;

export default function ProjectOverview() {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();
  const tenantId = useTenantId();
  const tid = tenantId || "";

  const {
    projects,
    activeProjectId,
    project,
    projectError,
    isLoading,
    switchProject,
  } = useActiveProject(tid || undefined);

  const updateProject = useUpdateProject();
  const {
    data: store,
    isLoading: storeLoading,
  } = useStoreSettings(activeProjectId || undefined);
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();
  const updateStoreSettings = useUpdateStoreSettings();

  const [projectEditVisible, setProjectEditVisible] = useState(false);
  const [storeEditVisible, setStoreEditVisible] = useState(false);

  const handleProjectSubmit = async (values: {
    name: string;
    description?: string;
    logo: string;
  }) => {
    try {
      await updateProject.mutateAsync({
        id: activeProjectId,
        request: {
          name: values.name,
          description: values.description,
          logoUrl: values.logo || "",
          logo: values.logo || "",
        },
        tenantId: tid || undefined,
      });

      if (store) {
        try {
          await updateStore.mutateAsync({
            storeId: store.id,
            projectId: activeProjectId,
            request: {
              name: values.name,
              slug: store.slug,
              description: values.description,
              logoUrl: values.logo || "",
            },
          });
        } catch {
          // non-blocking
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["project"] });
      await queryClient.invalidateQueries({ queryKey: ["store-settings"] });

      message.success(t("settings.saveSuccess"));
      setProjectEditVisible(false);
    } catch {
      // error handled in hook
    }
  };

  const handleStoreSubmit = async (values: StoreInfoFormValues) => {
    if (!activeProjectId || !project) return;
    const whatsappEnabled = !!values.whatsappPhone;

    const payload = {
      whatsAppOrdersEnabled: whatsappEnabled,
      whatsAppOrderNumber: values.whatsappPhone || null,
      phone: values.phone || null,
      address: values.address || null,
      city: values.city || null,
      country: values.country || null,
      postalCode: values.postalCode || null,
      currencyCode: values.currency || store?.settings?.currencyCode || "USD",
    };

    try {
      // 1. Update Project in Identity (always succeeds and updates logo)
      try {
        await updateProject.mutateAsync({
          id: activeProjectId,
          request: {
            name: project.name,
            description: project.description,
            logoUrl: values.logoUrl ?? "",
            logo: values.logoUrl ?? "",
          },
          tenantId: tid || undefined,
        });
      } catch (err) {
        console.error("Failed to update project logo/details:", err);
      }

      // 2. Update or Create Store in Ecommerce Module
      if (store) {
        try {
          await updateStoreSettings.mutateAsync({
            storeId: store.id,
            projectId: activeProjectId,
            request: payload,
          });
        } catch (err) {
          console.error("Failed to update store settings:", err);
        }

        try {
          await updateStore.mutateAsync({
            storeId: store.id,
            projectId: activeProjectId,
            request: {
              name: store.name || project.name,
              slug: store.slug || project.slug,
              description: store.description ?? project.description,
              logoUrl: values.logoUrl ?? "",
            },
          });
        } catch (err) {
          console.error("Failed to update store logo:", err);
        }
      } else {
        try {
          await createStore.mutateAsync({
            projectId: activeProjectId,
            request: {
              name: project.name,
              slug: project.slug,
              description: project.description,
              logoUrl: values.logoUrl ?? project.logoUrl ?? null,
              ...payload,
            },
          });
        } catch (err) {
          console.error("Failed to create store:", err);
        }
      }

      // 3. Invalidate all query caches for immediate UI refresh
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["project"] });
      await queryClient.invalidateQueries({ queryKey: ["store-settings"] });

      message.success(t("settings.saveSuccess"));
      setStoreEditVisible(false);
    } catch {
      // error handled in hook
    }
  };

  if (isLoading || storeLoading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">{t("settings.loadingProject")}</Text>
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <Empty
        style={{ marginTop: 60 }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Space direction="vertical" size={8}>
            <Text strong>{t("settings.noProjectSelected")}</Text>
            <Text type="secondary">
              {activeProjectId
                ? t("settings.projectNotLoadedDesc")
                : t("settings.selectProjectDesc")}
            </Text>
          </Space>
        }
      >
        <Button type="primary" onClick={() => router.push("/admin/projects")}>
          {t("settings.goToProjects")}
        </Button>
      </Empty>
    );
  }

  return (
    <PageTransition>
      <StoreHeader
        project={project}
        projects={projects}
        activeProjectId={activeProjectId}
        onSwitchProject={switchProject}
      />

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <ProjectInformation
            project={project}
            projectsCount={projects.length}
            onEdit={() => setProjectEditVisible(true)}
          />
        </Col>
        <Col xs={24} lg={12}>
          <StoreInformation
            project={project}
            store={store}
            onEdit={() => setStoreEditVisible(true)}
          />
        </Col>
      </Row>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          padding: "8px 16px",
        }}
      >
        <StoreSettingsTabs project={project} store={store} />
      </div>

      <ProjectEditModal
        open={projectEditVisible}
        project={project}
        submitting={updateProject.isPending}
        onCancel={() => setProjectEditVisible(false)}
        onSubmit={handleProjectSubmit}
      />

      <StoreEditModal
        open={storeEditVisible}
        project={project}
        store={store}
        submitting={updateStoreSettings.isPending || createStore.isPending}
        onCancel={() => setStoreEditVisible(false)}
        onSubmit={handleStoreSubmit}
      />
    </PageTransition>
  );
}