import React from 'react';
import { Form, InputNumber, Switch, Input } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const HtmlFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
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
      
      <Form.Item name="allowedTags" label="Allowed Tags">
        <Input placeholder="div,p,span,a,img,h1,h2,h3 (optional)" />
      </Form.Item>
      
      <Form.Item name="sanitizeHtml" label="Sanitize HTML" valuePropName="checked">
        <Switch defaultChecked />
      </Form.Item>
      
      <Form.Item name="allowInlineStyles" label="Allow Inline Styles" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="allowScripts" label="Allow Scripts" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="helpText" label="Help Text">
        <Input.TextArea rows={2} placeholder="Helpful text for users" />
      </Form.Item>
    </>
  );
};

export default HtmlFieldOptions;