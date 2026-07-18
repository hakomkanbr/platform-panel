"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Row,
  Col, Divider,
  message,
  Spin
} from "antd";
import {
  FormOutlined,
  SaveOutlined,
  PlusOutlined, ArrowLeftOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import route_paths from "@/helper/route_paths";
import FormFieldsBuilder from "./form-fields-builder";
import formsRepository from "@/api/repostories/forms";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux-toolkit/store";
import { FormValidationUtil } from "../utils/form-validation";
import TextArea from "antd/es/input/TextArea";
import { IField } from "@/types/page";
import TemplateSelector from "../components/template-selector";
import { FormTemplate } from "../utils/form-templates";

const { Title, Text } = Typography;

export default function FormCreateUpdateView({
  params,
  searchParams
}: {
  params: { "create-update": string }
  searchParams: { id?: string }
}) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [formFields, setFormFields] = useState<IField[]>([]);
  const [templateSelectorVisible, setTemplateSelectorVisible] = useState(false);
  const site = useSelector((state: RootState) => state.site);
  
  const isEdit = params["create-update"] === "edit";
  const formId = searchParams.id;

  useEffect(() => {
    if (isEdit && formId) {
      loadFormData();
    }
  }, [isEdit, formId]);

  const loadFormData = async () => {
    setInitialLoading(true);
    try {
      const data : any = await formsRepository.getOne(parseInt(formId!));
      form.setFieldsValue(data);
      setFormFields(data.fields || []);
    } catch (error) {
      message.error('Failed to load form data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    // Validate form fields before submission
    const validation = FormValidationUtil.validateForm(formFields);
    // if (!validation.isValid) {
    //   message.error('Please fix form validation errors before submitting');
    //   return;
    // }

    setLoading(true);
    try {
      const formData: any = {
        ...values,
        fields: formFields,
      };

      if (isEdit && formId) {
        const updateData = { ...formData, id: parseInt(formId) };
        await formsRepository.update(updateData);
        message.success('Form updated successfully');
      } else {
        await formsRepository.create(formData);
        message.success('Form created successfully');
      }

      router.push(route_paths.forms);
    } catch (error) {
      message.error(isEdit ? 'Failed to update form' : 'Failed to create form');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: FormTemplate) => {
    if (template.id !== 'blank') {
      setFormFields(template.fields);
      form.setFieldsValue({
        name: template.name,
        description: template.description
      });
    }
    setTemplateSelectorVisible(false);
  };

  if (initialLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading form data...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Link href={route_paths.forms}>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                >
                  Back to Forms
                </Button>
              </Link>
              {!isEdit && formFields.length === 0 && (
                <Button 
                  icon={<FormOutlined />}
                  onClick={() => setTemplateSelectorVisible(true)}
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                >
                  Use Template
                </Button>
              )}
              <Space direction="vertical" size={0}>
                <Title level={2} style={{ margin: 0, color: 'white' }}>
                  <FormOutlined style={{ marginRight: '12px' }} />
                  {isEdit ? 'Edit Form' : 'Create New Form'}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                  {isEdit ? 'Update form details and fields' : 'Build a dynamic form for data collection'}
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isActive: true
        }}
      >
        <Row gutter={[24, 24]}>
          {/* Form Details */}
          <Col xs={24} lg={8}>
            <Card 
              title={
                <Space>
                  <FormOutlined />
                  <span>Form Details</span>
                </Space>
              }
              style={{ height: 'fit-content' }}
            >
              <Form.Item
                name="name"
                label="Form Name"
                rules={[
                  { required: true, message: 'Please enter form name' },
                  { min: 3, message: 'Form name must be at least 3 characters' }
                ]}
              >
                <Input 
                  placeholder="Enter form name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="slug"
                label="Form Slug"
                rules={[
                  { required: true, message: 'Please enter form slug' },
                  { min: 3, message: 'Form slug must be at least 3 characters' }
                ]}
              >
                <Input 
                  placeholder="Enter form slug"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
              >
                <TextArea 
                  placeholder="Enter form description (optional)"
                  rows={4}
                />
              </Form.Item>

              <Divider />

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Link href={route_paths.forms}>
                  <Button size="large">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  icon={<SaveOutlined />}
                >
                  {isEdit ? 'Update Form' : 'Create Form'}
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Form Fields Builder */}
          <Col xs={24} lg={16}>
            <Card 
              title={
                <Space>
                  <PlusOutlined />
                  <span>Form Fields</span>
                </Space>
              }
            >
              <FormFieldsBuilder 
                fields={formFields}
                onChange={setFormFields}
              />
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Template Selector Modal */}
      <TemplateSelector
        visible={templateSelectorVisible}
        onClose={() => setTemplateSelectorVisible(false)}
        onSelect={handleTemplateSelect}
      />
    </div>
  );
}