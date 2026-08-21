"use client";;
import enumCreateUpdate from "@/abstracts/create-update";
import api from "@/api/api-context";
import api_points from "@/api/points";
import EButton from "@/components/elements/button";
import ECard from "@/components/elements/card";
import route_paths from "@/helper/route_paths";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { IError } from "@/abstracts/error-types";
import { checkOutError } from "@/helper/checkout-error";
import WriteError from "@/components/elements/error-message/error-message";
import { useDispatch } from "react-redux";
import { updateWebSite } from "@/lib/redux-toolkit/slice/site-slice";

export default function CreateUpdateWebSiteView({
  params
}: {
  params: { slug: string, "create-update": string, id: number }
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const title = params["create-update"] == enumCreateUpdate.create ? "Create WebSite" : "Edit WebSite";
  const [errors, setErrors] = useState<IError[]>([]);
  const dispatch = useDispatch();
  
  const onFinish = useCallback(async (values: any) => {
    values.slug = slugify(values.name ?? "", {
      lower: true
    });
    try {
      if (!values.name) {
        alert("please choose title..");
        return;
      }
      values["id"] = params["id"];
      values.slug = slugify(values.name ?? "", {
        lower: true
      });
      setLoading(true);
      if(values.id){
        (await api.put(api_points.webSite.update, values));
      }else{
        (await api.post(api_points.webSite.create, values));
      }
      dispatch(updateWebSite(values));
      router.push(`${route_paths.webSites}`);
    } catch (err: any) {
      setErrors(checkOutError(err));
    }
    finally {
      setLoading(false);
    }
  }, []);
  
  const getContent = async () => {
    const data = (await api.get(`${api_points.webSite.getOne}/${params["id"]}`)).data;
    data["date"] = moment(data.date);
    form.setFieldsValue(data);
  };
  
  useEffect(() => {
    if (params["create-update"] == enumCreateUpdate.edit) {
      getContent();
    }
  }, []);

  const { Option } = Select;
  const selectBefore = (
    <Select defaultValue="http://">
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );
  const selectAfter = (
    <Select defaultValue=".com">
      <Option value=".com">.com</Option>
      <Option value=".jp">.jp</Option>
      <Option value=".cn">.cn</Option>
      <Option value=".org">.org</Option>
    </Select>
  );

  return (
    <>
      <Form form={form} layout="vertical" initialValues={{
        published: true,
        date: moment(new Date())
      }} onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col md={16}>
            <ECard title={title}>
              <WriteError errors={errors} />
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <Form.Item name="name" label="Title">
                    <Input placeholder={"Title"} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item name="description" label="Description">
                    <Input placeholder={"Description"} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item name="link" label="Link">
                    <Input addonBefore={selectBefore} defaultValue="Your Site Link" />
                  </Form.Item>
                </Col>
              </Row>
            </ECard>
          </Col>
          <Col md={8}>
            <ECard title="Publish State">
              <Form.Item name="published" label="Published">
                <Select>
                  <Select.Option value={true}>Published</Select.Option>
                  <Select.Option value={false}>unPublished</Select.Option>
                </Select>
              </Form.Item>
              <EButton htmlType="submit" loading={loading} type="primary">
                Save
              </EButton>
              <Link legacyBehavior href={`${route_paths.webSites}`}>
                <EButton type="text">Back</EButton>
              </Link>
            </ECard>
          </Col>
        </Row>
      </Form>
    </>
  );
}
