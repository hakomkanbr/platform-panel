"use client";

import React, { useState } from "react";
import {
  Typography,
  Space,
  Tag,
  Button,
  Row,
  Col,
  Spin,
  Modal,
  Descriptions,
  Alert,
  List,
  message,
  Empty,
  Tabs,
  Statistic,
  InputNumber,
  Select,
  Input,
  Form,
  Popconfirm,
  Tooltip,
  Card,
  Table,
} from "antd";
import {
  CreditCardOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningOutlined,
  FileTextOutlined,
  DownloadOutlined,
  WalletOutlined,
  ReloadOutlined,
  StopOutlined,
  PlusOutlined,
  SwapOutlined,
  DollarOutlined,
  CalendarOutlined,
  KeyOutlined,
  HistoryOutlined,
  FilePdfOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  RocketOutlined,
  StarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  useCurrentSubscription,
  useAllPlans,
  useUpgradeSubscription,
  useDowngradeSubscription,
  useInvoices,
  useCreateSubscription,
  useProratedPrice,
  useApplyManualOverride,
  useRenewSubscription,
  useCancelSubscription,
  useCreditNotes,
} from "@/hooks/useBilling";
import { billingApi } from "@/lib/api/billing";
import {
  useWallet,
  useWalletTransactions,
  useCreateTopUpRequest,
  useMyTopUpRequests,
  useBankDetails,
} from "@/hooks/useWallet";
import { useTenantId } from "@/hooks/useTenantId";
import type {
  InvoiceDto,
  PlanDto,
  SubscriptionOverrideDto,
  CreditNoteDto,
  PlanChangeResult,
  UpgradeSubscriptionRequest,
  DowngradeSubscriptionRequest,
} from "@/types";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import AnimatedCard from "@/components/common/AnimatedCard";
import PageTransition from "@/components/common/PageTransition";
import { StatSkeleton } from "@/components/common/SkeletonLoader";
import WalletCardView from "@/components/wallet/WalletCard";
import WalletTransactionTable from "@/components/wallet/WalletTransactionTable";
import WalletTopUpModal from "@/components/wallet/WalletTopUpModal";
import TopUpRequestHistory from "@/components/wallet/TopUpRequestHistory";

const { Title, Text } = Typography;

const PLAN_ICONS: Record<string, React.ReactNode> = {
  starter: <StarOutlined />,
  pro: <RocketOutlined />,
  enterprise: <CrownOutlined />,
};

const PLAN_GRADIENTS: Record<string, string> = {
  starter: "var(--gradient-primary)",
  pro: "var(--gradient-purple)",
  enterprise: "var(--gradient-danger)",
};

