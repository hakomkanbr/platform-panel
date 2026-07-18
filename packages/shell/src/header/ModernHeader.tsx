"use client";
import React, { useState } from 'react';
import {
  Layout,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Tooltip,
  Space,
  Typography,
  Divider,
  MenuProps,
  Input,
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
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IRoleType, ROLE } from '@repo/shared-types';
import type { IUserProps } from '@repo/shared-types';

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
    notifications?: React.ReactNode;
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
  const [searchFocused, setSearchFocused] = useState(false);

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
    { key: 'project-overview', label: 'Project Overview', onClick: () => router.push(`${basePath}/projects/${currentProject?.id}`) },
    { key: 'project-apps', label: 'Applications', onClick: () => router.push(`${basePath}/projects/${currentProject?.id}/apps`) },
    { key: 'project-settings', label: 'Project Settings', onClick: () => router.push(`${basePath}/projects/${currentProject?.id}/settings`) },
    { type: 'divider' },
    { key: 'all-projects', label: 'All Projects', onClick: () => router.push(`${basePath}/projects`) },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: 'profile-header',
      label: (
        <div className="user-profile-header">
          <Avatar
            size={48}
            src={user?.image ? `${process.env.NEXT_PUBLIC_CDN}/user/${user.image}` : undefined}
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            }}
          />
          <div className="user-info">
            <Text strong style={{ fontSize: 16 }}>{user?.username || 'Admin User'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user?.email || 'admin@example.com'}
            </Text>
      
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    ...(profilePath ? [{
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href={profilePath}>My Profile</Link>,
    }] : []),
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
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
    <Header className="modern-header">
      <div className="header-left">
        {isMobile && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
            className="mobile-menu-toggle"
          />
        )}

        {/* Project Context */}
        {currentProject ? (
          <Dropdown menu={{ items: projectMenuItems }} trigger={['click']} placement="bottomLeft">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 10,
                background: 'var(--primary-light)',
                border: '1px solid var(--border-light)',
                transition: 'all 0.2s ease',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              <Text strong style={{ fontSize: 14, color: 'var(--primary)' }}>
                {currentProject.name}
              </Text>
              <DownOutlined style={{ fontSize: 10, color: 'var(--primary)' }} />
            </div>
          </Dropdown>
        ) : (
          <Button
            type="text"
            onClick={() => router.push(`${basePath}/projects`)}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              borderRadius: 10,
              height: 38,
            }}
          >
            Select Project
          </Button>
        )}

        {/* Global Search */}
        <div
          className="header-search"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 14px',
            height: 38,
            borderRadius: 10,
            border: `1px solid ${searchFocused ? 'var(--primary)' : 'var(--border)'}`,
            background: searchFocused ? 'var(--bg-card)' : 'var(--bg-subtle)',
            transition: 'all 0.2s ease',
            width: 280,
            marginLeft: 16,
          }}
        >
          <SearchOutlined style={{ color: 'var(--text-tertiary)', fontSize: 15 }} />
          <input
            placeholder="Search projects, apps..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              flex: 1,
              fontSize: 13,
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      <div className="header-right">
        <Space size="middle">
          <div className="quick-actions">
            {headerComponents?.redirectWebsite}
            {process.env.NODE_ENV === 'development' && headerComponents?.migrateDatabase}

            <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
              <Button
                type="text"
                icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
                onClick={toggleFullscreen}
                className="action-button"
              />
            </Tooltip>
          </div>

          <Divider type="vertical" style={{ height: 32, margin: '0 8px' }} />

          {headerComponents?.notifications}

          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={['click']}
            placement="bottomRight"
            overlayClassName="modern-user-dropdown"
          >
            <div className="user-avatar-container">
              <Badge dot status="success" offset={[-8, 8]}>
                <Avatar
                  size={36}
                  src={user?.image ? `${process.env.NEXT_PUBLIC_CDN}/user/${user.image}` : undefined}
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    cursor: 'pointer',
                    border: '2px solid #e2e8f0',
                  }}
                />
              </Badge>
            </div>
          </Dropdown>
        </Space>
      </div>

      <style jsx>{`
        :global(.modern-header) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          padding: 0 24px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .header-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex: 1;
        }

        .mobile-menu-toggle {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-toggle:hover {
          background: #f1f5f9;
          color: #6366f1;
        }

        .quick-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        :global(.action-button) {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        :global(.action-button:hover) {
          background: #f1f5f9;
          color: #6366f1;
        }

        .user-avatar-container {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-avatar-container:hover {
          transform: scale(1.05);
        }

        :global(.modern-user-dropdown .ant-dropdown-menu) {
          min-width: 280px;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05);
          border: 1px solid #e2e8f0;
        }

        :global(.user-profile-header) {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 4px;
        }

        :global(.user-profile-header .user-info) {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        @media (max-width: 768px) {
          :global(.modern-header) {
            padding: 0 16px;
          }

          .quick-actions {
            gap: 2px;
          }
        }
      `}</style>
    </Header>
  );
};

export default ModernHeader;
