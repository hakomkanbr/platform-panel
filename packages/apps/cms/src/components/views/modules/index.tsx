"use client";;
import api_points from "@/api/points";
import ECard from "@/components/elements/card";
import ETable from "@/components/elements/table";
import route_paths from "@/helper/route_paths";
import EButton from "@/components/elements/button";
import Link from "next/link";
import enumCreateUpdate from "@/abstracts/create-update";
import { RootState } from "@/lib/redux-toolkit/store";
import { IRoleType } from "@/abstracts/user/user";
import { useSelector } from "react-redux";
import columns from "./columns";
import { Card, Typography, Space, Button, Input, Statistic, Row, Col } from "antd";
import { AppstoreOutlined, PlusOutlined, SearchOutlined, DatabaseOutlined, SettingOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;

export default function ModulesView({
  params
}: {
  params: { slug: string }
}) {
  const user = useSelector((state: RootState) => state.user);
  const [searchText, setSearchText] = useState('');

  if (user.role == IRoleType.User) {
    columns?.splice(2, 1);
  }

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
                <AppstoreOutlined style={{ fontSize: 24, color: "white" }} />
              </div>
              <div>
                <Title level={2} style={{ margin: 0, color: "#1f2937" }}>
                  Content Modules
                </Title>
                <Text style={{ color: "#6b7280", fontSize: 16 }}>
                  Define and manage your content structure
                </Text>
              </div>
            </Space>
          </div>
          
          <Link href={`${route_paths.modules}/${enumCreateUpdate.create}`}>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              size="large"
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
              Create Module
            </Button>
          </Link>
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
              title={<Text style={{ color: "#1e40af", fontWeight: 500 }}>Total Modules</Text>}
              value="--"
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
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Statistic
              title={<Text style={{ color: "#166534", fontWeight: 500 }}>Active Modules</Text>}
              value="--"
              prefix={<SettingOutlined style={{ color: "#22c55e" }} />}
              valueStyle={{ color: "#166534", fontWeight: 700 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "none",
              background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)"
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Statistic
              title={<Text style={{ color: "#92400e", fontWeight: 500 }}>Total Fields</Text>}
              value="--"
              prefix={<AppstoreOutlined style={{ color: "#f59e0b" }} />}
              valueStyle={{ color: "#92400e", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Content Section */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "none"
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Search and Filters */}
        <div style={{ 
          padding: "24px 24px 0", 
          borderBottom: "1px solid #f3f4f6",
          marginBottom: 0
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16
          }}>
            <Search
              placeholder="Search modules by name or description..."
              allowClear
              size="large"
              style={{ maxWidth: 400 }}
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => {
                console.log('Search:', value);
              }}
            />
            
            <Space>
              <Text style={{ color: "#6b7280" }}>
                Showing all modules
              </Text>
            </Space>
          </div>
        </div>

        {/* Table */}
        <div style={{ padding: "0 24px 24px" }}>
          <ETable 
            columns={columns}
            url={api_points.module.getAll}
            payload={{ search: searchText }}
          />
        </div>
      </Card>
    </div>
  );
}
