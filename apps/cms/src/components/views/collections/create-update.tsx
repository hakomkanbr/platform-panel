"use client";;
import enumCreateUpdate from "@/abstracts/create-update";
import api from "@/api/api-context";
import api_points from "@/api/points";
import EButton from "@/components/elements/button";
import ECard from "@/components/elements/card";
import route_paths from "@/helper/route_paths";
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
  message
} from "antd";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { 
  MinusCircleOutlined, 
  PlusOutlined, 
  InfoCircleOutlined,
  SaveOutlined,
  EyeOutlined,
  DatabaseOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { checkOutError } from "@/helper/checkout-error";
import { IError } from "@/abstracts/error-types";
import WriteError from "@/components/elements/error-message/error-message";

const { Title, Text, Paragraph } = Typography;

export default function CollectionCreateUpdateView({
  params
}: {
  params: { "create-update": string, id?: number }
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [errors, setErrors] = useState<IError[]>([]);
  const isCreate = params["create-update"] == enumCreateUpdate.create;
  const title = isCreate ? "Create New Collection" : "Edit Collection";

  const onFinish = useCallback(async (values: any) => {
    try {
      if (params.id) {
        values["id"] = params.id;
      }
      values.slug = slugify(values.name ?? "", {
        lower: true
      });
      setLoading(true);
      
      if (params["create-update"] == enumCreateUpdate.create) {
        await api.post(api_points.collection.create, values);
      } else {
        await api.put(`${api_points.collection.update}/${params.id}`, values);
      }
      
      router.push(`${route_paths.collections}`);
      router.refresh();
    } catch (err: any) {
      setErrors(checkOutError(err));
    } finally {
      setLoading(false);
    }
  }, [params]);

  const getContent = async () => {
    const data = (await api.get(`${api_points.collection.getOne}/${params.id}`)).data;
    form.setFieldsValue(data);
  };

  useEffect(() => {
    if (params["create-update"] == enumCreateUpdate.edit && params.id) {
      getContent();
    }
  }, []);

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: 'white' }}>
                <DatabaseOutlined style={{ marginRight: '12px' }} />
                {title}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                {isCreate 
                  ? 'Create a new collection to organize your content'
                  : 'Update collection settings and structure'
                }
              </Text>
            </Space>
          </Col>
          <Col>
            <Link href={route_paths.collections}>
              <Button 
                icon={<ArrowLeftOutlined />}
                style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white'
                }}
              >
                Back to Collections
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>

      <Form form={form} layout="vertical" initialValues={{
        published: true,
        items: []
      }} onFinish={onFinish}>
        <Row gutter={[24, 24]}>
          <Col lg={16} xs={24}>
            <Card 
              title={
                <Space>
                  <DatabaseOutlined />
                  <span>Collection Details</span>
                </Space>
              }
              style={{ marginBottom: '24px' }}
            >
              <WriteError errors={errors} />
              
              <Alert
                message="Collection Information"
                description="A collection is a structured way to organize related content. Each collection can contain multiple items with key-value pairs."
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
                        message: "Collection name is required"
                      },
                      {
                        min: 3,
                        message: "Collection name must be at least 3 characters"
                      }
                    ]} 
                    name="name" 
                    label={
                      <Space>
                        <span>Collection Name</span>
                        <Tooltip title="This will be the display name for your collection">
                          <InfoCircleOutlined style={{ color: '#1890ff' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input 
                      placeholder="e.g., Blog Posts, Products, Team Members" 
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
                        <Tooltip title="This will be used in URLs and API endpoints">
                          <InfoCircleOutlined style={{ color: '#1890ff' }} />
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
                  <Divider orientation="left">
                    <Space>
                      <DatabaseOutlined />
                      <span>Collection Items</span>
                      <Badge count={form.getFieldValue('items')?.length || 0} showZero />
                    </Space>
                  </Divider>
                  
                  <Alert
                    message="Collection Structure"
                    description="Define the structure of your collection by adding key-value pairs. These will serve as the template for all items in this collection."
                    type="info"
                    style={{ marginBottom: '16px' }}
                    showIcon
                  />

                  <Form.List name="items">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Card 
                            key={key} 
                            size="small" 
                            style={{ marginBottom: '12px', border: '1px solid #d9d9d9' }}
                            title={`Item ${name + 1}`}
                            extra={
                              <Tooltip title="Remove Item">
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => remove(name)}
                                />
                              </Tooltip>
                            }
                          >
                            <Form.Item
                              {...restField}
                              name={[name, 'id']}
                              style={{ display: 'none' }}
                            >
                              <Input type="hidden" />
                            </Form.Item>
                            
                            <Row gutter={[12, 12]}>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  rules={[{
                                    required: true,
                                    message: "Key is required"
                                  }]}
                                  {...restField}
                                  name={[name, 'key']}
                                  label="Key"
                                  style={{ marginBottom: 0 }}
                                >
                                  <Input 
                                    placeholder="e.g., title, description, price" 
                                    size="large"
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  rules={[{
                                    required: true,
                                    message: "Value is required"
                                  }]}
                                  {...restField}
                                  name={[name, 'value']}
                                  label="Default Value"
                                  style={{ marginBottom: 0 }}
                                >
                                  <Input 
                                    placeholder="Default value for this field" 
                                    size="large"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        
                        <Button 
                          type="dashed" 
                          onClick={() => add()} 
                          block 
                          icon={<PlusOutlined />}
                          size="large"
                          style={{ 
                            height: '60px',
                            borderStyle: 'dashed',
                            borderColor: '#1890ff',
                            color: '#1890ff'
                          }}
                        >
                          Add New Item Field
                        </Button>
                      </>
                    )}
                  </Form.List>
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
                    Published collections are accessible via API
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
                    {isCreate ? "Create Collection" : "Update Collection"}
                  </Button>
                  
                  {!isCreate && (
                    <Button 
                      block
                      size="large"
                      icon={<EyeOutlined />}
                    >
                      Preview Collection
                    </Button>
                  )}
                </Space>
              </Space>
            </Card>

            {/* Collection Info Card */}
            <Card 
              title="Collection Info"
              size="small"
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div>
                  <Text strong>API Endpoint:</Text>
                  <br />
                  <Text code style={{ fontSize: '11px' }}>
                    /api/collections/{form.getFieldValue('slug') || 'collection-slug'}
                  </Text>
                </div>
                <div>
                  <Text strong>Items Count:</Text>
                  <br />
                  <Badge count={form.getFieldValue('items')?.length || 0} showZero />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}