import React from 'react';
import { Form, InputNumber, Switch, Select, Input } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const { Option } = Select;

const ImageFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="required" label="Required Field" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="maxFileSize" label="Maximum File Size (MB)">
        <InputNumber min={1} max={100} style={{ width: "100%" }} placeholder="10" />
      </Form.Item>
      
      <Form.Item name="allowedFormats" label="Allowed File Formats">
        <Select mode="multiple" placeholder="Select allowed formats">
          <Option value="jpg">JPG</Option>
          <Option value="jpeg">JPEG</Option>
          <Option value="png">PNG</Option>
          <Option value="gif">GIF</Option>
          <Option value="webp">WebP</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="maxWidth" label="Maximum Width (pixels)">
        <InputNumber min={100} style={{ width: "100%" }} placeholder="1920" />
      </Form.Item>
      
      <Form.Item name="maxHeight" label="Maximum Height (pixels)">
        <InputNumber min={100} style={{ width: "100%" }} placeholder="1080" />
      </Form.Item>
      
      <Form.Item name="helpText" label="Help Text">
        <Input.TextArea rows={2} placeholder="Helpful text for users" />
      </Form.Item>
    </>
  );
};

export default ImageFieldOptions;