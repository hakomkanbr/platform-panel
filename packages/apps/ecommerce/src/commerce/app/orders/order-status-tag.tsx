"use client";

import React from "react";
import { Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CarOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { EnumOrderStatus } from "../../types/orders";

interface OrderStatusTagProps {
  status: EnumOrderStatus;
  style?: React.CSSProperties;
}

export function OrderStatusTag({ status, style }: OrderStatusTagProps) {
  const t = useTranslations();

  switch (status) {
    case EnumOrderStatus.AwaitingApproval:
      return (
        <Tag
          icon={<ClockCircleOutlined />}
          color="warning"
          style={{ borderRadius: 6, padding: "2px 8px", fontSize: 12, ...style }}
        >
          {t("orders.status.AwaitingApproval")}
        </Tag>
      );
    case EnumOrderStatus.AwaitingPayment:
      return (
        <Tag
          icon={<ClockCircleOutlined />}
          color="orange"
          style={{ borderRadius: 6, padding: "2px 8px", fontSize: 12, ...style }}
        >
          {t("orders.status.AwaitingPayment")}
        </Tag>
      );
    case EnumOrderStatus.PaymentPaid:
      return (
        <Tag
          icon={<CheckCircleOutlined />}
          color="cyan"
          style={{ borderRadius: 6, padding: "2px 8px", fontSize: 12, ...style }}
        >
          {t("orders.status.PaymentPaid")}
        </Tag>
      );
    case EnumOrderStatus.Processing:
      return (
        <Tag
          icon={<SyncOutlined spin />}
          color="processing"
          style={{ borderRadius: 6, padding: "2px 8px", fontSize: 12, ...style }}
        >
          {t("orders.status.Processing")}
        </Tag>
      );
    case EnumOrderStatus.InCargo:
      return (
        <Tag
          icon={<CarOutlined />}
          color="purple"
          style={{ borderRadius: 6, padding: "2px 8px", fontSize: 12, ...style }}
        >
          {t("orders.status.InCargo")}
        </Tag>
      );
    case EnumOrderStatus.Delivered:
      return (
        <Tag
          icon={<CheckCircleOutlined />}
          color="success"
          style={{ borderRadius: 6, padding: "2px 8px", fontSize: 12, ...style }}
        >
          {t("orders.status.Delivered")}
        </Tag>
      );
    case EnumOrderStatus.Cancelled:
      return (
        <Tag
          icon={<CloseCircleOutlined />}
          color="error"
          style={{ borderRadius: 6, padding: "2px 8px", fontSize: 12, ...style }}
        >
          {t("orders.status.Cancelled")}
        </Tag>
      );
    case EnumOrderStatus.PaymentFailed:
      return (
        <Tag
          icon={<ExclamationCircleOutlined />}
          color="magenta"
          style={{ borderRadius: 6, padding: "2px 8px", fontSize: 12, ...style }}
        >
          {t("orders.status.PaymentFailed")}
        </Tag>
      );
    case EnumOrderStatus.Refunded:
      return (
        <Tag
          icon={<RollbackOutlined />}
          color="default"
          style={{ borderRadius: 6, padding: "2px 8px", fontSize: 12, ...style }}
        >
          {t("orders.status.Refunded")}
        </Tag>
      );
    case EnumOrderStatus.RefundFailed:
      return (
        <Tag
          icon={<ExclamationCircleOutlined />}
          color="volcano"
          style={{ borderRadius: 6, padding: "2px 8px", fontSize: 12, ...style }}
        >
          {t("orders.status.RefundFailed")}
        </Tag>
      );
    default:
      return <Tag style={{ borderRadius: 6, ...style }}>{status}</Tag>;
  }
}
