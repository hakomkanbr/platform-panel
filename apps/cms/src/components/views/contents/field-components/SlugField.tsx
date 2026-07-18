import React from 'react';
import { Form, Input } from 'antd';
import { FieldProps, commonFieldStyles } from './index';

const SlugField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  const form = Form.useFormInstance();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.info("SlugField manual change:", field.fieldSlug, "value:", newValue);
    if (onChange) {
      onChange(e);
    }
  };

  console.info("SlugField render with value:", field.fieldSlug, value);

  return (
    <Input
      value={value || ''}
      placeholder={options.placeholder || field.placeholder || `Enter ${field.name.toLowerCase()}`}
      onChange={handleChange}
      style={{
        ...commonFieldStyles,
        height: '42px',
        padding: '8px 16px'
      }}
      className="custom-text-field"
    />
  );
};

export default SlugField;