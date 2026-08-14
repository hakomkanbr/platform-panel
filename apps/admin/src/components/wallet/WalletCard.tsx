"use client";

import React from "react";
import { Card, Statistic, Typography, Spin, Empty, Button, Space } from "antd";
import {
  WalletOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  ReloadOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { WalletDto } from "@repo/shared-types";

const { Text } = Typography;

interface WalletCardProps {
  wallet: WalletDto | undefined;
  isLoading: boolean;
  onAdjust?: (mode: "add" | "deduct") => void;
  onRefresh?: () => void;
  onTopUp?: () => void;
}

export default function WalletCard({
  wallet,
  isLoading,
  onAdjust,
  onRefresh,
  onTopUp,
}: WalletCardProps) {
  if (isLoading) {
    return (
      <Card style={{ borderRadius: 12, height: "100%" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card style={{ borderRadius: 12, height: "100%" }}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="لم يتم العثور على محفظة لهذا الحساب" />
      </Card>
    );
  }

  const isPositive = wallet.balance >= 0;

  return (
    <Card
      style={{
        borderRadius: 12,
        height: "100%",
        background: isPositive
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        color: "#fff",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Space>
            <WalletOutlined style={{ fontSize: 24, color: "#fff" }} />
            <Text strong style={{ color: "#fff", fontSize: 16 }}>
              محفظة الحساب
            </Text>
          </Space>
          <Space>
            {onRefresh && (
              <Button type="text" icon={<ReloadOutlined style={{ color: "#fff" }} />} onClick={onRefresh} size="small" />
            )}
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
              {wallet.currency}
            </Text>
          </Space>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Statistic
            value={Math.abs(wallet.balance)}
            precision={2}
            prefix={isPositive ? "$" : <span style={{ color: "#ffd666" }}>-$</span>}
            valueStyle={{
              color: "#fff",
              fontSize: 36,
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16 }}>
          {onAdjust && (
            <>
              <Button type="default" ghost icon={<PlusCircleOutlined />} onClick={() => onAdjust("add")}
                style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff" }}>
                إضافة رصيد
              </Button>
              <Button type="default" ghost icon={<MinusCircleOutlined />} onClick={() => onAdjust("deduct")}
                style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff" }}>
                خصم رصيد
              </Button>
            </>
          )}
          {!onAdjust && onTopUp && (
            <Button type="default" ghost icon={<DollarOutlined />} onClick={onTopUp}
              style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff", fontWeight: 600 }} size="large">
              طلب شحن المحفظة
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
