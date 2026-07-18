import React from 'react';
import { InputNumber } from 'antd';
import { commonFieldStyles, FieldProps } from '@/components/views/contents/field-components';

// Controlled so Form can manage value and prefill
const MoneyField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  return (
    <InputNumber
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        height: '42px',
        ...commonFieldStyles
      }}
      placeholder={options.placeholder || field.placeholder || 'Enter amount'}
      formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={(val) => (val || '').replace(/(,*)/g, '') as unknown as number}
      min={options.minValue || 0}
      max={options.maxValue}
      controls={{
        upIcon: <span style={{ fontSize: '12px' }}>▲</span>,
        downIcon: <span style={{ fontSize: '12px' }}>▼</span>
      }}
      className="custom-money-field"
    />
  );
};

export default MoneyField;