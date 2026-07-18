import React from 'react';
import { Select } from 'antd';
import { FieldProps } from '../../views/contents/field-components';

// Controlled Select so it works with antd Form
const SelectField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  // Parse options from settings (one per line)
  const selectOptions = field.settings?.split('\n').map((opt: string) => ({
    label: opt.trim(),
    value: opt.trim()
  })) || [];

  return (
    <Select
      placeholder={field.placeholder || 'Select an option'}
      style={{ width: '100%' }}
      options={selectOptions}
      value={value}
      onChange={onChange}
    />
  );
};

export default SelectField;