"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import { DollarOutlined, PlusOutlined, TableOutlined } from "@ant-design/icons";
import { CommerceShell } from "../../components/CommerceShell";
import { StatSkeleton } from "@repo/ui";
import { usePriceLists } from "../../hooks/usePriceLists";
import { useProductPrices } from "../../hooks/useProductPrices";

const { Text, Title } = Typography;

export function PricingOverviewPage() {
  const router = useRouter();
  const priceLists = usePriceLists({ page: 1, pageSize: 1 });
  const productPrices = useProductPrices({ page: 1, pageSize: 1 });

  const loading = priceLists.isLoading || productPrices.isLoading;

  const activeLists = priceLists.data?.data.filter((p) => p.status === "active").length ?? 0;

  return (
    <CommerceShell
      title="Pricing"
      description="Control how and where your products are priced across channels, regions and customer groups."
      breadcrumbs={[{ title: "Pricing" }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/admin/pricing/price-lists/new")}>
          New price list
        </Button>
      }
    >
      {loading ? (
        <Row gutter={[24, 24]}>
          {[0, 1, 2].map((i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <StatSkeleton />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card
              onClick={() => router.push("/admin/pricing/price-lists")}
              style={{ borderRadius: 16, border: "1px solid var(--border-light)", cursor: "pointer" }}
            >
              <Text type="secondary" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Price lists
              </Text>
              <Title level={2} style={{ margin: "8px 0 0", fontSize: 32 }}>
                {priceLists.data?.count ?? 0}
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {activeLists} active
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              onClick={() => router.push("/admin/pricing/product-prices")}
              style={{ borderRadius: 16, border: "1px solid var(--border-light)", cursor: "pointer" }}
            >
              <Text type="secondary" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Product prices
              </Text>
              <Title level={2} style={{ margin: "8px 0 0", fontSize: 32 }}>
                {productPrices.data?.count ?? 0}
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Individual price records
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card style={{ borderRadius: 16, border: "1px solid var(--border-light)" }}>
              <Text type="secondary" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Quick actions
              </Text>
              <Space direction="vertical" style={{ marginTop: 12 }}>
                <Button
                  block
                  icon={<TableOutlined />}
                  onClick={() => router.push("/admin/pricing/price-lists")}
                >
                  Manage price lists
                </Button>
                <Button
                  block
                  icon={<DollarOutlined />}
                  onClick={() => router.push("/admin/pricing/product-prices")}
                >
                  Manage product prices
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      )}
    </CommerceShell>
  );
}
