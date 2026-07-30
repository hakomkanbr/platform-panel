"use client";;
import { Button, Col, Flex, Form, Input, Row } from "antd";
import React, { useState } from "react";
import { LinkOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { logout } from "@/app/actions/login";
import api from "@/api/api-context";
import api_points from "@/api/points";
import { IError } from "@/abstracts/error-types";
import WriteError from "@/components/elements/error-message/error-message";

const CreateSiteView: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<IError[]>([]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      if(values.id){
        await api.post(api_points.webSite.update,values);
      }else{
        await api.post(api_points.webSite.create,values);
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Successful Process",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        logout();
        setLoading(false);
      });
    } catch (err: any) {
      console.info("err => ", err);
      setErrors(err?.response?.data as IError[]);
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
        width: 1000
      }}
    >
      <Form
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{
          width: "50%",
          padding: "35px 20px",
          backgroundColor: "#fdfafa",
        }}
        autoComplete="off"
      >
        <Flex align="center" justify="center" style={{
          marginBottom: 30
        }}>
          <h1>Create Your WebSite</h1>
        </Flex>
        <WriteError errors={errors} />
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
            >
              <Input placeholder="WebSite Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{
                required:true
              }]}
            >
              <Input placeholder="WebSite Description" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="link"
              label="Link"
            >
              <Input prefix={<LinkOutlined />} placeholder="Link" />
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

export default CreateSiteView;