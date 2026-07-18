"use client";
import { Tabs, Typography, Space } from "antd";
import {
    SettingOutlined,
    GlobalOutlined,
    KeyOutlined,
    DatabaseOutlined
} from "@ant-design/icons";
import ECard from "@/components/elements/card";
import GeneralSection from "./general";
import { IRoleType, IUser, ROLE } from "@/abstracts/user/user";
import LanguageSettingSection from "./language";
import ApiKeySection from "./api-key";
import { useSelector } from "react-redux";
import { makeStore, RootState } from "@/lib/redux-toolkit/store";
import styles from "../settings.module.css";
import { useEffect } from "react";

const { Title } = Typography;

const TabsCompanies: React.FC<{ siteSlug: string | null }> = ({ siteSlug }) => {
    const user = useSelector((state: RootState) => state.user);

    const { role } = user;

    var items = [
        {
            label: (
                <Space>
                    <SettingOutlined />
                    General Settings
                </Space>
            ),
            key: "1",
            children: <GeneralSection siteSlug={siteSlug} user={user} />
        },
        {
            label: (
                <Space>
                    <KeyOutlined />
                    API Configuration
                </Space>
            ),
            key: "2",
            children: <ApiKeySection siteSlug={siteSlug} user={user} />
        },
        {
            label: (
                <Space>
                    <GlobalOutlined />
                    Language Settings
                </Space>
            ),
            key: "3",
            children: <LanguageSettingSection user={user} />
        }
    ];

    if (role == IRoleType.Editor) {
        items.splice(2, 1);
        items.splice(1, 1);
    }

    return (
        <div className={`${styles.settingsContainer} settings-fade-in`}>
            <div className={styles.settingsHeader}>
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                    <DatabaseOutlined style={{ marginRight: 12, color: '#6366f1' }} />
                    Headless CMS Settings
                </Title>
                <Typography.Text type="secondary" style={{ fontSize: '16px' }}>
                    Configure your headless CMS settings, API access, and content management preferences
                </Typography.Text>
            </div>

            <ECard className={styles.settingsCard}>
                <Tabs
                    tabPosition="top"
                    items={items}
                    size="large"
                    tabBarStyle={{
                        marginBottom: 32,
                        borderBottom: '2px solid #f1f5f9'
                    }}
                    animated={{ inkBar: true, tabPane: true }}
                />
            </ECard>
        </div>
    );
};

export default TabsCompanies;