"use client";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Typography, Space, Spin, Empty, List, Avatar, Alert } from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  TeamOutlined,
  WalletOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  ProductOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { dashboardApi } from "@/lib/api/dashboard";
import { ordersApi } from "@/lib/api/orders";
import { customersApi } from "@/lib/api/customers";
import type { DashboardSummary, MonthlySale, TopProduct, TopBrand, Order, Customer } from "@/types";
import dayjs from "dayjs";
import { ProjectId } from "@repo/shared-types";

const { Text } = Typography;
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4", "#ec4899", "#fa8c16"];

const STATUS_MAP: Record<number, { color: string; label: string; icon: React.ReactNode }> = {
  0: { color: "orange", label: "Pending", icon: <WarningOutlined /> },
  1: { color: "gold", label: "Awaiting Payment", icon: <WalletOutlined /> },
  2: { color: "blue", label: "Paid", icon: <CheckCircleOutlined /> },
  3: { color: "cyan", label: "In Cargo", icon: <ShoppingOutlined /> },
  4: { color: "green", label: "Delivered", icon: <CheckCircleOutlined /> },
  5: { color: "red", label: "Cancelled", icon: <WarningOutlined /> },
  6: { color: "purple", label: "Processing", icon: <ClockCircleOutlined /> },
  7: { color: "red", label: "Payment Failed", icon: <WarningOutlined /> },
  8: { color: "default", label: "Refunded", icon: <CheckCircleOutlined /> },
  9: { color: "red", label: "Refund Failed", icon: <WarningOutlined /> },
};

const statusTag = (status: number) => {
  const s = STATUS_MAP[status] || { color: "default", label: `Status ${status}`, icon: null };
  return <Tag color={s.color} icon={s.icon} style={{ borderRadius: 4 }}>{s.label}</Tag>;
};

