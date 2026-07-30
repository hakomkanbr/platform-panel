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
  Select,
  Tag,
  Radio
} from "antd";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  InfoCircleOutlined,
  SaveOutlined,
  EyeOutlined,
  ShareAltOutlined,
  ArrowLeftOutlined,
  ApiOutlined,
  GlobalOutlined,
  RocketOutlined,
  CodeOutlined,
  ThunderboltOutlined,
  LinkOutlined,
  NodeIndexOutlined,
  DatabaseOutlined
} from "@ant-design/icons";
import { checkOutError } from "@/helper/checkout-error";
import { IError } from "@/abstracts/error-types";
import WriteError from "@/components/elements/error-message/error-message";
import route_paths from "@/helper/route_paths";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export enum RelationType {
  OneToOne = 1,      // علاقة واحد لواحد
  OneToMany = 2,     // علاقة واحد لكثير
  ManyToMany = 3     // علاقة كثير لكثير
}

export default function RelationCreateUpdateView({
  params
}: {
  params: { "create-update": string, id?: number }
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [errors, setErrors] = useState<IError[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const isCreate = params["create-update"] == enumCreateUpdate.create;
  const title = isCreate ? "Create Relation" : "Edit Relation";

  const onFinish = useCallback(async (values: any) => {
    try {
      if (params.id) {
        values["id"] = params.id;
      }

      setLoading(true);

      if (params["create-update"] == enumCreateUpdate.create) {
        await api.post(api_points.relation.create, values);
        message.success('Relation created successfully!');
      } else {
        await api.put(`${api_points.relation.update}/${params.id}`, values);
        message.success('Relation updated successfully!');
      }

      router.push(route_paths.relations);
      router.refresh();
    } catch (err: any) {
      setErrors(checkOutError(err));
    } finally {
      setLoading(false);
    }
  }, [params]);

  const getContent = async () => {
    var data = (await api.get(`${api_points.relation.getOne}/${params.id}`)).data;
    console.log("Data Before:", data);

    if (data.relationType == "OneToOne") {
      data.relationType = RelationType.OneToOne;
    } else if (data.relationType == "OneToMany") {
      data.relationType = RelationType.OneToMany;
    } else if (data.relationType == "ManyToMany") {
      data.relationType = RelationType.ManyToMany;
    }
    console.log("Data After:", data);
    form.setFieldsValue(data);
  };

  const getCollections = async () => {
    try {
      const response = await api.get(api_points.module.getAll);
      setCollections(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  useEffect(() => {
    getCollections();
    if (params["create-update"] == enumCreateUpdate.edit && params.id) {
      getContent();
    }
  }, []);

  const relationTypes = [
    {
      label: 'One-to-One',
      value: RelationType.OneToOne,
      description: 'Each record in Source Module relates to exactly one record in Target Module',
      icon: <LinkOutlined />
    },
    {
      label: 'One-to-Many',
      value: RelationType.OneToMany,
      description: 'Each record in Source Module can relate to multiple records in Target Module',
      icon: <NodeIndexOutlined />
    },
    {
      label: 'Many-to-Many',
      value: RelationType.ManyToMany,
      description: 'Records in both collections can relate to multiple records in the other collection',
      icon: <ShareAltOutlined />
    }
  ];

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <Card style={{
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        border: 'none'
      }}>
        <Row justify="space-between" align="middle">
          <Col xs={24} lg={16}>
            <Space direction="vertical" size="large">
              <div>
                <Space align="center" size="middle">
                  <Badge.Ribbon text="Headless CMS" color="gold">
                    <div style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '12px',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <ShareAltOutlined style={{ fontSize: '32px', color: 'white' }} />
                    </div>
                  </Badge.Ribbon>
                </Space>
                <div style={{ marginTop: '16px' }}>
                  <Title level={2} style={{ margin: 0, color: 'white' }}>
                    {title}
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                    {isCreate
                      ? 'Define relationships between collections with automatic API handling'
                      : 'Update relation settings and connection rules'
                    }
                  </Text>
                </div>
              </div>

              <Space size="large">
                <Space align="center">
                  <ApiOutlined style={{ color: 'white' }} />
                  <Text style={{ color: 'white' }}>Auto API Joins</Text>
                </Space>
                <Space align="center">
                  <GlobalOutlined style={{ color: 'white' }} />
                  <Text style={{ color: 'white' }}>Nested Responses</Text>
                </Space>
                <Space align="center">
                  <ThunderboltOutlined style={{ color: 'white' }} />
                  <Text style={{ color: 'white' }}>Query Optimization</Text>
                </Space>
              </Space>
            </Space>
          </Col>

          <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
            <Link href={route_paths.relations}>
              <Button
                icon={<ArrowLeftOutlined />}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white'
                }}
                size="large"
              >
                Back to Relations
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>

      <Form form={form} layout="vertical" initialValues={{
        isActive: true,
        type: 'one-to-many'
      }} onFinish={onFinish}>
        <Row gutter={[24, 24]}>
          <Col lg={16} xs={24}>
            <Card
              title={
                <Space>
                  <ShareAltOutlined />
                  <span>Relation Configuration</span>
                  {/* <Badge count="API Ready" style={{ backgroundColor: '#52c41a' }} /> */}
                </Space>
              }
              style={{ marginBottom: '24px' }}
            >
              <WriteError errors={errors} />

              <Alert
                message="Relation in Headless CMS"
                description={
                  <div>
                    <div>Relations automatically handle data joins in API responses and enable complex queries between collections.</div>
                    <div style={{ marginTop: '8px' }}>
                      <Tag color="blue">Auto-Join</Tag>
                      <Tag color="green">Nested Data</Tag>
                      <Tag color="orange">Query Optimization</Tag>
                      <Tag color="purple">Referential Integrity</Tag>
                    </div>
                  </div>
                }
                type="info"
                icon={<ApiOutlined />}
                style={{ marginBottom: '24px' }}
                showIcon
              />

              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Relation name is required"
                      },
                      {
                        min: 3,
                        message: "Relation name must be at least 3 characters"
                      }
                    ]}
                    name="name"
                    label={
                      <Space>
                        <span>Relation Name</span>
                        <Tooltip title="A descriptive name for this relationship">
                          <InfoCircleOutlined style={{ color: '#ff6b6b' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input
                      placeholder="e.g., User Posts, Product Categories, Order Items"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    name="description"
                    label={
                      <Space>
                        <span>Description</span>
                        <Tooltip title="Describe the relationship between collections (optional)">
                          <InfoCircleOutlined style={{ color: '#ff6b6b' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <TextArea
                      placeholder="Describe how these collections are related..."
                      rows={3}
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Divider orientation="left">
                    <Space>
                      <ShareAltOutlined />
                      <span>Relation Type</span>
                    </Space>
                  </Divider>

                  <Form.Item
                    name="relationType"
                    label="Select Relation Type"
                    rules={[{ required: true, message: 'Please select a relation type' }]}
                  >
                    <Radio.Group style={{ width: '100%' }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {relationTypes.map((type) => (
                          <Card
                            key={type.value}
                            size="small"
                            style={{
                              border: form.getFieldValue('type') === type.value ? '2px solid #ff6b6b' : '1px solid #d9d9d9',
                              backgroundColor: form.getFieldValue('type') === type.value ? '#fff2f0' : 'white'
                            }}
                          >
                            <Radio value={type.value} style={{ width: '100%' }}>
                              <Space>
                                {type.icon}
                                <div>
                                  <Text strong>{type.label}</Text>
                                  <br />
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {type.description}
                                  </Text>
                                </div>
                              </Space>
                            </Radio>
                          </Card>
                        ))}
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    rules={[{ required: true, message: "Source Module is required" }]}
                    name="moduleId"
                    label={
                      <Space>
                        <span>Source Module</span>
                        <Tooltip title="The collection that will contain the foreign key">
                          <DatabaseOutlined style={{ color: '#ff6b6b' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Select
                      placeholder="Select Source Module"
                      size="large"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={collections.map(col => ({
                        label: col.name,
                        value: col.id
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    rules={[{ required: true, message: "Target Module is required" }]}
                    name="relatedModelId"
                    label={
                      <Space>
                        <span>Target Module</span>
                        <Tooltip title="The collection that will be referenced">
                          <DatabaseOutlined style={{ color: '#ff6b6b' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Select
                      placeholder="Select Target Module"
                      size="large"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={collections.map(col => ({
                        label: col.name,
                        value: col.id
                      }))}
                    />
                  </Form.Item>
                </Col>

                {/* <Col xs={24} md={12}>
                  <Form.Item 
                    name="foreignKey" 
                    label={
                      <Space>
                        <span>Foreign Key Field</span>
                        <Tooltip title="The field name that will store the reference (leave empty for auto-generation)">
                          <CodeOutlined style={{ color: '#ff6b6b' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input 
                      placeholder="e.g., user_id, category_id (auto-generated if empty)" 
                      size="large"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item 
                    name="relationKey" 
                    label={
                      <Space>
                        <span>Relation Key</span>
                        <Tooltip title="The key used in API responses for nested data">
                          <ApiOutlined style={{ color: '#ff6b6b' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input 
                      placeholder="e.g., user, category, items" 
                      size="large"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </Form.Item>
                </Col> */}
              </Row>
            </Card>
          </Col>

          <Col lg={8} xs={24}>
            <Card
              title={
                <Space>
                  <RocketOutlined />
                  <span>Settings</span>
                </Space>
              }
              style={{ marginBottom: '24px' }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>

                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Button
                    htmlType="submit"
                    loading={loading}
                    type="primary"
                    block
                    size="large"
                    icon={<SaveOutlined />}
                    style={{ backgroundColor: '#ff6b6b', borderColor: '#ff6b6b' }}
                  >
                    {isCreate ? "Create Relation" : "Update Relation"}
                  </Button>

                  {/* {!isCreate && (
                    <Button 
                      block
                      size="large"
                      icon={<ApiOutlined />}
                      style={{ borderColor: '#52c41a', color: '#52c41a' }}
                    >
                      Test Relation API
                    </Button>
                  )} */}
                </Space>
              </Space>
            </Card>

            {/* API Info Card */}
            <Card
              title={
                <Space>
                  <ApiOutlined />
                  <span>API Information</span>
                </Space>
              }
              size="small"
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ color: '#ff6b6b' }}>API Features:</Text>
                  <ul style={{ margin: '8px 0', paddingLeft: '16px', fontSize: '12px' }}>
                    <li>✅ Automatic Joins</li>
                    <li>✅ Nested Data Responses</li>
                    <li>✅ Query Optimization</li>
                    <li>✅ Lazy Loading Support</li>
                    <li>✅ Referential Integrity</li>
                    <li>✅ Cascade Operations</li>
                  </ul>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Text strong style={{ color: '#ff6b6b' }}>Example Response:</Text>
                  <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '8px',
                    borderRadius: '4px',
                    marginTop: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px'
                  }}>
                    {`{
  "id": 1,
  "title": "Post Title",
  "user": {
    "id": 1,
    "name": "John Doe"
  }
}`}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}