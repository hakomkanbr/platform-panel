'use client';

import { useState } from 'react';
import { Button, Modal, Form, message, TableProps, Card, Typography, Space, Tag, Tooltip, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, FileTextOutlined, SearchOutlined, GlobalOutlined, EyeOutlined } from '@ant-design/icons';
import { createPage, deletePage, updatePage } from '@/api/repostories/pages';
import ETable from '@/components/elements/table';
import { useDispatch } from 'react-redux';
import { dtRefresh } from '@/lib/redux-toolkit/slice/datatable-slice';
import Link from 'next/link';
import route_paths from '@/helper/route_paths';
import DtLanguage from '@/components/elements/table/action_language';

const { Title, Text } = Typography;
const { Search } = Input;

export default function Pages() {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Delete Page',
      content: 'Are you sure you want to delete this page? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deletePage(id);
          message.success('Page deleted successfully');
          dispatch(dtRefresh());
        } catch (error) {
          message.error('Failed to delete page');
        }
      },
    });
  };

  const columns: TableProps["columns"] = [
    { 
      title: 'Title', 
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <div>
          <Text strong style={{ color: "#1f2937" }}>{text}</Text>
        </div>
      ),
      sorter: true,
    },
    { 
      title: 'Slug', 
      dataIndex: 'slug',
      key: 'slug',
      render: (text: string) => (
        <Text code style={{ 
          background: "#f3f4f6", 
          color: "#6b7280",
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 12
        }}>
          /{text}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'published',
      key: 'published',
      width: 100,
      align: "center",
      render: (value: boolean) => (
        <Tag 
          color={value ? 'success' : 'default'}
          style={{
            borderRadius: 12,
            padding: "2px 12px",
            fontWeight: 500
          }}
        >
          {value ? 'Published' : 'Draft'}
        </Tag>
      ),
      filters: [
        { text: 'Published', value: true },
        { text: 'Draft', value: false },
      ],
    },
    {
      title: 'Language',
      dataIndex: 'languageSlug',
      key: 'language',
      width: 100,
      align: "center",
      render: (text: string) => (
        <DtLanguage value={text} />
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'actions',
      width: 120,
      align: "center",
      render: (_: any, record: any) => (
        <Space size={8}>
          <Tooltip title="Edit Page">
            <Link href={`${route_paths.pages}/edit?id=${record.id}`}>
              <Button 
                type="text"
                icon={<EditOutlined />} 
                style={{ 
                  color: "#F7931E",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6
                }}
                size="small"
              />
            </Link>
          </Tooltip>
          
          <Tooltip title="Delete Page">
            <Button 
              type="text"
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record.id)}
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
                <FileTextOutlined style={{ fontSize: 24, color: "white" }} />
              </div>
              <div>
                <Title level={2} style={{ margin: 0, color: "#1f2937" }}>
                  Pages Management
                </Title>
                <Text style={{ color: "#6b7280", fontSize: 16 }}>
                  Create and manage your website pages
                </Text>
              </div>
            </Space>
          </div>
          
          <Link href={`${route_paths.pages}/create`}>
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
                boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.3)",
                padding: "0 24px"
              }}
            >
              Create New Page
            </Button>
          </Link>
        </div>
      </Card>

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
              placeholder="Search pages by title or slug..."
              allowClear
              size="large"
              style={{ maxWidth: 400 }}
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => {
                // Handle search functionality
                console.log('Search:', value);
              }}
            />
            
            <Space>
              <Text style={{ color: "#6b7280" }}>
                Total Pages: <Text strong style={{ color: "#1f2937" }}>--</Text>
              </Text>
            </Space>
          </div>
        </div>

        {/* Table */}
        <div style={{ padding: "0 24px 24px" }}>
          <ETable
            columns={columns}
            payload={{ search: searchText }}
            url={"/admin/page"}
          />
        </div>
      </Card>
    </div>
  );
}
