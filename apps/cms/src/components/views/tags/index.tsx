"use client";
import api from "@/api/api-context";
import api_points from "@/api/points";
import ETable from "@/components/elements/table";
import { RootState } from "@/lib/redux-toolkit/store";
import { useSelector } from "react-redux";
import columns from "./columns";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Typography,
  Input,
  Badge,
  Modal,
  Form,
  message,
} from "antd";
import {
  PlusOutlined,
  TagOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;

export default function TagsView() {
  const user = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = async (values: any) => {
    try {
      await api.post(api_points.tag.create, { name: values.name });
      message.success("Tag created successfully");
      setModalOpen(false);
      form.resetFields();
    } catch {
      message.error("Failed to create tag");
    }
  };

  return (
    <div style={{ padding: "0" }}>
      <Card
        style={{
          marginBottom: "24px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: "white" }}>
                <TagOutlined style={{ marginRight: "12px" }} />
                Tags Management
              </Title>
              <Text style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>
                Manage content tags and labels
              </Text>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setModalOpen(true)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
              }}
            >
              Create Tag
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Tags"
              value={0}
              prefix={<TagOutlined style={{ color: "#6366f1" }} />}
              valueStyle={{ color: "#6366f1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Tags"
              value={0}
              prefix={<Badge status="success" />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Unused"
              value={0}
              prefix={<Badge status="warning" />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: "24px" }}>
        <Search
          placeholder="Search tags..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <Card
        title={
          <Space>
            <TagOutlined />
            <span>Tags</span>
            <Badge count={0} showZero style={{ backgroundColor: "#6366f1" }} />
          </Space>
        }
      >
        <ETable columns={columns} url={api_points.tag.getAll} />
      </Card>

      <Modal
        title="Create New Tag"
        open={modalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="name"
            label="Tag Name"
            rules={[{ required: true, message: "Tag name is required" }]}
          >
            <Input placeholder="Enter tag name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
