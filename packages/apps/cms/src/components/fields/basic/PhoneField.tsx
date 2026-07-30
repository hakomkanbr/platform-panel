import React from 'react';
import { Input } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

// Controlled so Form can manage value and prefill
const PhoneField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  return (
    <Input
      type="tel"
      value={value}
      onChange={onChange}
      placeholder={field.placeholder || 'Enter phone number'}
      style={{ width: '100%' }}
    />
  );
};

export default PhoneField;