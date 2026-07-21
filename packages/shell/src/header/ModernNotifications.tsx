"use client";
import React, { useState, useEffect } from 'react';
import {
  Badge,
  Button,
  Dropdown,
  List,
  Typography,
  Avatar,
  Tag,
  Empty,
  Divider,
  Tooltip,
  Space,
} from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserAddOutlined,
  FileTextOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
  avatar?: React.ReactNode;
}

const ModernNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'New User Registration',
      message: 'John Doe has registered as a new user',
      type: 'info',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      action: { label: 'View User', url: '/admin/users' },
      avatar: <UserAddOutlined style={{ color: '#6366f1' }} />,
    },
    {
      id: '2',
      title: 'Content Published',
      message: 'Article "Getting Started with CMS" has been published',
      type: 'success',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      read: false,
      action: { label: 'View Content', url: '/admin/contents' },
      avatar: <FileTextOutlined style={{ color: '#10b981' }} />,
    },
    {
      id: '3',
      title: 'Database Backup',
      message: 'Scheduled database backup completed successfully',
      type: 'success',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
      avatar: <DatabaseOutlined style={{ color: '#10b981' }} />,
    },
    {
      id: '4',
      title: 'Storage Warning',
      message: 'Storage usage is at 85%. Consider upgrading your plan.',
      type: 'warning',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      action: { label: 'View Settings', url: '/admin/settings' },
      avatar: <WarningOutlined style={{ color: '#f59e0b' }} />,
    },
    {
      id: '5',
      title: 'System Update',
      message: 'System has been updated to version 2.1.0',
      type: 'info',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      avatar: <InfoCircleOutlined style={{ color: '#6366f1' }} />,
    },
  ];

  // Initialize notifications
  useEffect(() => {
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#10b981' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#f59e0b' }} />;
      case 'error':
        return <ExclamationCircleOutlined style={{ color: '#ef4444' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#6366f1' }} />;
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6366f1';
    }
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    return moment(timestamp).fromNow();
  };

  // Notification dropdown content
  const notificationContent = (
    <div className="notifications-dropdown">
      {/* Header */}
      <div className="notifications-header">
        <div className="header-title">
          <Title level={5} style={{ margin: 0 }}>
            Notifications
          </Title>
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ backgroundColor: '#6366f1' }} />
          )}
        </div>
        <div className="header-actions">
          <Tooltip title="Mark all as read">
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined />}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            />
          </Tooltip>
          <Tooltip title="Notification settings">
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
            />
          </Tooltip>
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* Notifications List */}
      <div className="notifications-list">
        {notifications.length > 0 ? (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                actions={[
                  <Tooltip title="Mark as read" key="read">
                    <Button
                      type="text"
                      size="small"
                      icon={<CheckOutlined />}
                      onClick={() => markAsRead(notification.id)}
                      disabled={notification.read}
                    />
                  </Tooltip>,
                  <Tooltip title="Delete" key="delete">
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => deleteNotification(notification.id)}
                      danger
                    />
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={notification.avatar || getNotificationIcon(notification.type)}
                      style={{
                        background: `${getNotificationColor(notification.type)}15`,
                        border: `1px solid ${getNotificationColor(notification.type)}30`,
                      }}
                    />
                  }
                  title={
                    <div className="notification-title">
                      <Text strong style={{ fontSize: 13 }}>
                        {notification.title}
                      </Text>
                      <Tag
                        color={getNotificationColor(notification.type)}
                        style={{ fontSize: 10, marginLeft: 8 }}
                      >
                        {notification.type.toUpperCase()}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="notification-content">
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {notification.message}
                      </Text>
                      <div className="notification-meta">
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {formatTimestamp(notification.timestamp)}
                        </Text>
                        {notification.action && (
                          <Button
                            type="link"
                            size="small"
                            style={{ padding: 0, height: 'auto', fontSize: 11 }}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description="No notifications"
            style={{ padding: '40px 20px' }}
          />
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <>
          <Divider style={{ margin: 0 }} />
          <div className="notifications-footer">
            <Button type="link" size="small" block>
              View All Notifications
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dropdown
      overlay={notificationContent}
      trigger={['click']}
      placement="bottomRight"
      open={dropdownVisible}
      onOpenChange={setDropdownVisible}
      overlayClassName="modern-notifications-dropdown"
    >
      <div className="notifications-trigger">
        <Badge count={unreadCount} size="small" offset={[-8, 8]}>
          <Button
            type="text"
            icon={<BellOutlined />}
            className="notifications-button"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </Badge>
      </div>

      <style jsx>{`
        .notifications-trigger {
          cursor: pointer;
        }

        :global(.notifications-button) {
          transition: all 0.2s ease;
        }

        :global(.notifications-button:hover) {
          background: #f1f5f9;
          color: #6366f1;
        }

        :global(.modern-notifications-dropdown .ant-dropdown-menu) {
          padding: 0;
          width: 380px;
          max-height: 500px;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05);
          border: 1px solid #e2e8f0;
        }

        .notifications-dropdown {
          display: flex;
          flex-direction: column;
          max-height: 500px;
        }

        .notifications-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #f8fafc;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .notifications-list {
          flex: 1;
          overflow-y: auto;
          max-height: 350px;
        }

        :global(.notification-item) {
          padding: 12px 20px;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }

        :global(.notification-item:hover) {
          background: #f8fafc;
        }

        :global(.notification-item.unread) {
          background: #f0f9ff;
          border-left: 3px solid #6366f1;
        }

        :global(.notification-item:last-child) {
          border-bottom: none;
        }

        .notification-title {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }

        .notification-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
        }

        .notifications-footer {
          padding: 12px 20px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        @media (max-width: 768px) {
          :global(.modern-notifications-dropdown .ant-dropdown-menu) {
            width: 320px;
          }
        }
      `}</style>
    </Dropdown>
  );
};

export default ModernNotifications;