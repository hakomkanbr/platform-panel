import React from 'react';
import { Form, InputNumber, Switch, Select, Input } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const { Option } = Select;

const VideoFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="required" label="Required Field" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="maxFileSize" label="Maximum File Size (MB)">
        <InputNumber min={1} max={2000} style={{ width: "100%" }} placeholder="500" />
      </Form.Item>
      
      <Form.Item name="allowedFormats" label="Allowed Video Formats">
        <Select mode="multiple" placeholder="Select allowed formats">
          <Option value="mp4">MP4</Option>
          <Option value="avi">AVI</Option>
          <Option value="mov">MOV</Option>
          <Option value="wmv">WMV</Option>
          <Option value="flv">FLV</Option>
          <Option value="webm">WebM</Option>
          <Option value="mkv">MKV</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="maxDuration" label="Maximum Duration (seconds)">
        <InputNumber min={1} style={{ width: "100%" }} placeholder="3600" />
      </Form.Item>
      
      <Form.Item name="allowThumbnail" label="Allow Thumbnail" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="autoplay" label="Autoplay" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="controls" label="Show Controls" valuePropName="checked">
        <Switch defaultChecked />
      </Form.Item>
      
      <Form.Item name="helpText" label="Help Text">
        <Input.TextArea rows={2} placeholder="Helpful text for users" />
      </Form.Item>
    </>
  );
};

export default VideoFieldOptions;