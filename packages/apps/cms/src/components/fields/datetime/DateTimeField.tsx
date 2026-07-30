import React from 'react';
import { DatePicker } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

const DateTimeField: React.FC<FieldProps> = ({ field, options }) => {
  return (
    <DatePicker
      showTime
      placeholder={field.placeholder || 'Select date and time'}
      style={{ width: '100%' }}
      {...(options.defaultValue && { defaultValue: options.defaultValue })}
    />
  );
};

export default DateTimeField;