"use client";

import api_points from "@/api/points";
import DtSwitch from "@/components/elements/table/actions_switch";
import route_paths from "@/helper/route_paths";
import enumCreateUpdate from "@/abstracts/create-update";
import { TableProps } from "antd";
import Link from "next/link";
import { Button, Popconfirm, Space, message, Tag, Avatar, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, DatabaseOutlined, EyeOutlined } from "@ant-design/icons";
import collectionsRepository from "@/api/repostories/collections";

const columns : TableProps["columns"] = [
    {
        title: "Collection",
        dataIndex: "name",
        key: "name",
        render(value: string, record: any) {
            return (
                <Space>
                    <Avatar 
                        icon={<DatabaseOutlined />} 
                        style={{ backgroundColor: '#1890ff' }}
                        size="small"
                    />
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
                            {value}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            /{record.slug}
                        </div>
                    </div>
                </Space>
            );
        },
    },
    {
        title: "Status",
        dataIndex: "published",
        align: "center",
        width: 120,
        render(value: any, record: any, _: any) {
            return (
                <Space direction="vertical" size={4}>
                    <DtSwitch url={api_points.collection.changeState} id={record["id"]} value={value} />
                    <Tag color={value ? 'success' : 'warning'} style={{ margin: 0 }}>
                        {value ? 'Published' : 'Draft'}
                    </Tag>
                </Space>
            );
        },
    },
    {
        title: "Items",
        dataIndex: "items",
        align: "center",
        width: 100,
        render(value: any[]) {
            const count = value?.length || 0;
            return (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                        {count}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {count === 1 ? 'item' : 'items'}
                    </div>
                </div>
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
                    <Tooltip title="View Collection">
                        <Button 
                            type="default" 
                            size="small" 
                            icon={<EyeOutlined />}
                            style={{ color: '#52c41a', borderColor: '#52c41a' }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Collection">
                        <Link href={`${route_paths.collections}/${enumCreateUpdate.edit}?id=${value}`}>
                            <Button 
                                type="primary" 
                                size="small" 
                                icon={<EditOutlined />}
                            />
                        </Link>
                    </Tooltip>
                    <Popconfirm
                        title="Delete Collection"
                        description="Are you sure you want to delete this collection? This action cannot be undone."
                        onConfirm={async () => {
                            try {
                                await collectionsRepository.delete(value);
                                message.success('Collection deleted successfully');
                                // Trigger table refresh
                                window.location.reload();
                            } catch (error) {
                                message.error('Failed to delete collection');
                            }
                        }}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Collection">
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