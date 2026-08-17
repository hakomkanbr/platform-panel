"use client";

import React from "react";
import { Card, Typography, Space, Table, Avatar, Tag } from "antd";
import { EnvironmentOutlined, HomeOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../components/CommerceShell";

import { useQuery } from "@tanstack/react-query";
import { customersApi } from "../../api/customers/customers";
import { useCommerce } from "../../context/CommerceContext";

const { Title, Text } = Typography;

export function CustomerAddressesPage() {
  const t = useTranslations();
  const { projectId } = useCommerce();

  const { data: addressesData, isLoading } = useQuery({
    queryKey: ["customers", "addresses", projectId],
    queryFn: async () => {
      try {
        const res = await customersApi.getAddresses();
        if (Array.isArray(res)) return res;
        if (res && Array.isArray((res as any).data)) return (res as any).data;
        if (res && Array.isArray((res as any).items)) return (res as any).items;
      } catch (err) {
        console.warn("Could not fetch addresses from API:", err);
      }
      return [];
    },
    enabled: !!projectId,
    staleTime: 15_000,
  });

  const addresses = addressesData || [];

  const columns = [
    {
      title: "العنوان",
      key: "title",
      render: (_: unknown, record: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            style={{
              background: "#FFF3E0",
              color: "#F7931E",
            }}
            icon={<HomeOutlined />}
          />
          <div>
            <Text strong style={{ fontSize: 13, display: "block" }}>
              {record.title || "المنزل"}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.customerName || "—"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "المدينة",
      dataIndex: "city",
      key: "city",
      render: (city: string) => (
        <Tag color="orange" style={{ borderRadius: 6 }}>
          {city || "—"}
        </Tag>
      ),
    },
    {
      title: "تفاصيل العنوان",
      dataIndex: "addressLine",
      key: "addressLine",
      render: (addr: string) => <Text style={{ fontSize: 13 }}>{addr || "—"}</Text>,
    },
    {
      title: "رقم الهاتف",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone: string) => (
        <span dir="ltr" style={{ fontSize: 12 }}>
          {phone || "—"}
        </span>
      ),
    },
  ];

  return (
    <CommerceShell
      title={t("customers.addresses.title")}
      description={t("customers.addresses.description")}
      breadcrumbs={[
        { title: t("customers.title"), href: "/admin/customers" },
        { title: t("customers.addresses.title") },
      ]}
    >
      <Card
        style={{
          borderRadius: 14,
          border: "1px solid var(--border-light)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          dataSource={addresses}
          columns={columns}
          rowKey={(r: any) => r.id || `${r.customerName}-${r.addressLine}`}
          loading={isLoading}
          pagination={false}
          locale={{
            emptyText: "لا توجد عناوين مسجلة حالياً في قاعدة البيانات",
          }}
        />
      </Card>
    </CommerceShell>
  );
}
