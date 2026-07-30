"use client";

import React from 'react';
import { Form, Input, InputNumber, Switch, Button, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IField } from '@/types/page';
import { EnFieldType } from '@/abstracts/modules/module-input';
import FeedInputs from '../contents/inputs';

interface ModuleFieldsFormProps {
  inputs: IField[];
  initialValues: Record<string, any>;
  onSave: (values: Record<string, any>) => void;
  onCancel: () => void;
}

const ModuleFieldsForm: React.FC<ModuleFieldsFormProps> = ({
  inputs,
  initialValues,
  onSave,
  onCancel
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  console.info("inputs => ", inputs);
  console.info("initialValues => ", initialValues);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <FeedInputs
        fields={inputs}
      />

      <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button
            onClick={onCancel}
            size="large"
            style={{
              minWidth: 100,
              borderRadius: '8px',
              height: '40px'
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{
              minWidth: 120,
              borderRadius: '8px',
              height: '40px',
              background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
            }}
          >
            Save Configuration
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default ModuleFieldsForm;