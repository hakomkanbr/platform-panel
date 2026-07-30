"use client";

import api_points from "@/api/points";
import DtSwitch from "@/components/elements/table/actions_switch";
import route_paths from "@/helper/route_paths";
import enumCreateUpdate from "@/abstracts/create-update";
import { TableProps } from "antd";
import Link from "next/link";
import { Button, Popconfirm, Space, message, Tag, Avatar, Tooltip } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    FormOutlined,
    EyeOutlined,
    FileTextOutlined,
    FieldTimeOutlined,
    ShareAltOutlined
} from "@ant-design/icons";
import formsRepository from "@/api/repostories/forms";
import { IRoleType } from "@/abstracts/user/user";

const getColumns = (handleShareForm?: (formId: number, formName: string) => void, role?: IRoleType): TableProps["columns"] => [
    {
        title: "Form",
        dataIndex: "name",
        key: "name",
        render(value: string, record: any) {
            return (
                <Space>
                    <Avatar
                        icon={<FormOutlined />}
                        style={{ backgroundColor: '#52c41a' }}
                        size="small"
                    />
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
                            {value}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {record.description || 'No description'}
                        </div>
                    </div>
                </Space>
            );
        },
    },
    {
        title: "Form Slug",
        dataIndex: "slug",
        key: "slug",
    },
    {
        title: "Fields",
        dataIndex: "fields",
        align: "center",
        width: 100,
        render(value: any[]) {
            const count = value?.length || 0;
            return (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                        {count}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {count === 1 ? 'field' : 'fields'}
                    </div>
                </div>
            );
        },
    },
    {
        title: "Submissions",
        dataIndex: "submissionsCount",
        align: "center",
        width: 120,
        render(value: number, record: any) {
            return (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                        {value}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {value === 1 ? 'submission' : 'submissions'}
                    </div>
                    {value > 0 && (
                        <Link href={`${route_paths.forms}/submissions?formId=${record.id}`}>
                            <Button
                                type="link"
                                size="small"
                                icon={<FileTextOutlined />}
                                style={{ padding: 0, height: 'auto', fontSize: '11px' }}
                            >
                                View
                            </Button>
                        </Link>
                    )}
                </div>
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
                    <DtSwitch url={api_points.form.changeState} id={record["id"]} value={value} />
                    <Tag color={value ? 'success' : 'warning'} style={{ margin: 0 }}>
                        {value ? 'Active' : 'Inactive'}
                    </Tag>
                </Space>
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
        width: 200,
        render(value, record: any) {
            return (
                <Space>
                    <Tooltip title="View Submissions">
                        <Link href={`${route_paths.forms}/submissions?formId=${value}`}>
                            <Button
                                type="default"
                                size="small"
                                icon={<FileTextOutlined />}
                                style={{ color: '#1890ff', borderColor: '#1890ff' }}
                            />
                        </Link>
                    </Tooltip>
                    {
                        (role == IRoleType.Admin || role == IRoleType.SuperAdmin) && (
                            <>
                                <Tooltip title="Edit Form">
                                    <Link href={`${route_paths.forms}/${enumCreateUpdate.edit}?id=${value}`}>
                                        <Button
                                            type="primary"
                                            size="small"
                                            icon={<EditOutlined />}
                                        />
                                    </Link>
                                </Tooltip>
                                {handleShareForm && (
                                    <Tooltip title="Share Form">
                                        <Button
                                            type="default"
                                            size="small"
                                            icon={<ShareAltOutlined />}
                                            style={{ color: '#722ed1', borderColor: '#722ed1' }}
                                            onClick={() => handleShareForm(value, record.name)}
                                        />
                                    </Tooltip>
                                )}
                                <Popconfirm
                                    title="Delete Form"
                                    description="Are you sure you want to delete this form? This will also delete all submissions. This action cannot be undone."
                                    onConfirm={async () => {
                                        try {
                                            await formsRepository.delete(value);
                                            message.success('Form deleted successfully');
                                            // Trigger table refresh
                                            window.location.reload();
                                        } catch (error) {
                                            message.error('Failed to delete form');
                                        }
                                    }}
                                    okText="Yes, Delete"
                                    cancelText="Cancel"
                                    okButtonProps={{ danger: true }}
                                >
                                    <Tooltip title="Delete Form">
                                        <Button
                                            danger
                                            size="small"
                                            icon={<DeleteOutlined />}
                                        />
                                    </Tooltip>
                                </Popconfirm>
                            </>
                        )
                    }
                </Space>
            );
        },
    }
];

// Default columns without share functionality
const columns = getColumns();

export default columns;
export { getColumns };