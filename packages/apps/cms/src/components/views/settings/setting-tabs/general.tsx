import {
    Alert,
    Col,
    Divider,
    Flex,
    Form,
    Input,
    Row,
    Spin,
    Switch,
    Card,
    Typography,
    Space,
    Tag
} from "antd";
import { useCallback, useEffect, useState } from "react";
import {
    GlobalOutlined,
    MailOutlined,
    PhoneOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import UploadImage from "@/components/elements/upload/upload-single";
import PlacesEnum from "@/abstracts/file.enum";
import EButton from "@/components/elements/button";
import api_points from "@/api/points";
import api from "@/api/api-context";
import { IUser, IUserProps } from "@/abstracts/user/user";
import route_paths from "@/helper/route_paths";
import { useRouter } from "next/navigation";
import WriteError from "@/components/elements/error-message/error-message";
import Swal from "sweetalert2";
import { IError, mWebsiteRequired } from "@/abstracts/error-types";
import errorChooseSite from "@/data/errors/choose-website";
import { getCookie } from "@/app/actions/set-cookie";
import { SiteId, SiteSlug } from "@/abstracts/siteSlug";

const { Title, Text } = Typography;


export default function GeneralSection({
    user,
    siteSlug
}: {
    user?: IUserProps,
    siteSlug: string | null
}) {
    const [form] = Form.useForm();
    const router = useRouter();
    const [errors, setErrors] = useState<IError[]>(!siteSlug ? [mWebsiteRequired] : []);
    const [loading, setLoading] = useState<boolean>(true);
    const getContent = async () => {
        if (!siteSlug) {
            return;
        }
        const data = (await api.get(`${api_points.webSite.getOne}?slug=${siteSlug}`)).data;
        form.setFieldsValue(data);
    };
    const onFinish = useCallback(async (values: any) => {
        values.slug = await getCookie(SiteSlug);
        values.id = await getCookie(SiteId);
        setLoading(true);
        try {
            await api.put(api_points.webSite.update, values);
            Swal.fire({
                icon: "success",
                title: "Settings saved successfully!",
                text: "Your site configuration has been updated.",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error saving settings",
                text: "Please try again or contact support if the problem persists."
            });
        } finally {
            setLoading(false);
        }
    }, [siteSlug]);
    useEffect(() => {
        setLoading(true);
        getContent().finally(() => {
            setLoading(false);
        });
    }, []);

    if (!siteSlug) {
        return <WriteError errors={errorChooseSite} />;
    }

    return (
        <Spin spinning={loading}>
            <div className="general-settings">
                <Form onFinish={onFinish} layout="vertical" form={form}>
                    {/* Action Bar */}
                    <div className="action-bar">
                        <Space>
                            <EButton
                                loading={loading}
                                type="primary"
                                htmlType="submit"
                                size="large"
                            >
                                Save Changes
                            </EButton>
                        </Space>
                    </div>

                    <Row gutter={[24, 24]}>
                        {/* Site Status Card */}
                        <Col span={24}>
                            <Card
                                title={
                                    <Space>
                                        <GlobalOutlined style={{ color: '#F7931E' }} />
                                        <span>Site Status</span>
                                    </Space>
                                }
                                className="status-card"
                            >
                                <div className="status-switch">
                                    <Form.Item
                                        name="published"
                                        valuePropName="checked"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Switch
                                            checkedChildren={<CheckCircleOutlined />}
                                            unCheckedChildren={<CloseCircleOutlined />}
                                            size="default"
                                        />
                                    </Form.Item>
                                    <div className="status-info">
                                        <Text strong>Site Publication Status</Text>
                                        <br />
                                        <Text type="secondary">
                                            Control whether your site is publicly accessible
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        {/* Basic Information */}
                        <Col lg={16} md={24}>
                            <Card
                                title="Basic Information"
                                className="info-card"
                            >
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <Form.Item
                                        name="name"
                                        label={<Text strong>Site Name</Text>}
                                        rules={[{ required: true, message: 'Please enter site name' }]}
                                    >
                                        <Input
                                            placeholder="Enter your site name"
                                            size="large"
                                            prefix={<GlobalOutlined style={{ color: '#F7931E' }} />}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="description"
                                        label={<Text strong>Site Description</Text>}
                                    >
                                        <Input.TextArea
                                            placeholder="Describe your site and its purpose"
                                            rows={4}
                                            showCount
                                            maxLength={500}
                                        />
                                    </Form.Item>
                                </Space>
                            </Card>
                        </Col>

                        {/* Site Logo */}
                        <Col lg={8} md={24}>
                            <Card
                                title="Site Logo"
                                className="logo-card"
                            >
                                <div className="logo-upload-section">
                                    <Form.Item name="image" style={{ marginBottom: 16 }}>
                                        <UploadImage name="image" module={PlacesEnum.Site} />
                                    </Form.Item>
                                    <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                                        Upload your site logo (recommended: 200x60px)
                                    </Text>
                                </div>
                            </Card>
                        </Col>

                        {/* Help Section */}
                        {/* <Col span={24}>
                            <Alert
                                type="info"
                                showIcon
                                icon={<InfoCircleOutlined />}
                                message="Need Help?"
                                description={
                                    <Space direction="vertical">
                                        <Text>
                                            Check out our comprehensive documentation for detailed guidance on configuring your headless CMS.
                                        </Text>
                                        <a
                                            target="_blank"
                                            href={process.env.NEXT_PUBLIC_SITE_DOCS_URL}
                                            rel="noopener noreferrer"
                                            style={{ fontWeight: 500 }}
                                        >
                                            View Documentation →
                                        </a>
                                    </Space>
                                }
                                style={{ borderRadius: 8 }}
                            />
                        </Col> */}
                    </Row>
                </Form>

                <style jsx>{`
                    .general-settings {
                        padding: 8px;
                    }

                    .action-bar {
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 24px;
                        padding: 16px 24px;
                        background: white;
                        border-radius: 8px;
                        border: 1px solid #e2e8f0;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    }

                    :global(.status-card),
                    :global(.info-card),
                    :global(.logo-card) {
                        border-radius: 8px;
                        border: 1px solid #e2e8f0;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                    }

                    .status-switch {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    }

                    .status-info {
                        flex: 1;
                    }

                    .logo-upload-section {
                        text-align: center;
                        padding: 16px;
                    }

                    :global(.ant-form-item-label > label) {
                        font-weight: 500;
                        color: #374151;
                    }

                    :global(.ant-input-affix-wrapper) {
                        border-radius: 6px;
                    }

                    :global(.ant-input) {
                        border-radius: 6px;
                    }

                    :global(.ant-btn-primary) {
                        border-radius: 6px;
                        box-shadow: 0 2px 4px rgba(247, 147, 30, 0.2);
                    }
                `}</style>
            </div>
        </Spin>
    );
}