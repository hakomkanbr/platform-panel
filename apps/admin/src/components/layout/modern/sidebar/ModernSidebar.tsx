// components/ModernSidebar.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Menu, Divider, Tooltip, MenuProps } from 'antd';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuFoldOutlined, MenuUnfoldOutlined, CrownOutlined } from '@ant-design/icons';
import { getSidebarItems } from '@/utils/sidebarItems';
import { IRoleType, IUserProps, ROLE } from '@/abstracts/user/user';
import { ISidebarItem } from '@/abstracts/sidebar-item';
import "./ModernSidebar.css";

interface ModernSidebarProps {
  collapsed: boolean;
  modules: any[];
  user: IUserProps;
  router: any;
  isMobile: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({ collapsed, modules, user, router, isMobile, onCollapse }) => {
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<ISidebarItem[]>([]);

  useEffect(() => {
    const currentPath = pathname?.replace('/admin/', '') || 'dashboard';
    setSelectedKeys([currentPath]);
  }, [pathname]);

  useEffect(() => {
    const items = getSidebarItems(user[ROLE] as IRoleType, modules);
    console.info("sidebar modules => ", modules);
    console.info("sidebar items => ", items);
    setMenuItems(items);
  }, [user, modules]);

  const renderMenuItems = (items: ISidebarItem[]): MenuProps['items'] => {
    return items.map(item => {
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

    const target = findItem(menuItems);
    if (target?.path) router.push(target.path);

    if (isMobile) onCollapse(true);
  };

  return (
    <div className="modern-sidebar-content">
      <div className="sidebar-logo">
        {!collapsed ? (
          <Image src="/assets/images/logo-png.png" width={200} height={60} alt="Logo" />
        ) : (
          <Tooltip title="HeadlessCMS Admin">
            <div className="logo-collapsed">
              <CrownOutlined style={{ fontSize: 28, color: '#6366f1' }} />
            </div>
          </Tooltip>
        )}
      </div>

      <Divider style={{ margin: '5px 0', borderColor: '#e2e8f0' }} />

      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        items={renderMenuItems(menuItems)}
        onClick={handleMenuClick}
        style={{ border: 'none', background: 'transparent', flex: 1 }}
      />

      {!isMobile && (
        <div className='collapse-button' onClick={() => onCollapse(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined/>}
        </div>
      )}
    </div>
  );
};

export default ModernSidebar;
