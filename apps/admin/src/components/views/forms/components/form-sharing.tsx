"use client";

import { useState } from "react";
import { 
  Modal, 
  Card, 
  Typography, 
  Input, 
  Button,
  Space,
  message,
  Divider,
  QRCode,
  Tabs,
  Switch,
  Row,
  Col
} from "antd";
import { 
  ShareAltOutlined,
  CopyOutlined,
  LinkOutlined,
  QrcodeOutlined,
  CodeOutlined,
  SettingOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface FormSharingProps {
  visible: boolean;
  onClose: () => void;
  formId: number;
  formName: string;
}

export default function FormSharing({ visible, onClose, formId, formName }: FormSharingProps) {
  const [shareSettings, setShareSettings] = useState({
    isPublic: true,
    allowAnonymous: true,
    requireLogin: false,
    limitSubmissions: false,
    maxSubmissions: 100,
    expiryDate: null as string | null
  });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const formUrl = `${baseUrl}/forms/${formId}`;
  const embedCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(`${type} copied to clipboard!`);
    } catch (error) {
      message.error('Failed to copy to clipboard');
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setShareSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Modal
      title={
        <Space>
          <ShareAltOutlined />
          <span>Share Form: {formName}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
    >
      <Tabs defaultActiveKey="link">
        <TabPane 
          tab={
            <Space>
              <LinkOutlined />
              <span>Direct Link</span>
            </Space>
          } 
          key="link"
        >
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Form URL:</Text>
                <Input.Group compact style={{ marginTop: '8px' }}>
                  <Input
                    value={formUrl}
                    readOnly
                    style={{ width: 'calc(100% - 100px)' }}
                  />
                  <Button 
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(formUrl, 'Link')}
                  >
                    Copy
                  </Button>
                </Input.Group>
              </div>

              <Divider />

              <div>
                <Text strong>Share via Social Media:</Text>
                <div style={{ marginTop: '12px' }}>
                  <Space wrap>
                    <Button 
                      style={{ background: '#1877f2', color: 'white', border: 'none' }}
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(formUrl)}`)}
                    >
                      Facebook
                    </Button>
                    <Button 
                      style={{ background: '#1da1f2', color: 'white', border: 'none' }}
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(formUrl)}&text=${encodeURIComponent(`Check out this form: ${formName}`)}`)}
                    >
                      Twitter
                    </Button>
                    <Button 
                      style={{ background: '#0077b5', color: 'white', border: 'none' }}
                      onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(formUrl)}`)}
                    >
                      LinkedIn
                    </Button>
                    <Button 
                      style={{ background: '#25d366', color: 'white', border: 'none' }}
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${formName}: ${formUrl}`)}`)}
                    >
                      WhatsApp
                    </Button>
                  </Space>
                </div>
              </div>
            </Space>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <Space>
              <QrcodeOutlined />
              <span>QR Code</span>
            </Space>
          } 
          key="qr"
        >
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>QR Code for Form Access</Title>
              <Text type="secondary">
                Scan this QR code to access the form directly
              </Text>
              
              <div style={{ margin: '24px 0' }}>
                <QRCode 
                  value={formUrl} 
                  size={200}
                  style={{ margin: '0 auto' }}
                />
              </div>

              <Button 
                type="primary" 
                icon={<CopyOutlined />}
                onClick={() => {
                  // In a real implementation, you would generate and download the QR code image
                  copyToClipboard(formUrl, 'QR Code URL');
                }}
              >
                Copy QR Code URL
              </Button>
            </div>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <Space>
              <CodeOutlined />
              <span>Embed Code</span>
            </Space>
          } 
          key="embed"
        >
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Embed this form in your website:</Text>
                <TextArea
                  value={embedCode}
                  readOnly
                  rows={4}
                  style={{ marginTop: '8px' }}
                />
                <Button 
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(embedCode, 'Embed code')}
                  style={{ marginTop: '8px' }}
                >
                  Copy Embed Code
                </Button>
              </div>

              <Divider />

              <div>
                <Text strong>Customization Options:</Text>
                <div style={{ marginTop: '12px' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Text>Width:</Text>
                      <Input placeholder="100%" style={{ marginTop: '4px' }} />
                    </Col>
                    <Col span={12}>
                      <Text>Height:</Text>
                      <Input placeholder="600px" style={{ marginTop: '4px' }} />
                    </Col>
                  </Row>
                </div>
              </div>
            </Space>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <Space>
              <SettingOutlined />
              <span>Settings</span>
            </Space>
          } 
          key="settings"
        >
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Title level={5}>Access Control</Title>
                
                <div style={{ marginBottom: '16px' }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong>Public Access</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Allow anyone with the link to access the form
                      </Text>
                    </Col>
                    <Col>
                      <Switch 
                        checked={shareSettings.isPublic}
                        onChange={(checked) => handleSettingChange('isPublic', checked)}
                      />
                    </Col>
                  </Row>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong>Anonymous Submissions</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Allow submissions without requiring user login
                      </Text>
                    </Col>
                    <Col>
                      <Switch 
                        checked={shareSettings.allowAnonymous}
                        onChange={(checked) => handleSettingChange('allowAnonymous', checked)}
                      />
                    </Col>
                  </Row>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong>Require Login</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Users must be logged in to submit the form
                      </Text>
                    </Col>
                    <Col>
                      <Switch 
                        checked={shareSettings.requireLogin}
                        onChange={(checked) => handleSettingChange('requireLogin', checked)}
                      />
                    </Col>
                  </Row>
                </div>
              </div>

              <Divider />

              <div>
                <Title level={5}>Submission Limits</Title>
                
                <div style={{ marginBottom: '16px' }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong>Limit Submissions</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Set a maximum number of submissions
                      </Text>
                    </Col>
                    <Col>
                      <Switch 
                        checked={shareSettings.limitSubmissions}
                        onChange={(checked) => handleSettingChange('limitSubmissions', checked)}
                      />
                    </Col>
                  </Row>
                </div>

                {shareSettings.limitSubmissions && (
                  <div style={{ marginBottom: '16px' }}>
                    <Text>Maximum Submissions:</Text>
                    <Input
                      type="number"
                      value={shareSettings.maxSubmissions}
                      onChange={(e) => handleSettingChange('maxSubmissions', parseInt(e.target.value))}
                      style={{ marginTop: '4px', width: '150px' }}
                    />
                  </div>
                )}
              </div>

              <Button type="primary" style={{ alignSelf: 'flex-start' }}>
                Save Settings
              </Button>
            </Space>
          </Card>
        </TabPane>
      </Tabs>
    </Modal>
  );
}