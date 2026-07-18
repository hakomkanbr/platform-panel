"use client";

import { useState, useEffect } from "react";
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
  Table,
  Tag,
  Tooltip,
  message,
  Modal,
  Descriptions,
  Badge,
  TableProps
} from "antd";
import {
  FileTextOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  EyeOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined
} from "@ant-design/icons";
import Link from "next/link";
import route_paths from "@/helper/route_paths";
import api_points from "@/api/points";
import formsRepository from "@/api/repostories/forms";
import { FormSubmission, IFormSubmissionField } from "@/types/form";
import { exportFormSubmissions } from "../utils/form-export";
import ETable from "@/components/elements/table";
import { dtRefresh } from "@/lib/redux-toolkit/slice/datatable-slice";
import { useDispatch } from "react-redux";

const { Title, Text } = Typography;
const { Search } = Input;

export default function FormSubmissionsView({
  params,
  searchParams
}: {
  params: { slug: string }
  searchParams: { formId?: string }
}) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedForm, setSelectedForm] = useState<string | undefined>(searchParams.formId);
  const [forms, setForms] = useState<any[]>([]);
  const dispatch = useDispatch();

  const handleDeleteSubmission = async (id: number) => {
    try {
      await formsRepository.deleteSubmission(id);
      setSubmissions(submissions.filter(s => s.id !== id));
      dispatch(dtRefresh());
      message.success('Submission deleted successfully');
    } catch (error) {
      message.error('Failed to delete submission');
    }
  };

  const viewSubmission = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setModalVisible(true);
  };

  const handleExport = (format: 'csv' | 'json' | 'excel') => {
    const formName = forms.find(f => f.id.toString() === selectedForm)?.name || 'All_Forms';
    const success = exportFormSubmissions(submissions, formName, {
      format,
      includeMetadata: true
    });

    if (success) {
      message.success(`Submissions exported as ${format.toUpperCase()}`);
    } else {
      message.error('Export failed');
    }
  };

  const columns: TableProps["columns"] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (value: number, record: any, index: number) => {
        return (
          <Badge count={index + 1} style={{ backgroundColor: '#52c41a' }} />
        )
      }
    },
    {
      title: 'Form',
      dataIndex: 'formName',
      key: 'formName',
      render: (value: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#52c41a' }} />
          <span style={{ fontWeight: 'bold' }}>{value}</span>
        </Space>
      )
    },
    {
      title: 'Submitted Data',
      dataIndex: 'fieldValues',
      key: 'fieldValues',
      render: (data: IFormSubmissionField[]) => (
        <div>
          {data.slice(0, 2).map((obj, index) => (
            <div key={index} style={{ fontSize: '12px', color: '#666' }}>
              <strong>{obj.fieldName}:</strong> {String(obj.value).substring(0, 30)}
              {String(obj.value).length > 30 && '...'}
            </div>
          ))}
          {Object.keys(data).length > 2 && (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              +{Object.keys(data).length - 2} more fields
            </Text>
          )}
        </div>
      )
    },
    {
      title: 'Submitted At',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 150,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {date.toLocaleDateString()}
            </div>
            <div style={{ fontSize: '11px', color: '#999' }}>
              {date.toLocaleTimeString()}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => viewSubmission(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: 'Delete Submission',
                  content: 'Are you sure you want to delete this submission? This action cannot be undone.',
                  onOk: () => handleDeleteSubmission(record.id),
                  okText: 'Yes, Delete',
                  cancelText: 'Cancel',
                  okButtonProps: { danger: true }
                });
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const totalSubmissions = submissions.length;
  const todaySubmissions = submissions.filter(s => {
    const today = new Date();
    const submissionDate = new Date(s.submittedAt);
    return submissionDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Space direction="vertical" size={0}>
                <Title level={2} style={{ margin: 0, color: 'white' }}>
                  <FileTextOutlined style={{ marginRight: '12px' }} />
                  Form Submissions
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                  View and manage form submissions
                </Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space size="middle">
              {/* <Button.Group>
                <Tooltip title="Export as CSV">
                  <Button
                    icon={<ExportOutlined />}
                    onClick={() => handleExport('csv')}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white'
                    }}
                  >
                    CSV
                  </Button>
                </Tooltip>
                <Tooltip title="Export as JSON">
                  <Button
                    onClick={() => handleExport('json')}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white'
                    }}
                  >
                    JSON
                  </Button>
                </Tooltip>
              </Button.Group> */}
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
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Submissions Table */}
      <Card
        title={
          <Space>
            <FileTextOutlined />
            <span>Submissions</span>
          </Space>
        }
      >
        <ETable
          url={api_points.form.getSubmissions}
          payload={{ formId: parseInt(selectedForm!) }}
          columns={columns}
        />
      </Card>

      {/* Submission Details Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            <span>Submission Details</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedSubmission && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '20px' }}>
              <Descriptions.Item label="Submission ID">
                {selectedSubmission.id}
              </Descriptions.Item>
              <Descriptions.Item label="Form">
                {selectedSubmission.formName}
              </Descriptions.Item>
              <Descriptions.Item label="Submitted At">
                {new Date(selectedSubmission.submittedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="IP Address">
                {selectedSubmission.ipAddress || 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4}>Submitted Data</Title>
            <Card style={{ background: '#fafafa' }}>
              <Descriptions bordered column={1}>
                {selectedSubmission.fieldValues.map((obj: IFormSubmissionField, index) => (
                  <Descriptions.Item key={index} label={obj.fieldName}>
                    <Text copyable>{String(obj.value)}</Text>
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}