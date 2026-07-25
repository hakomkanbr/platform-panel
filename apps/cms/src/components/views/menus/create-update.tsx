"use client";
import enumCreateUpdate from "@/abstracts/create-update";
import api from "@/api/api-context";
import api_points from "@/api/points";
import route_paths from "@/helper/route_paths";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Card,
  Typography,
  Space,
  Divider,
  Alert,
  Tooltip,
  Table,
  Modal,
  message,
  InputNumber,
} from "antd";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import {
  InfoCircleOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  MenuOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { checkOutError } from "@/helper/checkout-error";
import { IError } from "@/abstracts/error-types";
import WriteError from "@/components/elements/error-message/error-message";
import {
  getMenuById,
  createMenu,
  updateMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/api/repostories/menus";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

export default function MenuCreateUpdateView({
  params,
}: {
  params: { "create-update": string; id?: number };
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState<IError[]>([]);
  const isCreate = params["create-update"] == enumCreateUpdate.create;
  const title = isCreate ? "Create New Menu" : "Edit Menu";

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemForm] = Form.useForm();

  const onFinish = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        const payload = {
          name: values.name,
          slug: slugify(values.name ?? "", { lower: true }),
          location: values.location || "header",
          languageId: values.languageId || "00000000-0000-0000-0000-000000000000",
        };
        if (isCreate) {
          await createMenu(payload);
        } else {
          await updateMenu(params.id!, payload);
        }
        router.push(route_paths.menus);
        router.refresh();
      } catch (err: any) {
        setErrors(checkOutError(err));
      } finally {
        setLoading(false);
      }
    },
    [params, isCreate]
  );

  const getContent = async () => {
    try {
      const raw = await getMenuById(params.id!);
      form.setFieldsValue({
        name: raw.name || raw.Name,
        slug: raw.slug || raw.Slug,
        location: raw.location || raw.Location || "header",
      });
      setMenuItems(raw.items || raw.Items || []);
    } catch {
      message.error("Failed to load menu");
    }
  };

  useEffect(() => {
    if (!isCreate && params.id) {
      getContent();
    }
  }, []);

  const handleItemSave = async (values: any) => {
    try {
      const payload = {
        title: values.title,
        targetType: values.targetType,
        externalUrl: values.targetType === "Url" ? values.externalUrl : null,
        targetDocumentId:
          values.targetType === "Page" || values.targetType === "Content"
            ? values.targetDocumentId || null
            : null,
        parentId: values.parentId || null,
        order: values.order || 0,
      };
      if (editingItem) {
        await updateMenuItem(editingItem.id || editingItem.Id, payload);
        message.success("Item updated");
      } else {
        await createMenuItem(params.id!, payload);
        message.success("Item created");
      }
      setItemModalOpen(false);
      setEditingItem(null);
      itemForm.resetFields();
      getContent();
    } catch {
      message.error("Failed to save item");
    }
  };

  const handleItemDelete = (item: any) => {
    const id = item.id || item.Id;
    confirm({
      title: "Delete Menu Item",
      icon: <ExclamationCircleOutlined />,
      content: `Delete "${item.title || item.Title}"?`,
      onOk: async () => {
        await deleteMenuItem(id);
        message.success("Item deleted");
        getContent();
      },
    });
  };

  const openItemModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      itemForm.setFieldsValue({
        title: item.title || item.Title,
        targetType: item.targetType || item.TargetType || "Url",
        externalUrl: item.externalUrl || item.ExternalUrl || "",
        targetDocumentId: item.targetDocumentId || item.TargetDocumentId || null,
        parentId: item.parentId || item.ParentId || null,
        order: item.order ?? item.Order ?? 0,
      });
    } else {
      setEditingItem(null);
      itemForm.resetFields();
    }
    setItemModalOpen(true);
  };

  const itemColumns = [
    { title: "Title", dataIndex: "title", key: "title",
      render: (v: any, r: any) => v || r.Title },
    { title: "Target Type", dataIndex: "targetType", key: "targetType",
      render: (v: any, r: any) => {
        const t = v || r.TargetType;
        return <span style={{ textTransform: "capitalize" }}>{t}</span>;
      }
    },
    { title: "Order", dataIndex: "order", key: "order", width: 80,
      render: (v: any, r: any) => v ?? r.Order ?? 0 },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openItemModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleItemDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "0" }}>
      <Card
        style={{
          marginBottom: "24px",
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: "white" }}>
                <MenuOutlined style={{ marginRight: "12px" }} />
                {title}
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}>
                {isCreate ? "Create a new navigation menu" : "Update menu settings and items"}
              </Text>
            </Space>
          </Col>
          <Col>
            <Link href={route_paths.menus}>
              <Button
                icon={<ArrowLeftOutlined />}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                }}
              >
                Back to Menus
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>

      <Form
        form={form}
        layout="vertical"
        initialValues={{ published: true, location: "header" }}
        onFinish={onFinish}
      >
        <Row gutter={[24, 24]}>
          <Col lg={16} xs={24}>
            <Card
              title={
                <Space>
                  <MenuOutlined />
                  <span>Menu Details</span>
                </Space>
              }
              style={{ marginBottom: "24px" }}
            >
              <WriteError errors={errors} />
              <Alert
                message="Menu Information"
                description="Create navigation menus for your website. Each menu can have multiple items with different target types."
                type="info"
                icon={<InfoCircleOutlined />}
                style={{ marginBottom: "24px" }}
                showIcon
              />
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    rules={[{ required: true, message: "Menu name is required" }]}
                    name="name"
                    label={
                      <Space>
                        <span>Menu Name</span>
                        <Tooltip title="The display name for this menu">
                          <InfoCircleOutlined style={{ color: "#2563eb" }} />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <Input
                      placeholder="e.g., Main Navigation, Footer Menu"
                      size="large"
                      onChange={(e) => {
                        form.setFieldValue("slug", slugify(e.target.value, { lower: true }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="slug" label="URL Slug">
                    <Input
                      placeholder="Auto-generated"
                      disabled
                      size="large"
                      style={{ backgroundColor: "#f5f5f5" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="location"
                    label="Menu Location"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Select location"
                      size="large"
                      options={[
                        { label: "Header", value: "header" },
                        { label: "Footer", value: "footer" },
                        { label: "Sidebar", value: "sidebar" },
                        { label: "Main", value: "main" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {!isCreate && (
              <Card
                title={
                  <Space>
                    <MenuOutlined />
                    <span>Menu Items</span>
                  </Space>
                }
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openItemModal()}
                  >
                    Add Item
                  </Button>
                }
              >
                <Table
                  dataSource={menuItems}
                  columns={itemColumns}
                  rowKey={(r: any) => r.id || r.Id}
                  pagination={false}
                  locale={{
                    emptyText: (
                      <div style={{ padding: 24, textAlign: "center" }}>
                        <Text type="secondary">No items yet. Click &quot;Add Item&quot; to create one.</Text>
                      </div>
                    ),
                  }}
                />
              </Card>
            )}
          </Col>

          <Col lg={8} xs={24}>
            <Card
              title={
                <Space>
                  <SaveOutlined />
                  <span>Actions</span>
                </Space>
              }
              style={{ marginBottom: "24px" }}
            >
              <Button
                htmlType="submit"
                loading={loading}
                type="primary"
                block
                size="large"
                icon={<SaveOutlined />}
              >
                {isCreate ? "Create Menu" : "Update Menu"}
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>

      <Modal
        title={editingItem ? "Edit Menu Item" : "Add Menu Item"}
        open={itemModalOpen}
        onOk={() => itemForm.submit()}
        onCancel={() => {
          setItemModalOpen(false);
          setEditingItem(null);
        }}
        width={600}
      >
        <Form
          form={itemForm}
          layout="vertical"
          onFinish={handleItemSave}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Item title" />
          </Form.Item>
          <Form.Item
            name="targetType"
            label="Target Type"
            rules={[{ required: true }]}
            initialValue="Url"
          >
            <Select
              options={[
                { label: "URL", value: "Url" },
                { label: "Page", value: "Page" },
                { label: "Content", value: "Content" },
              ]}
            />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.targetType !== cur.targetType}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue("targetType");
              return type === "Url" ? (
                <Form.Item name="externalUrl" label="External URL">
                  <Input placeholder="https://example.com" />
                </Form.Item>
              ) : (
                <Form.Item name="targetDocumentId" label="Target Document ID">
                  <Input placeholder="Document GUID" />
                </Form.Item>
              );
            }}
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="parentId" label="Parent Item ID">
                <InputNumber style={{ width: "100%" }} placeholder="Optional" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="order" label="Order" initialValue={0}>
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
