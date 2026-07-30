"use client";

import { useEffect, useState } from "react";
import { Table, Button, Card, Typography, Space, Tag, Tooltip, Modal, message, Row, Col, Statistic } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FieldStringOutlined, DatabaseOutlined, SettingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { deleteField, getFieldsByModule } from "@/api/repostories/fields";
import AddOrEditFieldModal from "./AddOrEditFieldModal";

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function ModuleFields({ mId }: { mId: number }) {
  const moduleId = Number(mId);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const data = await getFieldsByModule(moduleId);
      setFields(data);
    } catch (error) {
      message.error('Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [moduleId]);

  const handleEdit = (field: any) => {
    setEditingField(field);
    setModalOpen(true);
  };

  const handleDelete = async (id: number, fieldName: string) => {
    confirm({
      title: 'Delete Field',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete the field "${fieldName}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteField(id);
          message.success('Field deleted successfully');
          fetchFields();
        } catch (error) {
          message.error('Failed to delete field');
        }
      },
    });
  };

  const getFieldTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'text': 'blue',
      'textarea': 'cyan',
      'number': 'green',
      'email': 'orange',
      'password': 'red',
      'date': 'purple',
      'boolean': 'magenta',
      'select': 'gold',
      'file': 'lime',
      'image': 'volcano'
    };
    return colors[type.toLowerCase()] || 'default';
  };

  const columns = [
    {
      title: 'Field Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <Text strong style={{ color: "#1f2937", fontSize: 14 }}>{text}</Text>
          {record.required && (
            <Tag color="red" style={{ marginLeft: 8, fontSize: 10 }}>
              Required
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'fieldSlug',
      key: 'fieldSlug',
      render: (text: string) => (
        <Text code style={{ 
          background: "#f3f4f6", 
          color: "#6b7280",
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 12
        }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Field Type',
      dataIndex: 'fieldType',
      key: 'fieldType',
      render: (type: string) => (
        <Tag 
          color={getFieldTypeColor(type)}
          style={{
            borderRadius: 12,
            padding: "2px 12px",
            fontWeight: 500,
            textTransform: 'capitalize'
          }}
        >
          {type}
        </Tag>
      ),
    },
    {
      title: 'Required',
      dataIndex: 'required',
      key: 'required',
      align: 'center' as const,
      width: 100,
      render: (val: boolean) => (
        <Tag color={val ? 'error' : 'default'} style={{ borderRadius: 12 }}>
          {val ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center' as const,
      width: 120,
      render: (_: any, record: any) => (
        <Space size={8}>
          <Tooltip title="Edit Field">
            <Button 
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ 
                color: "#F7931E",
                border: "1px solid #e5e7eb",
                borderRadius: 6
              }}
              size="small"
            />
          </Tooltip>
          
          <Tooltip title="Delete Field">
            <Button 
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.name)}
              style={{ 
                border: "1px solid #fecaca",
                borderRadius: 6
              }}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const requiredFields = fields.filter((field: any) => field.required);
  const optionalFields = fields.filter((field: any) => !field.required);

  return (
    <div style={{  background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header Section */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "none",
          marginBottom: 24
        }}
        bodyStyle={{ padding: "32px" }}
      >
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}>
          <div>
            <Space align="center" size={16}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FieldStringOutlined style={{ fontSize: 24, color: "white" }} />
              </div>
              <div>
                <Title level={2} style={{ margin: 0, color: "#1f2937" }}>
                  Module Fields
                </Title>
                <Text style={{ color: "#6b7280", fontSize: 16 }}>
                  Manage fields for this content module
                </Text>
              </div>
            </Space>
          </div>
          
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setModalOpen(true)}
            style={{
              height: 48,
              borderRadius: 8,
              background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
              border: "none",
              fontWeight: 600,
              boxShadow: "0 4px 6px -1px rgba(247, 147, 30, 0.3)",
              padding: "0 24px"
            }}
          >
            Add New Field
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "none",
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Statistic
              title={<Text style={{ color: "#1e40af", fontWeight: 500 }}>Total Fields</Text>}
              value={fields.length}
              prefix={<DatabaseOutlined style={{ color: "#3b82f6" }} />}
              valueStyle={{ color: "#1e40af", fontWeight: 700 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "none",
              background: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)"
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Statistic
              title={<Text style={{ color: "#991b1b", fontWeight: 500 }}>Required Fields</Text>}
              value={requiredFields.length}
              prefix={<ExclamationCircleOutlined style={{ color: "#ef4444" }} />}
              valueStyle={{ color: "#991b1b", fontWeight: 700 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "none",
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Statistic
              title={<Text style={{ color: "#166534", fontWeight: 500 }}>Optional Fields</Text>}
              value={optionalFields.length}
              prefix={<SettingOutlined style={{ color: "#22c55e" }} />}
              valueStyle={{ color: "#166534", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Fields Table */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "none"
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Table
          loading={loading}
          dataSource={fields}
          columns={columns}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} fields`,
            style: { marginTop: 24 }
          }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <FieldStringOutlined style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
                <Title level={4} style={{ color: "#9ca3af", margin: 0 }}>
                  No Fields Yet
                </Title>
                <Text style={{ color: "#6b7280" }}>
                  Start by adding your first field to this module
                </Text>
              </div>
            )
          }}
        />
      </Card>

      {/* Add/Edit Field Modal */}
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
          moduleId={moduleId}
        />
      )}
    </div>
  );
}
