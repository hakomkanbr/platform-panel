// components/ModernSidebar.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Menu, Divider, Tooltip, MenuProps } from "antd";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import "./ModernSidebar.css";
import { IRoleType, ISidebarItem, IUserProps } from "@repo/shared-types";

interface ModernSidebarProps {
  collapsed: boolean;
  sidebarItems: ISidebarItem[];
  user: IUserProps;
  router: any;
  isMobile: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({
  collapsed,
  sidebarItems,
  user,
  router,
  isMobile,
  onCollapse,
}) => {
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const currentPath = pathname?.replace("/admin/", "") || "home";
    setSelectedKeys([currentPath.split("/")[0] || "home"]);
  }, [pathname]);

  const renderMenuItems = (items: ISidebarItem[]): MenuProps["items"] => {
    return items.map((item) => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: renderMenuItems(item.children), // recursive
        };
      }
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
      };
    });
  };

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

    const target = findItem(sidebarItems);
    if (target?.path) router.push(target.path);

    if (isMobile) onCollapse(true);
  };

  return (
    <div className="modern-sidebar-content">
      <div className="sidebar-logo">
        {!collapsed ? (
          <Image
            src="/assets/images/logo-png.png"
            width={200}
            height={60}
            alt="Logo"
          />
        ) : (
          <Tooltip title="HeadlessCMS Admin">
            <div className="logo-collapsed">
              <CrownOutlined style={{ fontSize: 28, color: "#6366f1" }} />
            </div>
          </Tooltip>
        )}
      </div>

      <Divider style={{ margin: "5px 0", borderColor: "#e2e8f0" }} />

      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        items={renderMenuItems(sidebarItems)}
        onClick={handleMenuClick}
        style={{ border: "none", background: "transparent", flex: 1 }}
      />

      {!isMobile && (
        <div className="collapse-button" onClick={() => onCollapse(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      )}
    </div>
  );
};

export default ModernSidebar;
