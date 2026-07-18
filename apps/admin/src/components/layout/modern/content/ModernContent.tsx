"use client";
import React from 'react';
import { Layout, Card, FloatButton, BackTop } from 'antd';
import {
  ArrowUpOutlined,
  QuestionCircleOutlined,
  BugOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { usePathname } from 'next/navigation';

const { Content } = Layout;

interface ModernContentProps {
  children: React.ReactNode;
}

const ModernContent: React.FC<ModernContentProps> = ({ children }) => {
  const pathname = usePathname();
  return (
    <Content>
      {/* Main Content Area */}
      {children}

      {/* Floating Action Buttons */}
      {/* <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24, bottom: 24 }}
        icon={<QuestionCircleOutlined />}
        tooltip="Help & Support"
      >
        <FloatButton
          icon={<MessageOutlined />}
          tooltip="Contact Support"
          onClick={() => {
            // Handle contact support
            console.log('Contact support clicked');
          }}
        />
        <FloatButton
          icon={<BugOutlined />}
          tooltip="Report Bug"
          onClick={() => {
            // Handle bug report
            console.log('Report bug clicked');
          }}
        />
        <FloatButton
          icon={<QuestionCircleOutlined />}
          tooltip="Help Documentation"
          onClick={() => {
            // Handle help documentation
            window.open('/docs', '_blank');
          }}
        />
      </FloatButton.Group> */}

      {/* Back to Top */}
      <BackTop
        style={{
          right: 24,
          bottom: 100,
        }}
      >
        <div className="back-to-top-button">
          <ArrowUpOutlined />
        </div>
      </BackTop>
    </Content>
  );
};

export default ModernContent;