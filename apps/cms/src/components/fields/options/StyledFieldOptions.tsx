import React from 'react';
import { Form, Input, InputNumber, Switch, Select, DatePicker, Row, Col, Typography } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const { Text: AntText } = Typography;

interface StyledFieldItemProps {
  name: string;
  label: string;
  children: React.ReactNode;
  span?: number;
  valuePropName?: string;
  rules?: any[];
}

export const StyledFieldItem: React.FC<StyledFieldItemProps> = ({
  name,
  label,
  children,
  span = 24,
  valuePropName,
  rules
}) => {
  return (
    <Col span={span}>
      <Form.Item
        name={name}
        label={<AntText strong style={{ color: '#595959', fontSize: '13px' }}>{label}</AntText>}
        style={{ marginBottom: '16px' }}
        valuePropName={valuePropName}
        rules={rules}
      >
        {children}
      </Form.Item>
    </Col>
  );
};

export const StyledInput: React.FC<any> = (props) => (
  <Input
    {...props}
    style={{
      borderRadius: '6px',
      border: '1px solid #d9d9d9',
      ...props.style
    }}
    size="middle"
  />
);

export const StyledInputNumber: React.FC<any> = (props) => (
  <InputNumber
    {...props}
    style={{
      width: "100%",
      borderRadius: '6px',
      border: '1px solid #d9d9d9',
      ...props.style
    }}
    size="middle"
  />
);

export const StyledTextArea: React.FC<any> = (props) => (
  <TextArea
    {...props}
    style={{
      borderRadius: '6px',
      border: '1px solid #d9d9d9',
      ...props.style
    }}
    size="middle"
  />
);

export const StyledSelect: React.FC<any> = (props) => (
  <Select
    {...props}
    style={{
      borderRadius: '6px',
      ...props.style
    }}
    size="middle"
    dropdownStyle={{ borderRadius: '8px' }}
  />
);

export const StyledDatePicker: React.FC<any> = (props) => (
  <DatePicker
    {...props}
    style={{
      width: "100%",
      borderRadius: '6px',
      border: '1px solid #d9d9d9',
      ...props.style
    }}
    size="middle"
  />
);

export const StyledSwitch: React.FC<{ label?: string;[key: string]: any }> = ({ label, ...props }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e9ecef'
  }}>
    <Switch size="small" {...props} />
    {label && (
      <AntText style={{ fontSize: '12px', color: '#6c757d' }}>
        {label}
      </AntText>
    )}
  </div>
);

export const FieldOptionsContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '8px 0' }}>
    <Row gutter={[16, 16]}>
      {children}
    </Row>
  </div>
);