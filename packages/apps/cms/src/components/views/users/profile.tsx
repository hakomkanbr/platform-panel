"use client";;
import enumCreateUpdate from "@/abstracts/create-update";
import api from "@/api/api-context";
import api_points from "@/api/points";
import EButton from "@/components/elements/button";
import ECard from "@/components/elements/card";
import route_paths from "@/helper/route_paths";
import { Col, Divider, Form, Input, Row, Typography, Avatar, Space, Card, Alert } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import PlacesEnum from "@/abstracts/file.enum";
import UploadImage from "@/components/elements/upload/upload-single";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux-toolkit/store";

const { Title, Text } = Typography;

export default function UserProfileView({
  params
}: {
  params: { slug: string, "create-update": string, id: number }
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const title = "Edit Profile";
  useEffect(() => {
    const a = async () => {
      const data = await (await api.get(api_points.users.getOne + `?id=${user.userId}`)).data
      form.setFieldsValue(data);
    }
    a();
  }, [])

  const onFinish = useCallback(async (values: any) => {
    try {
      values["id"] = user?.id;
      setLoading(true);
      (await api.post(api_points.users.create_update, values));
      Swal.fire({
        title: "User Information Updated",
        icon: "success"
      })
    } finally {
      setLoading(false);
    }
  }, [user]);
  const getUser = async () => {
    const data = (await api.get(`${api_points.users.getOne}?id=${params["id"]}`)).data;
    data["date"] = moment(data.date);
    form.setFieldsValue(data);
  };
  useEffect(() => {
    if (params["create-update"] == enumCreateUpdate.edit) {
      getUser();
    }
  }, []);
  return (
    <div style={{  background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24 }}>
        <Space align="center" style={{ marginBottom: 16 }}>
          <Link href={route_paths.admin}>
            <EButton 
              type="text" 
              icon={<ArrowLeftOutlined />}
              style={{ 
                display: "flex", 
                alignItems: "center",
                color: "#F7931E"
              }}
            >
              Back to Dashboard
            </EButton>
          </Link>
        </Space>
        
        <Card 
          style={{ 
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "none"
          }}
          bodyStyle={{ padding: "32px" }}
        >
          <Space align="center" size={24}>
            <Avatar 
              size={80} 
              icon={<UserOutlined />}
              style={{ 
                background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
                border: "4px solid white",
                boxShadow: "0 4px 12px rgba(247, 147, 30, 0.3)"
              }}
            />
            <div>
              <Title level={2} style={{ margin: 0, color: "#1f2937" }}>
                {title}
              </Title>
              <Text style={{ color: "#6b7280", fontSize: 16 }}>
                Manage your account settings and preferences
              </Text>
            </div>
          </Space>
        </Card>
      </div>

      <Form 
        form={form} 
        layout="vertical" 
        initialValues={{
          published: true,
          date: moment(new Date())
        }} 
        onFinish={onFinish}
      >
        <Row gutter={[24, 24]}>
          {/* Main Profile Information */}
          <Col lg={16} md={24}>
            <Card
              title={
                <Space>
                  <UserOutlined style={{ color: "#F7931E" }} />
                  <Text strong style={{ fontSize: 18, color: "#1f2937" }}>
                    Profile Information
                  </Text>
                </Space>
              }
              style={{ 
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "none"
              }}
              bodyStyle={{ padding: "32px" }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    name="userName" 
                    label={<Text strong style={{ color: "#374151" }}>Username</Text>}
                    rules={[{ required: true, message: "Please enter username" }]}
                  >
                    <Input 
                      prefix={<UserOutlined style={{ color: "#9ca3af" }} />}
                      placeholder="Enter username"
                      size="large"
                      style={{
                        borderRadius: 8,
                        border: "1px solid #d1d5db"
                      }}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item 
                    name="email" 
                    label={<Text strong style={{ color: "#374151" }}>Email Address</Text>}
                    rules={[
                      { type: 'email', message: "Please enter a valid email" }, 
                      { required: true, message: "Please enter email" }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined style={{ color: "#9ca3af" }} />}
                      placeholder="Enter email address"
                      size="large"
                      style={{
                        borderRadius: 8,
                        border: "1px solid #d1d5db"
                      }}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item 
                    name="phoneNumber" 
                    label={<Text strong style={{ color: "#374151" }}>Phone Number</Text>}
                  >
                    <Input 
                      prefix={<PhoneOutlined style={{ color: "#9ca3af" }} />}
                      placeholder="Enter phone number"
                      size="large"
                      style={{
                        borderRadius: 8,
                        border: "1px solid #d1d5db"
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: "32px 0", borderColor: "#e5e7eb" }}>
                <Text style={{ color: "#6b7280", fontWeight: 500 }}>Security Settings</Text>
              </Divider>

              <Alert
                message="Password Security"
                description="For your security, please use a strong password with at least 8 characters including letters, numbers, and special characters."
                type="info"
                showIcon
                style={{ 
                  marginBottom: 24,
                  borderRadius: 8,
                  border: "1px solid #bfdbfe",
                  background: "#eff6ff"
                }}
              />

              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="password"
                    label={<Text strong style={{ color: "#374151" }}>New Password</Text>}
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                      {
                        min: 8,
                        message: 'Password must be at least 8 characters!',
                      },
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
                      placeholder="Enter new password"
                      size="large"
                      style={{
                        borderRadius: 8,
                        border: "1px solid #d1d5db"
                      }}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="confirm"
                    label={<Text strong style={{ color: "#374151" }}>Confirm Password</Text>}
                    dependencies={['password']}
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The passwords do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
                      placeholder="Confirm new password"
                      size="large"
                      style={{
                        borderRadius: 8,
                        border: "1px solid #d1d5db"
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={8} md={24}>
            {/* Action Buttons */}
            <Card
              title={
                <Text strong style={{ fontSize: 16, color: "#1f2937" }}>
                  Actions
                </Text>
              }
              style={{ 
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "none",
                marginBottom: 24
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <EButton 
                  htmlType="submit" 
                  loading={loading} 
                  type="primary"
                  icon={<SaveOutlined />}
                  size="large"
                  block
                  style={{
                    height: 48,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
                    border: "none",
                    fontWeight: 600,
                    boxShadow: "0 4px 6px -1px rgba(247, 147, 30, 0.3)"
                  }}
                >
                  Save Changes
                </EButton>
                
                <Link href={route_paths.admin}>
                  <EButton 
                    type="default" 
                    size="large"
                    block
                    style={{
                      height: 48,
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                      color: "#6b7280"
                    }}
                  >
                    Cancel
                  </EButton>
                </Link>
              </Space>
            </Card>

            {/* Profile Image */}
            <Card
              title={
                <Text strong style={{ fontSize: 16, color: "#1f2937" }}>
                  Profile Picture
                </Text>
              }
              style={{ 
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "none"
              }}
              bodyStyle={{  textAlign: "center" }}
            >
              <Form.Item name="image" style={{ marginBottom: 0 }}>
                <UploadImage name="image" form={form} module={PlacesEnum.User} />
              </Form.Item>
              <Text style={{ color: "#6b7280", fontSize: 14, marginTop: 16, display: "block" }}>
                Upload a professional photo for your profile
              </Text>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
