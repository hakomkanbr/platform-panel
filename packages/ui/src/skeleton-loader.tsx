"use client";

import React from "react";
import { Skeleton, Card, Row, Col, Space } from "antd";
import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  type?: "card" | "table" | "stat" | "chart" | "page";
  count?: number;
}

const shimmerStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, var(--border-light) 0%, var(--border) 50%, var(--border-light) 100%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
  borderRadius: 8,
};

function SkeletonBlock({ width, height, style }: { width?: number | string; height?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        width: width || "100%",
        height: height || 16,
        ...shimmerStyle,
        ...style,
      }}
    />
  );
}

export function StatSkeleton() {
  return (
    <Card style={{ borderRadius: 16, border: "1px solid var(--border-light)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <Space direction="vertical" style={{ width: "100%" }} size={12}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <SkeletonBlock width={40} height={40} style={{ borderRadius: 10 }} />
          <SkeletonBlock width="60%" height={14} />
        </div>
        <SkeletonBlock width="40%" height={32} />
        <SkeletonBlock width="80%" height={8} />
      </Space>
    </Card>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card style={{ borderRadius: 16, border: "1px solid var(--border-light)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <SkeletonBlock width="100%" height={44} />
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonBlock key={i} width="100%" height={40} />
        ))}
      </Space>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card style={{ borderRadius: 16, border: "1px solid var(--border-light)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SkeletonBlock width={120} height={20} />
          <SkeletonBlock width={160} height={32} />
        </div>
        <SkeletonBlock width="100%" height={280} />
      </Space>
    </Card>
  );
}

export function PageSkeleton() {
  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }} size={24}>
        <SkeletonBlock width={200} height={28} />
        <SkeletonBlock width={320} height={16} />
        <Row gutter={[24, 24]}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <StatSkeleton />
            </Col>
          ))}
        </Row>
        <ChartSkeleton />
      </Space>
    </div>
  );
}

export function SkeletonLoader({ type = "card", count = 1 }: SkeletonLoaderProps) {
  if (type === "stat") {
    return (
      <Row gutter={[24, 24]}>
        {Array.from({ length: count }).map((_, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <StatSkeleton />
          </Col>
        ))}
      </Row>
    );
  }
  if (type === "table") return <TableSkeleton rows={count * 3} />;
  if (type === "chart") return <ChartSkeleton />;
  if (type === "page") return <PageSkeleton />;
  return (
    <Card style={{ borderRadius: 16, border: "1px solid var(--border-light)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <Skeleton active paragraph={{ rows: count }} />
    </Card>
  );
}
