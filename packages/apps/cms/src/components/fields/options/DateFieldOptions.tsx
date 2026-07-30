import React from 'react';
import { Form, Switch, Input, Select, DatePicker } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const { Option } = Select;

const DateFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="required" label="Required Field" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="defaultValue" label="Default Value">
        <DatePicker style={{ width: "100%" }} placeholder="Select default date" />
      </Form.Item>
      
      <Form.Item name="dateFormat" label="Date Format">
        <Select placeholder="Select date format">
          <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
          <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
          <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
          <Option value="DD-MM-YYYY">DD-MM-YYYY</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="minDate" label="Minimum Date">
        <DatePicker style={{ width: "100%" }} placeholder="Select minimum date" />
      </Form.Item>
      
      <Form.Item name="maxDate" label="Maximum Date">
        <DatePicker style={{ width: "100%" }} placeholder="Select maximum date" />
      </Form.Item>
      
      <Form.Item name="showTime" label="Show Time" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="helpText" label="Help Text">
        <Input.TextArea rows={2} placeholder="Helpful text for users" />
      </Form.Item>
    </>
  );
};

export default DateFieldOptions;