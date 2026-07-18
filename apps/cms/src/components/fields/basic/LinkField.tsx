import React from 'react';
import { Input, Select } from 'antd';
import { LinkOutlined, GlobalOutlined } from '@ant-design/icons';
import { commonFieldStyles, FieldProps } from '@/components/views/contents/field-components';

// Controlled so Form can manage value and prefill
const LinkField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  const [protocol, rest] = typeof value === 'string' && value.includes('://')
    ? ((): [string, string] => {
        const idx = value.indexOf('://');
        return [value.slice(0, idx + 3), value.slice(idx + 3)];
      })()
    : ['https://', value || ''];

  const selectBefore = (
    <Select 
      value={protocol}
      onChange={(proto) => onChange?.(`${proto}${rest || ''}`)}
      style={{ 
        width: 110,
        borderRadius: '8px 0 0 8px'
      }}
      bordered={false}
      options={[
        { value: 'http://', label: (<><GlobalOutlined style={{ marginRight: 4 }} />HTTP</>) },
        { value: 'https://', label: (<><GlobalOutlined style={{ marginRight: 4, color: '#52c41a' }} />HTTPS</>) },
      ]}
    />
  );

  return (
    <Input
      addonBefore={selectBefore}
      value={rest}
      onChange={(e) => onChange?.(`${protocol}${e.target.value}`)}
      placeholder={options.placeholder || field.placeholder || 'Enter website URL'}
      prefix={<LinkOutlined style={{ color: '#1890ff', marginRight: '8px' }} />}
      style={{
        ...commonFieldStyles,
        height: '42px'
      }}
      className="custom-link-field"
    />
  );
};

export default LinkField;