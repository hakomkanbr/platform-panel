"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Space,
  Spin,
  Alert,
  Tooltip,
  Modal,
  Empty,
  Badge,
} from "antd";
import {
  AppstoreAddOutlined,
  LockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
  ShopOutlined,
  FileTextOutlined,
  BarChartOutlined,
  NotificationOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  ThunderboltOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import type { ProjectDetailDto, AppCatalogDto, PlanCapability } from "@repo/shared-types";
import { useEnableApp, useDisableApp } from "@repo/hooks";

const { Title, Text, Paragraph } = Typography;

interface AppLauncherProps {
  project: ProjectDetailDto;
  appCatalog: AppCatalogDto[];
  capabilities: Record<string, PlanCapability> | undefined;
  tenantId: string;
  isLoadingCapabilities: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  shop: <ShopOutlined style={{ fontSize: 32 }} />,
  file: <FileTextOutlined style={{ fontSize: 32 }} />,
  chart: <BarChartOutlined style={{ fontSize: 32 }} />,
  notification: <NotificationOutlined style={{ fontSize: 32 }} />,
  setting: <SettingOutlined style={{ fontSize: 32 }} />,
  thunderbolt: <ThunderboltOutlined style={{ fontSize: 32 }} />,
  "shopping-cart": <ShoppingCartOutlined style={{ fontSize: 32 }} />,
  default: <AppstoreAddOutlined style={{ fontSize: 32 }} />,
};

function getIcon(iconName: string): React.ReactNode {
  return iconMap[iconName.toLowerCase()] || iconMap.default;
}

function isAppAllowed(app: AppCatalogDto, capabilities: Record<string, PlanCapability> | undefined): boolean {
  if (!capabilities) return false;
  const cap = capabilities[app.capabilityCode];
  if (!cap) return false;
  if (cap.capabilityType.toLowerCase() === "boolean") {
    return cap.value === 1;
  }
  return cap.value > 0;
}

export default function AppLauncher({
  project,
  appCatalog,
  capabilities,
  tenantId,
  isLoadingCapabilities,
}: AppLauncherProps) {
  const [launchingApp, setLaunchingApp] = useState<string | null>(null);
  const [infoModalApp, setInfoModalApp] = useState<AppCatalogDto | null>(null);
  const enableApp = useEnableApp();
  const disableApp = useDisableApp();

  const enabledAppIds = new Set(
    project.apps.filter((a) => a.isEnabled).map((a) => a.appCatalogId)
  );

  const handleToggleApp = async (app: AppCatalogDto, enable: boolean) => {
    if (enable) {
      await enableApp.mutateAsync({
        projectId: project.id,
        request: { appCatalogId: app.id },
        tenantId,
      });
    } else {
      await disableApp.mutateAsync({
        projectId: project.id,
        request: { appCatalogId: app.id },
        tenantId,
      });
    }
  };

  const handleLaunchApp = (app: AppCatalogDto) => {
    setLaunchingApp(app.id);
    const baseUrl = app.baseUrl || `http://localhost:${app.port}`;
    const url = `${baseUrl}?projectId=${project.id}&tenantId=${tenantId}`;
    const launchWindow = window.open(url, `app-${app.name}`, "width=1400,height=900,scrollbars=yes");
    if (!launchWindow) {
      window.location.href = url;
    }
    setTimeout(() => setLaunchingApp(null), 500);
  };

  const allowedApps = appCatalog.filter((app) => isAppAllowed(app, capabilities));
  const lockedApps = appCatalog.filter((app) => !isAppAllowed(app, capabilities));
  const enabledAppsInProject = appCatalog.filter((app) => enabledAppIds.has(app.id) && isAppAllowed(app, capabilities));
  const availableButDisabledApps = allowedApps.filter((app) => !enabledAppIds.has(app.id));

  return (
    <div>
      {isLoadingCapabilities && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin tip="Checking subscription capabilities..." />
        </div>
      )}

      {!isLoadingCapabilities && appCatalog.length === 0 && (
        <Empty description="No apps available in the catalog" style={{ padding: 40 }} />
      )}

      {!isLoadingCapabilities && capabilities && Object.keys(capabilities).length === 0 && (
        <Alert
          type="warning"
          message="No active subscription"
          description="This tenant does not have an active subscription plan. Please set up a subscription to access apps."
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button type="primary" onClick={() => window.location.href = "/admin/billing"}>
              Go to Billing
            </Button>
          }
        />
      )}

      {!isLoadingCapabilities && capabilities && enabledAppsInProject.length === 0 && allowedApps.length === 0 && (
        <Alert
          type="warning"
          message="No Apps Available"
          description="Your current subscription plan does not include any apps. Upgrade your plan to access applications."
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button type="primary" onClick={() => window.location.href = "/admin/billing"}>
              Upgrade Plan
            </Button>
          }
        />
      )}

      {enabledAppsInProject.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Title level={5} style={{ marginBottom: 16 }}>
            <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            Enabled Apps
            <Text type="secondary" style={{ fontSize: 14, fontWeight: "normal", marginLeft: 8 }}>
              Click to launch
            </Text>
          </Title>
          <Row gutter={[16, 16]}>
            {enabledAppsInProject.map((app) => (
              <Col xs={24} sm={12} md={8} lg={6} key={app.id}>
                <Badge.Ribbon text="Enabled" color="green">
                  <Card
                    hoverable
                    style={{ borderRadius: 12, height: "100%" }}
                    actions={[
                      <Tooltip title="Launch App" key="launch">
                        <Button
                          type="primary"
                          icon={<LinkOutlined />}
                          loading={launchingApp === app.id}
                          onClick={() => handleLaunchApp(app)}
                        >
                          Launch
                        </Button>
                      </Tooltip>,
                      <Tooltip title="Disable" key="disable">
                        <Button
                          type="text"
                          icon={<CloseCircleOutlined />}
                          danger
                          onClick={() => handleToggleApp(app, false)}
                        />
                      </Tooltip>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<div style={{ color: "#1890ff" }}>{getIcon(app.icon)}</div>}
                      title={app.displayName}
                      description={
                        <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ marginBottom: 0 }}>
                          {app.description}
                        </Paragraph>
                      }
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {availableButDisabledApps.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Title level={5} style={{ marginBottom: 16 }}>
            <AppstoreAddOutlined style={{ color: "#1890ff", marginRight: 8 }} />
            Available Apps
            <Text type="secondary" style={{ fontSize: 14, fontWeight: "normal", marginLeft: 8 }}>
              Enable to add to this project
            </Text>
          </Title>
          <Row gutter={[16, 16]}>
            {availableButDisabledApps.map((app) => (
              <Col xs={24} sm={12} md={8} lg={6} key={app.id}>
                <Card
                  hoverable
                  style={{ borderRadius: 12, height: "100%", opacity: 0.85 }}
                  actions={[
                    <Tooltip title="Enable App" key="enable">
                      <Button
                        type="dashed"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleToggleApp(app, true)}
                        loading={enableApp.isPending}
                      >
                        Enable
                      </Button>
                    </Tooltip>,
                  ]}
                >
                  <Card.Meta
                    avatar={<div style={{ color: "#1890ff" }}>{getIcon(app.icon)}</div>}
                    title={app.displayName}
                    description={
                      <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ marginBottom: 0 }}>
                        {app.description}
                      </Paragraph>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {lockedApps.length > 0 && (
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>
            <LockOutlined style={{ color: "#faad14", marginRight: 8 }} />
            Premium Apps
            <Text type="secondary" style={{ fontSize: 14, fontWeight: "normal", marginLeft: 8 }}>
              Upgrade your plan to access these apps
            </Text>
          </Title>
          <Row gutter={[16, 16]}>
            {lockedApps.map((app) => (
              <Col xs={24} sm={12} md={8} lg={6} key={app.id}>
                <Card
                  style={{
                    borderRadius: 12,
                    height: "100%",
                    background: "#fafafa",
                    border: "1px dashed #d9d9d9",
                  }}
                  actions={[
                    <Tooltip title="Upgrade Plan" key="upgrade">
                      <Button
                        type="link"
                        icon={<ThunderboltOutlined />}
                        onClick={() => (window.location.href = "/admin/billing")}
                      >
                        Upgrade
                      </Button>
                    </Tooltip>,
                    <Tooltip title="Learn More" key="info">
                      <Button
                        type="text"
                        icon={<QuestionCircleOutlined />}
                        onClick={() => setInfoModalApp(app)}
                      />
                    </Tooltip>,
                  ]}
                >
                  <Card.Meta
                    avatar={<div style={{ color: "#d9d9d9" }}><LockOutlined style={{ fontSize: 24 }} /></div>}
                    title={
                      <Space>
                        <Text type="secondary">{app.displayName}</Text>
                        <Tag color="orange">Premium</Tag>
                      </Space>
                    }
                    description={
                      <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ marginBottom: 0 }}>
                        {app.description}
                      </Paragraph>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <Modal
        title={infoModalApp?.displayName}
        open={!!infoModalApp}
        onCancel={() => setInfoModalApp(null)}
        footer={[
          <Button key="close" onClick={() => setInfoModalApp(null)}>Close</Button>,
          <Button key="upgrade" type="primary" onClick={() => { setInfoModalApp(null); window.location.href = "/admin/billing"; }}>
            Upgrade Plan to Access
          </Button>,
        ]}
      >
        {infoModalApp && (
          <Space direction="vertical">
            <div style={{ fontSize: 48, color: "#1890ff" }}>{getIcon(infoModalApp.icon)}</div>
            <Text strong>{infoModalApp.displayName}</Text>
            <Text>{infoModalApp.description}</Text>
            <Alert
              type="info"
              message="Requires plan upgrade"
              description={`This app requires the "${infoModalApp.capabilityCode}" capability which is not included in your current plan.`}
              showIcon
            />
          </Space>
        )}
      </Modal>
    </div>
  );
}