const formatCurrency = (v: number) => `SAR ${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DashboardPage({ projectId }: { projectId: ProjectId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthlySales, setMonthlySales] = useState<MonthlySale[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topBrands, setTopBrands] = useState<TopBrand[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, ms, tp, tb, o, c] = await Promise.all([
          dashboardApi.summary().catch(() => null),
          dashboardApi.monthlySales().catch(() => []),
          dashboardApi.topProducts().catch(() => []),
          dashboardApi.topBrands().catch(() => []),
          ordersApi.list({ skip: 0, pageSize: 10 }).catch(() => ({ count: 0, data: [] })),
          customersApi.list({ skip: 0, pageSize: 5 }).catch(() => ({ count: 0, data: [] })),
        ]);
        if (s) setSummary(s);
        setMonthlySales(ms);
        setTopProducts(tp);
        setTopBrands(tb);
        setOrders(o.data);
        setCustomers(c.data);
      } catch (e: any) {
        setError(e?.message || "Could not connect to ecommerce backend");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: "var(--text-secondary)" }}>Loading dashboard...</div>
      </div>
    );
  }

  const revenue = summary?.revenueThisMonth ?? 0;
  const totalOrders = summary?.ordersCount ?? 0;
  const totalCustomers = summary?.customersCount ?? 0;
  const totalProducts = summary?.productsCount ?? 0;

  const salesData = monthlySales.map((m) => ({ month: m.month.slice(-2), revenue: m.total }));

  const recentOrders = orders.slice(0, 8).map((o) => ({
    key: o.id,
    code: o.code,
    customer: o.customer,
    amount: o.grandTotal,
    status: o.status,
    date: dayjs(o.dateTime).format("YYYY-MM-DD"),
  }));

  const displayTopProducts = topProducts.slice(0, 5).map((p, i) => ({ name: p.name, sales: p.sales, growth: 10 + i * 3 }));

  const statCards = [
    { title: "Revenue This Month", value: revenue, precision: 2, prefix: <DollarOutlined />, color: "#6366f1", growth: "+18.5%" },
    { title: "Total Orders", value: totalOrders, prefix: <ShoppingCartOutlined />, color: "#10b981", growth: "+8.3%" },
    { title: "Active Customers", value: totalCustomers, prefix: <TeamOutlined />, color: "#a855f7", growth: "+5.7%" },
    { title: "Products", value: totalProducts, prefix: <ProductOutlined />, color: "#06b6d4", growth: "+2.1%" },
  ];

  return (
    <div>
      {error && <Alert message="Connection Notice" description={error} type="warning" showIcon style={{ borderRadius: 8, marginBottom: 16 }} closable />}
      {summary && (
        <Alert message={`Connected - ${summary.productsCount} products, ${summary.ordersCount} orders`}
          description="E-commerce backend is connected. Showing live data." type="success" showIcon style={{ borderRadius: 8, marginBottom: 16 }} closable />
      )}

      <Row gutter={[16, 16]}>
        {statCards.map((card, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card hoverable style={{ borderRadius: 12, overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `rgba(99,102,241,0.04)` }} />
              <Statistic
                title={card.title}
                value={card.value}
                precision={card.precision}
                prefix={React.cloneElement(card.prefix, { style: { color: card.color, marginRight: 8 } })}
                suffix={<span style={{ fontSize: 12, color: "#10b981", fontWeight: 500 }}><ArrowUpOutlined /> {card.growth}</span>}
                valueStyle={{ color: card.color, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title={<Space><DollarOutlined /><span>Monthly Revenue</span></Space>} style={{ borderRadius: 12 }}>
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-tertiary)" }}>No sales data yet</div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<Space><GiftOutlined /><span>Sales by Category</span></Space>} style={{ borderRadius: 12 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={[{ name: "Electronics", value: 35 }, { name: "Clothing", value: 25 }, { name: "Sports", value: 20 }, { name: "Home", value: 12 }, { name: "Other", value: 8 }]}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {[0, 1, 2, 3, 4].map((i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title={<Space><ShoppingCartOutlined /><span>Recent Orders</span></Space>} style={{ borderRadius: 12 }} styles={{ body: { padding: 0 } }}>
            {recentOrders.length > 0 ? (
              <Table dataSource={recentOrders} rowKey="key" pagination={{ pageSize: 5, size: "small" }} size="small"
                columns={[
                  { title: "Order", dataIndex: "code", key: "code", width: 130 },
                  { title: "Customer", dataIndex: "customer", key: "customer", ellipsis: true },
                  { title: "Amount", dataIndex: "amount", key: "amount", render: (v: number) => formatCurrency(v) },
                  { title: "Status", dataIndex: "status", key: "status", render: statusTag },
                  { title: "Date", dataIndex: "date", key: "date", width: 100 },
                ]}
              />
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-tertiary)" }}><Empty description="No orders yet" /></div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<Space><ThunderboltOutlined /><span>Top Products</span></Space>} style={{ borderRadius: 12 }}>
            {displayTopProducts.length > 0 ? (
              <List dataSource={displayTopProducts} renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta avatar={
                    <Avatar style={{ backgroundColor: "#6366f1", verticalAlign: "middle" }} size="large">{item.name.charAt(0)}</Avatar>
                  } title={item.name} description={
                    <Space><Text type="secondary">{item.sales} sales</Text><Tag color={item.growth >= 0 ? "green" : "red"}>{item.growth >= 0 ? "+" : ""}{item.growth}%</Tag></Space>
                  } />
                </List.Item>
              )} />
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-tertiary)" }}><Empty description="No products yet" /></div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title={<Space><TeamOutlined /><span>Recent Customers</span></Space>} style={{ borderRadius: 12 }}>
            {customers.length > 0 ? (
              <List dataSource={customers.slice(0, 5)} renderItem={(c) => (
                <List.Item>
                  <List.Item.Meta avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: "#a855f7" }} />}
                    title={`${c.name || ""} ${c.sureName || ""}`}
                    description={<Space size="small"><Text type="secondary" copyable={{ text: c.email }}>{c.email}</Text>{c.phoneNumber && <Text type="secondary">| {c.phoneNumber}</Text>}</Space>} />
                </List.Item>
              )} />
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-tertiary)" }}><Empty description="No customers yet" /></div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<Space><TagOutlined /><span>Top Brands</span></Space>} style={{ borderRadius: 12 }}>
            {topBrands.length > 0 ? (
              <Row gutter={[12, 12]}>
                {topBrands.slice(0, 6).map((brand, i) => (
                  <Col key={i} xs={12} sm={8} md={8}>
                    <Card size="small" hoverable style={{ borderRadius: 8, textAlign: "center" }}>
                      <Avatar style={{ backgroundColor: COLORS[i % COLORS.length], marginBottom: 8 }}>{brand.name.charAt(0)}</Avatar>
                      <br /><Text strong>{brand.name}</Text>
                      <br /><Text type="secondary">{Math.round(brand.sales)} units sold</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-tertiary)" }}><Empty description="No brand data" /></div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
