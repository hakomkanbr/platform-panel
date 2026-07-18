"use client";

import React, { useState } from "react";
import { Form, InputNumber, Typography, Button, Descriptions, Spin, Divider } from "antd";
import { BankOutlined, SendOutlined, ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import type { BankDetailsDto } from "@/types";

const { Text, Title } = Typography;

interface BankTransferMethodProps {
  bankDetails: BankDetailsDto | undefined;
  bankDetailsLoading: boolean;
  submitLoading: boolean;
  onSubmitRequest: (amount: number) => Promise<void>;
  onBack: () => void;
}

export default function BankTransferMethod({
  bankDetails,
  bankDetailsLoading,
  submitLoading,
  onSubmitRequest,
  onBack,
}: BankTransferMethodProps) {
  const [amount, setAmount] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form] = Form.useForm();

  const details = bankDetails ?? {
    bankName: "Example National Bank",
    accountName: "Platform Administration",
    iban: "XX00 0000 0000 0000 0000 0000",
    swift: "EXMPXX00",
  };

  const handleSubmit = async () => {
    if (!amount || amount <= 0) return;
    await onSubmitRequest(amount);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <CheckCircleOutlined style={{ fontSize: 64, color: "#10b981" }} />
        <Title level={4} style={{ margin: "16px 0 8px" }}>Transfer Instructions Sent!</Title>
        <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
          Please transfer <Text strong>${amount?.toFixed(2)}</Text> using the bank details below.
          Funds will be credited after confirmation.
        </Text>
      </div>
    );
  }

  if (bankDetailsLoading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} size="small" />
        <Title level={5} style={{ margin: 0 }}>Bank Transfer</Title>
      </div>

      <div style={{ borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)", padding: "16px 20px", color: "#fff" }}>
          <BankOutlined style={{ fontSize: 24, marginRight: 8 }} />
          <Text strong style={{ color: "#fff", fontSize: 16 }}>Bank Account Information</Text>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <Descriptions column={1} size="small" colon={false}>
            <Descriptions.Item label={<Text type="secondary">Bank Name</Text>} style={{ paddingBottom: 12 }}>
              <Text strong>{details.bankName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<Text type="secondary">Account Name</Text>} style={{ paddingBottom: 12 }}>
              <Text strong>{details.accountName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<Text type="secondary">IBAN</Text>} style={{ paddingBottom: 12 }}>
              <Text strong copyable style={{ fontSize: 15, letterSpacing: 1, fontFamily: "monospace", background: "#f3f4f6", padding: "4px 8px", borderRadius: 6 }}>
                {details.iban}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={<Text type="secondary">SWIFT/BIC</Text>} style={{ paddingBottom: 12 }}>
              <Text strong copyable style={{ fontFamily: "monospace" }}>{details.swift}</Text>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      <Divider style={{ margin: "8px 0 16px" }} />

      <Form form={form} layout="vertical">
        <Form.Item
          name="amount"
          label={<Text strong>Amount to Transfer</Text>}
          rules={[
            { required: true, message: "Please enter an amount" },
            { type: "number", min: 0.01, message: "Amount must be greater than 0" },
            { type: "number", max: 999999999, message: "Amount is too large" },
          ]}
        >
          <InputNumber
            min={0.01} max={999999999} step={0.01} precision={2}
            prefix="$" style={{ width: "100%" }} placeholder="0.00" size="large" autoFocus
            onChange={(val) => setAmount(val)}
          />
        </Form.Item>
      </Form>

      <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
        <Text style={{ color: "#92400e", fontSize: 13 }}>
          After making the transfer, please allow 1-3 business days for the funds to reflect in your wallet.
          Include your tenant ID as the transfer reference.
        </Text>
      </div>

      <Button
        type="primary" block size="large" icon={<SendOutlined />} onClick={handleSubmit}
        loading={submitLoading}
        style={{ height: 48, borderRadius: 12, background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none" }}
      >
        Submit Transfer Request
      </Button>
    </div>
  );
}
