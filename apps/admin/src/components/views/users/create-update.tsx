"use client";;
import enumCreateUpdate from "@/abstracts/create-update";
import api from "@/api/api-context";
import api_points from "@/api/points";
import EButton from "@/components/elements/button";
import ECard from "@/components/elements/card";
import route_paths from "@/helper/route_paths";
import { Alert, Col, DatePicker, Divider, Flex, Form, Input, Modal, Row, Select } from "antd";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import SingleSiteSelect from "./site-select";
import { IRoleType, IUser } from "@/abstracts/user/user";
import { IError } from "@/abstracts/error-types";
import { checkOutError } from "@/helper/checkout-error";
import WriteError from "@/components/elements/error-message/error-message";
import Title from "antd/es/typography/Title";
import { OTPProps } from "antd/es/input/OTP";
import Swal from "sweetalert2";

export default function CreateUpdateUsersView({
  params,
  user
}: {
  params: { slug: string, "create-update": string, id: number },
  user?: IUser
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const title = params["create-update"] == enumCreateUpdate.create ? "Create User" : "Edit User";
  const [code, setCode] = useState<string>();
  const [errorCode, setErrorCode] = useState<IError[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<IError[]>([]);

  const onFinishCreateUpdateUser = useCallback(async (values: any) => {
    try {
      values["id"] = params["id"];
      setLoading(true);
      (await api.post(api_points.users.create_update, values));
      (await api.get(api_points.users.sendCode + `?email=${values.email}`));
      setOpen(true);
    } catch (err: any) {
      setErrors(checkOutError(err));
    } finally {
      setLoading(false);
    }
  }, [user]);
  const onFinishAndConfirmEmail = useCallback(async () => {
    try {
      if (!code || (code && code?.length < 6)) {
        Swal.fire({
          title: "please enter correct code",
        }).then(() => {
          router.push(`${route_paths.users}`);
        })
      }
      (await api.get(`${api_points.users.confirmEmail}?email=${form.getFieldValue("email")}&code=${code}`));
      Swal.fire({
        title: "Email Success",
      }).then(() => {
        router.push(`${route_paths.users}`);
      })
    } catch (err: any) {
      console.info("Error => ", err);
      setErrorCode(checkOutError(err));
    } finally {
    }
  }, [code]);
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
  useEffect(() => {
    setCode("");
  }, [open]);
  const onChange: OTPProps['onChange'] = (text) => {
    setCode(text);
    console.log('onKeyUp:', text);
  };
  const sharedProps: OTPProps = {
    onChange,
  };
  return (
    <>
      <Form form={form} layout="vertical" initialValues={{
        published: true,
        date: moment(new Date())
      }} onFinish={onFinishCreateUpdateUser}>
        <Row gutter={[16, 16]}>
          <Col md={16}>
            <ECard title={title}>
              <WriteError errors={errors} />
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <Form.Item name="userName" label="User Name">
                    <Input placeholder={"User Name"} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item name="email" label="Email" rules={[{ type: 'email' }, {
                    required: true
                  }]}>
                    <Input placeholder="Email" />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item name="phoneNumber" label="Phone Number">
                    <Input placeholder="Phone Number" />
                  </Form.Item>
                </Col>
                {
                  user?.token?.role != IRoleType.User && (
                    <Col xs={12}>
                      <Form.Item name="sId" label="WebSite">
                        <SingleSiteSelect />
                      </Form.Item>
                    </Col>
                  )
                }

                <Divider />
                <Col xs={12}>
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
                <Col xs={12}>
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
            </ECard>
          </Col>
          <Col md={8}>
            <ECard title="Activate State">
              <Form.Item name="published" label="Published">
                <Select>
                  <Select.Option value={true}>Published</Select.Option>
                  <Select.Option value={false}>unPublished</Select.Option>
                </Select>
              </Form.Item>
              <EButton htmlType="submit" loading={loading} type="primary">
                Save
              </EButton>
              <Link legacyBehavior href={`${route_paths.users}`}>
                <EButton type="text">Back</EButton>
              </Link>
            </ECard>
          </Col>
        </Row>
      </Form>
      <Modal onCancel={() => {
        setOpen(false);
      }} onOk={() => {
        onFinishAndConfirmEmail();
      }} open={open}>
        <Flex gap="middle" justify="center" vertical>
          <Title level={5}>Email Confirmation</Title>
          <Alert
            message="Please check your email inbox"
            description="Enter the code we sent to your email."
            type="info"
          />
          <Input.OTP value={code} {...sharedProps} />
          <WriteError errors={errorCode} />
        </Flex>
      </Modal>
    </>
  );
}
