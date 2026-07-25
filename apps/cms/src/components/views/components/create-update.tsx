"use client";
import enumCreateUpdate from "@/abstracts/create-update";
import route_paths from "@/helper/route_paths";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Card,
  Typography,
  Space,
  Alert,
  Tooltip,
} from "antd";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import {
  InfoCircleOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import { checkOutError } from "@/helper/checkout-error";
import { IError } from "@/abstracts/error-types";
import WriteError from "@/components/elements/error-message/error-message";
import {
  getComponentById,
  createComponent,
  updateComponent,
} from "@/api/repostories/components";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ComponentCreateUpdateView({
  params,
}: {
  params: { "create-update": string; id?: number };
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState<IError[]>([]);
  const isCreate = params["create-update"] == enumCreateUpdate.create;
  const title = isCreate ? "Create New Component" : "Edit Component";

  const onFinish = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        const payload = {
          name: values.name,
          displayName: values.displayName,
          slug: slugify(values.name ?? "", { lower: true }),
          category: values.category || "block",
          description: values.description,
          isRepeatable: values.isRepeatable ?? true,
          settingsJson: values.settingsJson || null,
          moduleId: values.moduleId || null,
        };
        if (isCreate) {
          await createComponent(payload);
        } else {
          await updateComponent(params.id!, payload);
        }
        router.push(route_paths.components);
        router.refresh();
      } catch (err: any) {
        setErrors(checkOutError(err));
      } finally {
        setLoading(false);
      }
    },
    [params, isCreate]
  );

  const getContent = async () => {
    try {
      const raw = await getComponentById(params.id!);
      form.setFieldsValue({
        name: raw.name || raw.Name,
        displayName: raw.displayName || raw.DisplayName,
        category: raw.category || raw.Category || "block",
        description: raw.description || raw.Description,
        isRepeatable: raw.isRepeatable ?? raw.IsRepeatable ?? true,
        settingsJson: raw.settingsJson || raw.SettingsJson || "",
        moduleId: raw.moduleId || raw.ModuleId || null,
      });
    } catch {
      // handled silently
    }
  };

  useEffect(() => {
    if (!isCreate && params.id) {
      getContent();
    }
  }, []);

  return (
    <div style={{ padding: "0" }}>
      <Card
        style={{
          marginBottom: "24px",
          background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: "white" }}>
                <BuildOutlined style={{ marginRight: "12px" }} />
                {title}
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}>
                {isCreate
                  ? "Create a new reusable component"
                  : "Update component settings and fields"}
              </Text>
            </Space>
          </Col>
          <Col>
            <Link href={route_paths.components}>
              <Button
                icon={<ArrowLeftOutlined />}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                }}
              >
                Back to Components
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          isRepeatable: true,
          category: "block",
        }}
        onFinish={onFinish}
      >
        <Row gutter={[24, 24]}>
          <Col lg={16} xs={24}>
            <Card
              title={
                <Space>
                  <BuildOutlined />
                  <span>Component Details</span>
                </Space>
              }
              style={{ marginBottom: "24px" }}
            >
              <WriteError errors={errors} />
              <Alert
                message="Component Information"
                description="Components are reusable UI building blocks. Define their structure, fields, and behavior here."
                type="info"
                icon={<InfoCircleOutlined />}
                style={{ marginBottom: "24px" }}
                showIcon
              />
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    rules={[{ required: true, message: "Name is required" }]}
                    name="name"
                    label={
                      <Space>
                        <span>Component Name</span>
                        <Tooltip title="Internal identifier for the component">
                          <InfoCircleOutlined style={{ color: "#0891b2" }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input
                      placeholder="e.g., hero-section, feature-card"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="displayName"
                    label="Display Name"
                    rules={[{ required: true, message: "Display name is required" }]}
                  >
                    <Input
                      placeholder="e.g., Hero Section, Feature Card"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="category" label="Category">
                    <Select
                      size="large"
                      options={[
                        { label: "Block", value: "block" },
                        { label: "Section", value: "section" },
                        { label: "Layout", value: "layout" },
                        { label: "Feature", value: "feature" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="isRepeatable"
                    label="Repeatable"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="description" label="Description">
                    <TextArea
                      placeholder="Describe the component's purpose..."
                      rows={3}
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="settingsJson"
                    label={
                      <Space>
                        <span>Settings (JSON)</span>
                        <Tooltip title="JSON configuration for component settings">
                          <InfoCircleOutlined style={{ color: "#0891b2" }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <TextArea
                      placeholder='{"key": "value"}'
                      rows={4}
                      style={{ fontFamily: "monospace" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="moduleId" label="Module ID (Optional)">
                    <Input placeholder="Link to a module" size="large" />
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
                  <span>Actions</span>
                </Space>
              }
              style={{ marginBottom: "24px" }}
            >
              <Button
                htmlType="submit"
                loading={loading}
                type="primary"
                block
                size="large"
                icon={<SaveOutlined />}
              >
                {isCreate ? "Create Component" : "Update Component"}
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
