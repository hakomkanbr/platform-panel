import React from 'react';
import { TimePicker } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

const TimeField: React.FC<FieldProps> = ({ field, options }) => {
  return (
    <TimePicker
      placeholder={field.placeholder || 'Select time'}
      style={{ width: '100%' }}
      {...(options.defaultValue && { defaultValue: options.defaultValue })}
    />
  );
};

export default TimeField;