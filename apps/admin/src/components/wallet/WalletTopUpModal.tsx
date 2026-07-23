"use client";

import React, { useState } from "react";
import { Modal, Typography, Space, Button, Divider } from "antd";
import { WalletOutlined, BankOutlined, CreditCardOutlined } from "@ant-design/icons";
import type { BankDetailsDto } from "@/types";
import BankTransferMethod from "./BankTransferMethod";
import CardPaymentMethod from "./CardPaymentMethod";

const { Text, Title } = Typography;

type PaymentMethod = "choose" | "bank" | "card";

interface WalletTopUpModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmitRequest: (amount: number) => Promise<void>;
  bankDetails: BankDetailsDto | undefined;
  bankDetailsLoading: boolean;
  submitLoading: boolean;
}

export default function WalletTopUpModal({
  open,
  onCancel,
  onSubmitRequest,
  bankDetails,
  bankDetailsLoading,
  submitLoading,
}: WalletTopUpModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("choose");

  React.useEffect(() => {
    if (!open) setMethod("choose");
  }, [open]);

  const renderMethodCard = (
    icon: React.ReactNode,
    title: string,
    description: string,
    gradient: string,
    badge?: string,
    onClick?: () => void,
  ) => (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        padding: "28px 20px",
        borderRadius: 16,
        background: gradient,
        color: "#fff",
        cursor: onClick ? "pointer" : "not-allowed",
        transition: "all 0.3s ease",
        textAlign: "center",
        border: "2px solid transparent",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        position: "relative",
        opacity: badge ? 0.85 : 1,
      }}
      onMouseEnter={(e) => { if (onClick) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.2)"; } }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {badge && (
        <span style={{ position: "absolute", top: 12, right: 12, background: "#fbbf24", color: "#78350f", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {badge}
        </span>
      )}
      <div style={{ fontSize: 40, opacity: 0.9 }}>{icon}</div>
      <Title level={4} style={{ color: "#fff", margin: 0 }}>{title}</Title>
      <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, maxWidth: 240, lineHeight: 1.5 }}>
        {description}
      </Text>
    </div>
  );

  const renderChoose = () => (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Choose Top-Up Method</Title>
        <Text type="secondary">Select how you would like to add funds to your wallet</Text>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {renderMethodCard(
          <BankOutlined />,
          "Bank Transfer",
          "View our bank details and submit a transfer request. Funds are added once confirmed.",
          "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
          undefined,
          () => setMethod("bank"),
        )}
        {renderMethodCard(
          <CreditCardOutlined />,
          "Card Payment",
          "Pay instantly with your credit or debit card. Funds are added immediately upon success.",
          "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
          "Coming Soon",
          () => setMethod("card"),
        )}
      </div>
    </div>
  );

  return (
    <Modal
      title={<Space><WalletOutlined /><span>Wallet Top-Up</span></Space>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={method === "choose" ? 600 : 520}
      destroyOnClose
      style={{ top: 80 }}
    >
      <Divider style={{ margin: "12px 0 20px" }} />
      {method === "choose" && renderChoose()}
      {method === "bank" && (
        <BankTransferMethod
          bankDetails={bankDetails}
          bankDetailsLoading={bankDetailsLoading}
          submitLoading={submitLoading}
          onSubmitRequest={onSubmitRequest}
          onBack={() => setMethod("choose")}
        />
      )}
      {method === "card" && (
        <CardPaymentMethod onBack={() => setMethod("choose")} />
      )}
    </Modal>
  );
}
