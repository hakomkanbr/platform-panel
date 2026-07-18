"use client";

import {
  Form,
  Card,
  Typography,
  Button
} from "antd";
import {
  EyeOutlined
} from "@ant-design/icons";
import { EnFieldType } from "@/abstracts/modules/module-input";
import { FieldRenderer } from "../../contents/field-components";
import { IField } from "@/types/page";

const { Title } = Typography;

interface FormPreviewProps {
  fields: IField[];
  formName?: string;
  showTitle?: boolean;
  interactive?: boolean;
}

export default function FormPreview({
  fields,
  formName = "Form Preview",
  showTitle = true,
  interactive = false
}: FormPreviewProps) {






  if (fields.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '40px' }}>
        <EyeOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
        <Title level={4} type="secondary">No fields to preview</Title>
        <p style={{ color: '#999' }}>Add some fields to see the form preview</p>
      </Card>
    );
  }



  return (
    <Card>
      {showTitle && (
        <Title level={4} style={{ marginBottom: '24px', textAlign: 'center' }}>
          {formName}
        </Title>
      )}

      <Form layout="vertical" disabled={!interactive}>
        {fields
          .sort((a, b) => a.order - b.order)
          .map((field, index) => (
            <FieldRenderer
              key={field.fieldSlug || index}
              field={field}
              slugfields={[]}
              index={index}
            />
          ))}

        {interactive && (
          <Form.Item style={{ marginTop: '32px', textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" size="large">
              Submit Form
            </Button>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
}