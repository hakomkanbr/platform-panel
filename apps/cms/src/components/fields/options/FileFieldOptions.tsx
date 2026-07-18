import React from 'react';
import { Form, InputNumber, Switch, Select, Input } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const { Option } = Select;

const FileFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="required" label="Required Field" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="maxFileSize" label="Maximum File Size (MB)">
        <InputNumber min={1} max={1000} style={{ width: "100%" }} placeholder="50" />
      </Form.Item>
      
      <Form.Item name="allowedFormats" label="Allowed File Formats">
        <Select mode="multiple" placeholder="Select allowed formats">
          <Option value="pdf">PDF</Option>
          <Option value="doc">DOC</Option>
          <Option value="docx">DOCX</Option>
          <Option value="xls">XLS</Option>
          <Option value="xlsx">XLSX</Option>
          <Option value="ppt">PPT</Option>
          <Option value="pptx">PPTX</Option>
          <Option value="txt">TXT</Option>
          <Option value="zip">ZIP</Option>
          <Option value="rar">RAR</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="maxFiles" label="Maximum Files">
        <InputNumber min={1} max={10} style={{ width: "100%" }} placeholder="1" />
      </Form.Item>
      
      <Form.Item name="allowPreview" label="Allow Preview" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="helpText" label="Help Text">
        <Input.TextArea rows={2} placeholder="Helpful text for users" />
      </Form.Item>
    </>
  );
};

export default FileFieldOptions;