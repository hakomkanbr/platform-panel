"use client";

import api_points from "@/api/points";
import route_paths from "@/helper/route_paths";
import enumCreateUpdate from "@/abstracts/create-update";
import { TableProps } from "antd";
import Link from "next/link";
import { Button, Popconfirm, Space, message, Tag, Avatar, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, LayoutOutlined, EyeOutlined } from "@ant-design/icons";
import templatesRepository from "@/api/repostories/templates";

const columns: TableProps["columns"] = [
    {
        title: "Template",
        dataIndex: "name",
        key: "name",
        render(value: string, record: any) {
            return (
                <Space>
                    <Avatar
                        icon={<LayoutOutlined />}
                        style={{ backgroundColor: '#722ed1' }}
                        size="small"
                    />
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#722ed1' }}>
                            {value}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {record.slug || record.name?.toLowerCase().replace(/\s+/g, '-')}
                        </div>
                    </div>
                </Space>
            );
        },
    },
    {
        title: "Status",
        dataIndex: "isSystem",
        align: "center",
        width: 120,
        render(value: any) {
            return (
                <Tag color={value ? 'success' : 'warning'} style={{ margin: 0 }}>
                    {value ? 'System' : 'Custom'}
                </Tag>
            );
        },
    },
    {
        title: "Version",
        dataIndex: "version",
        align: "center",
        width: 100,
        render(value: string) {
            return (
                <Tag color="blue">{value || 'v1'}</Tag>
            );
        },
    },
    {
        title: "Created",
        dataIndex: "createdAt",
        align: "center",
        width: 120,
        render(value: string) {
            if (!value) return '-';
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
        },
    },
    {
        title: "Actions",
        dataIndex: "id",
        align: "center",
        width: 180,
        render(value, record: any) {
            return (
                <Space>
                    <Tooltip title="View Template">
                        <Link href={`${route_paths.templates}/${enumCreateUpdate.edit}?id=${value}`}>
                            <Button
                                type="default"
                                size="small"
                                icon={<EyeOutlined />}
                                style={{ color: '#52c41a', borderColor: '#52c41a' }}
                            />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Edit Template">
                        <Link href={`${route_paths.templates}/${enumCreateUpdate.edit}?id=${value}`}>
                            <Button
                                type="primary"
                                size="small"
                                icon={<EditOutlined />}
                            />
                        </Link>
                    </Tooltip>
                    <Popconfirm
                        title="Delete Template"
                        description="Are you sure you want to delete this template? This action cannot be undone."
                        onConfirm={async () => {
                            try {
                                await templatesRepository.delete(value);
                                message.success('Template deleted successfully');
                                window.location.reload();
                            } catch (error) {
                                message.error('Failed to delete template');
                            }
                        }}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Template">
                            <Button
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            );
        },
    }
];

export default columns;
