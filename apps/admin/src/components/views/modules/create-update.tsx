"use client";;
import enumCreateUpdate from "@/abstracts/create-update";
import SelectDataType from "@/abstracts/label-value";
import api from "@/api/api-context";
import api_points from "@/api/points";
import EButton from "@/components/elements/button";
import ECard from "@/components/elements/card";
import route_paths from "@/helper/route_paths";
import { Button, Col, DatePicker, Flex, Form, Input, Row, Select, Switch, Typography, Space, Card, Alert, Breadcrumb } from "antd";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { MinusCircleOutlined, PlusOutlined, AppstoreOutlined, SaveOutlined, ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { checkOutError } from "@/helper/checkout-error";
import { IError } from "@/abstracts/error-types";
import WriteError from "@/components/elements/error-message/error-message";
import { IField } from "@/types/page";
import LanguageSelect from "@/components/elements/language-select";

const { Title, Text } = Typography;

export default function CreateUpdateModuleView({
  params
}: {
  params: { slug: string, "create-update": string, id: number }
}) {
  const [form] = Form.useForm();
  const [categoryId, setCategoryId] = useState<SelectDataType>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [errors, setErrors] = useState<IError[]>([]);
  const [moduleInputs, setModuleInputs] = useState<IField[] | undefined>(undefined);
  const title = params["create-update"] == enumCreateUpdate.create ? "Create Module" : "Edit Module";

  const onFinish = useCallback(async (values: any) => {
    try {
      values["id"] = params["id"];
      values.slug = slugify(values.name ?? "", {
        lower: true
      });
      setLoading(true);
      (await api.post(api_points.module.create_update, values));
      router.push(`${route_paths.modules}`);
      router.refresh();
    } catch (err: any) {
      setErrors(checkOutError(err));
    } finally {
      setLoading(false);
    }
  }, [categoryId, moduleInputs]);

  const getContent = async () => {
    const data = (await api.get(`${api_points.module.getOne}?id=${params["id"]}`)).data;
    data["date"] = moment(data.date);
    form.setFieldsValue(data);
  };

  useEffect(() => {
    if (params["create-update"] == enumCreateUpdate.edit) {
      getContent();
    }
  }, []);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          published: true,
          date: moment(new Date()),
          isSingleton: false
        }}
        onFinish={onFinish}
        className="modern-form"
      >
        <Row gutter={[24, 24]}>
          <Col lg={16} xs={24}>
            <Card
              title={
                <Space>
                  <InfoCircleOutlined style={{ color: "#F7931E" }} />
                  <Text strong>Module Information</Text>
                </Space>
              }
              // extra={
              //   <>
              //     <LanguageSelect
              //       singleItem={null}
              //       title="Choose Language"
              //       size="default"
              //       variant="default"
              //     />
              //   </>
              // }
              className="modern-card"
              style={{ marginBottom: 24 }}
            >
              <WriteError errors={errors} />

              <Alert
                message="Module Configuration"
                description="Configure your module settings. The module name will be used to identify this content type throughout your CMS."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item
                    rules={[{ required: true, message: "Please enter module name" }]}
                    name="name"
                    label={<Text strong>Module Name</Text>}
                  >
                    <Input
                      placeholder="Enter module name (e.g., Blog Posts, Products)"
                      className="modern-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="description"
                    label={<Text strong>Module Description</Text>}
                  >
                    <Input
                      placeholder="Enter module description"
                      className="modern-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="isSingleton"
                    label={<Text strong>Singleton Module</Text>}
                    extra="Enable this if you only need one instance of this content type (e.g., About Page, Settings)"
                  >
                    <Switch
                      checkedChildren="Yes"
                      unCheckedChildren="No"
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
                  <SaveOutlined style={{ color: "#52c41a" }} />
                  <Text strong>Actions</Text>
                </Space>
              }
              className="modern-card"
              style={{ marginBottom: 24 }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  htmlType="submit"
                  loading={loading}
                  type="primary"
                  icon={<SaveOutlined />}
                  className="modern-btn-primary"
                  block
                  size="large"
                >
                  {params["create-update"] === enumCreateUpdate.create ? "Create Module" : "Update Module"}
                </Button>

                <Link href={route_paths.modules}>
                  <Button
                    icon={<ArrowLeftOutlined />}
                    block
                    size="large"
                  >
                    Cancel
                  </Button>
                </Link>
              </Space>
            </Card>

            <Card
              title={
                <Space>
                  <InfoCircleOutlined style={{ color: "#f59e0b" }} />
                  <Text strong>Module Info</Text>
                </Space>
              }
              className="modern-card"
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Module Type</Text>
                  <br />
                  <Text strong>Content Module</Text>
                </div>

                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Status</Text>
                  <br />
                  <Text strong style={{ color: "#52c41a" }}>Active</Text>
                </div>

                <Alert
                  message="Module Guidelines"
                  description="After creating the module, you can add custom fields to define the content structure."
                  type="info"
                  showIcon
                  style={{ fontSize: 12 }}
                />
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
