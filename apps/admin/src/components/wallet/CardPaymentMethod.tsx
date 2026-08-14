"use client";

import React from "react";
import { Typography, Button, Divider } from "antd";
import { CreditCardOutlined, ArrowLeftOutlined, ToolOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface CardPaymentMethodProps {
  onBack: () => void;
}

export default function CardPaymentMethod({ onBack }: CardPaymentMethodProps) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} size="small" />
        <Title level={5} style={{ margin: 0 }}>الدفع بالبطاقة</Title>
      </div>

      <div style={{ textAlign: "center", padding: "40px 20px", borderRadius: 16, background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", border: "1px solid #f59e0b" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <ToolOutlined style={{ fontSize: 40, color: "#fff" }} />
        </div>
        <Title level={4} style={{ margin: "0 0 12px", color: "#92400e" }}>الخدمة قيد التجهيز</Title>
        <Text style={{ display: "block", color: "#78350f", fontSize: 15, maxWidth: 360, margin: "0 auto", lineHeight: 1.6 }}>
          بوابة الدفع الإلكتروني عبر البطاقات قيد الربط والتكامل حالياً. نعمل على توفير تجربة دفع آمنة وسلسة بأعلى المعايير. يرجى استخدام التحويل البنكي في الوقت الحالي.
        </Text>
      </div>

      <Divider />

      <Button type="default" block size="large" onClick={onBack} style={{ height: 48, borderRadius: 12 }}>
        العودة لطرق الشحن
      </Button>
    </div>
  );
}
