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

export default function ThemeCreateUpdateView({
  params
}: {
  params: { "create-update": string, id?: number }
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [errors, setErrors] = useState<IError[]>([]);
  const isCreate = params["create-update"] == enumCreateUpdate.create;
  const title = isCreate ? "Create New Theme" : "Edit Theme";

  const onFinish = useCallback(async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        name: values.name,
        slug: slugify(values.name ?? "", { lower: true }),
        description: values.description,
        cssVariablesJson: values.cssVariablesJson || "{}",
        previewUrl: values.previewUrl,
        isActive: values.isActive ?? false,
      };
      if (params.id) {
        payload["id"] = params.id;
      }

      if (params["create-update"] == enumCreateUpdate.create) {
        await api.post(api_points.theme.create, payload);
      } else {
        await api.put(`${api_points.theme.update}/${params.id}`, payload);
      }

      router.push(`${route_paths.themes}`);
      router.refresh();
    } catch (err: any) {
      setErrors(checkOutError(err));
    } finally {
      setLoading(false);
    }
  }, [params]);

  const getContent = async () => {
    const response = (await api.get(`${api_points.theme.getOne}/${params.id}`));
    const raw = response.data?.data || response.data;
    form.setFieldsValue({
      name: raw.name || raw.Name,
      slug: raw.slug || raw.Slug,
      description: raw.description || raw.Description,
      cssVariablesJson: raw.cssVariablesJson || raw.CssVariablesJson || "{}",
      previewUrl: raw.previewUrl || raw.PreviewUrl,
      isActive: raw.isActive ?? raw.IsActive ?? false,
    });
  };

  useEffect(() => {
    if (params["create-update"] == enumCreateUpdate.edit && params.id) {
      getContent();
    }
  }, []);

  return (
    <div style={{ padding: '0' }}>
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: 'white' }}>
                <LayoutOutlined style={{ marginRight: '12px' }} />
                {title}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                {isCreate
                  ? 'Create a new theme for your site appearance'
                  : 'Update theme settings and styles'
                }
              </Text>
            </Space>
          </Col>
          <Col>
            <Link href={route_paths.themes}>
              <Button
                icon={<ArrowLeftOutlined />}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white'
                }}
              >
                Back to Themes
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>

      <Form form={form} layout="vertical" initialValues={{
        isActive: false,
        cssVariablesJson: "{}",
      }} onFinish={onFinish}>
        <Row gutter={[24, 24]}>
          <Col lg={16} xs={24}>
            <Card
              title={
                <Space>
                  <LayoutOutlined />
                  <span>Theme Details</span>
                </Space>
              }
              style={{ marginBottom: '24px' }}
            >
              <WriteError errors={errors} />

              <Alert
                message="Theme Information"
                description="A theme defines the visual appearance of your site including colors, typography, and layout preferences. Themes use CSS variables for consistent styling."
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
                        message: "Theme name is required"
                      },
                      {
                        min: 3,
                        message: "Theme name must be at least 3 characters"
                      }
                    ]}
                    name="name"
                    label={
                      <Space>
                        <span>Theme Name</span>
                        <Tooltip title="This will be the display name for your theme">
                          <InfoCircleOutlined style={{ color: '#10b981' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input
                      placeholder="e.g., Dark Mode, Light Theme, Custom Theme"
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
                        <Tooltip title="This will be used to identify the theme">
                          <InfoCircleOutlined style={{ color: '#10b981' }} />
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
                        <Tooltip title="Brief description of this theme">
                          <InfoCircleOutlined style={{ color: '#10b981' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <TextArea
                      placeholder="Describe the purpose and visual style of this theme..."
                      rows={3}
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="cssVariablesJson"
                    label={
                      <Space>
                        <span>CSS Variables (JSON)</span>
                        <Tooltip title="Custom CSS variables for theme styling">
                          <CodeOutlined style={{ color: '#10b981' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <TextArea
                      placeholder='{"--primary-color": "#10b981", "--secondary-color": "#6366f1"}'
                      rows={6}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="previewUrl"
                    label={
                      <Space>
                        <span>Preview URL</span>
                        <Tooltip title="URL to preview the theme">
                          <InfoCircleOutlined style={{ color: '#10b981' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input
                      placeholder="https://example.com/theme-preview"
                      size="large"
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
                  <Title level={5} style={{ marginBottom: '8px' }}>Activation Status</Title>
                  <Form.Item name="isActive" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Space>
                      <Switch />
                      <Text>
                        {form.getFieldValue('isActive') ? 'Active' : 'Draft'}
                      </Text>
                    </Space>
                  </Form.Item>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Active themes are applied to the site
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
                    style={{ background: '#10b981', borderColor: '#10b981' }}
                  >
                    {isCreate ? "Create Theme" : "Update Theme"}
                  </Button>

                  {!isCreate && (
                    <Button
                      block
                      size="large"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        const content = form.getFieldValue('cssVariablesJson') || "{}";
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
                      Preview CSS Variables
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
