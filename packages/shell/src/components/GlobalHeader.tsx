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
import { LocaleSwitcher } from "@repo/localization";
import { CommandPalette } from "@repo/ui";
import type { ApplicationDefinition } from "@repo/application-types";
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
  applications?: ApplicationDefinition[];
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
  applications,
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
              style={{ fontSize: 12, color: "#9CA3AF", display: "block" }}
            >
              {user?.email || ""}
            </Text>
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: (
        <Link href={profilePath ?? `${basePath}/users/profile`}>
          View Profile
        </Link>
      ),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link href={`${basePath}/setting`}>Settings</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: onLogout,
    },
  ];

  return (
    <>
      <Header
        className="modern-header"
        style={{
          background: "#FFFFFF",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #F3F4F6",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Left Section: App Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          {/* Mobile menu toggle */}
          {isMobile && (
            <Button
              type="text"
              icon={
                collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 18,
                width: 36,
                height: 36,
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

          {applications && <ApplicationSelector applications={applications} />}
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
              gap: 8,
              padding: "6px 16px",
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              cursor: "pointer",
              color: "#9CA3AF",
              fontSize: 13,
              background: "#FAFBFC",
              maxWidth: 320,
              width: "100%",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#F7931E";
              e.currentTarget.style.background = "#FFF8F0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.background = "#FAFBFC";
            }}
          >
            <SearchOutlined style={{ fontSize: 14 }} />
            <span>Search...</span>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <kbd
                style={{
                  padding: "1px 5px",
                  fontSize: 11,
                  borderRadius: 4,
                  border: "1px solid #D1D5DB",
                  background: "#FFFFFF",
                  color: "#6B7280",
                }}
              >
                ⌘
              </kbd>
              <kbd
                style={{
                  padding: "1px 5px",
                  fontSize: 11,
                  borderRadius: 4,
                  border: "1px solid #D1D5DB",
                  background: "#FFFFFF",
                  color: "#6B7280",
                }}
              >
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          {/* Quick Actions */}
          <Tooltip title="Toggle Fullscreen">
            <Button
              type="text"
              icon={
                isFullscreen ? <CompressOutlined /> : <ExpandOutlined />
              }
              onClick={toggleFullscreen}
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6B7280",
              }}
            />
          </Tooltip>

          <Tooltip title="Toggle theme">
            <Button
              type="text"
              icon={
                theme.mode === "dark" ? <SunOutlined /> : <MoonOutlined />
              }
              onClick={theme.toggle}
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6B7280",
              }}
            />
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <Badge count={0} size="small" offset={[-2, 2]}>
              <Button
                type="text"
                icon={
                  <BellOutlined
                    style={{ fontSize: 16, color: "#6B7280" }}
                  />
                }
                style={{
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Badge>
          </Tooltip>

          <Divider
            type="vertical"
            style={{ height: 28, margin: "0 4px", background: "#E5E7EB" }}
          />

          <LocaleSwitcher />

          {headerExtras}

          {/* User Menu */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 8px",
                borderRadius: 8,
                cursor: "pointer",
                transition: "background 0.2s",
                marginLeft: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F3F4F6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Avatar
                size={30}
                src={
                  user?.image
                    ? `${process.env.NEXT_PUBLIC_CDN}/user/${user.image}`
                    : undefined
                }
                icon={!user?.image ? <UserOutlined /> : undefined}
                style={{
                  background:
                    "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#1F2937",
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.username || "User"}
              </span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
}
