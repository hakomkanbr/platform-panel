"use client";;
import { Button, Col, Flex, Form, Input, Row } from "antd";
import React, { useState } from "react";
import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { register } from '@/app/actions/register';
import route_paths from "@/helper/route_paths";
import Swal from "sweetalert2";
import { IError } from "@/abstracts/error-types";
import WriteError from "@/components/elements/error-message/error-message";
import { checkOutError } from "@/helper/checkout-error";

const RegisterView: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<IError[]>([]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await register(values);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Please Confirm Your Email",
        showConfirmButton: false,
        timer: 5000
      }).then(async () => {
        router.push(route_paths.auth.login)
        setLoading(false);
      });
    } catch (err: any) {
      console.info("err => ", err);
      setErrors(checkOutError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      style={{
        margin: "auto",
        height: "100vh",
      }}
    >
      <Form
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{
          width: 400,
          margin:"auto",
          padding: "35px 20px",
          boxShadow: "-4px 4px 17px -8px rgba(0,0,0,0.5)",
          border: "1px solid #f9f9f9"
        }}
        autoComplete="off"
      >
        <Flex align="center" justify="center" style={{
          marginBottom: 30
        }}>
          <h1>Register</h1>
        </Flex>
        <WriteError errors={errors} />
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="username"
              label="User Name"
              rules={[{
                required: true
              }]}
            >
              <Input prefix={<UserOutlined />} placeholder="User Name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: 'email' }, {
                required: true
              }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{
                required: true
              }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{
                required: true
              }]}
            >
              <Input placeholder="Address" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="confirm"
              label="Confirm Password"
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
                    return Promise.reject(new Error('The new password that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button loading={loading} block htmlType="submit" type="primary">
            {loading ? "please wait..." : "Save"}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default RegisterView;