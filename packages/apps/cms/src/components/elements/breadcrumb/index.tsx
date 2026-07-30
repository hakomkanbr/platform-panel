import React from 'react';
import { Breadcrumb, Typography } from 'antd';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import './breadcrumb.css';

const { Text } = Typography;

interface BreadcrumbItem {
  title: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

interface EBreadcrumbProps {
  items: BreadcrumbItem[];
  showBackground?: boolean;
  size?: 'small' | 'default' | 'large';
}

const EBreadcrumb: React.FC<EBreadcrumbProps> = ({ 
  items, 
  showBackground = true,
  size = 'default' 
}) => {
  const processedItems = items.map((item, index) => {
    const isLast = index === items.length - 1;
    
    return {
      title: item.href && !isLast ? (
        <Link href={item.href} className="breadcrumb-link">
          <span className="breadcrumb-item-content">
            {item.icon}
            {item.title}
          </span>
        </Link>
      ) : (
        <span className={`breadcrumb-item-content ${isLast ? 'breadcrumb-current' : ''}`}>
          {item.icon}
          {item.title}
        </span>
      ),
      href: item.href
    };
  });

  return (
    <div className={`enhanced-breadcrumb-container ${showBackground ? 'with-background' : ''} size-${size}`}>
      <div className="breadcrumb-wrapper">
        <Breadcrumb
          separator={<RightOutlined className="breadcrumb-separator" />}
          items={processedItems}
          className="enhanced-breadcrumb"
        />
      </div>
      
      {/* Decorative elements */}
      <div className="breadcrumb-decoration">
        <div className="decoration-dot"></div>
        <div className="decoration-line"></div>
      </div>
    </div>
  );
};

export default EBreadcrumb;