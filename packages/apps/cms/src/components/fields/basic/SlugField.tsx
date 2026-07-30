import React from 'react';
import { Form, Input } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

const SlugField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  const form = Form.useFormInstance();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <Input
      value={value || ''}
      placeholder={options.placeholder || field.placeholder || `Enter ${field.name.toLowerCase()}`}
      onChange={handleChange}
      style={{
        height: '42px',
        padding: '8px 16px'
      }}
      className="custom-text-field"
    />
  );
};

export default SlugField;