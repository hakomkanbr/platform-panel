"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Col,
  Row,
  Space,
  Typography,
  Tag,
  Card,
  Result,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../../components/CommerceShell";
import {
  useProduct,
  useSetProductStatus,
  useSaveProductWorkspace,
} from "../../../hooks/useProducts";
import { getApiErrorMessage } from "../../../api/http";
import { AsyncBoundary } from "@repo/ui";

import {
  ProductWorkspaceProvider,
  useProductWorkspace,
} from "./ProductWorkspaceContext";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { PricingSection } from "./sections/PricingSection";
import { OrganizationSection } from "./sections/OrganizationSection";
import { FulfillmentSection } from "./sections/FulfillmentSection";
import { SeoSection } from "./sections/SeoSection";
import { ProductMediaTab, ProductVariantsTab } from "./product-tabs"; // Media and Variants will be updated by subagent or us

const { Text } = Typography;

function WorkspaceContent() {
  const t = useTranslations();
  const router = useRouter();
  const { productId, sections, saveActions, isAnySectionDirty, productType } =
    useProductWorkspace();
  const { data: product, isLoading, error, refetch } = useProduct(productId);
  const setStatus = useSetProductStatus();

  // Actually if we don't have a productId we need to handle Save Draft differently.
  // The orchestrator handles updates, but for Create we need `useSaveProductWorkspace`.
  const createProduct = useSaveProductWorkspace();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const handleCreate = async (e: Event) => {
      const customEvent = e as CustomEvent;
      const values = customEvent.detail;
      setCreating(true);
      try {
        const res = await createProduct.mutateAsync({
          id: null,
          body: {
            type: values.type,
            structure: 1, // Assuming standard structure
            status: 1, // Draft by default
            languageId: values.languageId,
            cultureCode: "ar-SA", // Fallback, could resolve from language
            name: values.name,
            code: values.code,
            slug: values.slug,
            description: values.description,
            shortDescription: values.shortDescription,
          }
        });
        message.success(
          t("catalog.products.workspace.draftCreated") ||
            "Draft created successfully!",
        );
        router.push(`/admin/catalog/products/${res.id}`);
      } catch (err: any) {
        message.error(getApiErrorMessage(err) || "Failed to create draft");
      } finally {
        setCreating(false);
      }
    };

    window.addEventListener("CREATE_PRODUCT", handleCreate);
    return () => window.removeEventListener("CREATE_PRODUCT", handleCreate);
  }, [createProduct, router, t]);

  const handleCreateDraft = async () => {
    // If we have no product ID, we must read from the BasicInfo form.
    // Wait, since BasicInfo has its own form, how do we get its values?
    // We could dispatch a global event, or just rely on the existing create endpoint via a centralized form,
    // OR we change the orchestrator to pass a ref.
    // Given React patterns, if `productId` is null, we can have a specific form wrapper just for Create.
    // For now, let's trigger a window event or let BasicInfo handle creation.
    // To keep it simple: if productId is null, we can't save Pricing, SEO, etc. yet.
    // The user must fill Basic Info and press "Save Draft".
    const basicInfoForm = document.getElementById(
      "basic-info-form",
    ) as HTMLFormElement;
    if (basicInfoForm) {
      basicInfoForm.requestSubmit();
    }
  };

  const onSave = async () => {
    try {
      await saveActions.onSave();
      refetch();
    } catch (e) {
      // handled in context
    }
  };

  const onPublish = async () => {
    try {
      await saveActions.onSaveAndPublish();
      if (productId) {
        await setStatus.mutateAsync({ id: productId, action: "publish" });
      }
      refetch();
      router.push("/admin/catalog/products");
    } catch (e) {
      // handled in context
    }
  };

  const isPhysical = productType === 1;
  const isDigital = productType === 2;
  const isService = productType === 3;
  const isSubscription = productType === 4;

  const getSectionStatusIndicator = (sectionKey: keyof typeof sections) => {
    const state = sections[sectionKey];
    if (state === "clean") return <Tag color="default">{t("catalog.products.workspace.saved") || "Saved"}</Tag>;
    if (state === "modified") return <Tag color="warning">{t("catalog.products.workspace.unsavedChanges") || "Unsaved Changes"}</Tag>;
    if (state === "uploading")
      return <Tag color="processing">{t("catalog.products.workspace.uploading") || "Uploading..."}</Tag>;
    return null;
  };

  const lockedState = (title: string, desc: string) => (
    <Card
      style={{
        borderRadius: 16,
        border: "1px dashed var(--border-light)",
        background: "var(--bg-subtle)",
      }}
    >
      <Result
        icon={<CheckCircleOutlined style={{ color: "var(--text-disabled)" }} />}
        title={
          <Text type="secondary" style={{ fontSize: 16 }}>
            {title}
          </Text>
        }
        subTitle={<Text type="secondary">{desc}</Text>}
      />
    </Card>
  );

  return (
    <AsyncBoundary
      loading={productId ? isLoading : false}
      error={error ? new Error(getApiErrorMessage(error)) : undefined}
      retry={refetch}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text strong style={{ fontSize: 18 }}>
                {t("catalog.products.workspace.basicInfo") || "Basic Information"}
              </Text>
              {getSectionStatusIndicator("basicInfo")}
            </div>
            {/* We add an id to the form inside BasicInfoSection in its file so we can trigger it if needed, or pass a ref */}
            <BasicInfoSection product={product} />

            {!productId ? (
              lockedState(
                t("catalog.products.workspace.lockedTitle") || "Save as Draft to continue",
                t("catalog.products.workspace.lockedDesc") || "Media, Variants, and SEO will unlock after you save the basic information.",
              )
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong style={{ fontSize: 18 }}>
                    {t("catalog.products.workspace.media") || "Media"}
                  </Text>
                  {getSectionStatusIndicator("media")}
                </div>
                <Card
                  style={{
                    borderRadius: 16,
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <ProductMediaTab productId={productId} />
                </Card>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong style={{ fontSize: 18 }}>
                    {t("catalog.products.workspace.variantsWorkspace") || "Variants Workspace"}
                  </Text>
                  {getSectionStatusIndicator("variants")}
                </div>
                <Card
                  style={{
                    borderRadius: 16,
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <ProductVariantsTab productId={productId} />
                </Card>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong style={{ fontSize: 18 }}>
                    {t("catalog.products.workspace.seo") || "Search Engine Optimization (SEO)"}
                  </Text>
                  {getSectionStatusIndicator("seo")}
                </div>
                <SeoSection product={product} />
              </>
            )}
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {productId && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong style={{ fontSize: 18 }}>
                    {t("catalog.products.workspace.pricing") || "Pricing"}
                  </Text>
                  {getSectionStatusIndicator("pricing")}
                </div>
                <PricingSection product={product} />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong style={{ fontSize: 18 }}>
                    {t("catalog.products.workspace.organization") || "Organization"}
                  </Text>
                  {getSectionStatusIndicator("organization")}
                </div>
                <OrganizationSection product={product} />

                {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Text strong style={{ fontSize: 18 }}>{t("catalog.products.workspace.fulfillment", "Rules & Fulfillment")}</Text>
                     {getSectionStatusIndicator("attributes")}
                  </div>
                  <FulfillmentSection product={product} /> */}
              </>
            )}

            <Card
              style={{
                borderRadius: 16,
                border: "1px solid var(--border-light)",
                background: "#f8fafc",
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                {!productId ? (
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={handleCreateDraft}
                    loading={creating}
                  >
                    {t("catalog.products.workspace.saveDraft") || "Save Draft"}
                  </Button>
                ) : (
                  <>
                    <Button
                      block
                      size="large"
                      onClick={onSave}
                      disabled={!isAnySectionDirty}
                      icon={<SaveOutlined />}
                    >
                      {t("catalog.products.workspace.saveChanges") || t("common.actions.saveChanges") || "Save Changes"}
                    </Button>
                    <Button
                      type="primary"
                      block
                      size="large"
                      onClick={onPublish}
                      icon={<RocketOutlined />}
                    >
                      {t("catalog.products.workspace.publishProduct") || "Publish Product"}
                    </Button>
                  </>
                )}
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </AsyncBoundary>
  );
}

export function ProductWorkspace({ id }: { id: string | null }) {
  const t = useTranslations();
  const router = useRouter();

  const title = id
    ? t("catalog.products.edit.title") || "Edit Product"
    : t("catalog.products.create.title") || "Create Product";

  return (
    <ProductWorkspaceProvider productId={id}>
      <CommerceShell
        title={title}
        breadcrumbs={[
          { title: t("catalog.title") || "Catalog", href: "/admin/catalog" },
          {
            title: t("catalog.products.title") || "Products",
            href: "/admin/catalog/products",
          },
          { title: title },
        ]}
        actions={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/admin/catalog/products")}
          >
            {t("common.actions.back")}
          </Button>
        }
      >
        <WorkspaceContent />
      </CommerceShell>
    </ProductWorkspaceProvider>
  );
}
