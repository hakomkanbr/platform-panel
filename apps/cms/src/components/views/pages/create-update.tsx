"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Switch,
  Button,
  message,
  Card,
  Alert,
  Row,
  Col,
  Typography,
  Space,
  Spin,
  Badge,
  Tooltip
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  LinkOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { createPage, updatePage, getPageById } from "@/api/repostories/pages";
import { FieldValue, IField, IPage, IPageBlock } from "@/types/page";
import ModuleSelector from "./ModuleSelector";
import enumCreateUpdate from "@/abstracts/create-update";
import { validatePageData, generateSlugFromTitle } from "@/utils/pageValidation";
import { v4 as uuidv4 } from "uuid";

import "./CreateUpdatePageView.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux-toolkit/store";
import LanguageSelect from "@/components/elements/language-select";

const { Title, Text } = Typography;

export default function CreateUpdatePageView() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = useSelector((state: RootState) => state.languages);
  const [form] = Form.useForm();
  const [selectedModules, setSelectedModules] = useState<IPageBlock[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  const pageId = searchParams.get('id');
  const isEdit = pageId !== null;

  useEffect(() => {
    if (isEdit && pageId) {
      loadPageData(parseInt(pageId));
    }
  }, [isEdit, pageId]);

  const loadPageData = async (id: number) => {
    try {
      setInitialLoading(true);
      const pageData: IPage & {
        blocks: any
      } = await getPageById(id);

      form.setFieldsValue({
        title: pageData.title,
        slug: pageData.slug,
        published: pageData.published
      });

      if (pageData.blocks) {
        console.info("restoredModules => ", pageData.blocks);
        const restoredModules = pageData.blocks.map((block: any, index: number) => {
          // تحويل array of fieldValues إلى كائن { fieldSlug: value }
          const fieldValueMap: Record<string, string> = {};

          block?.fields.forEach((field: IField) => {
            const match = (block.fieldValues as FieldValue[]).find(fv => fv.fieldId === field.id);
            if (match) {
              fieldValueMap[field.fieldSlug] = match.value;
            }
          });

          return {
            ...block,
            fieldValues: fieldValueMap,
            uid: uuidv4(),
          };
        });

        console.info("restoredModules => ", restoredModules);

        setSelectedModules(restoredModules);
      }
    } catch (error) {
      message.error('فشل في تحميل بيانات الصفحة');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // التحقق من صحة البيانات
      const validation = validatePageData(values.title, values.slug, selectedModules, language.selectedLang?.slug ?? "");
      setValidationErrors(validation.errors);
      setValidationWarnings(validation.warnings);

      if (!validation.isValid) {
        message.error("يرجى تصحيح الأخطاء قبل الحفظ");
        return;
      }




      console.info("selectedModules => ", selectedModules);

      // إعادة ترتيب الوحدات
      const sortedModules = selectedModules.flatMap((module, index) => {
        return {
          ...module,
          id: module?.id,     // تأكد أنه موجود
          fieldValues: module.fields?.map((field, index) => ({
            blockId: module.id,     // تأكد أنه موجود
            fieldId: field.id,
            languageSlug: language.selectedLang?.slug,
            value: module.fieldValues[field.fieldSlug] || ""
          })) ?? [],
          order: index
        };
      });

      console.info("sonra => selectedModules => ", selectedModules);

      const payload = {
        ...values,
        languageId: language.selectedLang?.id,
        blocks: sortedModules
      };

      if (isEdit && pageId) {
        await updatePage(parseInt(pageId), {
          page: payload
        });
        message.success("Page updated successfully ✅");
      } else {
        await createPage({
          page: payload
        });
        message.success("Page created successfully ✅");
      }

      router.push("/admin/pages");
    } catch (error) {
      console.info("Error => ", error),
        message.error(isEdit ? "Failed to refresh page" : "Failed to create page");
    } finally {
      setLoading(false);
    }
  };

  const handleModulesChange = (modules: IPageBlock[]) => {
    setSelectedModules(modules);
    // مسح رسائل التحقق عند تغيير الوحدات
    setValidationErrors([]);
    setValidationWarnings([]);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // إنشاء slug تلقائياً من العنوان إذا لم يكن في وضع التعديل
    if (!isEdit && title) {
      const generatedSlug = generateSlugFromTitle(title);
      form.setFieldValue('slug', generatedSlug);
    }
  };

  if (initialLoading) {
    return (
      <div className="page-layout">
        <Card className="loading-card">
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 24 }}>
              <Title level={4} style={{ color: '#8c8c8c', margin: 0 }}>
                Loading page data...
              </Title>
              <Text type="secondary">
                Please wait a moment
              </Text>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="create-update-page-layout">
      {/* Header Section */}
      <div className="page-header">
        <Card className="header-card">
          <div className="header-content">
            <div className="header-info">
              <div className="header-icon">
                <FileTextOutlined />
              </div>
              <div className="header-text">
                <Title level={2} style={{ margin: 0, color: '#262626' }}>
                  {isEdit ? "Edit Page" : "Create a new page"}
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {isEdit
                    ? "Edit the content and Page Settings"
                    : "Create a new page with the required modules."
                  }
                </Text>
              </div>
            </div>

            <div className="header-actions">
              <Space size="middle">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push("/admin/pages")}
                  size="large"
                >
                  Back to list
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={loading}
                  onClick={handleSubmit}
                  size="large"
                >
                  {isEdit ? "Save Edits" : "Create Page"}
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      </div>

      {/* Validation Messages */}
      {(validationErrors.length > 0 || validationWarnings.length > 0) && (
        <div className="validation-section">
          {validationErrors.length > 0 && (
            <Alert
              message={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ExclamationCircleOutlined />
                  <span>Data errors ({validationErrors.length})</span>
                </div>
              }
              description={
                <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                  {validationErrors.map((error, index) => (
                    <li key={index} style={{ marginBottom: 4 }}>{error}</li>
                  ))}
                </ul>
              }
              type="error"
              showIcon={false}
              style={{ marginBottom: 16 }}
            />
          )}

          {validationWarnings.length > 0 && (
            <Alert
              message={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <InfoCircleOutlined />
                  <span>Warnings ({validationWarnings.length})</span>
                </div>
              }
              description={
                <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                  {validationWarnings.map((warning, index) => (
                    <li key={index} style={{ marginBottom: 4 }}>{warning}</li>
                  ))}
                </ul>
              }
              type="warning"
              showIcon={false}
              style={{ marginBottom: 16 }}
            />
          )}
        </div>
      )}

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Page Settings */}
        <Col xs={24} lg={8}>
          <Card
            className="settings-card"
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="card-icon settings">
                  <FileTextOutlined />
                </div>
                <span>Page Settings</span>
              </div>
            }
          >
            <Form form={form} initialValues={{
              published: true
            }} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="title"
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileTextOutlined style={{ color: '#1890ff' }} />
                    <span>Page title</span>
                  </div>
                }
                rules={[{ required: true, message: 'Page title Required' }]}
              >
                <Input
                  placeholder="Example: Home page"
                  onChange={handleTitleChange}
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item
                name="slug"
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LinkOutlined style={{ color: '#52c41a' }} />
                    <span>Short link</span>
                  </div>
                }
                rules={[
                  { required: true, message: 'Short link Required' },
                  {
                    pattern: /^[a-z0-9-]+$/,
                    message: 'Must contain only lowercase letters, numbers, and dashes'
                  }
                ]}
              >
                <Input
                  placeholder="example: home"
                  size="large"
                  style={{ borderRadius: 8 }}
                  addonBefore="/"
                />
              </Form.Item>

              <LanguageSelect singleItem={null} onClick={(e) => {
                form.setFieldValue("categoryIds", null);
              }} title={language.selectedLang?.name ?? "choose language"} />

              <Form.Item
                style={{ marginTop: 15 }}
                name="published"
                valuePropName="checked"
                initialValue={false}
              >
                <div className="publish-switch">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Form.Item name="published" valuePropName="checked" style={{ margin: 0 }}>
                      <Switch size="default" />
                    </Form.Item>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        Publication status
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {form.getFieldValue('published') ? 'The page is published and visible to the public' : 'The page is hidden and not published'}                      </Text>
                    </div>
                    {form.getFieldValue('published') ? (
                      <EyeOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                    ) : (
                      <EyeInvisibleOutlined style={{ color: '#8c8c8c', fontSize: 18 }} />
                    )}
                  </div>
                </div>
              </Form.Item>

              {/* Page Stats */}
              <div className="page-stats">
                <Title level={5} style={{ marginBottom: 16 }}>Page statistics</Title>
                <Row gutter={[12, 12]}>
                  <Col span={12}>
                    <div className="stat-item">
                      <Badge count={selectedModules.length} style={{ backgroundColor: '#1890ff' }} />
                      <Text style={{ marginLeft: 8 }}>Units</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="stat-item">
                      <Badge
                        count={selectedModules.filter(m => m.isSingleton).length}
                        style={{ backgroundColor: '#52c41a' }}
                      />
                      <Text style={{ marginLeft: 8 }}>Singleton</Text>
                    </div>
                  </Col>
                </Row>
              </div>
            </Form>
          </Card>
        </Col>

        {/* Module Selector */}
        <Col xs={24} lg={16}>
          <Card
            className="modules-card"
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="card-icon modules">
                  <CheckCircleOutlined />
                </div>
                <span>Manage page units</span>
                <Badge
                  count={selectedModules.length}
                  style={{ backgroundColor: '#1890ff' }}
                  showZero
                />
              </div>
            }
            extra={
              <Tooltip title="Drag units from left to right to add">
                <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
              </Tooltip>
            }
          >
            <ModuleSelector
              selectedModules={selectedModules}
              onModulesChange={handleModulesChange}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
