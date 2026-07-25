"use client";
import enumCreateUpdate from "@/abstracts/create-update";
import api from "@/api/api-context";
import api_points from "@/api/points";
import EButton from "@/components/elements/button";
import ECard from "@/components/elements/card";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Switch,
  Card,
  Typography,
  Space,
  Divider,
  Alert,
  Tooltip,
  Badge,
  message,
  Select
} from "antd";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import {
  InfoCircleOutlined,
  SaveOutlined,
  EyeOutlined,
  LayoutOutlined,
  ArrowLeftOutlined,
  CodeOutlined
} from "@ant-design/icons";
import { checkOutError } from "@/helper/checkout-error";
import { IError } from "@/abstracts/error-types";
import WriteError from "@/components/elements/error-message/error-message";
import route_paths from "@/helper/route_paths";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function TemplateCreateUpdateView({
  params
}: {
  params: { "create-update": string, id?: number }
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [errors, setErrors] = useState<IError[]>([]);
  const isCreate = params["create-update"] == enumCreateUpdate.create;
  const title = isCreate ? "Create New Template" : "Edit Template";

  const onFinish = useCallback(async (values: any) => {
    try {
      setLoading(true);
      const payload: Record<string, any> = {
        name: values.name,
        slug: slugify(values.name ?? "", { lower: true }),
        description: values.description,
        contentJson: values.content || "{}",
        thumbnailUrl: values.thumbnailUrl,
        isSystem: values.published ?? false,
      };
      if (params.id) {
        payload["id"] = params.id;
      }

      if (params["create-update"] == enumCreateUpdate.create) {
        await api.post(api_points.template.create, payload);
      } else {
        await api.put(`${api_points.template.update}/${params.id}`, payload);
      }

      router.push(`${route_paths.templates}`);
      router.refresh();
    } catch (err: any) {
      setErrors(checkOutError(err));
    } finally {
      setLoading(false);
    }
  }, [params]);

  const getContent = async () => {
    const response = (await api.get(`${api_points.template.getOne}/${params.id}`));
    const raw = response.data?.data || response.data;
    form.setFieldsValue({
      name: raw.name || raw.Name,
      slug: raw.slug || raw.Slug,
      description: raw.description || raw.Description,
      content: raw.contentJson || raw.ContentJson || raw.content,
      published: raw.isSystem ?? raw.IsSystem ?? raw.published,
    });
  };

  useEffect(() => {
    if (params["create-update"] == enumCreateUpdate.edit && params.id) {
      getContent();
    }
  }, []);

  return (
    <div style={{ padding: '0' }}>
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: 'white' }}>
                <LayoutOutlined style={{ marginRight: '12px' }} />
                {title}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                {isCreate
                  ? 'Create a new template for your content layouts'
                  : 'Update template settings and structure'
                }
              </Text>
            </Space>
          </Col>
          <Col>
            <Link href={route_paths.templates}>
              <Button
                icon={<ArrowLeftOutlined />}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white'
                }}
              >
                Back to Templates
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>

      <Form form={form} layout="vertical" initialValues={{
        published: true,
      }} onFinish={onFinish}>
        <Row gutter={[24, 24]}>
          <Col lg={16} xs={24}>
            <Card
              title={
                <Space>
                  <LayoutOutlined />
                  <span>Template Details</span>
                </Space>
              }
              style={{ marginBottom: '24px' }}
            >
              <WriteError errors={errors} />

              <Alert
                message="Template Information"
                description="A template defines the layout and structure for your content. Templates can include design elements, placeholders, and reusable components."
                type="info"
                icon={<InfoCircleOutlined />}
                style={{ marginBottom: '24px' }}
                showIcon
              />

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Template name is required"
                      },
                      {
                        min: 3,
                        message: "Template name must be at least 3 characters"
                      }
                    ]}
                    name="name"
                    label={
                      <Space>
                        <span>Template Name</span>
                        <Tooltip title="This will be the display name for your template">
                          <InfoCircleOutlined style={{ color: '#722ed1' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input
                      placeholder="e.g., Blog Post, Product Page, Landing Page"
                      size="large"
                      onChange={(e) => {
                        const slug = slugify(e.target.value, { lower: true });
                        form.setFieldValue('slug', slug);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="slug"
                    label={
                      <Space>
                        <span>URL Slug</span>
                        <Tooltip title="This will be used to identify the template">
                          <InfoCircleOutlined style={{ color: '#722ed1' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input
                      placeholder="Auto-generated from name"
                      disabled
                      size="large"
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="description"
                    label={
                      <Space>
                        <span>Description</span>
                        <Tooltip title="Brief description of what this template is used for">
                          <InfoCircleOutlined style={{ color: '#722ed1' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <TextArea
                      placeholder="Describe the purpose and usage of this template..."
                      rows={3}
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="content"
                    label={
                      <Space>
                        <span>Template Content</span>
                        <Tooltip title="The template markup or content">
                          <CodeOutlined style={{ color: '#722ed1' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <TextArea
                      placeholder="Enter template content or markup..."
                      rows={6}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col lg={8} xs={24}>
            <Card
              title={
                <Space>
                  <SaveOutlined />
                  <span>Settings & Actions</span>
                </Space>
              }
              style={{ marginBottom: '24px' }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={5} style={{ marginBottom: '8px' }}>Publication Status</Title>
                  <Form.Item name="published" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Space>
                      <Switch />
                      <Text>
                        {form.getFieldValue('published') ? 'Published' : 'Draft'}
                      </Text>
                    </Space>
                  </Form.Item>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Published templates are available for use
                  </Text>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Button
                    htmlType="submit"
                    loading={loading}
                    type="primary"
                    block
                    size="large"
                    icon={<SaveOutlined />}
                  >
                    {isCreate ? "Create Template" : "Update Template"}
                  </Button>

                  {!isCreate && (
                    <Button
                      block
                      size="large"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        const content = form.getFieldValue('content') || form.getFieldValue('contentJson') || '{}';
                        const w = window.open('', '_blank');
                        if (w) {
                          try {
                            const parsed = typeof content === 'string' ? JSON.parse(content) : content;
                            w.document.write(`<pre style="font-size:14px;padding:20px;">${JSON.stringify(parsed, null, 2)}</pre>`);
                          } catch {
                            w.document.write(`<pre style="font-size:14px;padding:20px;">${content}</pre>`);
                          }
                          w.document.close();
                        }
                      }}
                    >
                      Preview Template
                    </Button>
                  )}
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
