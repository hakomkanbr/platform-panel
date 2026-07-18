import React from 'react';
import { Form, Switch, Input, Select } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const { Option } = Select;

const BooleanFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="required" label="Required Field" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="defaultValue" label="Default Value" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="displayType" label="Display Type">
        <Select placeholder="Select display type">
          <Option value="switch">Switch</Option>
          <Option value="checkbox">Checkbox</Option>
          <Option value="radio">Radio Buttons</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="trueLabel" label="True Label">
        <Input placeholder="Yes" />
      </Form.Item>
      
      <Form.Item name="falseLabel" label="False Label">
        <Input placeholder="No" />
      </Form.Item>
      
      <Form.Item name="helpText" label="Help Text">
        <Input.TextArea rows={2} placeholder="Helpful text for users" />
      </Form.Item>
    </>
  );
};

export default BooleanFieldOptions;