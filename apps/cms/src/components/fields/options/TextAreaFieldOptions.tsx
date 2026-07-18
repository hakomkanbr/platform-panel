import React from 'react';
import { Form, Input, InputNumber, Switch } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const TextAreaFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="minLength" label="Minimum Length">
        <InputNumber min={0} style={{ width: "100%" }} placeholder="Optional" />
      </Form.Item>
      
      <Form.Item name="maxLength" label="Maximum Length">
        <InputNumber min={0} style={{ width: "100%" }} placeholder="Optional" />
      </Form.Item>
      
      <Form.Item name="rows" label="Number of Rows">
        <InputNumber min={2} max={20} style={{ width: "100%" }} placeholder="4" />
      </Form.Item>
      
      <Form.Item name="defaultValue" label="Default Value">
        <Input.TextArea rows={3} placeholder="Optional" />
      </Form.Item>
      
      <Form.Item name="required" label="Required Field" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="placeholder" label="Placeholder Text">
        <Input placeholder="Enter placeholder text" />
      </Form.Item>
      
      <Form.Item name="resizable" label="Resizable" valuePropName="checked">
        <Switch defaultChecked />
      </Form.Item>
    </>
  );
};

export default TextAreaFieldOptions;