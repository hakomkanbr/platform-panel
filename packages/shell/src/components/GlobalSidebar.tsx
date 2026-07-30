"use client";

import React, { useEffect, useState } from "react";
import { Menu, Typography, Avatar, Tooltip, Spin } from "antd";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { useNavigation } from "@repo/navigation";
import { useShell } from "../context/ShellContext";
import type { ISidebarItem } from "@repo/shared-types";

const { Text } = Typography;

export function GlobalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, isMobile, setCollapsed, user, projects, projectsLoading } =
    useShell();
  const { sidebarItems: platformItems, appSidebarItems } = useNavigation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    const currentPath = pathname?.replace("/admin/", "") || "dashboard";
    setSelectedKeys([currentPath.split("/")[0] || "dashboard"]);
  }, [pathname]);

  useEffect(() => {
    const items: any[] = [];

    // Platform Navigation
    items.push(...renderMenuItems(platformItems));

    // Application Navigation Divider + Items
    if (appSidebarItems.length > 0) {
      items.push({
        type: "divider",
        key: "app-divider",
        style: { margin: "8px 0", borderColor: "#E5E7EB" },
      });

      if (!collapsed) {
        items.push({
          key: "app-section-label",
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
              Active Application
            </Text>
          ),
          disabled: true,
          style: { cursor: "default", opacity: 1, padding: "4px 0" },
        });
      }

      items.push(...renderMenuItems(appSidebarItems));
    }

    console.info("items : ", items);

    setMenuItems(items);
  }, [platformItems, appSidebarItems, collapsed]);

  const handleMenuClick = ({ key }: { key: string }) => {
    const findItem = (items: ISidebarItem[]): ISidebarItem | null => {
      for (const item of items) {
        if (item.key === key) return item;
        if (item.children) {
          const child = findItem(item.children);
          if (child) return child;
        }
      }
      return null;
    };

    const allItems = [...platformItems, ...appSidebarItems];
    const target = findItem(allItems);
    if (target?.path) router.push(target.path);
    if (isMobile) setCollapsed(true);
  };

  return (
    <div className="modern-sidebar-content">
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
        style={{
          flex: 1,
          overflowY: "auto",
          padding: collapsed ? "4px 0" : "0 6px",
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={selectedKeys}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: "none", background: "transparent" }}
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
              Projects
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
                <span>No projects yet</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      {!isMobile && (
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            margin: "12px 14px",
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
  );
}

function renderMenuItems(items: ISidebarItem[]): any[] {
  return items.map((item) => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        children: renderMenuItems(item.children),
        disabled: item.disabled,
      };
    }
    return {
      key: item.key,
      icon: item.icon,
      label: item.label,
      disabled: item.disabled,
    };
  });
}
