"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space, 
  Tabs, 
  Descriptions,
  Tag,
  message,
  Spin,
  Alert
} from "antd";
import { 
  FormOutlined, 
  EditOutlined, 
  BarChartOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  ShareAltOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import route_paths from "@/helper/route_paths";
import formsRepository from "@/api/repostories/forms";
import { Form } from "@/types/form";
import FormPreview from "../components/form-preview";
import FormAnalytics from "../components/form-analytics";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function FormDetailsView({
  params,
  searchParams
}: {
  params: { slug: string }
  searchParams: { id?: string }
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Form | null>(null);
  
  const formId = searchParams.id;

  useEffect(() => {
    if (formId) {
      loadFormDetails();
    }
  }, [formId]);

  const loadFormDetails = async () => {
    setLoading(true);
    try {
      const data = await formsRepository.getOne(parseInt(formId!));
      setForm(data);
    } catch (error) {
      message.error('Failed to load form details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!form) return;
    
    try {
      await formsRepository.changeState(form.id!, !form.isActive);
      setForm({ ...form, isActive: !form.isActive });
      message.success(`Form ${form.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      message.error('Failed to update form status');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading form details...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <Alert
        message="Form Not Found"
        description="The requested form could not be found."
        type="error"
        showIcon
        action={
          <Link href={route_paths.forms}>
            <Button type="primary">Back to Forms</Button>
          </Link>
        }
      />
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
              <Space direction="vertical" size={0}>
                <Title level={2} style={{ margin: 0, color: 'white' }}>
                  <FormOutlined style={{ marginRight: '12px' }} />
                  {form.name}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                  {form.description || 'No description provided'}
                </Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space size="middle">
              <Link href={`${route_paths.forms}/create-update/edit?id=${form.id}`}>
                <Button 
                  icon={<EditOutlined />} 
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                >
                  Edit Form
                </Button>
              </Link>
              <Link href={`${route_paths.forms}/submissions?formId=${form.id}`}>
                <Button 
                  icon={<FileTextOutlined />} 
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                >
                  View Submissions
                </Button>
              </Link>
              <Button 
                icon={<ShareAltOutlined />} 
                onClick={handleToggleStatus}
                style={{ 
                  background: form.isActive ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.2)', 
                  border: `1px solid ${form.isActive ? 'rgba(255,0,0,0.3)' : 'rgba(0,255,0,0.3)'}`,
                  color: 'white'
                }}
              >
                {form.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Form Details */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title="Form Information">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Name">
                {form.name}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={form.isActive ? 'green' : 'red'}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Fields Count">
                {form.fields?.length || 0} fields
              </Descriptions.Item>
              <Descriptions.Item label="Submissions">
                {form.submissionsCount || 0} submissions
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {form.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            {form.description && (
              <div style={{ marginTop: '16px' }}>
                <Text strong>Description:</Text>
                <div style={{ 
                  marginTop: '8px', 
                  padding: '12px', 
                  background: '#fafafa', 
                  borderRadius: '6px',
                  border: '1px solid #d9d9d9'
                }}>
                  <Text>{form.description}</Text>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card>
            <Tabs defaultActiveKey="preview">
              <TabPane 
                tab={
                  <Space>
                    <EyeOutlined />
                    <span>Form Preview</span>
                  </Space>
                } 
                key="preview"
              >
                <FormPreview 
                  fields={form.fields || []} 
                  formName={form.name}
                  showTitle={true}
                  interactive={true}
                />
              </TabPane>
              
              <TabPane 
                tab={
                  <Space>
                    <BarChartOutlined />
                    <span>Analytics</span>
                  </Space>
                } 
                key="analytics"
              >
                <FormAnalytics formId={form.id} />
              </TabPane>
              
              <TabPane 
                tab={
                  <Space>
                    <FormOutlined />
                    <span>Fields ({form.fields?.length || 0})</span>
                  </Space>
                } 
                key="fields"
              >
                <div>
                  {form.fields && form.fields.length > 0 ? (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                      {form.fields
                        .sort((a, b) => a.order - b.order)
                        .map((field:any, index) => (
                          <Card key={index} size="small">
                            <Row justify="space-between" align="middle">
                              <Col>
                                <Space direction="vertical" size={0}>
                                  <Text strong>
                                    {field.name}
                                    {field.required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                                  </Text>
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {field.fieldSlug} • {field.fieldType}
                                  </Text>
                                  {field.placeholder && (
                                    <Text type="secondary" style={{ fontSize: '11px' }}>
                                      Placeholder: {field.placeholder}
                                    </Text>
                                  )}
                                </Space>
                              </Col>
                              <Col>
                                <Space>
                                  <Tag color="blue">Order: {field.order + 1}</Tag>
                                  <Tag color={field.required ? 'red' : 'default'}>
                                    {field.required ? 'Required' : 'Optional'}
                                  </Tag>
                                </Space>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                    </Space>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <FormOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                      <Title level={4} type="secondary">No Fields</Title>
                      <Text type="secondary">This form doesn{"'"}t have any fields yet.</Text>
                    </div>
                  )}
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}