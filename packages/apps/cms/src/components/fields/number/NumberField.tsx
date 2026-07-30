import React from 'react';
import { InputNumber } from 'antd';
import { commonFieldStyles, FieldProps } from '@/components/views/contents/field-components';

// Forward value and onChange so antd Form can control this field
const NumberField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  return (
    <InputNumber
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        ...commonFieldStyles
      }}
      placeholder={options.placeholder || field.placeholder || `Enter ${field.name.toLowerCase()}`}
      min={options.minValue}
      max={options.maxValue}
      step={options.step || 1}
      controls={{
        upIcon: <span style={{ fontSize: '12px' }}>▲</span>,
        downIcon: <span style={{ fontSize: '12px' }}>▼</span>
      }}
      className="custom-number-field"
    />
  );
};

export default NumberField;