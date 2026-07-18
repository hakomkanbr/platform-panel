import React from 'react';
import { Card, Typography, Tag } from 'antd';
import { getFieldTypeLabel, getFieldTypeColor } from './fieldTypesConfig';

const { Text, Title } = Typography;

interface FieldPreviewProps {
  fieldType: string;
  fieldName: string;
  options?: any;
}

const FieldPreview: React.FC<FieldPreviewProps> = ({ fieldType, fieldName, options = {} }) => {

  const renderFieldOptions = () => {
    const optionsList = [];
    
    if (options.required) {
      optionsList.push(<Tag key="required" color="red">مطلوب</Tag>);
    }
    
    if (options.defaultValue) {
      optionsList.push(<Tag key="default" color="blue">قيمة افتراضية</Tag>);
    }
    
    if (options.minLength || options.maxLength) {
      optionsList.push(<Tag key="length" color="orange">محدود الطول</Tag>);
    }
    
    if (options.maxFileSize) {
      optionsList.push(<Tag key="filesize" color="purple">محدود الحجم</Tag>);
    }

    return optionsList;
  };

  if (!fieldType || !fieldName) {
    return (
      <Card size="small" style={{ marginTop: 16 }}>
        <Text type="secondary">اختر نوع الحقل لرؤية المعاينة</Text>
      </Card>
    );
  }

  return (
    <Card size="small" style={{ marginTop: 16 }} title="معاينة الحقل">
      <div style={{ marginBottom: 8 }}>
        <Title level={5} style={{ margin: 0 }}>
          {fieldName}
        </Title>
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <Tag color={getFieldTypeColor(fieldType)}>
          {getFieldTypeLabel(fieldType)}
        </Tag>
      </div>
      
      {renderFieldOptions().length > 0 && (
        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>الخيارات: </Text>
          {renderFieldOptions()}
        </div>
      )}
    </Card>
  );
};

export default FieldPreview;