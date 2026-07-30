import React from 'react';
import { InputNumber } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { FieldProps, commonFieldStyles } from './index';

// Forward value and onChange so antd Form can control this field
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
      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={value => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
      min={options.minValue || 0}
      max={options.maxValue}
      defaultValue={options.defaultValue}
      controls={{
        upIcon: <span style={{ fontSize: '12px' }}>▲</span>,
        downIcon: <span style={{ fontSize: '12px' }}>▼</span>
      }}
      className="custom-money-field"
    />
  );
};

export default MoneyField;