"use client";;
import ICategory from "@/abstracts/categories";
import { IError } from "@/abstracts/error-types";
import ILanguage from "@/abstracts/language";
import api from "@/api/api-context";
import api_points from "@/api/points";
import EButton from "@/components/elements/button";
import WriteError from "@/components/elements/error-message/error-message";
import LanguageSelect from "@/components/elements/language-select";
import { checkOutError } from "@/helper/checkout-error";
import { useAppDispatch } from "@/lib/redux-toolkit/hooks";
import { dtRefresh } from "@/lib/redux-toolkit/slice/datatable-slice";
import { setSelectedLang } from "@/lib/redux-toolkit/slice/language-slice";
import { changeModalState } from "@/lib/redux-toolkit/slice/modal-slice";
import { RootState } from "@/lib/redux-toolkit/store";
import { IModule } from "@/types/page";
import { Drawer, Form, Input, Radio } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import slugify from "slugify";

export default function CategoryCreateUpdateView({
  params,
  model
}: {
  params: { slug: string },
  model : IModule
}) {
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const { modal, languages } = useSelector((state: RootState) => state);
  const [errors, setErrors] = useState<IError[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (values: ICategory) => {
    setLoading(true);
    try {
      values.slug = slugify(values.name, {
        lower: true
      });
      values.languageId = languages.selectedLang?.id ?? 0;
      values.moduleId = model.id;
      if (modal.data) {
        values.id = modal.data.id;
      }
      await api.post(api_points.category.create_update, values);
      await dispatch(dtRefresh());
      dispatch(changeModalState({
        open: false
      }));
    } catch (err: any) {
      setErrors(checkOutError(err));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (modal.open && modal.data) {
      var language = modal.data.language as ILanguage;
      dispatch(setSelectedLang(language));
      form.setFieldsValue(modal.data);
    } else {
      form.resetFields();
    }
  }, [modal]);
  return (
    <>
      <EButton type="default"
        onClick={() => dispatch(changeModalState({ open: true }))}>
        Create Category
      </EButton>
      <Drawer title="Create Category" open={modal.open} onClose={() => {
        dispatch(changeModalState({ open: false }));
      }}>
        <Form
          onFinish={onSubmit}
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          layout="vertical"
          size="middle"
        >
          <LanguageSelect singleItem="" title="Choose Language" onClick={(e) => {
              dispatch(changeModalState({ open: true }));
            }} />
          <Form.Item name="published">
            <Radio.Group defaultValue={true}>
              <Radio.Button value={true}>Published</Radio.Button>
              <Radio.Button value={false}>Unpublished</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <WriteError errors={errors} />
          <Form.Item rules={[
            {
              required: true
            },
            {
              min: 2
            }
          ]} name="name" label="Name">
            <Input placeholder="Category Name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item>
            <EButton loading={loading} htmlType="submit" type="primary">Submit</EButton>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
