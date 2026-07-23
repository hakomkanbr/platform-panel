"use client";;
import { Form, Input, Card, Typography, Divider, Flex } from "antd";
import React, { useState } from "react";
import { MailOutlined, LockOutlined, DatabaseOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { IError } from "@/abstracts/error-types";
import route_paths from "@/helper/route_paths";
import SubmitBtn from "@/components/elements/button/submit-button";
import { IUserState } from "@/abstracts/auth";
import EmailActivated from "./email-sucess";
import { useTransition } from "react";
import api_points from "@/api/points";
import api from "@/api/api-context";
import BtnMigrateDb from "@/components/layout/admin/header/migrate-db";
import Image from "next/image";
import Link from "next/link";
import { getTokenPayload } from "@/helper/session";
import { ROLE } from "@/abstracts/user/user";
import { jwtDecode } from "jwt-decode";
import { checkOutError } from "@/helper/checkout-error";
import WriteError from "@/components/elements/error-message/error-message";

const { Title, Text } = Typography;

const initialState: {
  errors: string,
} = {
  errors: '',
}

const LoginView: React.FC<{ result: IUserState }> = ({ result }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<IError>();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const response = await api.post(api_points.auth.login, { ...values });
      const data = response.data;

      console.info("data => ", data);

      const decoded: any = jwtDecode(data.token);

      const role = decoded[ROLE];

      const roleRoutes: Record<string, string> = {
        SuperAdmin: route_paths.admin,
        Admin: route_paths.admin,
        Editor: route_paths.pages,
      };

      router.push(roleRoutes[role] || route_paths.pages);

    } catch (err: any) {
      var errors = checkOutError(err);
      setErrors(errors);
      console.error("Login error =>", errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F7931E 0%, #E67E00 30%, #009FE3 70%, #007BB5 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      {/* Background Pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        zIndex: 1
      }} />

      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "none",
          position: "relative",
          zIndex: 2
        }}
        bodyStyle={{ padding: "40px 32px" }}
      >
        {/* Logo Section */}
        <Flex justify="center" align="center" gap={10} style={{ textAlign: "center", marginBottom: 32, flexDirection: "column" }}>
          <Image src={"/assets/images/logo-png.png"} width={250} height={73} alt="logo" />
          <Text style={{ color: "#6b7280", fontSize: 16 }}>
            Welcome back to your admin panel
          </Text>
        </Flex>

        {result == IUserState.confirmed && (
          <div style={{ marginBottom: 24 }}>
            <EmailActivated />
          </div>
        )}

        <WriteError errors={errors ?? []} style={{}} />

        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            label={<Text strong style={{ color: "#374151" }}>Email Address</Text>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#9ca3af" }} />}
              placeholder="Enter your email"
              autoComplete="username"
              style={{
                borderRadius: 8,
                border: "1px solid #d1d5db",
                padding: "12px 16px",
                fontSize: 16
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong style={{ color: "#374151" }}>Password</Text>}
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
              autoComplete="current-password"
              placeholder="Enter your password"
              style={{
                borderRadius: 8,
                border: "1px solid #d1d5db",
                padding: "12px 16px",
                fontSize: 16
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
            <SubmitBtn
              loading={loading || isPending}
              block
              htmlType="submit"
              type="primary"
              style={{
                height: 48,
                borderRadius: 8,
                background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
                border: "none",
                fontSize: 16,
                fontWeight: 600,
                boxShadow: "0 4px 6px -1px rgba(247, 147, 30, 0.3)"
              }}
            >
              Sign In to Dashboard
            </SubmitBtn>
          </Form.Item>
        </Form>

        {process.env.NODE_ENV == "development" && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Divider>
              <Text style={{ color: "#9ca3af", fontSize: 12 }}>Development Tools</Text>
            </Divider>
            <BtnMigrateDb />
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Text style={{ color: "#9ca3af", fontSize: 14 }}>
            Powered by <Link href={"https://bremix.tech"} target="_blank">Bremix Tech</Link> • Secure & Modern
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginView;