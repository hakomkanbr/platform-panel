"use client";

import { message } from "antd";
import { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  DollarCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { TiArrowSync } from "react-icons/ti";
import formatMoney from "@/lib/formatMoney";
import type { DailySale, MonthlySale, TopProduct, OrderSummary } from "@/types";
import { dashboardApi } from "@/lib/api/dashboard";

const COLORS = ["#16a085", "#2980b9", "#8e44ad", "#e67e22", "#c0392b"];

function DashboardPage() {
  const [pieData, setPieData] = useState<any[]>([]);
  const [dailySales, setDailySales] = useState<any[]>([]);
  const [monthlySales, setMonthlySales] = useState<any[]>([]);
  const [weeklySalesData, setWeeklySalesData] = useState<any[]>([]);

  const [data, setData] = useState<OrderSummary>({
    awaitingApproval: 0,
    awaitingPayment: 0,
    paymentFaild: 0,
    refunded: 0,
    refundFailed: 0,
    processing: 0,
    paymentPaid: 0,
    delivered: 0,
    inCargo: 0,
    cancelled: 0,
  });

  useEffect(() => {
    dashboardApi
      .orders()
      .then(setData)
      .catch((err) => message.error(err.message));
  }, []);
  useEffect(() => {
    dashboardApi
      .topProducts()
      .then((res: TopProduct[]) => {
        setPieData(
          res
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5)
            .map((item, index) => ({
              name: item.name,
              sales: item.sales,
              color: COLORS[index % COLORS.length],
            })),
        );
      })
      .catch((err) => message.error(err.message));
  }, []);
  useEffect(() => {
    dashboardApi
      .dailySales()
      .then((res: any[]) => {
        setDailySales(res);
        setWeeklySalesData(
          res.map((item) => ({ day: item.day, sales: item.total })),
        );
      })
      .catch((err) => message.error(err.message));
    dashboardApi
      .monthlySales()
      .then(setMonthlySales)
      .catch((err) => message.error(err.message));
  }, []);

  const pending = data.awaitingApproval + data.awaitingPayment;
  const processing = data.processing;
  const delivered = data.delivered + data.inCargo;
  const cancelledOrRefunded =
    data.cancelled + data.paymentFaild + data.refunded + data.refundFailed;
  const totalOrders =
    data.awaitingApproval +
    data.awaitingPayment +
    data.paymentFaild +
    data.refunded +
    data.refundFailed +
    data.processing +
    data.paymentPaid +
    data.delivered +
    data.inCargo +
    data.cancelled;

  const today = dailySales[dailySales.length - 1] || { total: 0 };
  const yesterday = dailySales[dailySales.length - 2] || { total: 0 };
  const thisMonth = monthlySales[monthlySales.length - 1] || { total: 0 };
  const lastMonth = monthlySales[monthlySales.length - 2] || { total: 0 };
  const allTimeSales = monthlySales.reduce((sum, m) => sum + m.total, 0);

  const salesCards = [
    {
      label: "Today's Sales",
      value: today.total,
      bg: "linear-gradient(135deg, #0ab8a8, #087a70)",
    },
    {
      label: "Yesterday's Sales",
      value: yesterday.total,
      bg: "linear-gradient(135deg, #f7a240, #d4720a)",
    },
    {
      label: "This Month",
      value: thisMonth.total,
      bg: "linear-gradient(135deg, #4f8ef7, #1a5cd4)",
    },
    {
      label: "Last Month",
      value: lastMonth.total,
      bg: "linear-gradient(135deg, #0baec9, #077c90)",
    },
    {
      label: "All Time",
      value: allTimeSales,
      bg: "linear-gradient(135deg, #27ae77, #0f6b45)",
    },
  ];

  const statCards = [
    {
      icon: <ShoppingCartOutlined style={{ fontSize: 20 }} />,
      bg: "#fff3e8",
      color: "#ea580c",
      label: "Total Orders",
      value: totalOrders,
    },
    {
      icon: <TiArrowSync style={{ fontSize: 22 }} />,
      bg: "#dbeafe",
      color: "#2563eb",
      label: "Pending",
      value: pending,
    },
    {
      icon: <ShoppingCartOutlined style={{ fontSize: 20 }} />,
      bg: "#ccfbf1",
      color: "#0d9488",
      label: "Processing",
      value: processing,
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: 20 }} />,
      bg: "#d1fae5",
      color: "#059669",
      label: "Delivered",
      value: delivered,
    },
    {
      icon: <DollarCircleOutlined style={{ fontSize: 20 }} />,
      bg: "#dcfce7",
      color: "#16a34a",
      label: "Paid",
      value: data.paymentPaid,
    },
    {
      icon: <InboxOutlined style={{ fontSize: 20 }} />,
      bg: "#fee2e2",
      color: "#b91c1c",
      label: "Cancelled/Refunded",
      value: cancelledOrRefunded,
    },
  ];

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#8c8c9a",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Sales Summary
      </div>
      <Row gutter={[14, 14]} style={{ marginBottom: 28 }}>
        {salesCards.map((card, i) => (
          <Col key={i} xs={24} sm={12} md={8} lg={6} xl={i === 4 ? 4 : 5}>
            <Card
              bordered={false}
              style={{
                background: card.bg,
                border: "none",
                borderRadius: 14,
                overflow: "hidden",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -30,
                  right: 20,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.07)",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    color: "rgba(236, 174, 28, 0.85)",
                    fontSize: 12,
                    fontWeight: 500,
                    marginBottom: 8,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                  }}
                >
                  {card.label}
                </div>
                <div
                  style={{
                    color: "#483e3e",
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {formatMoney(Number(card.value.toFixed(2)))}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#8c8c9a",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Order Status
      </div>
      <Row gutter={[14, 14]} style={{ marginBottom: 28 }}>
        {statCards.map((card, i) => (
          <Col key={i} xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: card.bg,
                    color: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                    marginRight: 14,
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#8c8c9a",
                      marginBottom: 4,
                      fontWeight: 500,
                    }}
                  >
                    {card.label}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#1a1a2e",
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#8c8c9a",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Charts
      </div>
      <Row gutter={[14, 14]}>
        <Col xs={24} md={12}>
          <Card
            title="Weekly Sales"
            style={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.05)" }}
            extra={
              <a
                href="/admin/orders"
                style={{ fontSize: 12, color: "#6366f1", fontWeight: 500 }}
              >
                Orders →
              </a>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={weeklySalesData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid stroke="#f0f0f4" strokeDasharray="4 4" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#8c8c9a" }}
                  interval={0}
                  axisLine={{ stroke: "#e8e8ee" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#8c8c9a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value}`, "Sales"]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #f0f0f4",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#16a085"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#16a085", strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Top Selling Products"
            style={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.05)" }}
          >
            {pieData?.length ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: 12, color: "#8c8c9a" }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} sales`]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #f0f0f4",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: 12,
                    }}
                  />
                  <Pie
                    data={pieData}
                    dataKey="sales"
                    nameKey="name"
                    cx="50%"
                    cy="57%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${name.substring(0, 15)} (${(percent * 100).toFixed(1)}%)`
                    }
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8c8c8c",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <InboxOutlined style={{ fontSize: 40 }} />
                <span>No sales data yet</span>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
