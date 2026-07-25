"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  Typography,
  Space,
  Tag,
  Tooltip,
  Modal,
  message,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BuildOutlined,
  DatabaseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  getComponentById,
  createComponentField,
  deleteComponentField,
} from "@/api/repostories/components";
import AddOrEditFieldModal from "./AddOrEditFieldModal";

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function ComponentFields({ componentId }: { componentId: number }) {
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const data = await getComponentById(componentId);
      setFields(data.fields || data.Fields || []);
    } catch {
      message.error("Failed to fetch fields");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (componentId) fetchFields();
  }, [componentId]);

  const handleEdit = (field: any) => {
    setEditingField(field);
    setModalOpen(true);
  };

  const handleDelete = (id: number, fieldName: string) => {
    confirm({
      title: "Delete Field",
      icon: <ExclamationCircleOutlined />,
      content: `Delete field "${fieldName}"?`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteComponentField(id);
          message.success("Field deleted");
          fetchFields();
        } catch {
          message.error("Failed to delete field");
        }
      },
    });
  };

  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: "blue",
      textarea: "cyan",
      number: "green",
      boolean: "magenta",
      select: "gold",
      image: "volcano",
      file: "lime",
      editor: "purple",
      date: "orange",
      email: "geekblue",
      url: "cyan",
      color: "pink",
    };
    return colors[type.toLowerCase()] || "default";
  };

  const columns = [
    {
      title: "Field Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Text strong style={{ color: "#1f2937", fontSize: 14 }}>
          {text || record.Name}
        </Text>
      ),
    },
    {
      title: "Slug",
      dataIndex: "fieldSlug",
      key: "fieldSlug",
      render: (text: string, record: any) => {
        const slug = text || record.FieldSlug;
        return slug ? (
          <Tag style={{ fontFamily: "monospace", fontSize: 12, background: "#f3f4f6" }}>
            {slug}
          </Tag>
        ) : null;
      },
    },
    {
      title: "Field Type",
      dataIndex: "fieldType",
      key: "fieldType",
      render: (type: string, record: any) => {
        const t = type || record.FieldType;
        return (
          <Tag color={getFieldTypeColor(t)} style={{ textTransform: "capitalize", borderRadius: 12 }}>
            {t}
          </Tag>
        );
      },
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      width: 80,
      align: "center" as const,
      render: (v: any, r: any) => v ?? r.Order ?? 0,
    },
    {
      title: "Grid Size",
      dataIndex: "gridSize",
      key: "gridSize",
      width: 90,
      align: "center" as const,
      render: (v: any, r: any) => v ?? r.GridSize ?? 24,
    },
    {
      title: "Group",
      dataIndex: "groupName",
      key: "groupName",
      render: (v: any, r: any) => v || r.GroupName || "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <Space size={8}>
          <Tooltip title="Edit Field">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: "#0891b2", border: "1px solid #e5e7eb", borderRadius: 6 }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete Field">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                handleDelete(record.id || record.Id, record.name || record.Name)
              }
              style={{ border: "1px solid #fecaca", borderRadius: 6 }}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "none",
          marginBottom: 24,
        }}
        bodyStyle={{ padding: "32px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Space align="center" size={16}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <BuildOutlined style={{ fontSize: 24, color: "white" }} />
              </div>
              <div>
                <Title level={2} style={{ margin: 0, color: "#1f2937" }}>
                  Component Fields
                </Title>
                <Text style={{ color: "#6b7280", fontSize: 16 }}>
                  Manage fields for this component
                </Text>
              </div>
            </Space>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => {
              setEditingField(null);
              setModalOpen(true);
            }}
            style={{
              height: 48,
              borderRadius: 8,
              background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
              border: "none",
              fontWeight: 600,
              boxShadow: "0 4px 6px -1px rgba(8, 145, 178, 0.3)",
              padding: "0 24px",
            }}
          >
            Add New Field
          </Button>
        </div>
      </Card>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", border: "none", background: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)" }}>
            <Statistic
              title={<Text style={{ color: "#155e75", fontWeight: 500 }}>Total Fields</Text>}
              value={fields.length}
              prefix={<DatabaseOutlined style={{ color: "#0891b2" }} />}
              valueStyle={{ color: "#155e75", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", border: "none", background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}>
            <Statistic
              title={<Text style={{ color: "#166534", fontWeight: 500 }}>Active Fields</Text>}
              value={fields.filter((f: any) => f.isActive !== false).length}
              prefix={<BuildOutlined style={{ color: "#22c55e" }} />}
              valueStyle={{ color: "#166534", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", border: "none", background: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)" }}>
            <Statistic
              title={<Text style={{ color: "#991b1b", fontWeight: 500 }}>With Group</Text>}
              value={fields.filter((f: any) => f.groupName || f.GroupName).length}
              prefix={<ExclamationCircleOutlined style={{ color: "#ef4444" }} />}
              valueStyle={{ color: "#991b1b", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", border: "none" }}>
        <Table
          loading={loading}
          dataSource={fields}
          columns={columns}
          rowKey={(r: any) => r.id || r.Id}
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} fields`,
          }}
          locale={{
            emptyText: (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <BuildOutlined style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
                <Title level={4} style={{ color: "#9ca3af", margin: 0 }}>No Fields Yet</Title>
                <Text style={{ color: "#6b7280" }}>Add your first field to this component</Text>
              </div>
            ),
          }}
        />
      </Card>

      {modalOpen && (
        <AddOrEditFieldModal
          open={modalOpen}
          field={editingField}
          onSaved={() => {
            setModalOpen(false);
            setEditingField(null);
            fetchFields();
          }}
          onClose={() => {
            setModalOpen(false);
            setEditingField(null);
          }}
          componentId={componentId}
        />
      )}
    </div>
  );
}
