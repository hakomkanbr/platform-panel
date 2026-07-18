import React from 'react';
import { Row, Col } from 'antd';
import { EnFieldType } from "@/abstracts/modules/module-input";
import { IField } from "@/types/page";

interface GridLayoutProps {
  children: React.ReactNode;
  field: IField;
  index: number;
}

const GridLayout: React.FC<GridLayoutProps> = ({ children, field, index }) => {
  // Advanced grid logic based on field type and position
  const getGridConfig = (fieldType: EnFieldType, index: number) => {
    const baseConfig = {
      xs: 24,  // Mobile: full width
      sm: 24,  // Small tablets: full width
      md: 12,  // Medium screens: half width
      lg: 8,  // Large screens: half width
      xl: 8,  // Extra large: half width
      xxl: 6   // Ultra wide: third width
    };

    switch (fieldType) {
      case EnFieldType.editor:
        return {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24,
          xxl: 24
        };
      case EnFieldType.textArea:
        return {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 16,
          xl: 16,
          xxl: 16
        };
      case EnFieldType.image:
      case EnFieldType.gallary:
        return {
          xs: 24,
          sm: 12,
          md: 12,
          lg: 8,
          xl: 8,
          xxl: 6
        };
      case EnFieldType.number:
      case EnFieldType.moneyFormat:
      case EnFieldType.percentage:
        return {
          xs: 24,
          sm: 12,
          md: 12,
          lg: 8,
          xl: 8,
          xxl: 6
        };
      case EnFieldType.link:
        return {
          xs: 24,
          sm: 24,
          md: 16,
          lg: 12,
          xl: 12,
          xxl: 8
        };
      case EnFieldType.list:
        return {
          xs: 24,
          sm: 24,
          md: 12,
          lg: 12,
          xl: 12,
          xxl: 8
        };

      default:
        return baseConfig;
    }
  };

  const gridConfig = getGridConfig(field.fieldType as EnFieldType, index);

  return (
    <Col
      {...gridConfig}
      className="field-grid-item"
      style={{
        padding: '0 12px',
        marginBottom: '0'
      }}
    >
      {children}
    </Col>
  );
};

// Grid Container Component
export const FieldsGridContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Row
      gutter={[16, 16]}
      className="fields-grid-container"
      style={{
        margin: '0 -12px',
        width: 'calc(100%)'
      }}
    >
      {children}
    </Row>
  );
};

export default GridLayout;