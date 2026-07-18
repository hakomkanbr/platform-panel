"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Select,
  DatePicker,
  Space,
  Spin,
  Empty,
  Progress,
  Table,
  Tag
} from "antd";
import { 
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FormOutlined,
  RiseOutlined
} from "@ant-design/icons";
import formsRepository from "@/api/repostories/forms";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface FormAnalyticsProps {
  formId?: number;
}

interface AnalyticsData {
  totalSubmissions: number;
  todaySubmissions: number;
  weekSubmissions: number;
  monthSubmissions: number;
  averageCompletionTime: number;
  completionRate: number;
  topFields: Array<{
    fieldName: string;
    fieldLabel: string;
    responseCount: number;
    responseRate: number;
  }>;
  submissionTrend: Array<{
    date: string;
    count: number;
  }>;
  deviceStats: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  locationStats: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
}

export default function FormAnalytics({ formId }: FormAnalyticsProps) {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'submissions' | 'completion' | 'fields'>('submissions');

  useEffect(() => {
    loadAnalytics();
  }, [formId, dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockData: AnalyticsData = {
        totalSubmissions: 1247,
        todaySubmissions: 23,
        weekSubmissions: 156,
        monthSubmissions: 678,
        averageCompletionTime: 4.2,
        completionRate: 87.5,
        topFields: [
          { fieldName: 'email', fieldLabel: 'Email Address', responseCount: 1200, responseRate: 96.2 },
          { fieldName: 'name', fieldLabel: 'Full Name', responseCount: 1180, responseRate: 94.6 },
          { fieldName: 'phone', fieldLabel: 'Phone Number', responseCount: 890, responseRate: 71.4 },
          { fieldName: 'message', fieldLabel: 'Message', responseCount: 1100, responseRate: 88.2 },
        ],
        submissionTrend: [
          { date: '2024-01-01', count: 45 },
          { date: '2024-01-02', count: 52 },
          { date: '2024-01-03', count: 38 },
          { date: '2024-01-04', count: 67 },
          { date: '2024-01-05', count: 43 },
          { date: '2024-01-06', count: 58 },
          { date: '2024-01-07', count: 71 },
        ],
        deviceStats: [
          { device: 'Desktop', count: 687, percentage: 55.1 },
          { device: 'Mobile', count: 423, percentage: 33.9 },
          { device: 'Tablet', count: 137, percentage: 11.0 },
        ],
        locationStats: [
          { country: 'United States', count: 456, percentage: 36.6 },
          { country: 'United Kingdom', count: 234, percentage: 18.8 },
          { country: 'Canada', count: 178, percentage: 14.3 },
          { country: 'Australia', count: 123, percentage: 9.9 },
          { country: 'Germany', count: 89, percentage: 7.1 },
        ]
      };
      
      setAnalytics(mockData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Loading analytics...</Text>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Empty 
        description="No analytics data available"
        style={{ padding: '50px' }}
      />
    );
  }

  const fieldColumns = [
    {
      title: 'Field',
      dataIndex: 'fieldLabel',
      key: 'fieldLabel',
      render: (text: string, record: any) => (
        <Space>
          <FormOutlined style={{ color: '#52c41a' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.fieldName}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Responses',
      dataIndex: 'responseCount',
      key: 'responseCount',
      align: 'center' as const,
      render: (count: number) => (
        <Text strong style={{ color: '#1890ff' }}>{count}</Text>
      )
    },
    {
      title: 'Response Rate',
      dataIndex: 'responseRate',
      key: 'responseRate',
      align: 'center' as const,
      render: (rate: number) => (
        <div>
          <Progress 
            percent={rate} 
            size="small" 
            strokeColor={rate > 80 ? '#52c41a' : rate > 60 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
          <Text style={{ fontSize: '12px' }}>{rate}%</Text>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Controls */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Text strong>Analytics Dashboard</Text>
              {formId && <Tag color="blue">Form ID: {formId}</Tag>}
            </Space>
          </Col>
          <Col>
            <Space>
              <Select
                value={selectedMetric}
                onChange={setSelectedMetric}
                style={{ width: 150 }}
                options={[
                  { label: 'Submissions', value: 'submissions' },
                  { label: 'Completion', value: 'completion' },
                  { label: 'Field Analysis', value: 'fields' }
                ]}
              />
              <RangePicker 
                value={dateRange}
                onChange={setDateRange}
                style={{ width: 250 }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Submissions"
              value={analytics.totalSubmissions}
              prefix={<FormOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Today"
              value={analytics.todaySubmissions}
              prefix={<RiseOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={analytics.completionRate}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Time"
              value={analytics.averageCompletionTime}
              suffix="min"
              prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Field Performance */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BarChartOutlined />
                <span>Field Performance</span>
              </Space>
            }
          >
            <Table
              dataSource={analytics.topFields}
              columns={fieldColumns}
              pagination={false}
              size="small"
              rowKey="fieldName"
            />
          </Card>
        </Col>

        {/* Device Stats */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <PieChartOutlined />
                <span>Device Distribution</span>
              </Space>
            }
          >
            <div style={{ padding: '16px 0' }}>
              {analytics.deviceStats.map((device, index) => (
                <div key={device.device} style={{ marginBottom: '16px' }}>
                  <Row justify="space-between" align="middle" style={{ marginBottom: '4px' }}>
                    <Col>
                      <Text>{device.device}</Text>
                    </Col>
                    <Col>
                      <Text strong>{device.count} ({device.percentage}%)</Text>
                    </Col>
                  </Row>
                  <Progress 
                    percent={device.percentage} 
                    strokeColor={['#52c41a', '#1890ff', '#faad14'][index]}
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Location Stats */}
        <Col xs={24}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                <span>Top Locations</span>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              {analytics.locationStats.map((location, index) => (
                <Col xs={24} sm={12} md={8} lg={4} key={location.country}>
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                      {location.count}
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      {location.country}
                    </div>
                    <Progress 
                      type="circle" 
                      percent={location.percentage} 
                      size={60}
                      strokeColor="#52c41a"
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}