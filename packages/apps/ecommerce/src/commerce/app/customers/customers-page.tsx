"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Avatar,
  Drawer,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  ShopOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { CommerceShell } from "../../components/CommerceShell";
import { StatSkeleton } from "@repo/ui";
import { useCustomers } from "../../hooks/useCustomers";
import {
  EnumCustomerType,
  type CustomerSummaryDto,
} from "../../types/customers";

const { Title, Text } = Typography;

export function CustomersPage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<EnumCustomerType | undefined>();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummaryDto | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: customersData, isLoading, refetch, isFetching } = useCustomers({
    page: 1,
    pageSize: 50,
    search: search || undefined,
    type: typeFilter,
  });

  const customers = customersData?.data || [];

  const totalIndividual = customers.filter((c) => c.type === EnumCustomerType.Individual).length;
  const totalCorporate = customers.filter((c) => c.type === EnumCustomerType.Corporate).length;

  const handleOpenDetails = (customer: CustomerSummaryDto) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  };

  const columns = [
    {
      title: t("customers.table.name"),
      key: "name",
      render: (_: unknown, record: CustomerSummaryDto) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            style={{
              background:
                record.type === EnumCustomerType.Corporate
                  ? "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)"
                  : "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
              fontSize: 13,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {record.name?.charAt(0)?.toUpperCase() || "C"}
          </Avatar>
          <div>
            <a
              onClick={() => handleOpenDetails(record)}
              style={{ fontWeight: 600, color: "#1F2937", fontSize: 13 }}
            >
              {record.name} {record.sureName}
            </a>
            {record.unvan && (
              <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                {record.unvan}
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t("customers.table.email"),
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <Text style={{ fontSize: 13, color: "#4B5563" }}>{email || "—"}</Text>
      ),
    },
    {
      title: t("customers.table.phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone: string) => (
        <span dir="ltr" style={{ fontSize: 12, color: "#4B5563" }}>
          {phone || "—"}
        </span>
      ),
    },
    {
      title: t("customers.table.type"),
      dataIndex: "type",
      key: "type",
      render: (type: EnumCustomerType) => (
        <Tag
          color={type === EnumCustomerType.Corporate ? "purple" : "blue"}
          style={{ borderRadius: 6, fontSize: 12 }}
        >
          {type === EnumCustomerType.Corporate
            ? t("customers.type.corporate")
            : t("customers.type.individual")}
        </Tag>
      ),
    },
    {
      title: t("customers.table.actions"),
      key: "actions",
      align: "center" as const,
      render: (_: unknown, record: CustomerSummaryDto) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleOpenDetails(record)}
          style={{ borderRadius: 6 }}
        >
          {t("customers.table.viewDetails")}
        </Button>
      ),
    },
  ];

  return (
    <CommerceShell
      title={t("customers.title")}
      description={t("customers.description")}
      breadcrumbs={[{ title: t("customers.title") }]}
      actions={
        <Button
          icon={<ReloadOutlined spin={isFetching} />}
          onClick={() => refetch()}
          style={{ borderRadius: 8 }}
        >
          {t("orders.overview.refresh")}
        </Button>
      }
    >
      {/* KPI Cards */}
      {isLoading ? (
        <Row gutter={[20, 20]}>
          {[0, 1, 2].map((i) => (
            <Col xs={24} sm={8} key={i}>
              <StatSkeleton />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={8}>
            <Card
              style={{
                borderRadius: 14,
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase" }}>
                    {t("customers.overview.totalCustomers")}
                  </Text>
                  <Title level={3} style={{ margin: "6px 0 0", fontSize: 26 }}>
                    {customers.length}
                  </Title>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "#FFF3E0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#F7931E",
                    fontSize: 22,
                  }}
                >
                  <UserOutlined />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                borderRadius: 14,
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase" }}>
                    {t("customers.overview.individual")}
                  </Text>
                  <Title level={3} style={{ margin: "6px 0 0", fontSize: 26, color: "#3B82F6" }}>
                    {totalIndividual}
                  </Title>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3B82F6",
                    fontSize: 22,
                  }}
                >
                  <IdcardOutlined />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                borderRadius: 14,
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase" }}>
                    {t("customers.overview.corporate")}
                  </Text>
                  <Title level={3} style={{ margin: "6px 0 0", fontSize: 26, color: "#8B5CF6" }}>
                    {totalCorporate}
                  </Title>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "#F5F3FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8B5CF6",
                    fontSize: 22,
                  }}
                >
                  <ShopOutlined />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card
        style={{
          borderRadius: 14,
          border: "1px solid var(--border-light)",
          marginTop: 20,
          marginBottom: 20,
        }}
        bodyStyle={{ padding: "16px 20px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <Space wrap size={12}>
            <Input
              placeholder={t("customers.overview.searchPlaceholder")}
              prefix={<SearchOutlined style={{ color: "#9CA3AF" }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 280, borderRadius: 8 }}
              allowClear
            />
            <Select
              placeholder={t("customers.table.type")}
              value={typeFilter}
              onChange={setTypeFilter}
              allowClear
              style={{ width: 180 }}
              options={[
                { value: EnumCustomerType.Individual, label: t("customers.type.individual") },
                { value: EnumCustomerType.Corporate, label: t("customers.type.corporate") },
              ]}
            />
          </Space>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {customers.length} {t("customers.title")}
          </Text>
        </div>
      </Card>

      {/* Customers Table */}
      <Card
        style={{
          borderRadius: 14,
          border: "1px solid var(--border-light)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          dataSource={customers}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 15 }}
          locale={{
            emptyText: (
              <div style={{ padding: "48px 0", textAlign: "center" }}>
                <UserOutlined style={{ fontSize: 40, color: "#D1D5DB" }} />
                <Title level={5} style={{ marginTop: 12, color: "#4B5563" }}>
                  {t("customers.table.noCustomers")}
                </Title>
                <Text type="secondary">{t("customers.table.noCustomersDesc")}</Text>
              </div>
            ),
          }}
        />
      </Card>

      {/* Customer Detail Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCustomer(null);
        }}
        width={500}
        title={
          <Space>
            <UserOutlined style={{ color: "#F7931E" }} />
            <span>{selectedCustomer ? `${selectedCustomer.name} ${selectedCustomer.sureName}` : ""}</span>
          </Space>
        }
      >
        {selectedCustomer && (
          <Space direction="vertical" size={20} style={{ width: "100%" }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label={t("customers.table.name")}>
                <Text strong>{selectedCustomer.name} {selectedCustomer.sureName}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("customers.table.email")}>
                {selectedCustomer.email || "—"}
              </Descriptions.Item>
              <Descriptions.Item label={t("customers.table.phone")}>
                <span dir="ltr">{selectedCustomer.phoneNumber || "—"}</span>
              </Descriptions.Item>
              <Descriptions.Item label={t("customers.table.type")}>
                <Tag color={selectedCustomer.type === EnumCustomerType.Corporate ? "purple" : "blue"}>
                  {selectedCustomer.type === EnumCustomerType.Corporate
                    ? t("customers.type.corporate")
                    : t("customers.type.individual")}
                </Tag>
              </Descriptions.Item>
              {selectedCustomer.taxOffice && (
                <Descriptions.Item label={t("customers.table.taxOffice")}>
                  {selectedCustomer.taxOffice}
                </Descriptions.Item>
              )}
              {selectedCustomer.taxNumber && (
                <Descriptions.Item label={t("customers.table.taxNumber")}>
                  {selectedCustomer.taxNumber}
                </Descriptions.Item>
              )}
              {selectedCustomer.unvan && (
                <Descriptions.Item label={t("customers.table.company")}>
                  {selectedCustomer.unvan}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Space>
        )}
      </Drawer>
    </CommerceShell>
  );
}
