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
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;

export default function MenusView() {
  const user = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

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
                Menus Management
              </Title>
              <Text style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>
                Manage your navigation menus and menu items
              </Text>
            </Space>
          </Col>
          <Col>
            <Link href={`${route_paths.menus}/${enumCreateUpdate.create}`}>
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
                Create Menu
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Menus"
              value={0}
              prefix={<MenuOutlined style={{ color: "#2563eb" }} />}
              valueStyle={{ color: "#2563eb" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Header Menus"
              value={0}
              prefix={<Badge status="success" />}
              valueStyle={{ color: "#16a34a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Footer Menus"
              value={0}
              prefix={<Badge status="processing" />}
              valueStyle={{ color: "#2563eb" }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: "24px" }}>
        <Search
          placeholder="Search menus..."
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
            <MenuOutlined />
            <span>Menus</span>
            <Badge count={0} showZero style={{ backgroundColor: "#2563eb" }} />
          </Space>
        }
      >
        <ETable columns={columns} url={api_points.menu.getAll} />
      </Card>
    </div>
  );
}
