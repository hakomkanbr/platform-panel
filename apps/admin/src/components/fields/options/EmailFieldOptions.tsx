import React from 'react';
import { Form, Switch, Input } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const EmailFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="required" label="Required Field" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="defaultValue" label="Default Value">
        <Input type="email" placeholder="example@domain.com" />
      </Form.Item>
      
      <Form.Item name="placeholder" label="Placeholder Text">
        <Input placeholder="Enter placeholder text" />
      </Form.Item>
      
      <Form.Item name="allowedDomains" label="Allowed Domains">
        <Input placeholder="gmail.com,yahoo.com (optional)" />
      </Form.Item>
      
      <Form.Item name="validateDomain" label="Validate Domain" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="helpText" label="Help Text">
        <Input.TextArea rows={2} placeholder="Helpful text for users" />
      </Form.Item>
    </>
  );
};

export default EmailFieldOptions;