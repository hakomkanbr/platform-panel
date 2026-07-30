"use client";

import { useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button,
  Space,
  Select,
  Breadcrumb
} from "antd";
import { 
  ArrowLeftOutlined,
  BarChartOutlined,
  FormOutlined
} from "@ant-design/icons";
import Link from "next/link";
import route_paths from "@/helper/route_paths";
import FormAnalytics from "../components/form-analytics";

const { Title, Text } = Typography;

export default function FormAnalyticsView({
  searchParams
}: {
  searchParams: { formId?: string }
}) {
  const [selectedFormId, setSelectedFormId] = useState<number | undefined>(
    searchParams.formId ? parseInt(searchParams.formId) : undefined
  );

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Link href={route_paths.forms}>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                >
                  Back to Forms
                </Button>
              </Link>
              <Space direction="vertical" size={0}>
                <Title level={2} style={{ margin: 0, color: 'white' }}>
                  <BarChartOutlined style={{ marginRight: '12px' }} />
                  Form Analytics
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                  Analyze form performance and submission data
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Breadcrumb */}
      <Card style={{ marginBottom: '24px' }}>
        <Breadcrumb
          items={[
            {
              title: <Link href={route_paths.forms}>Forms</Link>
            },
            {
              title: 'Analytics'
            }
          ]}
        />
      </Card>

      {/* Form Selector */}
      {!selectedFormId && (
        <Card style={{ marginBottom: '24px' }}>
          <Row justify="center">
            <Col xs={24} md={12} lg={8}>
              <div style={{ textAlign: 'center' }}>
                <FormOutlined style={{ fontSize: '48px', color: '#722ed1', marginBottom: '16px' }} />
                <Title level={4}>Select a Form to Analyze</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                  Choose a form to view detailed analytics and insights
                </Text>
                <Select
                  placeholder="Select a form..."
                  size="large"
                  style={{ width: '100%' }}
                  onChange={(value) => setSelectedFormId(value)}
                  options={[
                    { label: 'Contact Form', value: 1 },
                    { label: 'Newsletter Signup', value: 2 },
                    { label: 'Job Application', value: 3 },
                    { label: 'Event Registration', value: 4 },
                    { label: 'Feedback Survey', value: 5 }
                  ]}
                />
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Analytics Dashboard */}
      {selectedFormId && (
        <FormAnalytics formId={selectedFormId} />
      )}
    </div>
  );
}