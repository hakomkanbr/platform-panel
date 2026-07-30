"use client";;
import enumCreateUpdate from "@/abstracts/create-update";
import api from "@/api/api-context";
import api_points from "@/api/points";
import route_paths from "@/helper/route_paths";
import {
  Button,
  Col, Form,
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
  ArrowLeftOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from "@ant-design/icons";
import { checkOutError } from "@/helper/checkout-error";
import { IError } from "@/abstracts/error-types";
import WriteError from "@/components/elements/error-message/error-message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux-toolkit/store";
import { IoNavigate } from "react-icons/io5";
import LanguageSelect from "@/components/elements/language-select";
import ILanguage from "@/abstracts/language";
import { setSelectedLang } from "@/lib/redux-toolkit/slice/language-slice";

const { Title, Text } = Typography;

export default function NavigationCreateUpdateView({
  params
}: {
  params: { "create-update": string, id?: number }
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [errors, setErrors] = useState<IError[]>([]);
  const isCreate = params["create-update"] == enumCreateUpdate.create;
  const title = isCreate ? "Create New Navigation" : "Edit Navigation";
  const language = useSelector((state: RootState) => state.languages);
  const dispatch = useDispatch();

  const onFinish = useCallback(async (values: any) => {
    try {
      if (params.id) values["id"] = params.id;

      console.info("values => ", values);

      values.items = values.items.map((item: any, index: number) => ({
        ...item,
        children: item.children.map((child: any, childIndex: number) => ({
          ...child,
          order: childIndex
        })),
        order: index
      }))

      setLoading(true);

      console.info("language.selectedLang?.id => ", language.selectedLang?.id);

      values.languageId = language.selectedLang?.id ?? 0;

      if (!values.languageId || values.languageId == 0) {
        message.error("Please select a language");
        return;
      }

      if (params["create-update"] == enumCreateUpdate.create) {
        await api.post(api_points.navigation.create, {
          navigation: values
        });
      } else {
        await api.put(`${api_points.navigation.update}/${params.id}`, {
          navigation: values
        });
      }

      router.push(`${route_paths.navigations}`);
      router.refresh();
    } catch (err: any) {
      setErrors(checkOutError(err));
    } finally {
      setLoading(false);
    }
  }, [params, language]);

  const getContent = async () => {
    const data = (await api.get(`${api_points.navigation.getOne}/${params.id}`)).data;
    console.info("data.language", data.language);
    (data.language as ILanguage) && dispatch(setSelectedLang(data.language));
    form.setFieldsValue(data);
  };

  useEffect(() => {
    if (params["create-update"] == enumCreateUpdate.edit && params.id) {
      getContent();
    }
  }, []);

  useEffect(() => {
    console.info("language.selectedLang => ", language.selectedLang);
  }, [language.selectedLang]);

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: 'white' }}>
                <IoNavigate style={{ marginRight: '12px', position: "relative", top: 5 }} />
                {title}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                {isCreate
                  ? 'Create a new Navigation to organize your content'
                  : 'Update Navigation settings and structure'
                }
              </Text>
            </Space>
          </Col>
          <Col>
            <Link href={route_paths.navigations}>
              <Button
                icon={<ArrowLeftOutlined />}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white'
                }}
              >
                Back to Navigations
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
                  <IoNavigate style={{ position: "relative", top: 4 }} />
                  <span>Navigation Details</span>
                </Space>
              }
              extra={
                <div style={{ paddingTop: 15 }}>
                  <LanguageSelect
                    singleItem={null}
                    title="Choose Language"
                    size="small"
                    variant="default"
                  />
                </div>
              }
              style={{ marginBottom: '24px' }}
            >
              <WriteError errors={errors} />

              <Alert
                message="Navigation Information"
                description="A Navigation is a structured way to organize related content. Each Navigation can contain multiple items with key-value pairs."
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
                        message: "Navigation name is required"
                      },
                      {
                        min: 3,
                        message: "Navigation name must be at least 3 characters"
                      }
                    ]}
                    name="name"
                    label={
                      <Space>
                        <span>Navigation Name</span>
                        <Tooltip title="This will be the display name for your Navigation">
                          <InfoCircleOutlined style={{ color: '#1890ff' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input
                      placeholder="e.g., Navbar, Footer"
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
                    rules={[
                      {
                        required: true,
                        message: "Navigation slug is required"
                      },
                      {
                        min: 3,
                        message: "Navigation slug must be at least 3 characters"
                      }
                    ]}
                    name="slug"
                    label={
                      <Space>
                        <span>Navigation Slug</span>
                        <Tooltip title="This will be the display slug for your Navigation">
                          <InfoCircleOutlined style={{ color: '#1890ff' }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input
                      placeholder="Navigation Slug"
                      size="large"
                      onChange={(e) => {
                        const slug = slugify(e.target.value, { lower: true });
                        form.setFieldValue('slug', slug);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Divider orientation="left">
                    <Space>
                      <DatabaseOutlined />
                      <span>Navigation Items</span>
                      <Badge count={form.getFieldValue('items')?.length || 0} showZero />
                    </Space>
                  </Divider>

                  <Alert
                    message="Navigation Structure"
                    description="Define the structure of your Navigation by adding key-value pairs. These will serve as the template for all items in this Navigation."
                    type="info"
                    style={{ marginBottom: '16px' }}
                    showIcon
                  />

                  <Form.List name="items">
                    {(fields, { add, remove, move }) => (
                      <>
                        {fields.map(({ key, name, ...restField }, index) => (
                          <Card
                            key={key}
                            size="small"
                            style={{ marginBottom: '12px', border: '1px solid #d9d9d9' }}
                            title={`Item ${name + 1}`}
                            extra={
                              <Space>
                                <Tooltip title="Move Up">
                                  <Button
                                    type="text"
                                    size="small"
                                    disabled={index === 0}
                                    icon={<ArrowUpOutlined />}
                                    onClick={() => move(index, index - 1)}
                                  />
                                </Tooltip>
                                <Tooltip title="Move Down">
                                  <Button
                                    type="text"
                                    size="small"
                                    disabled={index === fields.length - 1}
                                    icon={<ArrowDownOutlined />}
                                    onClick={() => move(index, index + 1)}
                                  />
                                </Tooltip>
                                <Tooltip title="Remove Item">
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => remove(name)}
                                  />
                                </Tooltip>
                              </Space>
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
                                    message: "title is required"
                                  }]}
                                  {...restField}
                                  name={[name, 'title']}
                                  label="title"
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
                                    message: "url is required"
                                  }]}
                                  {...restField}
                                  name={[name, 'url']}
                                  label="Default url"
                                  style={{ marginBottom: 0 }}
                                >
                                  <Input
                                    placeholder="Default url for this field"
                                    size="large"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Divider orientation="left" style={{ marginTop: 16 }}>
                              <Space>
                                <span>Children</span>
                                <Badge count={form.getFieldValue(['items', name, 'children'])?.length || 0} showZero />
                              </Space>
                            </Divider>

                            {/* Nested children list */}
                            <Form.List name={[name, 'children']}>
                              {(childFields, { add: childAdd, remove: childRemove, move: childMove }) => (
                                <>
                                  {childFields.map(({ key: cKey, name: cName, ...cRestField }, cIndex) => (
                                    <Card
                                      key={cKey}
                                      size="small"
                                      type="inner"
                                      style={{ marginBottom: 8 }}
                                      title={`Child ${cName + 1}`}
                                      extra={
                                        <Space>
                                          <Tooltip title="Move Up">
                                            <Button
                                              type="text"
                                              size="small"
                                              disabled={cIndex === 0}
                                              icon={<ArrowUpOutlined />}
                                              onClick={() => childMove(cIndex, cIndex - 1)}
                                            />
                                          </Tooltip>
                                          <Tooltip title="Move Down">
                                            <Button
                                              type="text"
                                              size="small"
                                              disabled={cIndex === childFields.length - 1}
                                              icon={<ArrowDownOutlined />}
                                              onClick={() => childMove(cIndex, cIndex + 1)}
                                            />
                                          </Tooltip>
                                          <Tooltip title="Remove Child">
                                            <Button
                                              type="text"
                                              danger
                                              size="small"
                                              icon={<MinusCircleOutlined />}
                                              onClick={() => childRemove(cName)}
                                            />
                                          </Tooltip>
                                        </Space>
                                      }
                                    >
                                      <Form.Item
                                        {...cRestField}
                                        name={[cName, 'id']}
                                        style={{ display: 'none' }}
                                      >
                                        <Input type="hidden" />
                                      </Form.Item>

                                      <Row gutter={[12, 12]}>
                                        <Col xs={24} md={12}>
                                          <Form.Item
                                            rules={[{ required: true, message: 'title is required' }]}
                                            {...cRestField}
                                            name={[cName, 'title']}
                                            label="title"
                                            style={{ marginBottom: 0 }}
                                          >
                                            <Input placeholder="title" size="large" />
                                          </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                          <Form.Item
                                            rules={[{ required: true, message: 'Url is required' }]}
                                            {...cRestField}
                                            name={[cName, 'url']}
                                            label="Url"
                                            style={{ marginBottom: 0 }}
                                          >
                                            <Input placeholder="Url for the key" size="large" />
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                    </Card>
                                  ))}

                                  <Button
                                    type="dashed"
                                    onClick={() => childAdd({})}
                                    block
                                    icon={<PlusOutlined />}
                                    style={{ marginTop: 8 }}
                                  >
                                    Add Child
                                  </Button>
                                </>
                              )}
                            </Form.List>
                          </Card>
                        ))}

                        <Button
                          type="dashed"
                          onClick={() => add({ children: [] })}
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
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Button
                    htmlType="submit"
                    loading={loading}
                    type="primary"
                    block
                    size="large"
                    icon={<SaveOutlined />}
                  >
                    {isCreate ? "Create Navigation" : "Update Navigation"}
                  </Button>
                </Space>
              </Space>
            </Card>

            {/* Navigation Info Card */}
            <Card
              title="Navigation Info"
              size="small"
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div>
                  <Text strong>API Endpoint:</Text>
                  <br />
                  <Text code style={{ fontSize: '11px' }}>
                    /api/Navigations/{form.getFieldValue('slug') || 'Navigation-slug'}
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