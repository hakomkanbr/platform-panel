"use client";;
import api_points from "@/api/points";
import ECard from "@/components/elements/card";
import ETable from "@/components/elements/table";
import route_paths from "@/helper/route_paths";
import Link from "next/link";
import enumCreateUpdate from "@/abstracts/create-update";
import { RootState } from "@/lib/redux-toolkit/store";
import { IRoleType } from "@/abstracts/user/user";
import { useSelector } from "react-redux";
import columns from "./columns";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Typography,
  Input,
  Select, Badge
} from "antd";
import {
  PlusOutlined,
  DatabaseOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { useState } from "react";
import { FiNavigation } from "react-icons/fi";

const { Title, Text } = Typography;
const { Search } = Input;

export default function NavigationsView({
  params
}: {
  params: { slug: string }
}) {
  const user = useSelector((state: RootState) => state.user);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const { site } = useAppSelector(state => state);

  if (user.role == IRoleType.User) {
    columns?.splice(2, 1);
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: 'white' }}>
                <FiNavigation style={{ marginRight: '12px' , position : "relative" , top : 3}} />
                Navigation Management
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                Manage your page navigations and data structures
              </Text>
            </Space>
          </Col>
          <Col>
            <Space size="middle">
              {/* <Tooltip title="Export Collections">
                <Button 
                  icon={<ExportOutlined />} 
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                >
                  Export
                </Button>
              </Tooltip> */}
              <Link href={`${route_paths.navigations}/${enumCreateUpdate.create}`}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  size="large"
                  style={{ 
                    background: 'white', 
                    color: '#667eea',
                    border: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Create Navigation
                </Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Collections Table */}
      <ECard 
        title={
          <Space>
            <DatabaseOutlined />
            <span>Navigations</span>
            <Badge count={0} showZero style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
      >
        <ETable 
          columns={columns}
          url={api_points.navigation.getAll}
          payload={{ SiteId: site.id, Search: searchTerm }}
        />
      </ECard>
    </div>
  );
}