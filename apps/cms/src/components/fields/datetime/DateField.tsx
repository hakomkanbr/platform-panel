import React from 'react';
import { DatePicker } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

// Controlled so Form can manage value and prefill
const DateField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  return (
    <DatePicker
      value={value}
      onChange={onChange as any}
      placeholder={field.placeholder || 'Select date'}
      style={{ width: '100%' }}
    />
  );
};

export default DateField;