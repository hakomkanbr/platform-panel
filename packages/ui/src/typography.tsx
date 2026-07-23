"use client";

import React from 'react';
import { Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;

export interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ children, className }) => (
  <div className={`s2s-page-header ${className || ''}`}>
    <Title level={2} style={{ fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
      {children}
    </Title>
  </div>
);

export interface PageDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageDescription: React.FC<PageDescriptionProps> = ({ children, className }) => (
  <Text type="secondary" className={className} style={{ fontSize: 15, display: 'block', marginTop: 4 }}>
    {children}
  </Text>
);

export interface PageHeaderProps {
  title: string;
  description?: string;
  extra?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, extra, className }) => (
  <div className={`s2s-page-header ${className || ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <Title level={2} style={{ fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1.2, color: 'var(--text-primary)' }}>
        {title}
      </Title>
      {description && (
        <Text type="secondary" style={{ fontSize: 15, display: 'block', marginTop: 4, color: 'var(--text-secondary)' }}>
          {description}
        </Text>
      )}
    </div>
    {extra && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{extra}</div>}
  </div>
);