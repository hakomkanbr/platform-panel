import React from 'react';
import { Form, InputNumber, Switch, Select, Input } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const { Option } = Select;

const RichTextFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="required" label="Required Field" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="minLength" label="Minimum Length">
        <InputNumber min={0} style={{ width: "100%" }} placeholder="Optional" />
      </Form.Item>
      
      <Form.Item name="maxLength" label="Maximum Length">
        <InputNumber min={0} style={{ width: "100%" }} placeholder="Optional" />
      </Form.Item>
      
      <Form.Item name="toolbar" label="Editor Tools">
        <Select mode="multiple" placeholder="Select available tools">
          <Option value="bold">Bold</Option>
          <Option value="italic">Italic</Option>
          <Option value="underline">Underline</Option>
          <Option value="link">Link</Option>
          <Option value="image">Image</Option>
          <Option value="list">List</Option>
          <Option value="align">Align</Option>
          <Option value="color">Color</Option>
          <Option value="table">Table</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="allowImages" label="Allow Images" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="allowLinks" label="Allow Links" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="helpText" label="Help Text">
        <Input.TextArea rows={2} placeholder="Helpful text for users" />
      </Form.Item>
    </>
  );
};

export default RichTextFieldOptions;