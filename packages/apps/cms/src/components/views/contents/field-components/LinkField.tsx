import React from 'react';
import { Input, Select } from 'antd';
import { LinkOutlined, GlobalOutlined } from '@ant-design/icons';
import { FieldProps, commonFieldStyles } from './index';

const LinkField: React.FC<FieldProps> = ({ field, options }) => {
  const selectBefore = (
    <Select 
      defaultValue="https://" 
      style={{ 
        width: 100,
        borderRadius: '8px 0 0 8px'
      }}
      bordered={false}
    >
      <Select.Option value="http://">
        <GlobalOutlined style={{ marginRight: '4px' }} />
        HTTP
      </Select.Option>
      <Select.Option value="https://">
        <GlobalOutlined style={{ marginRight: '4px', color: '#52c41a' }} />
        HTTPS
      </Select.Option>
    </Select>
  );

  return (
    <Input
      addonBefore={selectBefore}
      placeholder={options.placeholder || field.placeholder || 'Enter website URL'}
      defaultValue={options.defaultValue}
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