import React from 'react';
import { Radio, Space } from 'antd';
import { FieldProps } from '../../views/contents/field-components';

// Controlled Radio.Group so it works with antd Form
const RadioField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  // Parse options from settings
  const radioOptions = field.settings?.split('\n').map((opt:any) => ({
    label: opt.trim(),
    value: opt.trim()
  })) || [];

  return (
    <Radio.Group value={value} onChange={onChange}>
      <Space direction="vertical">
        {radioOptions.map((option: any) => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
};

export default RadioField;