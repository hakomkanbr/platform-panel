"use client";

import React, { useEffect, useState } from "react";
import { Menu, Typography, Avatar, Tooltip, Spin, Dropdown } from "antd";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOutlined,
  UpOutlined,
  DownOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigation } from "@repo/navigation";
import { useTranslations, type Translator } from "@repo/localization";
import { useShell } from "../context/ShellContext";
import type { NavigationItem } from "@repo/navigation";

const { Text } = Typography;

const BOTTOM_KEYS = ["projects", "billing", "team"];

export function GlobalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, isMobile, setCollapsed, user, projects, projectsLoading } =
    useShell();
  const { platform, application } = useNavigation();
  const t = useTranslations();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [mainMenuItems, setMainMenuItems] = useState<any[]>([]);
  const [bottomMenuItems, setBottomMenuItems] = useState<any[]>([]);
  const [bottomOpen, setBottomOpen] = useState(false);

  useEffect(() => {
    if (!pathname) return;
    const allItems = [...platform, ...application];
    const findActive = (items: NavigationItem[]): NavigationItem | null => {
      let best: NavigationItem | null = null;
      const walk = (list: NavigationItem[]) => {
        for (const item of list) {
          if (item.path && pathname.startsWith(item.path)) {
            if (!best || item.path.length > best.path.length) best = item;
          }
          if (item.children) walk(item.children);
        }
      };
      walk(items);
      return best;
    };
    const getOpenChain = (
      items: NavigationItem[],
      activeKey: string,
      parents: string[] = [],
    ): string[] => {
      for (const item of items) {
        if (item.key === activeKey) return parents;
        if (item.children) {
          const res = getOpenChain(item.children, activeKey, [
            ...parents,
            item.key,
          ]);
          if (res) return res;
        }
      }
      return [];
    };
    const active = findActive(allItems);
    const activeKey = active?.key || "dashboard";
    setSelectedKeys([activeKey]);
    setOpenKeys((prev) => Array.from(new Set([...prev, ...getOpenChain(allItems, activeKey)])));
  }, [pathname, platform, application]);

  useEffect(() => {
    const mainItems = platform.filter((i) => !BOTTOM_KEYS.includes(i.key));
    const bottomItems = platform.filter((i) => BOTTOM_KEYS.includes(i.key));

    const items: any[] = [];

    // Application Navigation (top)
    // if (application.length > 0) {
    //   if (!collapsed) {
    //     items.push({
    //       key: "app-section-label",
    //       label: (
    //         <Text
    //           style={{
    //             fontSize: 11,
    //             fontWeight: 700,
    //             color: "#9CA3AF",
    //             textTransform: "uppercase",
    //             letterSpacing: "0.08em",
    //           }}
    //         >
    //           Applications
    //         </Text>
    //       ),
    //       disabled: true,
    //       style: { cursor: "default", opacity: 1, padding: "4px 0" },
    //     });
    //   }
    //   items.push(...renderMenuItems(application));
    //   items.push({
    //     type: "divider",
    //     key: "app-divider",
    //     style: { margin: "8px 0", borderColor: "#E5E7EB" },
    //   });
    // }

    // Main Platform Navigation
    if (!collapsed) {
      items.push({
        key: "main-section-label",
        label: (
          <Text
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {t("common.sidebar.overview")}
          </Text>
        ),
        disabled: true,
        style: { cursor: "default", opacity: 1, padding: "4px 0" },
      });
    }
    items.push(...renderMenuItems(mainItems, t));

    setMainMenuItems(items);
    setBottomMenuItems(renderMenuItems(bottomItems, t));
  }, [platform, application, collapsed, t]);

  const handleMenuClick = ({ key }: { key: string }) => {
    const findItem = (items: NavigationItem[]): NavigationItem | null => {
      for (const item of items) {
        if (item.key === key) return item;
        if (item.children) {
          const child = findItem(item.children);
          if (child) return child;
        }
      }
      return null;
    };

    const allItems = [...platform, ...application];
    const target = findItem(allItems);
    if (!target || target.disabled) return;
    if (target?.path) router.push(target.path);
    if (isMobile) setCollapsed(true);
    setBottomOpen(false);
  };

  const menuProps = {
    mode: "inline" as const,
    selectedKeys,
    onClick: handleMenuClick,
    style: { border: "none", background: "transparent" },
  };

  return (
    <div
      className="modern-sidebar-content"
      style={{ position: "relative" }}
    >
      {/* Brand Logo */}
      <div
        className="sidebar-logo"
        style={{ padding: collapsed ? "16px 0" : "18px 20px" }}
      >
        {!collapsed ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
            }}
            onClick={() => router.push("/admin")}
          >
            <img
              src="/assets/images/logo-png.png"
              alt="Share2Sells"
              style={{ height: 40, width: "auto", objectFit: "contain" }}
            />
          </div>
        ) : (
          <Tooltip title="Share2Sells">
            <div
              onClick={() => router.push("/admin")}
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                cursor: "pointer",
              }}
            >
              <img
                src="/assets/images/logo-icon.png"
                alt="S2S"
                style={{ height: 40, width: "auto", objectFit: "contain" }}
              />
            </div>
          </Tooltip>
        )}
      </div>

      {/* User Info */}
      <div
        className="sidebar-user"
        style={{ padding: collapsed ? "8px 0" : "0 14px 14px" }}
      >
        {!collapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 12,
              background: "#FAFBFC",
              border: "1px solid #F3F4F6",
            }}
          >
            <Avatar
              size={32}
              style={{
                background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
                fontSize: 13,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text
                strong
                style={{
                  fontSize: 13,
                  color: "#1F2937",
                  display: "block",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.username || "User"}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: "#9CA3AF",
                  display: "block",
                  marginTop: 2,
                }}
              >
                {user?.email || ""}
              </Text>
            </div>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 0 2px #D1FAE5",
                flexShrink: 0,
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        className="sidebar-scroll-area"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: collapsed ? "4px 0 160px" : "0 6px 160px",
        }}
      >
        <Menu
          {...menuProps}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          items={mainMenuItems}
          inlineIndent={18}
        />

        {/* Quick Projects */}
        {!collapsed && (
          <div style={{ marginTop: 24, padding: "0 14px" }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: 10,
              }}
            >
              {t("common.sidebar.projects")}
            </Text>
            {projectsLoading ? (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <Spin size="small" />
              </div>
            ) : projects && projects.length > 0 ? (
              projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/admin/projects/${project.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#4B5563",
                    transition: "all 0.2s ease",
                    marginTop: 2,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#FFF3E0";
                    e.currentTarget.style.color = "#F7931E";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#4B5563";
                  }}
                >
                  <FolderOutlined
                    style={{ color: project.color || "#F7931E" }}
                  />
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.name}
                  </span>
                </div>
              ))
            ) : (
              <div
                onClick={() => router.push("/admin/projects")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#9CA3AF",
                  fontStyle: "italic",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FFF3E0";
                  e.currentTarget.style.color = "#F7931E";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#9CA3AF";
                }}
              >
                <FolderOutlined />
                <span>{t("common.sidebar.noProjectsYet")}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Pinned Select: Projects, Billing, Team */}
      <div
        className="sidebar-bottom-fixed"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid #E5E7EB",
          padding: collapsed ? "8px 0" : "10px 10px",
          flexShrink: 0,
          background: "#FFFFFF",
          zIndex: 10,
        }}
      >
        {!collapsed && (
          <Dropdown
            placement="topLeft"
            trigger={["click"]}
            open={bottomOpen}
            onOpenChange={(open) => setBottomOpen(open)}
            getPopupContainer={(node) => node.parentElement as HTMLElement}
            menu={{
              items: bottomMenuItems,
              selectable: true,
              selectedKeys,
              onClick: handleMenuClick,
              style: { width: 240 },
            }}
          >
            <div
              className="sidebar-bottom-select"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 10,
                border: "1px solid #E5E7EB",
                background: "#FAFBFC",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#F7931E";
                e.currentTarget.style.background = "#FFF3E0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.background = "#FAFBFC";
              }}
            >
              <AppstoreOutlined style={{ color: "#F7931E", fontSize: 15 }} />
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1F2937",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {t("common.sidebar.workspace")}
              </span>
              {bottomOpen ? (
                <DownOutlined style={{ fontSize: 10, color: "#F7931E" }} />
              ) : (
                <UpOutlined
                  className="sidebar-bottom-arrow"
                  style={{ fontSize: 10, color: "#9CA3AF" }}
                />
              )}
            </div>
          </Dropdown>
        )}
        {collapsed && (
          <Tooltip title={t("common.sidebar.workspace")}>
            <Dropdown
              placement="top"
              trigger={["click"]}
              open={bottomOpen}
              onOpenChange={(open) => setBottomOpen(open)}
              getPopupContainer={(node) => node.parentElement as HTMLElement}
              menu={{
                items: bottomMenuItems,
                selectable: true,
                selectedKeys,
                onClick: handleMenuClick,
                style: { width: 200 },
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  border: "1px solid #E5E7EB",
                  background: "#FAFBFC",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#F7931E";
                  e.currentTarget.style.background = "#FFF3E0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.background = "#FAFBFC";
                }}
              >
                <AppstoreOutlined style={{ color: "#F7931E", fontSize: 16 }} />
              </div>
            </Dropdown>
          </Tooltip>
        )}

        {/* Collapse Toggle */}
        {!isMobile && (
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 36,
              margin: "10px 0 0",
              borderRadius: 10,
              border: "1px solid #E5E7EB",
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: "#6B7280",
              background: "#FFFFFF",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#F7931E";
              e.currentTarget.style.color = "#F7931E";
              e.currentTarget.style.background = "#FFF3E0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.color = "#6B7280";
              e.currentTarget.style.background = "#FFFFFF";
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        )}
      </div>
    </div>
  );
}

function renderMenuItems(items: NavigationItem[], t: Translator): any[] {
  return items.map((item) => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.key,
        icon: item.icon,
        label: item.labelKey && t.has(item.labelKey) ? t(item.labelKey) : item.label,
        children: renderMenuItems(item.children, t),
        disabled: item.disabled,
      };
    }
    return {
      key: item.key,
      icon: item.icon,
      label: item.labelKey && t.has(item.labelKey) ? t(item.labelKey) : item.label,
      disabled: item.disabled,
    };
  });
}
