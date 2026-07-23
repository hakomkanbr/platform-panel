"use client";

import React, { useEffect, useState } from "react";
import { Modal, Input } from "antd";
import {
  SearchOutlined,
  FolderOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  CodeOutlined,
  ThunderboltOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  basePath?: string;
}

interface CommandItem {
  id: string;
  title: string;
  category: "Projects" | "Applications" | "Navigation" | "Actions";
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  basePath = "/admin",
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items: CommandItem[] = [
    {
      id: "create-project",
      title: "Create New Project",
      category: "Actions",
      icon: <ThunderboltOutlined style={{ color: "#F7931E" }} />,
      path: `${basePath}/projects/new`,
      shortcut: "⌘N",
    },
    {
      id: "browse-apps",
      title: "Browse App Library",
      category: "Applications",
      icon: <AppstoreOutlined style={{ color: "#009FE3" }} />,
      path: `${basePath}/app-library`,
    },
    {
      id: "ecommerce-proj",
      title: "Ecommerce Platform",
      category: "Projects",
      icon: <FolderOutlined style={{ color: "#F7931E" }} />,
      path: `${basePath}/projects/1`,
    },
    {
      id: "cms-proj",
      title: "Content Management CMS",
      category: "Projects",
      icon: <FolderOutlined style={{ color: "#10B981" }} />,
      path: `${basePath}/projects/2`,
    },
    {
      id: "crm-proj",
      title: "CRM Customer System",
      category: "Projects",
      icon: <FolderOutlined style={{ color: "#EF4444" }} />,
      path: `${basePath}/projects/4`,
    },
    {
      id: "user-management",
      title: "User Management & Permissions",
      category: "Navigation",
      icon: <UserOutlined style={{ color: "#8B5CF6" }} />,
      path: `${basePath}/users`,
    },
    {
      id: "platform-settings",
      title: "Platform Settings",
      category: "Navigation",
      icon: <SettingOutlined style={{ color: "#6B7280" }} />,
      path: `${basePath}/setting`,
    },
    {
      id: "api-keys",
      title: "API Keys & Integrations",
      category: "Actions",
      icon: <CodeOutlined style={{ color: "#009FE3" }} />,
      path: `${basePath}/setting?tab=api`,
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: CommandItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.path) {
      router.push(item.path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={640}
      centered
      styles={{
        content: {
          padding: 0,
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #E5E7EB",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        },
        body: {
          padding: 0,
        },
      }}
    >
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 12 }}>
        <SearchOutlined style={{ fontSize: 18, color: "#F7931E" }} />
        <Input
          placeholder="Search projects, applications, APIs, settings... (Use ↑↓ arrows)"
          variant="borderless"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ fontSize: 15, color: "#1F2937", padding: 0 }}
        />
        <kbd
          style={{
            padding: "2px 6px",
            borderRadius: 6,
            background: "#F3F4F6",
            border: "1px solid #E5E7EB",
            fontSize: 11,
            color: "#6B7280",
            fontFamily: "monospace",
          }}
        >
          ESC
        </kbd>
      </div>

      <div style={{ maxHeight: 380, overflowY: "auto", padding: 8 }}>
        {filteredItems.length === 0 ? (
          <div style={{ padding: "32px 16px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
            No results found for &ldquo;{query}&rdquo;
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: isSelected ? "#FFF3E0" : "transparent",
                  border: `1px solid ${isSelected ? "#FDE68A" : "transparent"}`,
                  transition: "all 0.15s ease",
                  marginBottom: 2,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: isSelected ? "#FFFFFF" : "#F9FAFB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      border: "1px solid #F3F4F6",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#1F2937", display: "block" }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{item.category}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {item.shortcut && (
                    <kbd
                      style={{
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        fontSize: 11,
                        color: "#9CA3AF",
                      }}
                    >
                      {item.shortcut}
                    </kbd>
                  )}
                  <RightOutlined style={{ fontSize: 12, color: isSelected ? "#F7931E" : "#D1D5DB" }} />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div
        style={{
          padding: "10px 20px",
          background: "#FAFBFC",
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          color: "#9CA3AF",
        }}
      >
        <span>
          Navigate with <kbd style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, padding: "1px 4px" }}>↑</kbd>{" "}
          <kbd style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, padding: "1px 4px" }}>↓</kbd>
        </span>
        <span>
          Select with <kbd style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, padding: "1px 4px" }}>↵</kbd>
        </span>
      </div>
    </Modal>
  );
};
