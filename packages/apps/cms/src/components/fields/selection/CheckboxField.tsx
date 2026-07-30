import React from 'react';
import { Checkbox, Space } from 'antd';
import { FieldProps } from '../../views/contents/field-components';

// Controlled Checkbox.Group so it works with antd Form
const CheckboxField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  // Parse options from settings
  const checkboxOptions = field.settings?.split('\n').map((opt:any) => ({
    label: opt.trim(),
    value: opt.trim()
  })) || [];

  return (
    <Checkbox.Group value={value} onChange={onChange}>
      <Space direction="vertical">
        {checkboxOptions.map((option:any) => (
          <Checkbox key={option.value} value={option.value}>
            {option.label}
          </Checkbox>
        ))}
      </Space>
    </Checkbox.Group>
  );
};

export default CheckboxField;