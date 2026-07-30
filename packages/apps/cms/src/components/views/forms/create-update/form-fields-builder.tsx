"use client";

import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Select,
  Switch,
  Row,
  Col,
  Divider,
  Typography,
  Alert,
  Popconfirm,
  Badge,
  Tooltip
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  DragOutlined,
  EditOutlined,
  EyeOutlined
} from "@ant-design/icons";
import FormPreview from "../components/form-preview";
import { FormValidationUtil } from "../utils/form-validation";
import { EnFieldType } from "@/abstracts/modules/module-input";
import { FORM_FIELD_TYPES, fieldRequiresOptions } from "@/utils/field-utils";
import { IField } from "@/types/page";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface FormFieldsBuilderProps {
  fields: IField[];
  onChange: (fields: IField[]) => void;
}


export default function FormFieldsBuilder({ fields, onChange }: FormFieldsBuilderProps) {
  const [editingField, setEditingField] = useState<number | null>(null);
  const [fieldForm] = Form.useForm();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  console.info("fields => ", fields);

  const addNewField = () => {
    const newField: IField = {
      id: -1,
      moduleId: -1,
      fieldSlug: `field_${Date.now()}`,
      name: 'New Field',
      fieldType: EnFieldType.text,
      settings: undefined,
      order: fields.length,
    };

    const newFields = [...fields, newField];

    // Validate the new fields
    const validation = FormValidationUtil.validateForm(newFields);
    setValidationErrors(validation.errors);

    onChange(newFields);
    setEditingField(fields.length);
    fieldForm.setFieldsValue(newField);
  };

  const updateField = (index: number, updatedField: IField) => {
    const newFields = [...fields];
    newFields[index] = { ...updatedField, order: index };

    // Validate the updated fields
    const validation = FormValidationUtil.validateForm(newFields);
    setValidationErrors(validation.errors);

    onChange(newFields);
  };

  const deleteField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    // Update order for remaining fields
    const reorderedFields = newFields.map((field, i) => ({ ...field, order: i }));
    onChange(reorderedFields);
    setEditingField(null);
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);

    // Update order for all fields
    const reorderedFields = newFields.map((field, i) => ({ ...field, order: i }));
    onChange(reorderedFields);
  };

  const handleFieldSave = () => {
    fieldForm.validateFields().then((values) => {
      if (editingField !== null) {
        var fieldId = fields[editingField].id ?? -1;
        updateField(editingField, { ...values, id: fieldId });
        setEditingField(null);
        fieldForm.resetFields();
      }
    });
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    fieldForm.resetFields();
  };

  // Get field types available for forms
  const formFieldTypes = FORM_FIELD_TYPES;

  return (
    <div>
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert
          message="Form Validation Errors"
          description={
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* Fields List */}
      <div style={{ marginBottom: '24px' }}>
        {fields.length === 0 ? (
          <Alert
            message="No fields added yet"
            description="Click the 'Add Field' button below to start building your form."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {fields.map((field, index) => (
              <Card
                key={index}
                size="small"
                style={{
                  border: editingField === index ? '2px solid #52c41a' : '1px solid #d9d9d9',
                  backgroundColor: editingField === index ? '#f6ffed' : 'white'
                }}
              >
                <Row justify="space-between" align="middle">
                  <Col flex="auto">
                    <Space>
                      <DragOutlined style={{ color: '#999', cursor: 'move' }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {field.name}
                          {/* {field.required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>} */}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {field.fieldSlug} • {formFieldTypes.find(t => t.value === field.fieldType)?.label}
                        </div>
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <Badge
                        count={index + 1}
                        style={{ backgroundColor: '#52c41a' }}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditingField(index);
                          fieldForm.setFieldsValue(field);
                        }}
                      />
                      <Popconfirm
                        title="Delete Field"
                        description="Are you sure you want to delete this field?"
                        onConfirm={() => deleteField(index)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </Space>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        )}
      </div>

      {/* Field Editor */}
      {editingField !== null && (
        <Card
          title="Edit Field"
          style={{ marginBottom: '24px', border: '2px solid #52c41a' }}
          extra={
            <Space>
              <Button onClick={handleFieldCancel}>Cancel</Button>
              <Button type="primary" onClick={handleFieldSave}>Save Field</Button>
            </Space>
          }
        >
          <Form
            form={fieldForm}
            layout="vertical"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Field Label"
                  rules={[{ required: true, message: 'Please enter field label' }]}
                >
                  <Input placeholder="Enter field label" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fieldSlug"
                  label="Field Name"
                  rules={[
                    { required: true, message: 'Please enter field name' },
                    { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: 'Invalid field name format' }
                  ]}
                >
                  <Input placeholder="field_name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fieldType"
                  label="Field Type"
                  rules={[{ required: true, message: 'Please select field type' }]}
                >
                  <Select
                    placeholder="Select field type"
                    options={formFieldTypes.map(type => ({
                      label: type.label,
                      value: type.value
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="required"
                  label="Required Field"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Required" unCheckedChildren="Optional" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="placeholder"
                  label="Placeholder Text"
                >
                  <Input placeholder="Enter placeholder text (optional)" />
                </Form.Item>
              </Col>
              <Form.Item noStyle shouldUpdate={(prevValues, currentValues) =>
                prevValues.fieldType !== currentValues.fieldType
              }>
                {({ getFieldValue }) => {
                  const fieldType = getFieldValue('fieldType');
                  return fieldRequiresOptions(fieldType) ? (
                    <Col xs={24}>
                      <Form.Item
                        name="options"
                        label="Options"
                        rules={[{ required: true, message: 'Please enter options' }]}
                        extra="Enter each option on a new line"
                      >
                        <TextArea
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          rows={4}
                        />
                      </Form.Item>
                    </Col>
                  ) : null;
                }}
              </Form.Item>
              <Col xs={24}>
                <Form.Item
                  name="validation"
                  label="Validation Rules"
                  extra="Enter custom validation rules (optional)"
                >
                  <TextArea
                    placeholder="e.g., min:3, max:50, regex:^[A-Za-z]+$"
                    rows={2}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )}

      {/* Add Field Button */}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={addNewField}
        style={{ width: '100%', height: '50px', fontSize: '16px' }}
        disabled={editingField !== null}
      >
        Add New Field
      </Button>

      {/* Form Preview */}
      <Card
        title={
          <Space>
            <EyeOutlined />
            <span>Form Preview</span>
          </Space>
        }
        style={{ marginTop: '24px' }}
      >
        <FormPreview
          fields={fields}
          formName="Form Preview"
          showTitle={false}
          interactive={false}
        />
      </Card>
    </div>
  );
}