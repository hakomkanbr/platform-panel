"use client";
import api_points from "@/api/points";
import ETable from "@/components/elements/table";
import route_paths from "@/helper/route_paths";
import Link from "next/link";
import enumCreateUpdate from "@/abstracts/create-update";
import { RootState } from "@/lib/redux-toolkit/store";
import { IRoleType } from "@/abstracts/user/user";
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
} from "antd";
import {
  PlusOutlined,
  BuildOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;

export default function ComponentsView() {
  const user = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div style={{ padding: "0" }}>
      <Card
        style={{
          marginBottom: "24px",
          background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: "white" }}>
                <BuildOutlined style={{ marginRight: "12px" }} />
                Components Management
              </Title>
              <Text style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>
                Manage reusable UI components and their fields
              </Text>
            </Space>
          </Col>
          <Col>
            <Link href={`${route_paths.components}/${enumCreateUpdate.create}`}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                }}
              >
                Create Component
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Components"
              value={0}
              prefix={<BuildOutlined style={{ color: "#0891b2" }} />}
              valueStyle={{ color: "#0891b2" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Blocks"
              value={0}
              prefix={<Badge status="processing" />}
              valueStyle={{ color: "#0891b2" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Sections"
              value={0}
              prefix={<Badge status="success" />}
              valueStyle={{ color: "#16a34a" }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: "24px" }}>
        <Search
          placeholder="Search components..."
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
            <BuildOutlined />
            <span>Components</span>
            <Badge count={0} showZero style={{ backgroundColor: "#0891b2" }} />
          </Space>
        }
      >
        <ETable columns={columns} url={api_points.component.getAll} />
      </Card>
    </div>
  );
}
