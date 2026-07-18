import React from 'react';
import { Input } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

const { TextArea } = Input;

// Controlled so Form can manage value and prefill
const HtmlField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  return (
    <TextArea
      rows={6}
      value={value}
      onChange={onChange}
      placeholder={field.placeholder || 'Enter HTML code'}
      style={{ fontFamily: 'monospace' }}
    />
  );
};

export default HtmlField;