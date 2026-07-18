"use client";;
import React, { useEffect, useState } from 'react';
import { ContactsOutlined, DashboardOutlined, HarmonyOSOutlined, ProductOutlined, SettingOutlined, UserOutlined, FormOutlined, FileTextOutlined, AppstoreOutlined, DatabaseOutlined, LinkOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import EHeader from './header';
import Image from 'next/image';
import { IRoleType, IUser, IUserProps, ROLE } from '@/abstracts/user/user';
import { useDispatch } from 'react-redux';
import { setUserRole } from '@/lib/redux-toolkit/slice/user-slice';
import { setSiteSlug } from '@/lib/redux-toolkit/slice/site-slice';
import { getCookie } from '@/app/actions/set-cookie';
import { SiteSlug } from '@/abstracts/siteSlug';
import { IModule } from '@/types/page';

const { Text } = Typography;
const { Sider, Content } = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode; modules: IModule[], user: IUserProps }> = ({ children, modules, user }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const itemStyle = {
    padding: "0 10px"
  };
  const items = modules.map((module) => (
    {
      key: `admin/${module.slug}/contents`,
      label: module.name,
      icon: (<HarmonyOSOutlined style={{
        fontSize: 10
      }} />),
      style: {
        padding: "0 25px"
      }
    }
  ));

  const renderItem = () => {
    const elements = [
      {
        label: "Dashboard", key: "admin", icon: <DashboardOutlined />, style: itemStyle
      },
      {
        label: "WebSites", key: "admin/web-sites", icon: <DatabaseOutlined />, style: itemStyle
      },
      {
        label: "Pages", key: "admin/pages", icon: <FileTextOutlined />, style: itemStyle
      },
      { label: "Modules", key: "admin/modules", icon: <AppstoreOutlined />, style: itemStyle },
      { label: "Collections", key: "admin/collections", icon: <ProductOutlined />, style: itemStyle },
      { label: "Relations", key: "admin/relations", icon: <LinkOutlined />, style: itemStyle },
      { label: "Forms", key: "admin/forms", icon: <FormOutlined />, style: itemStyle },
      { label: "Sections", key: "/Categories", children: items, icon: <HarmonyOSOutlined />, style: { paddingLeft: 0 } },
      { label: "Users", key: "admin/users", icon: <TeamOutlined />, style: itemStyle },
      { label: "Setting", key: "admin/setting", icon: <SettingOutlined />, style: itemStyle }
    ];
    if (user?.role == IRoleType.User) {
      const websiteIndex = elements.findIndex(i => i.label == "WebSites");
      elements.splice(websiteIndex, 1);
      const usersIndex = elements.findIndex(i => i.label == "Users");
      elements.splice(usersIndex, 1);
    }
    if (!items.length) {
      const index = elements.findIndex(i => i.label == "Sections");
      elements.splice(index, 1);
    }
    return elements;
  };

  useEffect(() => {
    console.info("user.role => ", user);
    if (user) {
      getCookie(SiteSlug).then((i => {
        if (i) {
          dispatch(setSiteSlug(i ?? ""));
        }
      }))
      // dispatch(setUserRole(user[ROLE] as IRoleType));
    }
  }, [user]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        width={260}
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        style={{
          background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)"
        }}
      >
        {/* Logo Section */}
        <div style={{
          textAlign: "center",
          padding: collapsed ? "20px 10px" : "24px 20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: 16
        }}>
          {!collapsed ? (
            <div>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
              }}>
                <DatabaseOutlined style={{ fontSize: 24, color: "white" }} />
              </div>
              <Text strong style={{ color: "white", fontSize: 18 }}>
                HeadlessCMS
              </Text>
              <br />
              <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                Admin Panel
              </Text>
            </div>
          ) : (
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
            }}>
              <DatabaseOutlined style={{ fontSize: 20, color: "white" }} />
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['admin']}
          items={renderItem()}
          onClick={(info) => {
            router.push(`/` + info.key);
          }}
          style={{
            background: "transparent",
            border: "none"
          }}
          className="modern-sidebar"
        />
      </Sider>

      <Layout style={{
        background: "#f8fafc",
        minHeight: "100vh"
      }}>
        <EHeader collapsed={collapsed} user={user} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: 0,
            padding: 0,
            minHeight: "calc(100vh - 64px)",
            background: "#f8fafc"
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;