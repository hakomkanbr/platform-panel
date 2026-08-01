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
import { CommerceShell } from "../../components/CommerceShell";
import { StatSkeleton } from "@repo/ui";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { useTags } from "../../hooks/useTags";

const { Title, Text } = Typography;

const quickActions = [
  { label: "New product", icon: <ProductOutlined />, path: "/products/new" },
  { label: "Add category", icon: <UnorderedListOutlined />, path: "/categories" },
  { label: "Add brand", icon: <CrownOutlined />, path: "/brands" },
  { label: "Add tag", icon: <TagsOutlined />, path: "/tags" },
];

export function CatalogOverviewPage() {
  const router = useRouter();
  const products = useProducts({ page: 1, pageSize: 1 });
  const categories = useCategories({ page: 1, pageSize: 1 });
  const brands = useBrands({ page: 1, pageSize: 1 });
  const tags = useTags({ page: 1, pageSize: 1 });

  const loading =
    products.isLoading || categories.isLoading || brands.isLoading || tags.isLoading;

  const published = products.data?.data.filter((p) => p.status === "published").length ?? 0;
  const draft = products.data?.data.filter((p) => p.status === "draft").length ?? 0;

  return (
    <CommerceShell
      title="Catalog"
      description="Manage the products, categories, brands, tags and attributes that make up your storefront."
      breadcrumbs={[{ title: "Catalog" }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/admin/catalog/products/new")}>
          New product
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
              label="Products"
              value={products.data?.count ?? 0}
              sub="Published"
              subValue={published}
              onClick={() => router.push("/admin/catalog/products")}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICardValue
              label="Categories"
              value={categories.data?.count ?? 0}
              sub="In your tree"
              subValue={draft}
              hideSub
              onClick={() => router.push("/admin/catalog/categories")}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICardValue
              label="Brands"
              value={brands.data?.count ?? 0}
              sub="Draft"
              subValue={draft}
              hideSub
              onClick={() => router.push("/admin/catalog/brands")}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICardValue
              label="Tags"
              value={tags.data?.count ?? 0}
              sub="Active"
              subValue={draft}
              hideSub
              onClick={() => router.push("/admin/catalog/tags")}
            />
          </Col>
        </Row>
      )}

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Start building" style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Text type="secondary" style={{ color: "var(--text-secondary)" }}>
                A complete catalog drives discoverability, SEO and conversions. Begin by creating products and organizing
                them with categories and attributes.
              </Text>
              <Space wrap>
                {quickActions.map((a) => (
                  <Button key={a.label} icon={a.icon} onClick={() => router.push(`/admin/catalog${a.path}`)}>
                    {a.label}
                  </Button>
                ))}
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Catalog health" style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text>
                Draft products:{" "}
                <Text strong>{draft}</Text>
              </Text>
              <Text>
                Published products:{" "}
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
