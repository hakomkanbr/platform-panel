import React from 'react';
import { Form, InputNumber, Switch, Select, Input } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const { Option } = Select;

const GalleryFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="required" label="Required Field" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="minImages" label="Minimum Images">
        <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
      </Form.Item>
      
      <Form.Item name="maxImages" label="Maximum Images">
        <InputNumber min={1} style={{ width: "100%" }} placeholder="10" />
      </Form.Item>
      
      <Form.Item name="maxFileSize" label="Maximum File Size per Image (MB)">
        <InputNumber min={1} max={100} style={{ width: "100%" }} placeholder="5" />
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
      
      <Form.Item name="sortable" label="Sortable" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="helpText" label="Help Text">
        <Input.TextArea rows={2} placeholder="Helpful text for users" />
      </Form.Item>
    </>
  );
};

export default GalleryFieldOptions;