export default function BillingPage() {
  const tenantId = useTenantId();
  const { data: subscription, isLoading: subLoading } = useCurrentSubscription(tenantId);
  const { data: plans = [], isLoading: plansLoading } = useAllPlans();
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices(tenantId);
  const { data: wallet, isLoading: walletLoading } = useWallet(tenantId);
  const { data: walletTransactions = [], isLoading: txLoading } = useWalletTransactions(tenantId);
  const { data: creditNotes = [], isLoading: creditNotesLoading } = useCreditNotes(tenantId);
  const upgradeMutation = useUpgradeSubscription();
  const downgradeMutation = useDowngradeSubscription();
  const createSubscriptionMutation = useCreateSubscription();
  const proratedPriceMutation = useProratedPrice();
  const applyOverrideMutation = useApplyManualOverride();
  const renewMutation = useRenewSubscription();
  const cancelSubMutation = useCancelSubscription();

  const [changePlanModalVisible, setChangePlanModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanDto | null>(null);
  const [changeType, setChangeType] = useState<"upgrade" | "downgrade" | "new" | null>(null);
  const [overrideModalVisible, setOverrideModalVisible] = useState(false);
  const [overrideType, setOverrideType] = useState<SubscriptionOverrideDto["overrideType"]>("capability_override");
  const [overrideForm] = Form.useForm();
  const [renewModalVisible, setRenewModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelImmediate, setCancelImmediate] = useState(false);
  const [invoiceDetailVisible, setInvoiceDetailVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDto | null>(null);
  const [customDiscount, setCustomDiscount] = useState<number>(0);
  const [waiveFee, setWaiveFee] = useState(false);
  const [proratedInfo, setProratedInfo] = useState<any>(null);
  const [proratedLoading, setProratedLoading] = useState(false);
  const createTopUpRequestMutation = useCreateTopUpRequest();
  const { data: topUpRequests = [], isLoading: topUpRequestsLoading } = useMyTopUpRequests();
  const { data: bankDetails, isLoading: bankDetailsLoading } = useBankDetails();
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);

  const isLoading = subLoading || plansLoading;
  const hasNoSubscription = subscription?.status === "none" || !subscription?.planId;

  if (isLoading) {
    return (
      <PageTransition>
        <div className="section-header">
          <Title level={3}>Billing & Subscription</Title>
          <Text type="secondary">Manage your subscription plan, billing history, and wallet</Text>
        </div>
        <StatSkeleton />
        <div style={{ height: 24 }} />
        <AnimatedCard>
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-tertiary)" }}>
            <Spin />
          </div>
        </AnimatedCard>
      </PageTransition>
    );
  }

  const currentPlan = plans.find((p) => p.id === subscription?.planId);

  const statusColorMap: Record<string, string> = {
    none: "default", trial: "orange", active: "green",
    past_due: "red", canceled: "default", cancelled: "default", expired: "red",
  };

  const invoiceStatusColorMap: Record<string, string> = {
    Paid: "green", Pending: "orange", Failed: "red",
    Cancelled: "default", Overdue: "red", Refunded: "blue", Credit: "purple",
  };

  const normalizeProratedInfo = (raw: any) => {
    const remaining = raw.remainingDays ?? 0;
    const total = raw.totalDays ?? 30;
    const dailyRateCurrent = raw.dailyRateCurrent ?? 0;
    const dailyRateTarget = raw.dailyRateTarget ?? 0;
    const currentPlanCredit = raw.currentPlanCredit ?? Math.round(dailyRateCurrent * remaining * 100) / 100;
    const newPlanCharge = raw.newPlanCharge ?? Math.round(dailyRateTarget * remaining * 100) / 100;
    const netAmount = raw.netAmount ?? Math.round((newPlanCharge - currentPlanCredit) * 100) / 100;
    return { ...raw, currentPlanCredit, newPlanCharge, netAmount };
  };

  const handlePlanSelect = async (plan: PlanDto) => {
    if (plan.id === subscription?.planId) return;
    const isNewSubscription = hasNoSubscription || plan.price === 0 || subscription?.status === "canceled";
    const isUpgrade = isNewSubscription ? false : plan.price > (currentPlan?.price || 0);
    setChangeType(isNewSubscription ? "new" : isUpgrade ? "upgrade" : "downgrade");
    setSelectedPlan(plan);
    setCustomDiscount(0);
    setWaiveFee(false);
    setProratedInfo(null);
    setChangePlanModalVisible(true);

    if (!isNewSubscription && tenantId) {
      setProratedLoading(true);
      try {
        const result = await proratedPriceMutation.mutateAsync({
          planId: plan.id,
          tenantId,
          action: isUpgrade ? "upgrade" : "downgrade",
        });
        setProratedInfo(normalizeProratedInfo(result));
      } catch {
        setProratedInfo(null);
      } finally {
        setProratedLoading(false);
      }
    }
  };

  const handleConfirmChange = async () => {
    if (!selectedPlan || !changeType || !tenantId) return;
    try {
      if (changeType === "new") {
        await createSubscriptionMutation.mutateAsync({ tenantId, planId: selectedPlan.id });
        message.success("Subscription created successfully!");
        setChangePlanModalVisible(false);
        setSelectedPlan(null);
        setChangeType(null);
        return;
      }

      const idempotencyKey = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

      const request: Record<string, unknown> = {
        planId: selectedPlan.id,
        tenantId,
        idempotencyKey,
      };
      if (customDiscount > 0) {
        request.customDiscount = customDiscount;
        request.discountReason = "Manual discount applied by admin";
      }
      if (waiveFee) request.waiveUpgradeFee = true;

      if (changeType === "downgrade") {
        request.refundToWallet = true;
        const net = proratedInfo?.netAmount ?? 0;
        const credit = proratedInfo?.currentPlanCredit ?? 0;
        const charge = proratedInfo?.newPlanCharge ?? 0;
        if (net < 0) request.customRefundAmount = Math.abs(net);
        request.refundReason = `Downgrade: ${currentPlan?.displayName ?? "N/A"} \u2192 ${selectedPlan.displayName} (credit $${credit.toFixed(2)} - charge $${charge.toFixed(2)} = net $${net.toFixed(2)})`;
      }

      const result: PlanChangeResult = await (changeType === "upgrade"
        ? upgradeMutation.mutateAsync(request as UpgradeSubscriptionRequest)
        : downgradeMutation.mutateAsync(request as DowngradeSubscriptionRequest));

      const net = proratedInfo?.netAmount ?? 0;
      if (net > 0) {
        message.success(`${changeType === "upgrade" ? "Upgrade" : "Downgrade"} to ${selectedPlan.displayName} completed! $${net.toFixed(2)} charged.`);
      } else if (net < 0) {
        message.success(`${changeType === "upgrade" ? "Upgrade" : "Downgrade"} to ${selectedPlan.displayName} completed! $${Math.abs(net).toFixed(2)} credited to wallet.`);
      } else {
        message.success(`${changeType === "upgrade" ? "Upgrade" : "Downgrade"} to ${selectedPlan.displayName} completed!`);
      }

      setChangePlanModalVisible(false);
      setSelectedPlan(null);
      setChangeType(null);
      setCustomDiscount(0);
      setWaiveFee(false);
      setProratedInfo(null);
    } catch (err) {
      message.error(`${changeType === "upgrade" ? "Upgrade" : changeType === "downgrade" ? "Downgrade" : "Subscription creation"} failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const handleApplyOverride = async (values: any) => {
    if (!subscription || !tenantId) return;
    try {
      await applyOverrideMutation.mutateAsync({
        tenantId,
        subscriptionId: subscription.id,
        overrideType: values.overrideType,
        capabilityCode: values.capabilityCode,
        overrideValue: values.overrideValue,
        reason: values.reason,
        newExpiryDate: values.newExpiryDate,
        discountPercent: values.discountPercent,
        discountAmount: values.discountAmount,
        expiresAt: values.expiresAt,
      });
      setOverrideModalVisible(false);
      overrideForm.resetFields();
    } catch {
      message.error("Failed to apply override");
    }
  };

  const handleRenew = async () => {
    if (!tenantId) return;
    try {
      await renewMutation.mutateAsync({ tenantId });
      setRenewModalVisible(false);
    } catch {
      message.error("Renewal failed");
    }
  };

  const handleCancelSubscription = async () => {
    if (!tenantId) return;
    try {
      await cancelSubMutation.mutateAsync({ tenantId, immediate: cancelImmediate });
      setCancelModalVisible(false);
    } catch {
      message.error("Cancellation failed");
    }
  };

  const handleTopUpSubmit = async (amount: number) => {
    await createTopUpRequestMutation.mutateAsync({ amount });
  };

  const handleDownloadInvoice = async (invoice: InvoiceDto) => {
    generateLocalInvoicePdf(invoice);
  };

  const generateLocalInvoicePdf = async (invoice: InvoiceDto) => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(24);
    doc.setTextColor(24, 144, 255);
    doc.text("INVOICE", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice #${invoice.id.slice(0, 12).toUpperCase()}`, pageWidth / 2, 28, { align: "center" });

    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.text(`Date: ${dayjs(invoice.createdAt).format("MMMM DD, YYYY")}`, 14, 40);
    doc.text(`Status: ${invoice.status}`, 14, 46);
    if (invoice.dueDate) doc.text(`Due Date: ${dayjs(invoice.dueDate).format("MMMM DD, YYYY")}`, 14, 52);
    if (invoice.paidAt) doc.text(`Paid On: ${dayjs(invoice.paidAt).format("MMMM DD, YYYY")}`, 14, 58);
    doc.text(`From: ${invoice.oldPlanName || "N/A"}`, 14, 68);
    doc.text(`To: ${invoice.newPlanName}`, 14, 74);

    const lineItems = invoice.lineItems && invoice.lineItems.length > 0
      ? invoice.lineItems
      : [{ description: `${invoice.newPlanName} - ${invoice.invoiceType.replace("_", " ")}`, quantity: 1, unitPrice: invoice.amount, totalPrice: invoice.amount, type: "full_charge" as const }];

    autoTable(doc, {
      startY: 84,
      head: [["Description", "Qty", "Unit Price", "Total"]],
      body: lineItems.map((item) => [item.description, item.quantity.toString(), `$${item.unitPrice.toFixed(2)}`, `$${item.totalPrice.toFixed(2)}`]),
      foot: [
        [{ content: "Subtotal", colSpan: 3, styles: { halign: "right", fontStyle: "bold" } }, { content: `$${invoice.amount.toFixed(2)}`, styles: { fontStyle: "bold" } }],
        [{ content: `Tax (${invoice.taxAmount > 0 ? ((invoice.taxAmount / invoice.amount) * 100).toFixed(1) : 0}%)`, colSpan: 3, styles: { halign: "right" } }, { content: `$${invoice.taxAmount.toFixed(2)}` }],
        ...((invoice.discountAmount > 0 ? [[{ content: "Discount", colSpan: 3, styles: { halign: "right", textColor: [82, 196, 26] } }, { content: `-$${invoice.discountAmount.toFixed(2)}`, styles: { textColor: [82, 196, 26] } }]] : []) as any),
        [{ content: "Total", colSpan: 3, styles: { halign: "right", fontStyle: "bold", fontSize: 11 } }, { content: `$${invoice.totalAmount.toFixed(2)}`, styles: { fontStyle: "bold", fontSize: 11 } }],
      ],
      theme: "striped",
      headStyles: { fillColor: [24, 144, 255] },
      footStyles: { fillColor: [245, 245, 245] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", pageWidth / 2, finalY + 20, { align: "center" });
    doc.text("This is a system-generated invoice.", pageWidth / 2, finalY + 26, { align: "center" });
    doc.save(`invoice-${invoice.id.slice(0, 8)}.pdf`);
  };

  const priceDiff = selectedPlan && currentPlan
    ? Math.abs(selectedPlan.price - currentPlan.price)
    : selectedPlan?.price || 0;

  const invoiceColumns: ColumnsType<InvoiceDto> = [
    { title: "Invoice", key: "id", width: 100, render: (_: any, record: InvoiceDto) => (<Text code style={{ fontSize: 12 }}>{record.id.slice(0, 8)}...</Text>) },
    { title: "Type", dataIndex: "invoiceType", key: "invoiceType", width: 100, render: (type: string) => {
      const labels: Record<string, string> = { subscription: "Subscription", upgrade: "Upgrade", downgrade: "Downgrade", renewal: "Renewal", credit_note: "Credit Note", manual: "Manual" };
      return <Tag style={{ borderRadius: 4 }}>{labels[type] || type}</Tag>;
    }},
    { title: "Description", key: "description", render: (_: any, record: InvoiceDto) => (<Text>{record.oldPlanName ? `${record.oldPlanName} \u2192 ` : ""}{record.newPlanName}</Text>) },
    { title: "Amount", dataIndex: "totalAmount", key: "totalAmount", render: (amount: number, record: InvoiceDto) => {
      const isCredit = record.invoiceType === "credit_note" || amount < 0;
      return <Text strong type={isCredit ? "success" : undefined}>{isCredit ? "-" : "+"}${Math.abs(amount).toFixed(2)} {record.currency}</Text>;
    }},
    { title: "Status", dataIndex: "status", key: "status", render: (status: string) => (<Tag color={invoiceStatusColorMap[status] || "default"} style={{ borderRadius: 4 }}>{status}</Tag>) },
    { title: "Date", dataIndex: "createdAt", key: "createdAt", render: (date: string) => dayjs(date).format("MMM DD, YYYY") },
    { title: "Actions", key: "actions", width: 120, render: (_: any, record: InvoiceDto) => (
      <Space size="small">
        <Tooltip title="View Details"><Button type="text" size="small" icon={<FileTextOutlined />} onClick={() => { setSelectedInvoice(record); setInvoiceDetailVisible(true); }} /></Tooltip>
        <Tooltip title="Download PDF"><Button type="text" size="small" icon={<DownloadOutlined />} onClick={() => handleDownloadInvoice(record)} /></Tooltip>
      </Space>
    )},
  ];

  const creditNoteColumns: ColumnsType<CreditNoteDto> = [
    { title: "ID", dataIndex: "id", key: "id", render: (id: string) => <Text code>{id.slice(0, 8)}...</Text> },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (amount: number) => <Text strong type="success">-${Math.abs(amount).toFixed(2)}</Text> },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Issued" ? "blue" : s === "Applied" ? "green" : "default"} style={{ borderRadius: 4 }}>{s}</Tag> },
    { title: "Date", dataIndex: "createdAt", key: "createdAt", render: (d: string) => dayjs(d).format("MMM DD, YYYY") },
  ];

  const tabItems = [
    {
      key: "invoices",
      label: (<Space><FileTextOutlined />Invoices</Space>),
      children: (
        <Table columns={invoiceColumns} dataSource={invoices} rowKey="id" loading={invoicesLoading}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}` }}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No invoices yet" /> }}
          scroll={{ x: 800 }} size="middle" />
      ),
    },
    {
      key: "wallet",
      label: (<Space><WalletOutlined />Wallet</Space>),
      children: (
        <div>
          <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={8}>
              <WalletCardView wallet={wallet} isLoading={walletLoading} onTopUp={() => setTopUpModalVisible(true)} />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <AnimatedCard><Statistic title="Total Transactions" value={walletTransactions.length} prefix={<HistoryOutlined />} /></AnimatedCard>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <AnimatedCard>
                <Statistic title="Active Credits" value={walletTransactions.filter((t) => t.type === "credit" && t.status === "completed").length}
                  prefix={<DollarOutlined />} valueStyle={{ color: "var(--success)" }} />
              </AnimatedCard>
            </Col>
          </Row>
          <WalletTransactionTable transactions={walletTransactions} isLoading={txLoading} />
          <div style={{ marginTop: 24 }}>
            <Title level={5}><HistoryOutlined /> Top-Up Request History</Title>
            <TopUpRequestHistory requests={topUpRequests} isLoading={topUpRequestsLoading} />
          </div>
          <WalletTopUpModal
            open={topUpModalVisible} onCancel={() => setTopUpModalVisible(false)}
            onSubmitRequest={handleTopUpSubmit}
            bankDetails={bankDetails} bankDetailsLoading={bankDetailsLoading}
            submitLoading={createTopUpRequestMutation.isPending} />
        </div>
      ),
    },
    {
      key: "credit-notes",
      label: (<Space><GiftOutlined />Credit Notes</Space>),
      children: (
        <Table columns={creditNoteColumns} dataSource={creditNotes} rowKey="id" loading={creditNotesLoading}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}` }}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No credit notes issued" /> }}
          scroll={{ x: 700 }} size="middle" />
      ),
    },
  ];

  const isExpiringSoon = !hasNoSubscription && subscription?.currentPeriodEnd &&
    dayjs(subscription.currentPeriodEnd).diff(dayjs(), "day") <= 7 && dayjs(subscription.currentPeriodEnd).isAfter(dayjs());

  const isExpired = !hasNoSubscription && subscription?.currentPeriodEnd &&
    dayjs(subscription.currentPeriodEnd).isBefore(dayjs());

  return (
    <PageTransition>
      <div className="section-header">
        <Title level={3}>Billing & Subscription</Title>
        <Text type="secondary">Manage your subscription plan, billing history, and wallet</Text>
      </div>

      {hasNoSubscription && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
          <Card style={{ borderRadius: 16, textAlign: "center", padding: "40px 24px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff" }}>
            <RocketOutlined style={{ fontSize: 56, marginBottom: 12, opacity: 0.9 }} />
            <Title level={2} style={{ color: "#fff", margin: "0 0 8px" }}>Get Started with a Plan</Title>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, display: "block", marginBottom: 4 }}>
              You don&apos;t have an active subscription yet.
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, display: "block" }}>
              Choose a plan below to unlock all features and start building.
            </Text>
          </Card>
        </motion.div>
      )}

      {isExpiringSoon && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
          <Alert type="warning" message="Subscription Expiring Soon"
            description={`Your subscription expires on ${dayjs(subscription.currentPeriodEnd).format("MMMM DD, YYYY")}. Renew now to avoid service interruption.`}
            showIcon closable
            action={<Button size="small" type="primary" onClick={() => setRenewModalVisible(true)}>Renew Now</Button>} />
        </motion.div>
      )}

      {isExpired && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
          <Alert type="error" message="Subscription Expired"
            description="Your subscription has expired. Renew your plan to restore access to all features."
            showIcon closable
            action={<Button size="small" type="primary" danger onClick={() => setRenewModalVisible(true)}>Renew Subscription</Button>} />
        </motion.div>
      )}

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <AnimatedCard data-tour="billing-current"
            title={<Space><CreditCardOutlined style={{ color: "var(--primary)" }} />Current Subscription</Space>}
            extra={subscription ? <Tag color={statusColorMap[subscription?.status] || "default"} style={{ borderRadius: 6, padding: "2px 12px" }}>{subscription?.status?.toUpperCase() || "UNKNOWN"}</Tag>
              : <Tag color="default" style={{ borderRadius: 6 }}>NO SUBSCRIPTION</Tag>}
          >
            {subscription ? (
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Plan"><Text strong>{currentPlan?.displayName || subscription?.planName || "N/A"}</Text></Descriptions.Item>
                <Descriptions.Item label="Price"><Text strong style={{ fontSize: 16, color: "var(--primary)" }}>${currentPlan?.price?.toFixed(2) || "0.00"}</Text><Text type="secondary"> /{currentPlan?.billingCycle || "month"}</Text></Descriptions.Item>
                <Descriptions.Item label="Status">{subscription?.status === "active" ? <Text type="success">Active</Text> : <Text type="warning">{subscription?.status}</Text>}</Descriptions.Item>
                <Descriptions.Item label="Period Start">{subscription?.startDate && dayjs(subscription.startDate).format("MMM DD, YYYY")}</Descriptions.Item>
                <Descriptions.Item label="Period End">{subscription?.currentPeriodEnd && dayjs(subscription.currentPeriodEnd).format("MMM DD, YYYY")}</Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Space direction="vertical" align="center"><Text type="secondary">No active subscription</Text><Text type="secondary" style={{ fontSize: 12 }}>Select a plan below to get started</Text></Space>} />
            )}

            {subscription && subscription.status === "active" && (
              <div style={{ marginTop: 16 }}>
                <Space wrap>
                  <Popconfirm title="Cancel Subscription" description="Are you sure you want to cancel? You can choose immediate or end-of-period cancellation."
                    onConfirm={() => setCancelModalVisible(true)}>
                    <Button danger icon={<StopOutlined />}>Cancel</Button>
                  </Popconfirm>
                </Space>
              </div>
            )}

            {subscription?.overrides && subscription.overrides.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ borderTop: "1px solid var(--border-light)", margin: "12px 0", height: 0 }} />
                <Text strong style={{ fontSize: 13 }}><KeyOutlined style={{ marginRight: 4 }} />Active Overrides ({subscription.overrides.length})</Text>
                <List size="small" dataSource={subscription.overrides}
                  renderItem={(ovr) => (
                    <List.Item style={{ padding: "4px 0" }}>
                      <Space>
                        <Tag color="purple" style={{ borderRadius: 4 }}>{ovr.overrideType.replace("_", " ")}</Tag>
                        <Text style={{ fontSize: 12 }}>{ovr.capabilityCode}: {ovr.overrideValue}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{ovr.reason}</Text>
                        {ovr.expiresAt && <Text type="secondary" style={{ fontSize: 11 }}>Expires: {dayjs(ovr.expiresAt).format("MMM DD, YYYY")}</Text>}
                      </Space>
                    </List.Item>
                  )} />
              </div>
            )}
          </AnimatedCard>
        </Col>

        <Col xs={24} lg={12}>
          <AnimatedCard title={<Space><CheckCircleOutlined style={{ color: "var(--success)" }} />Plan Features</Space>} index={1}>
            {currentPlan?.features?.length ? (
              <List dataSource={currentPlan.features}
                renderItem={(feature) => (
                  <List.Item key={feature.capabilityCode} style={{ padding: "8px 0" }}>
                    <Space>
                      <CheckCircleOutlined style={{ color: "var(--success)" }} />
                      <Text>{feature.capabilityName || feature.capabilityCode}: {feature.value}{feature.unit ? ` ${feature.unit}` : ""}</Text>
                    </Space>
                  </List.Item>
                )} />
            ) : (
              <Empty description={subscription ? "No feature details available" : "Subscribe to a plan to see features"} />
            )}

            {wallet && (
              <>
                <div style={{ borderTop: "1px solid var(--border-light)", margin: "16px 0", height: 0 }} />
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  style={{ padding: 16, background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                  <Space>
                    <WalletOutlined style={{ fontSize: 22, color: "#fff" }} />
                    <div>
                      <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>Wallet Balance</Text>
                      <div style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
                        ${wallet.balance.toFixed(2)} <span style={{ fontSize: 13, fontWeight: "normal" }}>{wallet.currency}</span>
                      </div>
                    </div>
                  </Space>
                </motion.div>
              </>
            )}
          </AnimatedCard>
        </Col>
      </Row>

      <AnimatedCard data-tour="billing-plans"
        title={<Space><ThunderboltOutlined style={{ color: "var(--primary)" }} />Available Plans</Space>}
        style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === subscription?.planId;
            const isNewSubscription = hasNoSubscription;
            const isUpgrade = !isCurrentPlan && !isNewSubscription && plan.price > (currentPlan?.price || 0);
            const isFreePlan = plan.price === 0;
            const actionLabel = isNewSubscription || isFreePlan ? "Subscribe" : isUpgrade ? "Upgrade" : "Downgrade";
            const actionIcon = isNewSubscription || isFreePlan ? <CheckCircleOutlined /> : isUpgrade ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
            const planKey = plan.name?.toLowerCase() || "default";
            const gradient = PLAN_GRADIENTS[planKey] || "var(--gradient-primary)";

            return (
              <Col xs={24} sm={8} key={plan.id}>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: plans.indexOf(plan) * 0.04 }}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }} style={{ height: "100%" }}>
                  <div style={{ borderRadius: 16, border: isCurrentPlan ? "2px solid var(--primary)" : "1px solid var(--border)", height: "100%", position: "relative", overflow: "hidden", background: "var(--bg-card)" }}>
                    {isCurrentPlan && <div style={{ position: "absolute", top: 12, right: 12 }}><Tag color="blue" style={{ borderRadius: 4, fontSize: 10 }}>CURRENT</Tag></div>}
                    <div style={{ padding: "24px 20px 16px" }}>
                      <div style={{ textAlign: "center", marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, margin: "0 auto 12px" }}>
                          {PLAN_ICONS[planKey] || <StarOutlined />}
                        </div>
                        <Title level={4} style={{ margin: 0 }}>{plan.displayName || plan.name}</Title>
                        <div style={{ margin: "12px 0" }}>
                          <span className="gradient-text" style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em" }}>${plan.price}</span>
                          <Text type="secondary" style={{ fontSize: 14 }}>/{plan.billingCycle}</Text>
                        </div>
                      </div>
                      <List dataSource={plan.features || []}
                        renderItem={(feature) => (
                          <List.Item key={feature.capabilityCode} style={{ padding: "5px 0", border: "none" }}>
                            <Space><CheckCircleOutlined style={{ color: "var(--success)", fontSize: 13 }} /><Text style={{ fontSize: 13 }}>{feature.capabilityName || feature.capabilityCode}: {feature.value}{feature.unit ? ` ${feature.unit}` : ""}</Text></Space>
                          </List.Item>
                        )} />
                    </div>
                    <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border-light)", textAlign: "center" }}>
                      {isCurrentPlan ? (
                        <Button disabled style={{ borderRadius: 8, width: "100%" }}>Current Plan</Button>
                      ) : (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="primary" icon={actionIcon} onClick={() => handlePlanSelect(plan)}
                            style={{ borderRadius: 8, paddingInline: 24, height: 36, width: "100%" }}>
                            {actionLabel}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Col>
            );
          })}
        </Row>
      </AnimatedCard>

      <AnimatedCard title={<Space><HistoryOutlined />Billing History & Wallet</Space>}>
        <Tabs items={tabItems} />
      </AnimatedCard>

      <Modal title={<Space>{changeType === "upgrade" ? <ArrowUpOutlined style={{ color: "var(--success)" }} /> : changeType === "downgrade" ? <ArrowDownOutlined style={{ color: "var(--warning)" }} /> : <CheckCircleOutlined style={{ color: "var(--primary)" }} />}{changeType === "upgrade" ? "Upgrade" : changeType === "downgrade" ? "Downgrade" : "New Subscription"} Plan</Space>}
        open={changePlanModalVisible}
        onCancel={() => { setChangePlanModalVisible(false); setSelectedPlan(null); setChangeType(null); }}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => { setChangePlanModalVisible(false); setSelectedPlan(null); setChangeType(null); }}>Cancel</Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmChange}
            loading={upgradeMutation.isPending || downgradeMutation.isPending || createSubscriptionMutation.isPending}>
            {changeType === "new" ? "Subscribe" : `Confirm ${changeType === "upgrade" ? "Upgrade" : "Downgrade"}`}
          </Button>,
        ]}>
        <div>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Current Plan"><Text strong>{currentPlan?.displayName || "No active subscription"}</Text></Descriptions.Item>
            {currentPlan && <Descriptions.Item label="Current Price">${currentPlan?.price?.toFixed(2) || "0.00"}/{currentPlan?.billingCycle || "month"}</Descriptions.Item>}
            <Descriptions.Item label="New Plan"><Text strong>{selectedPlan?.displayName || "N/A"}</Text></Descriptions.Item>
            <Descriptions.Item label="New Price">${selectedPlan?.price?.toFixed(2) || "0.00"}/{selectedPlan?.billingCycle || "month"}</Descriptions.Item>
          </Descriptions>

          {proratedInfo && changeType !== "new" && (() => {
            const credit = proratedInfo.currentPlanCredit ?? 0;
            const charge = proratedInfo.newPlanCharge ?? 0;
            const net = proratedInfo.netAmount ?? 0;
            const remaining = proratedInfo.remainingDays ?? 0;
            const total = proratedInfo.totalDays ?? 0;
            const isNetPositive = net > 0;
            const isNetNegative = net < 0;
            return (
              <div style={{ padding: 16, marginTop: 16, background: "var(--bg-page)", borderRadius: 12 }}>
                <Text strong style={{ fontSize: 13 }}><SwapOutlined style={{ marginRight: 4 }} />Billing Breakdown</Text>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", margin: "4px 0 12px" }}>{remaining} of {total} days remaining in billing cycle</div>
                <div style={{ padding: 12, background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border-light)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <Text>Current plan credit ({remaining} unused days)</Text>
                    <Text type="success" strong>+${credit.toFixed(2)}</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <Text>New plan charge ({remaining} remaining days)</Text>
                    <Text type="danger" strong>-${charge.toFixed(2)}</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--border-light)", marginTop: 4 }}>
                    <Text strong>Net {isNetPositive ? "due" : isNetNegative ? "credit" : "due"}</Text>
                    <Text strong style={{ color: isNetPositive ? "var(--error)" : isNetNegative ? "var(--success)" : "var(--text-secondary)", fontSize: 16 }}>
                      {net === 0 ? "$0.00" : `${isNetPositive ? "-" : "+"}$${Math.abs(net).toFixed(2)}`}
                    </Text>
                  </div>
                </div>
                <Alert type={net === 0 ? "info" : isNetPositive ? "info" : "success"}
                  message={net === 0 ? "No additional payment is required." : isNetPositive ? `$${net.toFixed(2)} will be charged immediately and your plan will be updated.` : `$${Math.abs(net).toFixed(2)} will be credited to your wallet and your plan will be updated.`}
                  style={{ marginTop: 12, borderRadius: 8 }} showIcon />
              </div>
            );
          })()}

          {proratedLoading && (
            <div style={{ textAlign: "center", padding: 16 }}><Spin size="small" /><Text type="secondary" style={{ marginLeft: 8 }}>Calculating prorated price...</Text></div>
          )}

          {!proratedInfo && changeType !== "new" && !proratedLoading && (
            <Alert type="info" message="You are about to change your subscription plan." style={{ marginTop: 16, borderRadius: 8 }} showIcon />
          )}
        </div>
      </Modal>

      <Modal title={<Space><PlusOutlined />Subscription Override</Space>} open={overrideModalVisible}
        onCancel={() => { setOverrideModalVisible(false); overrideForm.resetFields(); }}
        onOk={() => overrideForm.submit()} confirmLoading={applyOverrideMutation.isPending} width={500}>
        <Form form={overrideForm} layout="vertical" onFinish={handleApplyOverride} initialValues={{ overrideType: "capability_override" }}>
          <Form.Item name="overrideType" label="Override Type" rules={[{ required: true }]}>
            <Select onChange={(v) => setOverrideType(v)}>
              <Select.Option value="capability_override">Capability Override</Select.Option>
              <Select.Option value="date_extension">Date Extension</Select.Option>
              <Select.Option value="custom_discount">Custom Discount</Select.Option>
              <Select.Option value="fee_waiver">Fee Waiver</Select.Option>
            </Select>
          </Form.Item>
          {overrideType === "capability_override" && (
            <>
              <Form.Item name="capabilityCode" label="Capability Code" rules={[{ required: true, message: "Enter capability code (e.g. STORAGE_GB, MAX_API_CALLS)" }]}>
                <Input placeholder="e.g. STORAGE_GB" />
              </Form.Item>
              <Form.Item name="overrideValue" label="Override Value" rules={[{ required: true, message: "Enter the new limit value" }]}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}
          {overrideType === "date_extension" && (
            <Form.Item name="newExpiryDate" label="New Expiry Date" rules={[{ required: true, message: "Select the new expiry date" }]}>
              <Select>
                <Select.Option value={dayjs().add(7, "day").toISOString()}>+7 days</Select.Option>
                <Select.Option value={dayjs().add(14, "day").toISOString()}>+14 days</Select.Option>
                <Select.Option value={dayjs().add(30, "day").toISOString()}>+30 days (1 month)</Select.Option>
                <Select.Option value={dayjs().add(60, "day").toISOString()}>+60 days (2 months)</Select.Option>
                <Select.Option value={dayjs().add(90, "day").toISOString()}>+90 days (3 months)</Select.Option>
                <Select.Option value={dayjs().add(180, "day").toISOString()}>+180 days (6 months)</Select.Option>
                <Select.Option value={dayjs().add(365, "day").toISOString()}>+365 days (1 year)</Select.Option>
              </Select>
            </Form.Item>
          )}
          {overrideType === "custom_discount" && (
            <>
              <Form.Item name="discountPercent" label="Discount Percentage"><InputNumber min={0} max={100} style={{ width: "100%" }} /></Form.Item>
              <Form.Item name="discountAmount" label="Fixed Discount Amount ($)"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
            </>
          )}
          {overrideType === "fee_waiver" && (
            <Alert type="info" message="Fee Waiver" description="This will waive any applicable fees for the current billing period." showIcon style={{ marginBottom: 16 }} />
          )}
          <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "Provide a reason for this override" }]}>
            <Input.TextArea rows={2} placeholder="Why is this override being applied?" />
          </Form.Item>
          <Form.Item name="expiresAt" label="Override Expiry (Optional)">
            <Select allowClear placeholder="Select expiry" onChange={(v) => overrideForm.setFieldsValue({ expiresAt: v })}>
              <Select.Option value={dayjs().add(7, "day").toISOString()}>7 days</Select.Option>
              <Select.Option value={dayjs().add(30, "day").toISOString()}>30 days</Select.Option>
              <Select.Option value={dayjs().add(90, "day").toISOString()}>90 days</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Renew Subscription" open={renewModalVisible} onCancel={() => setRenewModalVisible(false)}
        onOk={handleRenew} confirmLoading={renewMutation.isPending}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Alert type="info" message="Subscription Renewal"
            description={subscription ? `Your current period ends on ${dayjs(subscription.currentPeriodEnd).format("MMMM DD, YYYY")}. Renewing will extend your subscription for another billing cycle.` : "Your subscription has expired. Renew to restore access."}
            showIcon />
          {currentPlan && (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Plan">{currentPlan.displayName}</Descriptions.Item>
              <Descriptions.Item label="Price">${currentPlan.price.toFixed(2)} / {currentPlan.billingCycle}</Descriptions.Item>
            </Descriptions>
          )}
        </Space>
      </Modal>

      <Modal title="Cancel Subscription" open={cancelModalVisible} onCancel={() => setCancelModalVisible(false)}
        onOk={handleCancelSubscription} confirmLoading={cancelSubMutation.isPending}
        okButtonProps={{ danger: true }} okText="Confirm Cancellation">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Alert type="warning" message="Cancel Subscription" description="Cancelling will affect your tenant's access to plan features." showIcon />
          <div style={{ padding: "12px 0" }}>
            <Text strong>Cancellation Type:</Text>
            <div style={{ marginTop: 8 }}>
              <Select value={cancelImmediate ? "immediate" : "end_of_period"}
                onChange={(v) => setCancelImmediate(v === "immediate")} style={{ width: "100%" }}>
                <Select.Option value="end_of_period">End of Current Period - Access until {subscription ? dayjs(subscription.currentPeriodEnd).format("MMM DD, YYYY") : "period end"}</Select.Option>
                <Select.Option value="immediate">Immediate - Access revoked now</Select.Option>
              </Select>
            </div>
          </div>
          {cancelImmediate && <Alert type="error" message="Immediate cancellation will revoke access right away." showIcon />}
          {subscription?.overrides && subscription.overrides.length > 0 && (
            <Alert type="info" message={`${subscription.overrides.length} active override(s) will also be removed.`} showIcon />
          )}
        </Space>
      </Modal>

      <Modal title={<Space><FileTextOutlined />Invoice Details</Space>}
        open={invoiceDetailVisible} onCancel={() => { setInvoiceDetailVisible(false); setSelectedInvoice(null); }}
        width={600}
        footer={selectedInvoice ? [<Button key="download" type="primary" icon={<FilePdfOutlined />} onClick={() => handleDownloadInvoice(selectedInvoice)}>Download PDF</Button>] : []}>
        {selectedInvoice && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Invoice ID" span={2}><Text code>{selectedInvoice.id}</Text></Descriptions.Item>
            <Descriptions.Item label="Type"><Tag>{selectedInvoice.invoiceType}</Tag></Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={invoiceStatusColorMap[selectedInvoice.status] || "default"}>{selectedInvoice.status}</Tag></Descriptions.Item>
            <Descriptions.Item label="From Plan">{selectedInvoice.oldPlanName || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="To Plan">{selectedInvoice.newPlanName}</Descriptions.Item>
            <Descriptions.Item label="Subtotal">${selectedInvoice.amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Tax">${selectedInvoice.taxAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Discount">${selectedInvoice.discountAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Total" span={2}><Text strong style={{ fontSize: 16, color: "var(--primary)" }}>${selectedInvoice.totalAmount.toFixed(2)} {selectedInvoice.currency}</Text></Descriptions.Item>
            <Descriptions.Item label="Created">{dayjs(selectedInvoice.createdAt).format("MMM DD, YYYY HH:mm")}</Descriptions.Item>
            <Descriptions.Item label="Paid At">{selectedInvoice.paidAt ? dayjs(selectedInvoice.paidAt).format("MMM DD, YYYY HH:mm") : "-"}</Descriptions.Item>
            {selectedInvoice.description && <Descriptions.Item label="Description" span={2}>{selectedInvoice.description}</Descriptions.Item>}
          </Descriptions>
        )}
      </Modal>
    </PageTransition>
  );
}
