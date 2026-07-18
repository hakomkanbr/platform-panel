"use client";;
import { Button, Flex, Form, Input } from "antd";
import React, { useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import route_paths from "@/helper/route_paths";
import Swal from "sweetalert2";
import { IError } from "@/abstracts/error-types";
import WriteError from "@/components/elements/error-message/error-message";
import { checkOutError } from "@/helper/checkout-error";
import { confirmEmail } from "@/app/actions/confirm-email";
import { CookiesKeys, IUserState } from "@/abstracts/auth";
import { setCookie } from "@/app/actions/set-cookie";

const EmailConfirmView: React.FC<{
  email: string,
  token: string
}> = ({
  email,
  token
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<IError[]>([]);

    const onFinish = async () => {
      try {
        setLoading(true);
        await confirmEmail(email,token);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Successful Process",
          showConfirmButton: false,
          timer: 1500
        }).then(async () => {
          // const formData = new FormData();
          // await login(formData);
          setCookie(CookiesKeys.authResult , IUserState.confirmed).then(()=>{
            router.push(route_paths.auth.login);
            setLoading(false);
          });
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
            padding: "35px 20px",
            boxShadow: "-4px 4px 17px -8px rgba(0,0,0,0.5)",
            border: "1px solid #f9f9f9"
          }}
          autoComplete="off"
        >
          <Flex align="center" justify="center" style={{
            marginBottom: 30
          }}>
            <h1>Confirm Your Email</h1>
          </Flex>
          <WriteError errors={errors} />
          <Form.Item
            label="Email"
            name="email"
          >
            <Input prefix={<MailOutlined />} defaultValue={email} disabled placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} block htmlType="submit" type="primary">
              {loading ? "please wait..." : "Save"}
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    );
  };

export default EmailConfirmView;