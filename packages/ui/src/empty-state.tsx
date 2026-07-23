"use client";

import React from 'react';
import { Empty, Button, Typography } from 'antd';

const { Text } = Typography;

export interface EmptyStateProps {
  title?: string;
  description?: string;
  image?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, image, action, className }) => (
  <div className={`s2s-empty-state ${className || ''}`}>
    <Empty
      image={image || Empty.PRESENTED_IMAGE_SIMPLE}
      description={null}
      style={{ margin: 0 }}
    />
    {title && (
      <Text strong style={{ fontSize: 18, marginTop: 16, display: 'block', color: 'var(--text-primary)' }}>
        {title}
      </Text>
    )}
    {description && (
      <Text type="secondary" style={{ fontSize: 14, marginTop: 8, display: 'block', maxWidth: 320, textAlign: 'center', color: 'var(--text-secondary)' }}>
        {description}
      </Text>
    )}
    {action && (
      <Button
        type="primary"
        size="middle"
        onClick={action.onClick}
        style={{ marginTop: 20 }}
      >
        {action.label}
      </Button>
    )}
  </div>
);