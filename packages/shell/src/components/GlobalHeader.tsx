"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Tooltip,
  Typography,
  Divider,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ExpandOutlined,
  CompressOutlined,
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShell } from "../context/ShellContext";
import { ProjectSelector } from "./ProjectSelector";
import { ApplicationSelector } from "./ApplicationSelector";
import { WorkspaceSelector } from "./WorkspaceSelector";
import { CommandPalette } from "@repo/ui";
import type { MenuProps } from "antd";

const { Header } = Layout;
const { Text } = Typography;

export interface GlobalHeaderProps {
  onLogout?: () => void;
  profilePath?: string;
  projects?: Array<{ id: string; name: string; slug?: string; color?: string }>;
  projectsLoading?: boolean;
  workspaces?: Array<{ id: string; name: string; slug?: string }>;
  activeWorkspaceId?: string;
  onWorkspaceChange?: (ws: { id: string; name: string }) => void;
  onProjectChange?: (project: {
    id: string;
    name: string;
    slug?: string;
  }) => void;
  headerExtras?: React.ReactNode;
}

export function GlobalHeader({
  onLogout,
  profilePath,
  projects,
  projectsLoading,
  workspaces,
  activeWorkspaceId,
  onWorkspaceChange,
  onProjectChange,
  headerExtras,
}: GlobalHeaderProps) {
  const router = useRouter();
  const { collapsed, isMobile, setCollapsed, user, theme, basePath } =
    useShell();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile-header",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 4px",
          }}
        >
          <Avatar
            size={44}
            src={
              user?.image
                ? `${process.env.NEXT_PUBLIC_CDN}/user/${user.image}`
                : undefined
            }
            icon={<UserOutlined />}
            style={{
              background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
              flexShrink: 0,
            }}
          />
          <div style={{ overflow: "hidden" }}>
            <Text
              strong
              style={{
                fontSize: 14,
                display: "block",
                color: "#1F2937",
                lineHeight: 1.2,
              }}
            >
              {user?.username || "User"}
            </Text>
            <Text
              style={{
                fontSize: 12,
                display: "block",
                color: "#6B7280",
                marginTop: 2,
              }}
            >
              {user?.email || ""}
            </Text>
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider", key: "divider-1" },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: (
        <Link
          href={profilePath || `${basePath}/users`}
          style={{ color: "#1F2937" }}
        >
          My Profile
        </Link>
      ),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: (
        <Link href={`${basePath}/setting`} style={{ color: "#1F2937" }}>
          Workspace Settings
        </Link>
      ),
    },
    { type: "divider", key: "divider-2" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span style={{ color: "#EF4444" }}>Sign Out</span>,
      danger: true,
      onClick: () => {
        if (onLogout) {
          onLogout();
        } else {
          location.href = "/auth/login";
        }
      },
    },
  ];

  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          padding: "0 28px",
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          position: "sticky",
          top: 0,
          zIndex: 99,
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Left Section */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
        >
          {isMobile && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6B7280",
              }}
            />
          )}

          <WorkspaceSelector
            workspaces={workspaces}
            activeWorkspaceId={activeWorkspaceId}
            onWorkspaceChange={onWorkspaceChange}
          />

          <ProjectSelector
            projects={projects}
            loading={projectsLoading}
            onProjectChange={onProjectChange}
          />

          <ApplicationSelector />
        </div>

        {/* Center Section: Global Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            onClick={() => setCommandPaletteOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 14px",
              height: 38,
              borderRadius: 10,
              border: "1px solid #E5E7EB",
              background: "#F9FAFB",
              cursor: "pointer",
              transition: "all 0.2s ease",
              width: "100%",
              maxWidth: 420,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#F7931E";
              e.currentTarget.style.background = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.background = "#F9FAFB";
            }}
          >
            <SearchOutlined
              style={{ color: "#F7931E", fontSize: 15, flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: 13,
                color: "#9CA3AF",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Search projects, applications, APIs...
            </span>
            <kbd
              style={{
                padding: "2px 6px",
                borderRadius: 5,
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                fontSize: 11,
                fontWeight: 600,
                color: "#6B7280",
                fontFamily: "monospace",
                flexShrink: 0,
                display: "contents",
              }}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
            flex: 1,
          }}
        >
          {headerExtras}

          {/* Theme Toggle */}
          <Tooltip title={theme.mode === "light" ? "Dark Mode" : "Light Mode"}>
            <Button
              type="text"
              icon={theme.mode === "light" ? <MoonOutlined /> : <SunOutlined />}
              onClick={theme.toggle}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9CA3AF",
              }}
            />
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <Badge count={0} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9CA3AF",
                }}
              />
            </Badge>
          </Tooltip>

          {/* Fullscreen */}
          <Tooltip
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <Button
              type="text"
              icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={toggleFullscreen}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9CA3AF",
              }}
            />
          </Tooltip>

          <Divider
            type="vertical"
            style={{ height: 24, margin: "0 4px", borderColor: "#E5E7EB" }}
          />

          {/* User Menu */}
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
            overlayStyle={{ minWidth: 260 }}
          >
            <div
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease",
                marginLeft: 4,
              }}
            >
              <Badge dot status="success" offset={[-4, 4]}>
                <Avatar
                  size={36}
                  src={
                    user?.image
                      ? `${process.env.NEXT_PUBLIC_CDN}/user/${user.image}`
                      : undefined
                  }
                  icon={<UserOutlined />}
                  style={{
                    background:
                      "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
                    cursor: "pointer",
                    border: "2px solid #E5E7EB",
                    flexShrink: 0,
                  }}
                />
              </Badge>
            </div>
          </Dropdown>
        </div>
      </Header>

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        basePath={basePath}
      />
    </>
  );
}
