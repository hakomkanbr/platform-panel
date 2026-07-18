import React from 'react';
import { Input } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

// Controlled so Form can manage value and prefill
const UrlField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  return (
    <Input
      type="url"
      value={value}
      onChange={onChange}
      placeholder={field.placeholder || 'Enter URL'}
      style={{ width: '100%' }}
    />
  );
};

export default UrlField;