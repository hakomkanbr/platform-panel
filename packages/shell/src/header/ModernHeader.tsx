"use client";

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Tooltip,
  Typography,
  Divider,
  MenuProps,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ExpandOutlined,
  CompressOutlined,
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
  DownOutlined,
  PlusOutlined,
  FolderOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { IUserProps } from '@repo/shared-types';
import { CommandPalette } from '@repo/ui';

const { Header } = Layout;
const { Text } = Typography;

interface ModernHeaderProps {
  collapsed: boolean;
  user: IUserProps;
  onCollapse: (collapsed: boolean) => void;
  isMobile: boolean;
  onLogout?: () => void;
  headerComponents?: {
    siteSelect?: React.ReactNode;
    redirectWebsite?: React.ReactNode;
    migrateDatabase?: React.ReactNode;
  };
  basePath?: string;
  profilePath?: string;
  currentProject?: { name: string; id: string | number } | null;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({
  collapsed,
  user,
  onCollapse,
  isMobile,
  onLogout,
  headerComponents,
  basePath = "/admin",
  profilePath,
  currentProject,
}) => {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const projectMenuItems: MenuProps['items'] = [
    {
      key: 'project-overview',
      icon: <FolderOutlined style={{ color: '#F7931E' }} />,
      label: 'Project Overview',
      onClick: () => router.push(`${basePath}/projects/${currentProject?.id || '1'}`),
    },
    {
      key: 'project-apps',
      icon: <AppstoreOutlined style={{ color: '#009FE3' }} />,
      label: 'Applications',
      onClick: () => router.push(`${basePath}/projects/${currentProject?.id || '1'}/apps`),
    },
    {
      key: 'project-settings',
      icon: <SettingOutlined style={{ color: '#6B7280' }} />,
      label: 'Project Settings',
      onClick: () => router.push(`${basePath}/projects/${currentProject?.id || '1'}/settings`),
    },
    { type: 'divider' },
    {
      key: 'all-projects',
      label: 'All Projects',
      onClick: () => router.push(`${basePath}/projects`),
    },
  ];

  const quickActionItems: MenuProps['items'] = [
    {
      key: 'new-project',
      icon: <FolderOutlined style={{ color: '#F7931E' }} />,
      label: 'New Project',
      onClick: () => router.push(`${basePath}/projects/new`),
    },
    {
      key: 'new-app',
      icon: <AppstoreOutlined style={{ color: '#009FE3' }} />,
      label: 'Install Application',
      onClick: () => router.push(`${basePath}/app-library`),
    },
    {
      key: 'invite-member',
      icon: <UserAddOutlined style={{ color: '#10B981' }} />,
      label: 'Invite Team Member',
      onClick: () => router.push(`${basePath}/users`),
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: 'profile-header',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px' }}>
          <Avatar
            size={44}
            src={user?.image ? `${process.env.NEXT_PUBLIC_CDN}/user/${user.image}` : undefined}
            icon={<UserOutlined />}
            style={{ background: 'linear-gradient(135deg, #F7931E 0%, #E67E00 100%)', flexShrink: 0 }}
          />
          <div style={{ overflow: 'hidden' }}>
            <Text strong style={{ fontSize: 14, display: 'block', color: '#1F2937', lineHeight: 1.2 }}>
              {user?.username || 'User'}
            </Text>
            <Text style={{ fontSize: 12, display: 'block', color: '#6B7280', marginTop: 2 }}>
              {user?.email || ''}
            </Text>
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href={profilePath || `${basePath}/users`} style={{ color: '#1F2937' }}>My Profile</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link href={`${basePath}/setting`} style={{ color: '#1F2937' }}>Workspace Settings</Link>,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <span style={{ color: '#EF4444' }}>Sign Out</span>,
      danger: true,
      onClick: () => {
        if (onLogout) {
          onLogout();
        } else {
          location.href = `${basePath}/auth/login`;
        }
      },
    },
  ];

  return (
    <>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          padding: '0 28px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Left Section: Collapse + Workspace Context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          {isMobile && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => onCollapse(!collapsed)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280',
              }}
            />
          )}

          {headerComponents?.siteSelect}

          {currentProject && (
            <Dropdown menu={{ items: projectMenuItems }} trigger={['click']} placement="bottomLeft">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '5px 12px',
                  borderRadius: 8,
                  background: '#FFF3E0',
                  border: '1px solid #FDE68A',
                  transition: 'all 0.2s ease',
                  userSelect: 'none',
                }}
              >
                <FolderOutlined style={{ color: '#F7931E', fontSize: 13 }} />
                <Text strong style={{ fontSize: 13, color: '#F7931E' }}>
                  {currentProject.name}
                </Text>
                <DownOutlined style={{ fontSize: 9, color: '#F7931E' }} />
              </div>
            </Dropdown>
          )}
        </div>

        {/* Middle Section: Raycast Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
          <div
            onClick={() => setCommandPaletteOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 14px',
              height: 38,
              borderRadius: 10,
              border: '1px solid #E5E7EB',
              background: '#F9FAFB',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%',
              maxWidth: 420,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#F7931E';
              e.currentTarget.style.background = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.background = '#F9FAFB';
            }}
          >
            <SearchOutlined style={{ color: '#F7931E', fontSize: 15, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#9CA3AF', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Search projects, applications, APIs...
            </span>
            <kbd
              style={{
                padding: '2px 6px',
                borderRadius: 5,
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                fontSize: 11,
                fontWeight: 600,
                color: '#6B7280',
                fontFamily: 'monospace',
                flexShrink: 0,
              }}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section: Quick Action + Notifications + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flex: 1 }}>
          <Dropdown menu={{ items: quickActionItems }} trigger={['click']} placement="bottomRight">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                borderRadius: 9,
                height: 36,
                padding: '0 14px',
                fontSize: 13,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #F7931E 0%, #E67E00 100%)',
                border: 'none',
                boxShadow: '0 2px 6px rgba(247, 147, 30, 0.25)',
              }}
            >
              Create
            </Button>
          </Dropdown>

          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 4 }}>
            {headerComponents?.redirectWebsite}
            {process.env.NODE_ENV === 'development' && headerComponents?.migrateDatabase}

            <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
              <Button
                type="text"
                icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
                onClick={toggleFullscreen}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9CA3AF',
                }}
              />
            </Tooltip>
          </div>

          <Divider type="vertical" style={{ height: 24, margin: '0 4px', borderColor: '#E5E7EB' }} />

          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={['click']}
            placement="bottomRight"
            overlayStyle={{ minWidth: 260 }}
          >
            <div style={{ cursor: 'pointer', transition: 'all 0.2s ease', marginLeft: 4 }}>
              <Badge dot status="success" offset={[-4, 4]}>
                <Avatar
                  size={36}
                  src={user?.image ? `${process.env.NEXT_PUBLIC_CDN}/user/${user.image}` : undefined}
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #F7931E 0%, #E67E00 100%)',
                    cursor: 'pointer',
                    border: '2px solid #E5E7EB',
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
};

export default ModernHeader;