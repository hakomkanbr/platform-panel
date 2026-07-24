"use client";;
import React from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Layout, Row, theme, Typography, Space, Badge, Input } from 'antd';
import EUser from './user';
import EFullScreen from './full-screen';
import SiteSelect from './sites-select';
import { IRoleType, IUser, IUserProps, ROLE } from '@/abstracts/user/user';
import RedirectWebSite from './redirect-url';
import BtnMigrateDb from './migrate-db';

const { Text } = Typography;
const { Search } = Input;

const { Header, Sider, Content } = Layout;

const EHeader: React.FC<{ setCollapsed: (value: boolean) => void; collapsed: boolean, user?: IUserProps }> = ({ setCollapsed, collapsed, user }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Header style={{
            padding: "0 24px",
            background: "white",
            borderBottom: "1px solid #f0f0f0",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
            height: 64,
            lineHeight: "64px"
        }}>
            <Row align="middle" style={{ height: "100%" }}>
                <Col flex="none">
                    <Space align="center">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 40,
                                height: 40,
                                borderRadius: 8,
                                color: "#6b7280",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        />
                        {user && user.userId && user[ROLE] == IRoleType.Admin && (
                            <div style={{ marginLeft: 16 }}>
                                <SiteSelect />
                            </div>
                        )}
                    </Space>
                </Col>

                <Col flex="auto" style={{ textAlign: "center" }}>
                    <Search
                        placeholder="Search content, pages, modules..."
                        allowClear
                        style={{
                            maxWidth: 400,
                            borderRadius: 8
                        }}
                        size="middle"
                        onSearch={(value) => console.log('Search:', value)}
                    />
                </Col>

                <Col flex="none">
                    <Space align="center" size={16}>
                        <RedirectWebSite />

                        {process.env.NODE_ENV === "development" && <BtnMigrateDb />}

                        <Badge count={3} size="small">
                            <Button
                                type="text"
                                icon={<BellOutlined />}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 8,
                                    color: "#6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            />
                        </Badge>

                        <EFullScreen />
                        <EUser user={user} />
                    </Space>
                </Col>
            </Row>
        </Header>
    );
};

export default EHeader;