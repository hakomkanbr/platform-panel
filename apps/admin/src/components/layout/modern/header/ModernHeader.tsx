"use client";
import React, { useEffect, useState } from 'react';
import {
  Layout,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Input,
  Tooltip,
  Space,
  Typography,
  Divider,
  Switch,
  notification,
  DropDownProps,
  MenuProps,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  ExpandOutlined,
  CompressOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  GlobalOutlined,
  QuestionCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { IUserProps, IRoleType, ROLE } from '@/abstracts/user/user';
import { logout } from '@/app/actions/login';
import route_paths from '@/helper/route_paths';

// Import header components
import ModernSiteSelect from './ModernSiteSelect';
import RedirectWebsite from './RedirectWebsite';
import MigrateDatabase from './MigrateDatabase';
import { deleteCookie } from '@/app/actions/set-cookie';

const { Header } = Layout;
const { Text } = Typography;

interface ModernHeaderProps {
  collapsed: boolean;
  user: IUserProps;
  onCollapse: (collapsed: boolean) => void;
  isMobile: boolean;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({
  collapsed,
  user,
  onCollapse,
  isMobile,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Dark mode toggle
  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    // Here you would implement actual dark mode logic
    notification.info({
      message: 'Theme Changed',
      description: `Switched to ${checked ? 'dark' : 'light'} mode`,
      placement: 'topRight',
      duration: 2,
    });
  };

  // User dropdown menu
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
            <Badge
              status="success"
              text={user?.role === IRoleType.User ? 'Editor' : 'Administrator'}
              style={{ fontSize: 11 }}
            />
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href={route_paths.profile}>My Profile</Link>,
    },
    // {
    //   key: 'settings',
    //   icon: <SettingOutlined />,
    //   label: 'Account Settings',
    // },
    // {
    //   key: 'help',
    //   icon: <QuestionCircleOutlined />,
    //   label: 'Help & Support',
    // },
    // {
    //   type: 'divider',
    // },
    // {
    //   key: 'theme',
    //   icon: isDarkMode ? <SunOutlined /> : <MoonOutlined />,
    //   label: (
    //     <div className="theme-toggle">
    //       <span>Dark Mode</span>
    //       <Switch
    //         size="small"
    //         checked={isDarkMode}
    //         onChange={toggleDarkMode}
    //         style={{ marginLeft: 'auto' }}
    //       />
    //     </div>
    //   ),
    // },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
      onClick: async () => {
        deleteCookie("AuthToken");
        setTimeout((i:any) => {
          location.href = "/auth/login";
        }, 1000);
      },
    },
  ];

  return (
    <Header className="modern-header">
      <div className="header-left">
        {/* Mobile menu toggle */}
        {isMobile && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
            className="mobile-menu-toggle"
          />
        )}

        {user && user.userId && user[ROLE] == IRoleType.Admin && (
          <ModernSiteSelect />
        )}
        {/* Search */}
        {/* <div className="header-search">
          <ModernSearch />
        </div> */}
      </div>

      <div className="header-right">
        <Space size="middle">
          {/* Quick Actions */}
          <div className="quick-actions">
            {/* Website redirect */}
            <RedirectWebsite />

            {/* Database migration (development only) */}
            {process.env.NODE_ENV === 'development' && (
              <MigrateDatabase />
            )}

            {/* Fullscreen toggle */}
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

          {/* Notifications */}
          {/* <ModernNotifications /> */}

          {/* User menu */}
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

        .header-center {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 2;
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

        .header-search {
          flex: 1;
          max-width: 400px;
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

        :global(.theme-toggle) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        @media (max-width: 768px) {
          :global(.modern-header) {
            padding: 0 16px;
          }

          .header-center {
            display: none;
          }

          .header-search {
            max-width: 200px;
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