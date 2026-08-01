"use client";
import React from "react";
import { Layout, Menu, Typography, Tag } from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagOutlined,
  ShoppingOutlined,
  TeamOutlined,
  InboxOutlined,
  CommentOutlined,
  GiftOutlined,
  PercentageOutlined,
  SettingOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useSubscription } from "@/contexts/SubscriptionContext";

const { Sider } = Layout;

type MenuItem = {
  key: string;
  icon?: React.ReactNode;
  label: string;
  requiredCapability?: string;
};

const allMenuItems: (MenuItem | { type: "divider" })[] = [
  { key: "/panel", icon: <DashboardOutlined />, label: "Dashboard", requiredCapability: "panel_dashboard" },
  { key: "/panel/products", icon: <ShoppingCartOutlined />, label: "Products" },
  { key: "/panel/categories", icon: <AppstoreOutlined />, label: "Categories" },
  { key: "/panel/brands", icon: <TagOutlined />, label: "Brands", requiredCapability: "panel_brands" },
  { key: "/panel/inventory", icon: <InboxOutlined />, label: "Inventory", requiredCapability: "panel_inventory" },
  {
    key: "/panel/inventory/warehouses",
    icon: <InboxOutlined />,
    label: "Warehouses",
    requiredCapability: "panel_warehouses",
  },
  { key: "/panel/orders", icon: <ShoppingOutlined />, label: "Orders", requiredCapability: "panel_orders" },
  { key: "/panel/customers", icon: <TeamOutlined />, label: "Customers" },
  { type: "divider" as const },
  { key: "/panel/discounts", icon: <PercentageOutlined />, label: "Discounts" },
  { key: "/panel/coupons", icon: <GiftOutlined />, label: "Coupons" },
  { key: "/panel/comments", icon: <CommentOutlined />, label: "Comments" },
  { type: "divider" as const },
  {
    key: "/panel/settings/api-keys",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

export default function Sidebar({
  collapsed,
  onCollapse,
}: {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, hasCapability } = useSubscription();

  const selectedKey =
    "/" +
    (pathname.split("/").filter(Boolean).slice(0, 2).join("/") || "panel");

  const buildMenuItems = () =>
    allMenuItems.map((item) => {
      if ("type" in item) return item;

      const hasAccess = !item.requiredCapability || hasCapability(item.requiredCapability);
      const isPremium = !!item.requiredCapability && !hasAccess && !isLoading;

      return {
        key: item.key,
        icon: item.icon,
        label: isPremium ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            {item.label}
            <Tag color="gold" style={{ fontSize: 10, lineHeight: "16px", padding: "0 4px", margin: 0 }}>
              <CrownOutlined style={{ marginRight: 2 }} />PREMIUM
            </Tag>
          </span>
        ) : (
          item.label
        ),
        disabled: isPremium,
      };
    });

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      width={240}
      collapsedWidth={73}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        zIndex: 100,
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          gap: 10,
          padding: "0 16px",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "var(--gradient-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShoppingCartOutlined style={{ fontSize: 16, color: "#fff" }} />
        </div>
        {!collapsed && (
          <Typography.Text
            strong
            style={{ color: "#fa832a", fontSize: 16, letterSpacing: "-0.02em" }}
          >
            Share2Sells
          </Typography.Text>
        )}
      </div>
      <div style={{ padding: "8px 0" }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={buildMenuItems()}
          onClick={({ key }) => router.push(key)}
          style={{
            background: "transparent",
            borderRight: 0,
          }}
        />
      </div>
    </Sider>
  );
}
