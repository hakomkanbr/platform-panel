"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import {
  CrownOutlined,
  PlusOutlined,
  ProductOutlined,
  TagsOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../components/CommerceShell";
import { StatSkeleton } from "@repo/ui";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { useTags } from "../../hooks/useTags";

const { Title, Text } = Typography;

export function CatalogOverviewPage() {
  const t = useTranslations();
  const router = useRouter();
  const products = useProducts({ page: 1, pageSize: 1 });
  const categories = useCategories({ page: 1, pageSize: 1 });
  const brands = useBrands({ page: 1, pageSize: 1 });
  const tags = useTags({ page: 1, pageSize: 1 });

  const loading =
    products.isLoading || categories.isLoading || brands.isLoading || tags.isLoading;

  const published = products.data?.data.filter((p) => p.status === 2).length ?? 0;
  const draft = products.data?.data.filter((p) => p.status === 1).length ?? 0;

  return (
    <CommerceShell
      title={t("catalog.title")}
      description={t("catalog.description")}
      breadcrumbs={[{ title: t("catalog.title") }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/admin/catalog/products/new")}>
          {t("catalog.overview.newProduct")}
        </Button>
      }
    >
      {loading ? (
        <Row gutter={[24, 24]}>
          {[0, 1, 2, 3].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <StatSkeleton />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <KPICardValue
              label={t("catalog.overview.kpi.products")}
              value={products.data?.count ?? 0}
              sub={t("catalog.overview.kpi.published")}
              subValue={published}
              onClick={() => router.push("/admin/catalog/products")}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICardValue
              label={t("catalog.overview.kpi.categories")}
              value={categories.data?.count ?? 0}
              sub={t("catalog.overview.kpi.inYourTree")}
              subValue={draft}
              hideSub
              onClick={() => router.push("/admin/catalog/categories")}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICardValue
              label={t("catalog.overview.kpi.brands")}
              value={brands.data?.count ?? 0}
              sub={t("catalog.overview.kpi.draft")}
              subValue={draft}
              hideSub
              onClick={() => router.push("/admin/catalog/brands")}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICardValue
              label={t("catalog.overview.kpi.tags")}
              value={tags.data?.count ?? 0}
              sub={t("catalog.overview.kpi.active")}
              subValue={draft}
              hideSub
              onClick={() => router.push("/admin/catalog/tags")}
            />
          </Col>
        </Row>
      )}

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title={t("catalog.overview.startBuilding")} style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Text type="secondary" style={{ color: "var(--text-secondary)" }}>
                {t("catalog.overview.startBuildingText")}
              </Text>
              <Space wrap>
                <Button icon={<ProductOutlined />} onClick={() => router.push("/admin/catalog/products/new")}>
                  {t("catalog.overview.newProduct")}
                </Button>
                <Button icon={<UnorderedListOutlined />} onClick={() => router.push("/admin/catalog/categories")}>
                  {t("catalog.overview.quick.addCategory")}
                </Button>
                <Button icon={<CrownOutlined />} onClick={() => router.push("/admin/catalog/brands")}>
                  {t("catalog.overview.quick.addBrand")}
                </Button>
                <Button icon={<TagsOutlined />} onClick={() => router.push("/admin/catalog/tags")}>
                  {t("catalog.overview.quick.addTag")}
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t("catalog.overview.health")} style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text>
                {t("catalog.overview.draftProducts")}{" "}
                <Text strong>{draft}</Text>
              </Text>
              <Text>
                {t("catalog.overview.publishedProducts")}{" "}
                <Text strong>{published}</Text>
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </CommerceShell>
  );
}

function KPICardValue({
  label,
  value,
  sub,
  subValue,
  hideSub,
  onClick,
}: {
  label: string;
  value: number;
  sub?: string;
  subValue?: number;
  hideSub?: boolean;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      style={{
        borderRadius: 16,
        border: "1px solid var(--border-light)",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <Text type="secondary" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </Text>
      <Title level={2} style={{ margin: "8px 0 0", fontSize: 32 }}>
        {value}
      </Title>
      {!hideSub && sub && (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {sub}: {subValue ?? 0}
        </Text>
      )}
    </Card>
  );
}
