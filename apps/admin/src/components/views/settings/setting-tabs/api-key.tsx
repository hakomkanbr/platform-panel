import { 
    Alert, 
    Card, 
    Col, 
    Row, 
    Spin, 
    Typography, 
    Input, 
    Button, 
    Space,
    Divider,
    Tag,
    Tooltip,
    message
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { 
    KeyOutlined, 
    CopyOutlined, 
    ReloadOutlined, 
    EyeOutlined, 
    EyeInvisibleOutlined,
    InfoCircleOutlined,
    ApiOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import api_points from "@/api/points";
import api from "@/api/api-context";
import { IUser, IUserProps } from "@/abstracts/user/user";
import WriteError from "@/components/elements/error-message/error-message";
import Swal from "sweetalert2";
import { IError, mWebsiteRequired } from "@/abstracts/error-types";
import errorChooseSite from "@/data/errors/choose-website";

const { Title, Text, Paragraph } = Typography;

export default function ApiKeySection({
    user,
    siteSlug
}: {
    user?: IUserProps,
    siteSlug: string | null
}) {
    const [loading, setLoading] = useState<boolean>(true);
    const [apiKey, setApiKey] = useState<string>("");
    const [showApiKey, setShowApiKey] = useState<boolean>(false);
    const [regenerating, setRegenerating] = useState<boolean>(false);
    const [errors, setErrors] = useState<IError[]>(!siteSlug ? [mWebsiteRequired] : []);

    const getApiKey = async () => {
        if (!siteSlug) {
            return;
        }
        try {
            const data = (await api.get(`${api_points.webSite.getOne}?slug=${siteSlug}`)).data;
            setApiKey(data.apiKey || "");
        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(apiKey);
            message.success("API Key copied to clipboard!");
        } catch (error) {
            message.error("Failed to copy API Key");
        }
    };

    const regenerateApiKey = async () => {
        if (!siteSlug) return;

        const result = await Swal.fire({
            title: 'Regenerate API Key?',
            text: 'This will invalidate your current API key. All applications using the current key will need to be updated.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, regenerate it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setRegenerating(true);
            try {
                const response = await api.put(api_points.webSite.regenerateApiKey, { 
                    slug: siteSlug
                });
                
                if (response.data.apiKey) {
                    setApiKey(response.data.apiKey);
                    message.success("API Key regenerated successfully!");
                } else {
                    // Refresh the data to get the new API key
                    await getApiKey();
                    message.success("API Key regenerated successfully!");
                }
            } catch (error) {
                message.error("Failed to regenerate API Key. Please contact support.");
                console.error("API Key regeneration error:", error);
            } finally {
                setRegenerating(false);
            }
        }
    };

    useEffect(() => {
        setLoading(true);
        getApiKey().finally(() => {
            setLoading(false);
        });
    }, [siteSlug]);

    if (!siteSlug) {
        return <WriteError errors={errorChooseSite} />;
    }

    return (
        <Spin spinning={loading}>
            <div className="api-key-section">
                <Row gutter={[24, 24]}>
                    {/* Main API Key Card */}
                    <Col span={24}>
                        <Card 
                            className="api-key-card"
                            title={
                                <Space>
                                    <KeyOutlined style={{ color: '#6366f1' }} />
                                    <span>API Key Management</span>
                                </Space>
                            }
                            extra={
                                <Tag color="green" icon={<CheckOutlined />}>
                                    Active
                                </Tag>
                            }
                        >
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Alert
                                    message="API Key Security"
                                    description="Keep your API key secure and never share it publicly. Use environment variables in your applications."
                                    type="warning"
                                    showIcon
                                    icon={<InfoCircleOutlined />}
                                />

                                <div className="api-key-display">
                                    <Text strong style={{ marginBottom: 8, display: 'block' }}>
                                        Your API Key:
                                    </Text>
                                    <Input.Group compact>
                                        <Input
                                            value={showApiKey ? apiKey : apiKey.replace(/./g, '•')}
                                            readOnly
                                            style={{ 
                                                width: 'calc(100% - 120px)',
                                                fontFamily: 'monospace',
                                                fontSize: '14px'
                                            }}
                                            placeholder="No API key generated"
                                        />
                                        <Tooltip title={showApiKey ? "Hide API Key" : "Show API Key"}>
                                            <Button 
                                                icon={showApiKey ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                                onClick={() => setShowApiKey(!showApiKey)}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Copy to clipboard">
                                            <Button 
                                                icon={<CopyOutlined />}
                                                onClick={copyToClipboard}
                                                disabled={!apiKey}
                                            />
                                        </Tooltip>
                                    </Input.Group>
                                </div>

                                <Space>
                                    <Button
                                        type="primary"
                                        danger
                                        icon={<ReloadOutlined />}
                                        loading={regenerating}
                                        onClick={regenerateApiKey}
                                        disabled={!apiKey}
                                    >
                                        Regenerate API Key
                                    </Button>
                                </Space>
                            </Space>
                        </Card>
                    </Col>

                    {/* API Usage Information */}
                    <Col md={12} sm={24}>
                        <Card 
                            title={
                                <Space>
                                    <ApiOutlined style={{ color: '#10b981' }} />
                                    <span>API Usage</span>
                                </Space>
                            }
                            className="usage-card"
                        >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <div className="usage-item">
                                    <Text type="secondary">Base URL:</Text>
                                    <Paragraph 
                                        copyable={{ 
                                            text: process.env.NEXT_PUBLIC_SITE_DOCS_URL || 'https://your-api.com/api',
                                            onCopy: () => message.success('Base URL copied!')
                                        }}
                                        code 
                                        style={{ margin: 0, marginTop: 4 }}
                                    >
                                        {process.env.NEXT_PUBLIC_SITE_DOCS_URL || 'https://your-api.com/api'}
                                    </Paragraph>
                                </div>
                                
                                <div className="usage-item">
                                    <Text type="secondary">Authentication Header:</Text>
                                    <Paragraph 
                                        copyable={{ 
                                            text: `ApiKey: ${apiKey || 'YOUR_API_KEY'}`,
                                            onCopy: () => message.success('Authorization header copied!')
                                        }}
                                        code 
                                        style={{ margin: 0, marginTop: 4 }}
                                    >
                                        ApiKey: {apiKey ? '••••••••••••' : 'YOUR_API_KEY'}
                                    </Paragraph>
                                </div>

                                <div className="usage-item">
                                    <Text type="secondary">Content-Type:</Text>
                                    <Paragraph 
                                        copyable={{ 
                                            text: 'application/json',
                                            onCopy: () => message.success('Content-Type copied!')
                                        }}
                                        code 
                                        style={{ margin: 0, marginTop: 4 }}
                                    >
                                        application/json
                                    </Paragraph>
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    {/* Quick Start Guide */}
                    <Col md={12} sm={24}>
                        <Card 
                            title="Quick Start Example"
                            className="example-card"
                        >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Text strong>JavaScript/Node.js Example:</Text>
                                <div className="code-example">
                                    <pre>{`fetch('${process.env.NEXT_PUBLIC_SITE_DOCS_URL || 'https://your-api.com/api'}/content', {
  method: 'GET',
  headers: {
    'Authorization': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}</pre>
                                </div>
                                
                                <Button 
                                    type="link" 
                                    href={process.env.NEXT_PUBLIC_SITE_DOCS_URL}
                                    target="_blank"
                                    style={{ padding: 0 }}
                                >
                                    View Full Documentation →
                                </Button>
                            </Space>
                        </Card>
                    </Col>

                    {/* Security Best Practices */}
                    <Col span={24}>
                        <Card title="Security Best Practices" className="security-card">
                            <Row gutter={[16, 16]}>
                                <Col md={8} sm={24}>
                                    <div className="security-tip">
                                        <InfoCircleOutlined style={{ color: '#10b981', fontSize: 20 }} />
                                        <div>
                                            <Text strong>Environment Variables</Text>
                                            <br />
                                            <Text type="secondary">
                                                Store API keys in environment variables, never in your code
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={8} sm={24}>
                                    <div className="security-tip">
                                        <InfoCircleOutlined style={{ color: '#10b981', fontSize: 20 }} />
                                        <div>
                                            <Text strong>HTTPS Only</Text>
                                            <br />
                                            <Text type="secondary">
                                                Always use HTTPS when making API requests
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={8} sm={24}>
                                    <div className="security-tip">
                                        <InfoCircleOutlined style={{ color: '#10b981', fontSize: 20 }} />
                                        <div>
                                            <Text strong>Regular Rotation</Text>
                                            <br />
                                            <Text type="secondary">
                                                Rotate your API keys regularly for better security
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                <style jsx>{`
                    .api-key-section {
                        padding: 8px;
                    }

                    :global(.api-key-card) {
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        border: 1px solid #e2e8f0;
                    }

                    :global(.usage-card), 
                    :global(.example-card), 
                    :global(.security-card) {
                        border-radius: 8px;
                        border: 1px solid #e2e8f0;
                        height: 100%;
                    }

                    .api-key-display {
                        background: #f8fafc;
                        padding: 16px;
                        border-radius: 8px;
                        border: 1px solid #e2e8f0;
                    }

                    .usage-item {
                        padding: 8px 0;
                        border-bottom: 1px solid #f1f5f9;
                    }

                    .usage-item:last-child {
                        border-bottom: none;
                    }

                    .code-example {
                        background: #1f2937;
                        color: #f9fafb;
                        padding: 16px;
                        border-radius: 6px;
                        overflow-x: auto;
                    }

                    .code-example pre {
                        margin: 0;
                        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        font-size: 12px;
                        line-height: 1.5;
                    }

                    .security-tip {
                        display: flex;
                        gap: 12px;
                        align-items: flex-start;
                        padding: 16px;
                        background: #f0fdf4;
                        border-radius: 8px;
                        border: 1px solid #bbf7d0;
                        height: 100%;
                    }
                `}</style>
            </div>
        </Spin>
    );
}