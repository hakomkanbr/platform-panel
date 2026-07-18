import { 
    Flex, 
    Form, 
    Spin, 
    Card, 
    Typography, 
    Space, 
    Alert,
    Row,
    Col
} from "antd";
import { useEffect, useState } from "react";
import { GlobalOutlined, TranslationOutlined, InfoCircleOutlined } from "@ant-design/icons";
import api from "@/api/api-context";
import api_points from "@/api/points";
import EButton from "@/components/elements/button";
import Swal from 'sweetalert2'
import { getCookie } from "@/app/actions/set-cookie";
import WriteError from "@/components/elements/error-message/error-message";
import { IError } from "@/abstracts/error-types";
import { checkOutError } from "@/helper/checkout-error";
import ETable from "@/components/elements/table";
import LanguageCreateUpdateView from "./create-update";
import { IUser, IUserProps } from "@/abstracts/user/user";
import errorChooseSite from "@/data/errors/choose-website";
import {SiteSlug} from "@/abstracts/siteSlug";
import columns from "./column";

const { Title, Text } = Typography;


export default function LanguageSettingSection({
    user
}: {
    user?: IUserProps
}) {
    
    const [form] = Form.useForm();
    const [errors, setErrors] = useState<IError[]>([]);
    const [site, setSite] = useState<string | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const onFinish = async (values: { socials: { name: string, url: string }[] }) => {
        try {
            await api.post(api_points.service.addUpdateSocial, {
                items: values.socials,
                site: site
            });
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast: any) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            setLoading(false);
            Toast.fire({
                icon: "success",
                title: "Saved successfully"
            });
        } catch (err: any) {
            setErrors(checkOutError(err));
        } finally {
            setLoading(true);
        }
    }

    useEffect(() => {
        getCookie(SiteSlug).then((site)=>{
            if (!site) {
                setErrors(errorChooseSite);
            }else{
                setSite(site);
            }
        }).finally(()=>{
            setLoading(false);
        });
    }, []);
    
    if (!site) {
        return (
            <Spin spinning={loading}>
                <WriteError errors={errors} />
            </Spin>
        );
    }

    return (
        <Spin spinning={loading}>
            <div className="language-settings">
                <Row gutter={[24, 24]}>
                    {/* Header Section */}
                    <Col span={24}>
                        <Card className="header-card">
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
                                    <TranslationOutlined style={{ marginRight: 8, color: '#6366f1' }} />
                                    Language Management
                                </Title>
                                <Text type="secondary">
                                    Configure and manage multiple languages for your headless CMS content
                                </Text>
                            </Space>
                        </Card>
                    </Col>

                    {/* Add Language Section */}
                    <Col span={24}>
                        <Card 
                            title={
                                <Space>
                                    <GlobalOutlined style={{ color: '#10b981' }} />
                                    <span>Add New Language</span>
                                </Space>
                            }
                            className="add-language-card"
                        >
                            <LanguageCreateUpdateView />
                        </Card>
                    </Col>

                    {/* Languages List */}
                    <Col span={24}>
                        <Card 
                            title="Configured Languages"
                            className="languages-list-card"
                        >
                            <ETable 
                                url={api_points.service.getLanguageList} 
                                columns={columns}
                            />
                        </Card>
                    </Col>

                    {/* Help Section */}
                    <Col span={24}>
                        <Alert
                            type="info"
                            showIcon
                            icon={<InfoCircleOutlined />}
                            message="Multi-language Support"
                            description={
                                <Space direction="vertical">
                                    <Text>
                                        Configure multiple languages to serve content in different locales. 
                                        Each language can have its own content variations and translations.
                                    </Text>
                                    <Text strong>
                                        Features:
                                    </Text>
                                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                        <li>Content localization</li>
                                        <li>Language-specific URLs</li>
                                        <li>Automatic language detection</li>
                                        <li>SEO-friendly language switching</li>
                                    </ul>
                                </Space>
                            }
                            style={{ borderRadius: 8 }}
                        />
                    </Col>
                </Row>

                <style jsx>{`
                    .language-settings {
                        padding: 8px;
                    }

                    :global(.header-card),
                    :global(.add-language-card),
                    :global(.languages-list-card) {
                        border-radius: 8px;
                        border: 1px solid #e2e8f0;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                    }

                    :global(.header-card) {
                        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    }

                    :global(.add-language-card .ant-card-body) {
                        padding: 24px;
                    }

                    :global(.languages-list-card .ant-table-wrapper) {
                        border-radius: 6px;
                        overflow: hidden;
                    }

                    :global(.ant-table-thead > tr > th) {
                        background: #f8fafc;
                        border-bottom: 2px solid #e2e8f0;
                        font-weight: 600;
                        color: #374151;
                    }

                    :global(.ant-table-tbody > tr:hover > td) {
                        background: #f8fafc;
                    }
                `}</style>
            </div>
        </Spin>
    );
}