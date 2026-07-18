"use client";;
import route_paths from "@/helper/route_paths";
import enumCreateUpdate from "@/abstracts/create-update";
import { TableProps } from "antd";
import Link from "next/link";
import { Button, Popconfirm, Space, message, Avatar, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { BiNavigation } from "react-icons/bi";
import { deleteNavigation } from "@/api/repostories/navigation";
import DtLanguage from "@/components/elements/table/action_language";
import ILanguage from "@/abstracts/language";
import { columnCreatedDate, columnLanguage, columnUpdatedDate } from "@/components/elements/table/cols";


const columns: TableProps["columns"] = [
    {
        title: "Navigation",
        dataIndex: "name",
        key: "name",
        render(value: string, record: any) {
            return (
                <Space>
                    <Avatar
                        icon={<BiNavigation />}
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
    columnLanguage,
    columnCreatedDate,
    columnUpdatedDate,
    {
        title: "Actions",
        dataIndex: "id",
        align: "center",
        width: 180,
        render(value, record: any) {
            return (
                <Space>
                    <Tooltip title="Edit Navigation">
                        <Link href={`${route_paths.navigations}/${enumCreateUpdate.edit}?id=${value}`}>
                            <Button
                                type="primary"
                                size="small"
                                icon={<EditOutlined />}
                            />
                        </Link>
                    </Tooltip>
                    <Popconfirm
                        title="Delete Navigation"
                        description="Are you sure you want to delete this Navigation? This action cannot be undone."
                        onConfirm={async () => {
                            try {
                                await deleteNavigation(value);
                                message.success('Navigation deleted successfully');
                                // Trigger table refresh
                                window.location.reload();
                            } catch (error) {
                                message.error('Failed to delete Navigation');
                            }
                        }}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Navigation">
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