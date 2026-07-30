import React from 'react';
import { Form, InputNumber, Switch } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const NumberFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="minValue" label="Minimum Value">
        <InputNumber style={{ width: "100%" }} placeholder="Optional" />
      </Form.Item>
      
      <Form.Item name="maxValue" label="Maximum Value">
        <InputNumber style={{ width: "100%" }} placeholder="Optional" />
      </Form.Item>
      
      <Form.Item name="defaultValue" label="Default Value">
        <InputNumber style={{ width: "100%" }} placeholder="Optional" />
      </Form.Item>
      
      <Form.Item name="required" label="Required Field" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="step" label="Step Size">
        <InputNumber min={0.01} step={0.01} style={{ width: "100%" }} placeholder="1" />
      </Form.Item>
      
      <Form.Item name="precision" label="Decimal Places">
        <InputNumber min={0} max={10} style={{ width: "100%" }} placeholder="0" />
      </Form.Item>
    </>
  );
};

export default NumberFieldOptions;