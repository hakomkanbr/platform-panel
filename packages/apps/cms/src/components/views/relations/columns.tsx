"use client";

import api_points from "@/api/points";
import DtSwitch from "@/components/elements/table/actions_switch";
import route_paths from "@/helper/route_paths";
import enumCreateUpdate from "@/abstracts/create-update";
import { TableProps } from "antd";
import Link from "next/link";
import { Button, Popconfirm, Space, message, Tag, Avatar, Tooltip, Badge } from "antd";
import { DeleteOutlined, EditOutlined, ShareAltOutlined, EyeOutlined, ApiOutlined, NodeIndexOutlined, LinkOutlined } from "@ant-design/icons";
import relationsRepository from "@/api/repostories/relations";

const relationsColumns: TableProps["columns"] = [
    {
        title: "Relation",
        dataIndex: "name",
        key: "name",
        render(value: string, record: any) {
            const getRelationIcon = (type: string) => {
                switch (type?.toLowerCase()) {
                    case 'OneToOne':
                        return <LinkOutlined style={{ color: '#52c41a' }} />;
                    case 'OneToMany':
                        return <NodeIndexOutlined style={{ color: '#1890ff' }} />;
                    case 'ManyToMany':
                        return <ShareAltOutlined style={{ color: '#722ed1' }} />;
                    default:
                        return <ShareAltOutlined style={{ color: '#ff6b6b' }} />;
                }
            };

            return (
                <Space>
                    <Badge.Ribbon text="Relation" color="orange">
                        <Avatar
                            icon={getRelationIcon(record.type)}
                            style={{ backgroundColor: '#fff2e8', border: '2px solid #ff6b6b' }}
                            size="default"
                        />
                    </Badge.Ribbon>
                    <div style={{ marginLeft: '8px' }}>
                        <div style={{ fontWeight: 'bold', color: '#ff6b6b', fontSize: '14px' }}>
                            {value}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            <ApiOutlined style={{ marginRight: '4px' }} />
                            {record.sourceCollection} → {record.targetCollection}
                        </div>
                    </div>
                </Space>
            );
        },
    },
    {
        title: "Relation Type",
        dataIndex: "relationType",
        align: "center",
        width: 140,
        render(value: string) {
            const getTypeConfig = (type: string) => {
                switch (type?.toLowerCase()) {
                    case 'OneToOne':
                        return { color: 'success', icon: <LinkOutlined />, text: 'One-to-One' };
                    case 'OneToMany':
                        return { color: 'processing', icon: <NodeIndexOutlined />, text: 'One-to-Many' };
                    case 'ManyToMany':
                        return { color: 'purple', icon: <ShareAltOutlined />, text: 'Many-to-Many' };
                    default:
                        return { color: 'default', icon: <ShareAltOutlined />, text: value || 'Unknown' };
                }
            };

            const config = getTypeConfig(value);

            return (
                <Space direction="vertical" size={4}>
                    <Tag color={config.color} style={{ margin: 0 }}>
                        {config.icon} {config.text}
                    </Tag>
                    <Tag color="blue" style={{ margin: 0, fontSize: '10px' }}>
                        <ApiOutlined style={{ fontSize: '10px' }} /> Auto-Join
                    </Tag>
                </Space>
            );
        },
    },
    // {
    //     title: "Collections",
    //     dataIndex: "collections",
    //     align: "center",
    //     width: 200,
    //     render(value: any, record: any) {
    //         return (
    //             <div style={{ textAlign: 'center' }}>
    //                 <div style={{ 
    //                     fontSize: '12px', 
    //                     color: '#1890ff',
    //                     backgroundColor: '#f0f8ff',
    //                     padding: '4px 8px',
    //                     borderRadius: '4px',
    //                     marginBottom: '4px'
    //                 }}>
    //                     📊 {record.sourceCollection}
    //                 </div>
    //                 <div style={{ fontSize: '10px', color: '#666', margin: '2px 0' }}>
    //                     ↓ relates to ↓
    //                 </div>
    //                 <div style={{ 
    //                     fontSize: '12px', 
    //                     color: '#52c41a',
    //                     backgroundColor: '#f6ffed',
    //                     padding: '4px 8px',
    //                     borderRadius: '4px'
    //                 }}>
    //                     📊 {record.targetCollection}
    //                 </div>
    //             </div>
    //         );
    //     },
    // },
    {
        title: "Foreign Key",
        dataIndex: "foreignKey",
        align: "center",
        width: 150,
        render(value: string, record: any) {
            return (
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '12px',
                        color: '#722ed1',
                        backgroundColor: '#f9f0ff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontFamily: 'monospace'
                    }}>
                        🔑 {value || 'Auto-generated'}
                    </div>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                        Database field
                    </div>
                </div>
            );
        },
    },
    // {
    //     title: "Status",
    //     dataIndex: "isActive",
    //     align: "center",
    //     width: 120,
    //     render(value: boolean, record: any) {
    //         return (
    //             <Space direction="vertical" size={4}>
    //                 <Tag color={value ? 'success' : 'warning'} style={{ margin: 0 }}>
    //                     {value ? 'Active' : 'Inactive'}
    //                 </Tag>
    //                 {value && (
    //                     <Tag color="blue" style={{ margin: 0, fontSize: '10px' }}>
    //                         <ApiOutlined style={{ fontSize: '10px' }} /> API Ready
    //                     </Tag>
    //                 )}
    //             </Space>
    //         );
    //     },
    // },
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
        width: 200,
        render(value, record: any) {
            return (
                <Space>
                    <Tooltip title="Edit Relation">
                        <Link href={`${route_paths.relations}/${enumCreateUpdate.edit}?id=${value}`}>
                            <Button
                                type="primary"
                                size="small"
                                icon={<EditOutlined />}
                                style={{ backgroundColor: '#ff6b6b', borderColor: '#ff6b6b' }}
                            />
                        </Link>
                    </Tooltip>
                    <Popconfirm
                        title="Delete Relation"
                        description={
                            <div>
                                <div>Are you sure you want to delete this relation?</div>
                                <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
                                    ⚠️ This will affect API responses and data structure
                                </div>
                            </div>
                        }
                        onConfirm={async () => {
                            try {
                                await relationsRepository.delete(value);
                                message.success('Relation deleted successfully');
                                // Trigger table refresh
                                window.location.reload();
                            } catch (error) {
                                message.error('Failed to delete relation');
                            }
                        }}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Relation">
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

export default relationsColumns;