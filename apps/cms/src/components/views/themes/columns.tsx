"use client";

import api_points from "@/api/points";
import route_paths from "@/helper/route_paths";
import enumCreateUpdate from "@/abstracts/create-update";
import { TableProps } from "antd";
import Link from "next/link";
import { Button, Popconfirm, Space, message, Tag, Avatar, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, LayoutOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { activateTheme, deleteTheme } from "@/api/repostories/themes";

const columns: TableProps["columns"] = [
    {
        title: "Theme",
        dataIndex: "name",
        key: "name",
        render(value: string, record: any) {
            const name = value || record.Name;
            const slug = record.slug || record.Slug || name?.toLowerCase().replace(/\s+/g, '-');
            return (
                <Space>
                    <Avatar
                        icon={<LayoutOutlined />}
                        style={{ backgroundColor: '#10b981' }}
                        size="small"
                    />
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                            {name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {slug}
                        </div>
                    </div>
                </Space>
            );
        },
    },
    {
        title: "Slug",
        dataIndex: "slug",
        key: "slug",
        width: 180,
        render(value: string, record: any) {
            const slug = value || record.Slug;
            return (
                <Tag style={{ fontFamily: 'monospace', fontSize: '12px' }}>{slug || '-'}</Tag>
            );
        },
    },
    {
        title: "Status",
        dataIndex: "isActive",
        align: "center",
        width: 120,
        render(value: any, record: any) {
            const active = value ?? record.IsActive ?? false;
            return (
                <Tag color={active ? 'success' : 'warning'} style={{ margin: 0 }}>
                    {active ? 'Active' : 'Draft'}
                </Tag>
            );
        },
    },
    {
        title: "Version",
        dataIndex: "version",
        align: "center",
        width: 100,
        render(value: string, record: any) {
            const ver = value || record.Version || 'v1';
            return (
                <Tag color="blue">{ver}</Tag>
            );
        },
    },
    {
        title: "Actions",
        dataIndex: "id",
        align: "center",
        width: 240,
        render(value, record: any) {
            const id = value || record.Id;
            const isActive = record.isActive ?? record.IsActive ?? false;
            return (
                <Space>
                    <Tooltip title="Edit Theme">
                        <Link href={`${route_paths.themes}/${enumCreateUpdate.edit}?id=${id}`}>
                            <Button
                                type="primary"
                                size="small"
                                icon={<EditOutlined />}
                            />
                        </Link>
                    </Tooltip>
                    {!isActive && (
                        <Tooltip title="Activate Theme">
                            <Button
                                type="default"
                                size="small"
                                icon={<CheckCircleOutlined />}
                                style={{ color: '#10b981', borderColor: '#10b981' }}
                                onClick={async () => {
                                    try {
                                        await activateTheme(id);
                                        message.success('Theme activated successfully');
                                        window.location.reload();
                                    } catch (error) {
                                        message.error('Failed to activate theme');
                                    }
                                }}
                            />
                        </Tooltip>
                    )}
                    <Popconfirm
                        title="Delete Theme"
                        description="Are you sure you want to delete this theme? This action cannot be undone."
                        onConfirm={async () => {
                            try {
                                await deleteTheme(id);
                                message.success('Theme deleted successfully');
                                window.location.reload();
                            } catch (error) {
                                message.error('Failed to delete theme');
                            }
                        }}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Theme">
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
