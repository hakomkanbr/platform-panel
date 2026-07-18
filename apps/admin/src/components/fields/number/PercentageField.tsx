import React from 'react';
import { InputNumber } from 'antd';
import { commonFieldStyles, FieldProps } from '@/components/views/contents/field-components';

// Forward value and onChange so antd Form can control this field
const PercentageField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  return (
    <InputNumber
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        height: '42px',
        ...commonFieldStyles
      }}
      placeholder={options.placeholder || field.placeholder || 'Enter percentage'}
      min={options.minValue || 0}
      max={options.maxValue || 100}
      formatter={value => `${value}%`}
      parser={value => value?.replace('%', '') as unknown as number}
      defaultValue={options.defaultValue}
      controls={{
        upIcon: <span style={{ fontSize: '12px' }}>▲</span>,
        downIcon: <span style={{ fontSize: '12px' }}>▼</span>
      }}
      className="custom-percentage-field"
    />
  );
};

export default PercentageField;