"use client";

import React from 'react';
import { Typography, Divider } from 'antd';

const { Title, Text } = Typography;

export interface SectionProps {
  title: string;
  description?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noDivider?: boolean;
}

export const Section: React.FC<SectionProps> = ({ title, description, extra, children, className, noDivider }) => (
  <div className={className} style={{ marginBottom: 32 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div>
        <Title level={4} style={{ fontSize: 18, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
          {title}
        </Title>
        {description && (
          <Text type="secondary" style={{ fontSize: 14, marginTop: 4, display: 'block', color: 'var(--text-secondary)' }}>
            {description}
          </Text>
        )}
      </div>
      {extra && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{extra}</div>}
    </div>
    {!noDivider && <Divider style={{ margin: '12px 0 20px' }} />}
    {children}
  </div>
);