"use client";
import React from 'react';
import { Layout } from 'antd';
import { PageTransition } from '@repo/ui';

const { Content } = Layout;

interface ModernContentProps {
  children: React.ReactNode;
}

const ModernContent: React.FC<ModernContentProps> = ({ children }) => {
  return (
    <Content style={{ minHeight: 'calc(100vh - 64px - 48px)' }}>
      <PageTransition>
        {children}
      </PageTransition>
    </Content>
  );
};

export default ModernContent;