import React from 'react';
import { Input } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

// Controlled so Form can manage value and prefill
const PasswordField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  return (
    <Input.Password
      value={value}
      onChange={onChange}
      placeholder={field.placeholder || 'Enter password'}
      style={{ width: '100%' }}
    />
  );
};

export default PasswordField;