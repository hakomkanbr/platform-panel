import React from 'react';
import { Input } from 'antd';
import { FieldProps, commonFieldStyles } from './index';

const { TextArea } = Input;

// Forward value and onChange so antd Form can control this field
const TextAreaField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  return (
    <TextArea
      value={value}
      onChange={onChange}
      rows={options.rows || 4}
      placeholder={options.placeholder || field.placeholder || `Enter ${field.name.toLowerCase()}`}
      minLength={options.minLength}
      maxLength={options.maxLength}
      style={{
        ...commonFieldStyles,
        padding: '12px 16px',
        resize: 'vertical',
        minHeight: '100px'
      }}
      className="custom-textarea-field"
      showCount={!!options.maxLength}
    />
  );
};

export default TextAreaField;