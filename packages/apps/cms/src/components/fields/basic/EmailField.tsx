import React from 'react';
import { Input } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

// Controlled so Form can manage value and prefill
const EmailField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  return (
    <Input
      type="email"
      value={value}
      onChange={onChange}
      placeholder={field.placeholder || 'Enter email address'}
      style={{ width: '100%' }}
    />
  );
};

export default EmailField;