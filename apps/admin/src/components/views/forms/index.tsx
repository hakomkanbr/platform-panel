"use client";
import api_points from "@/api/points";
import ECard from "@/components/elements/card";
import ETable from "@/components/elements/table";
import route_paths from "@/helper/route_paths";
import EButton from "@/components/elements/button";
import Link from "next/link";
import enumCreateUpdate from "@/abstracts/create-update";
import { RootState } from "@/lib/redux-toolkit/store";
import { IRoleType } from "@/abstracts/user/user";
import { useDispatch, useSelector } from "react-redux";
import columns, { getColumns } from "./columns";
import formsRepository from "@/api/repostories/forms";
import { FormStats } from "@/types/form";
import { useEffect } from "react";
import FormSharing from "./components/form-sharing";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Typography,
  Input,
  Select,
  Divider,
  Badge,
  Tooltip
} from "antd";
import {
  PlusOutlined,
  FormOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FilterOutlined,
  ExportOutlined,
  FileTextOutlined,
  SendOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { useState } from "react";
import { dtSetPayload } from "@/lib/redux-toolkit/slice/datatable-slice";

const { Title, Text } = Typography;
const { Search } = Input;

export default function FormsView({
  params
}: {
  params: { slug: string }
}) {
  const user = useSelector((state: RootState) => state.user);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [stats, setStats] = useState<FormStats>({
    totalForms: 0,
    activeForms: 0,
    totalSubmissions: 0,
    todaysSubmissions: 0,
    weekSubmissions: 0,
    monthSubmissions: 0
  });
  const [sharingModalVisible, setSharingModalVisible] = useState(false);
  const [selectedFormForSharing, setSelectedFormForSharing] = useState<{ id: number, name: string } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await formsRepository.getFormStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load form stats:', error);
    }
  };

  const handleShareForm = (formId: number, formName: string) => {
    setSelectedFormForSharing({ id: formId, name: formName });
    setSharingModalVisible(true);
  };

  // Get columns with share functionality
  const tableColumns = getColumns(handleShareForm, user.role as IRoleType);

  if (user.role != IRoleType.Admin && user.role != IRoleType.SuperAdmin) {
    tableColumns?.splice(1, 2);
    tableColumns?.splice(2, 1);
    // tableColumns?.splice(2, 1);
    // tableColumns?.splice(3, 1);
    // tableColumns?.splice(4, 1);
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: 'white' }}>
                <FormOutlined style={{ marginRight: '12px' }} />
                Forms Management
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                Create and manage dynamic forms for data collection
              </Text>
            </Space>
          </Col>
          <Col>
            <Space size="middle">
              {/* <Tooltip title="View Submissions">
                <Link href={`${route_paths.forms}/submissions`}>
                  <Button
                    icon={<FileTextOutlined />}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white'
                    }}
                  >
                    Submissions
                  </Button>
                </Link>
              </Tooltip> */}
              {
                (user.role == IRoleType.Admin || user.role == IRoleType.SuperAdmin) && (<Link href={`${route_paths.forms}/${enumCreateUpdate.create}`}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    style={{
                      background: 'white',
                      color: '#52c41a',
                      border: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Create Form
                  </Button>
                </Link>)
              }
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Forms"
              value={stats.totalForms}
              prefix={<FormOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Active Forms"
              value={stats.activeForms}
              prefix={<Badge status="success" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Today's Submissions"
              value={stats.todaysSubmissions}
              prefix={<Badge status="warning" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Submissions"
              value={stats.totalSubmissions}
              prefix={<SendOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      {/* <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="Search forms..."
              allowClear
              enterButton={<SearchOutlined onChange={(e) => {
                dispatch(dtSetPayload({
                  search: searchTerm
                }));
              }} />}
              size="large"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Filter by status"
              size="large"
              style={{ width: '100%' }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'All Forms', value: 'all' },
                { label: 'Published Only', value: 'published' },
                { label: 'Draft Only', value: 'draft' }
              ]}
            />
          </Col>
          <Col xs={24} md={4}>
            <Button.Group size="large" style={{ width: '100%' }}>
              <Button
                type={viewMode === 'table' ? 'primary' : 'default'}
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode('table')}
                style={{ width: '50%' }}
              />
              <Button
                type={viewMode === 'grid' ? 'primary' : 'default'}
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode('grid')}
                style={{ width: '50%' }}
              />
            </Button.Group>
          </Col>
        </Row>
      </Card> */}

      {/* Forms Table */}
      <ECard
        title={
          <Space>
            <FormOutlined />
            <span>Forms</span>
            <Badge count={0} showZero style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
      >
        <ETable
          columns={tableColumns}
          url={api_points.form.getAll}
        />
      </ECard>

      {/* Form Sharing Modal */}
      {selectedFormForSharing && (
        <FormSharing
          visible={sharingModalVisible}
          onClose={() => {
            setSharingModalVisible(false);
            setSelectedFormForSharing(null);
          }}
          formId={selectedFormForSharing.id}
          formName={selectedFormForSharing.name}
        />
      )}
    </div>
  );
}