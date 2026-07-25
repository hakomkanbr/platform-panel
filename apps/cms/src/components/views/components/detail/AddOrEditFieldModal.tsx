"use client";
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Typography,
  Space,
  InputNumber,
} from "antd";
import {
  BuildOutlined,
} from "@ant-design/icons";
import { createComponentField } from "@/api/repostories/components";

const { Title, Text } = Typography;
const { Option } = Select;

const FIELD_TYPES = [
  { label: "Text", value: "Text" },
  { label: "Number", value: "Number" },
  { label: "TextArea", value: "TextArea" },
  { label: "Boolean", value: "Boolean" },
  { label: "Image", value: "Image" },
  { label: "File", value: "File" },
  { label: "Select", value: "Select" },
  { label: "Editor", value: "Editor" },
  { label: "Date", value: "Date" },
  { label: "Email", value: "Email" },
  { label: "Url", value: "Url" },
  { label: "Color", value: "Color" },
  { label: "Slug", value: "Slug" },
  { label: "List", value: "List" },
  { label: "Link", value: "Link" },
  { label: "Video", value: "Video" },
];

export default function AddOrEditFieldModal({
  open,
  onClose,
  componentId,
  field,
  onSaved,
}: any) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (field) {
      form.setFieldsValue({
        name: field.name || field.Name,
        fieldSlug: field.fieldSlug || field.FieldSlug,
        fieldType: field.fieldType || field.FieldType || "Text",
        order: field.order ?? field.Order ?? 0,
        gridSize: field.gridSize ?? field.GridSize ?? 24,
        groupName: field.groupName || field.GroupName || "",
        settings: field.settings || field.Settings || "",
      });
    } else {
      form.resetFields();
    }
  }, [field, form]);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        fieldSlug: values.fieldSlug,
        fieldType: values.fieldType,
        order: values.order || 0,
        gridSize: values.gridSize || 24,
        groupName: values.groupName || null,
        settings: values.settings || null,
      };

      await createComponentField(componentId, payload);
      message.success(field ? "Field updated" : "Field created");
      onSaved();
      onClose();
    } catch {
      message.error("Failed to save field");
    }
  };

  return (
    <Modal
      title={
        <Space>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <BuildOutlined style={{ color: "white", fontSize: 18 }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 16 }}>
              {field ? "Edit Field" : "Create New Field"}
            </Text>
          </div>
        </Space>
      }
      open={open}
      onCancel={() => onClose()}
      onOk={() => form.submit()}
      okText="Save Field"
      cancelText="Cancel"
      width={600}
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Field Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="e.g., Title, Description" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="fieldSlug"
              label="Field Slug"
              rules={[{ required: true, message: "Slug is required" }]}
            >
              <Input placeholder="e.g., title, description" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="fieldType"
              label="Field Type"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select type" showSearch>
                {FIELD_TYPES.map((ft) => (
                  <Option key={ft.value} value={ft.value}>
                    {ft.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="order" label="Order">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="gridSize" label="Grid Size">
              <InputNumber style={{ width: "100%" }} min={1} max={24} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="groupName" label="Group Name">
              <Input placeholder="Optional group name" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="settings" label="Settings (JSON)">
              <Input.TextArea
                placeholder='{"key": "value"}'
                rows={3}
                style={{ fontFamily: "monospace" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
