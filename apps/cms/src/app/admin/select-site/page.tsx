"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Spin,
  Typography,
  Avatar,
  Badge,
} from "antd";
import {
  GlobalOutlined,
  SelectOutlined,
  SettingOutlined,
  TeamOutlined,
  DatabaseOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import ISite from "@/abstracts/site";
import api from "@/api/api-context";
import api_points from "@/api/points";
import { setCookie } from "@/app/actions/set-cookie";
import { SiteId, SiteSlug } from "@/abstracts/siteSlug";
import { useDispatch } from "react-redux";
import { setSiteId, setSiteSlug } from "@/lib/redux-toolkit/slice/site-slice";

export default function SelectSitePage() {
  const router = useRouter();
  const [websites, setWebsites] = useState<ISite[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const dispatch = useDispatch();

  // Function to get random icon for each site
  const getSiteIcon = (siteId: number) => {
    const icons = [
      GlobalOutlined,
      SettingOutlined,
      TeamOutlined,
      DatabaseOutlined,
      RocketOutlined,
    ];
    return icons[siteId % icons.length];
  };

  useEffect(() => {
    async function fetchSites() {
      try {
        const res = await api.get(api_points.webSite.getAll);
        setWebsites(res.data.data);
      } catch (error) {
        console.error("Failed to fetch sites:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSites();
  }, []);

  const handleSelect = (site: ISite) => {
    setLoadingPage(true);
    setCookie(SiteId, site.id.toString());
    setCookie(SiteSlug, site.slug);

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || location.pathname;
    setTimeout(() => {
      dispatch(setSiteId(site.id));
      dispatch(setSiteSlug(site.slug));
      router.push(next);
    }, 500);
  };

  if (loading || loadingPage) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
          <Typography.Text
            style={{
              display: "block",
              marginTop: 24,
              color: "#022349",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {
              loading ? "Loading..." : "Redirecting to selected site..."
            }
          </Typography.Text>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
      }}
    >
      <div style={{ position: "relative", zIndex: 10, padding: 32 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header Section */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Avatar
              size={90}
              icon={<GlobalOutlined />}
              style={{
                background: "linear-gradient(to right, #022349, #0ea5e9)",
                boxShadow: "0 12px 24px rgba(2, 35, 73, 0.3)",
                marginBottom: 24,
              }}
            />
            <Typography.Title
              level={1}
              style={{
                color: "#022349",
                marginBottom: 16,
                fontWeight: "bold",
              }}
            >
              Content Management Hub
            </Typography.Title>
            <Typography.Text
              style={{
                color: "#475569",
                fontSize: 18,
                maxWidth: 720,
                margin: "0 auto",
                lineHeight: 1.6,
                display: "block",
              }}
            >
              Select your site to access powerful content management tools and
              streamline your workflow
            </Typography.Text>
          </div>

          {/* Sites Grid */}
          <Row gutter={[32, 32]} justify="center">
            {websites.map((site) => {
              const IconComponent = getSiteIcon(site.id);

              return (
                <Col key={site.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    style={{
                      height: "100%",
                      boxShadow: "0 6px 20px rgba(2, 35, 73, 0.1)",
                      transition: "all 0.3s",
                      background: "#ffffff",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                    }}
                    actions={[
                      <Button
                        key="select"
                        type="primary"
                        icon={<SelectOutlined />}
                        block
                        size="large"
                        onClick={() => handleSelect(site)}
                        style={{
                          background:
                            "linear-gradient(to right, #022349, #0ea5e9)",
                          border: "none",
                          color: "#fff",
                          boxShadow: "0 4px 12px rgba(2, 35, 73, 0.2)",
                          transition: "all 0.3s",
                          borderRadius: 6,
                        }}
                      >
                        Manage Site
                      </Button>,
                    ]}
                  >
                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                      <Avatar
                        size={64}
                        icon={<IconComponent />}
                        style={{
                          background:
                            "linear-gradient(to right, #022349, #0ea5e9)",
                          boxShadow: "0 8px 16px rgba(2, 35, 73, 0.2)",
                          marginBottom: 16,
                        }}
                      />
                      <Typography.Title
                        level={3}
                        style={{
                          marginBottom: 12,
                          color: "#022349",
                          fontWeight: "bold",
                        }}
                      >
                        {site.name}
                      </Typography.Title>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <Badge
                            count={site.role}
                            style={{
                              backgroundColor:
                                site.role === "Admin" ? "#10b981" : "#0ea5e9",
                              color: "#fff",
                              boxShadow:
                                "0 4px 10px rgba(2, 35, 73, 0.15)",
                            }}
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 8,
                            background: "#f1f5f9",
                            borderRadius: 8,
                            padding: 8,
                          }}
                        >
                          <Typography.Text
                            style={{ color: "#334155", fontSize: 14 }}
                          >
                            Site ID:
                          </Typography.Text>
                          <Typography.Text
                            style={{
                              color: "#022349",
                              fontFamily: "monospace",
                              fontSize: 14,
                              background: "#e2e8f0",
                              padding: "2px 8px",
                              borderRadius: 4,
                            }}
                          >
                            {site.id}
                          </Typography.Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {websites.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 80 }}>
              <Avatar
                size={64}
                icon={<GlobalOutlined />}
                style={{
                  background: "#cbd5e1",
                  marginBottom: 24,
                  color: "#fff",
                }}
              />
              <Typography.Title
                level={3}
                style={{ color: "#022349", marginBottom: 16 }}
              >
                No Sites Available
              </Typography.Title>
              <Typography.Text
                style={{ color: "#64748b", fontSize: 16 }}
              >
                Contact your administrator to get access to sites
              </Typography.Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
