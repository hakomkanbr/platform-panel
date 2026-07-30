"use client";
import api from "@/api/api-context";
import api_points from "@/api/points";
import EButton from "@/components/elements/button";
import { useAppDispatch } from "@/lib/redux-toolkit/hooks";
import { dtRefresh } from "@/lib/redux-toolkit/slice/datatable-slice";
import { changeModalState } from "@/lib/redux-toolkit/slice/modal-slice";
import { RootState } from "@/lib/redux-toolkit/store";
import { 
    Alert, 
    Flex, 
    Form, 
    Modal, 
    Select, 
    Space, 
    Typography,
    Tag,
    message
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PlusOutlined, GlobalOutlined, InfoCircleOutlined } from "@ant-design/icons";
import languages from "@/data/language.json";
import ILanguage from "@/abstracts/language";

const { Text } = Typography;

export default function LanguageCreateUpdateView() {
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const [slug, setSlug] = useState<string>("");
  const { modal } = useSelector((state: RootState) => state);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: ILanguage) => {
    setLoading(true);
    try {
      const selectedLanguage = languages.find(i => i.code === values.slug);
      values.name = selectedLanguage?.name ?? "";
      values.slug = values.slug;
      
      if (modal.data) {
        values.id = modal.data.id;
      }
      
      await api.post(api_points.service.addUpdateLanguage, values);
      
      message.success(`Language ${modal.data ? 'updated' : 'added'} successfully!`);
      dispatch(dtRefresh());
      dispatch(changeModalState({ open: false }));
      form.resetFields();
      setSlug("");
    } catch (error) {
      message.error("Failed to save language. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modal.open) {
      if (modal.data) {
        form.setFieldsValue(modal.data);
        setSlug(modal.data.slug);
      }
    } else {
      form.resetFields();
      setSlug("");
    }
  }, [modal, form]);

  const onChange = (value: string) => {
    setSlug(value);
  };

  const selectedLanguage = languages.find(lang => lang.code === slug);

  return (
    <div className="language-create-update">
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <div>
          <Text strong style={{ fontSize: 16 }}>Available Languages</Text>
          <br />
          <Text type="secondary">Add support for multiple languages in your CMS</Text>
        </div>
        <EButton 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => dispatch(changeModalState({ open: true }))}
          size="large"
        >
          Add Language
        </EButton>
      </Flex>

      <Modal 
        title={
          <Space>
            <GlobalOutlined style={{ color: '#F7931E' }} />
            <span>{modal.data ? "Edit Language" : "Add New Language"}</span>
          </Space>
        }
        open={modal.open} 
        onCancel={() => {
          dispatch(changeModalState({ open: false }));
          form.resetFields();
          setSlug("");
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={600}
        className="language-modal"
      >
        <div style={{ padding: '20px 0' }}>
          <Form
            onFinish={onSubmit}
            form={form}
            layout="vertical"
            size="large"
          >
            <Form.Item 
              name="slug" 
              label={<Text strong>Select Language</Text>}
              rules={[{ required: true, message: 'Please select a language' }]}
            >
              <Select 
                onChange={onChange} 
                placeholder="Choose a language to add"
                showSearch
                filterOption={(input, option) =>
                  (option?.label as unknown as string)?.toLowerCase().includes(input.toLowerCase()) ||
                  (option?.value as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
                size="large"
              >
                {languages.map((language, i) => (
                  <Select.Option key={i} value={language.code}>
                    <Space>
                      <Tag color="blue">{language.code.toUpperCase()}</Tag>
                      {language.name}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {selectedLanguage && (
              <Alert
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                message="Language URL Structure"
                description={
                  <Space direction="vertical" size="small">
                    <Text>
                      <Text strong>Language Code:</Text> {selectedLanguage.code}
                    </Text>
                    <Text>
                      <Text strong>Display Name:</Text> {selectedLanguage.name}
                    </Text>
                    <Text>
                      <Text strong>URL Pattern:</Text> <Text code>/{selectedLanguage.code}/your-content</Text>
                    </Text>
                  </Space>
                }
                style={{ marginTop: 16 }}
              />
            )}
          </Form>
        </div>
      </Modal>

      <style jsx>{`
        .language-create-update {
          padding: 8px 0;
        }

        :global(.language-modal .ant-modal-header) {
          border-bottom: 2px solid #f1f5f9;
          padding: 20px 24px;
        }

        :global(.language-modal .ant-modal-body) {
          padding: 0 24px 24px;
        }

        :global(.language-modal .ant-select-selector) {
          border-radius: 6px;
        }

        :global(.language-modal .ant-btn-primary) {
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(247, 147, 30, 0.2);
        }
      `}</style>
    </div>
  );
}
