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
} from "@repo/hooks";
import { billingApi } from "@repo/api-client";
import {
  useWallet,
  useWalletTransactions,
  useCreateTopUpRequest,
  useMyTopUpRequests,
  useBankDetails,
} from "@repo/hooks";
import { useTenantId } from "@repo/hooks";
import type {
  InvoiceDto,
  PlanDto,
  SubscriptionOverrideDto,
  CreditNoteDto,
  PlanChangeResult,
  UpgradeSubscriptionRequest,
  DowngradeSubscriptionRequest,
} from "@repo/shared-types";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { AnimatedCard, PageTransition, StatSkeleton } from "@repo/ui";
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

const STATUS_LABELS: Record<string, string> = {
  none: "بدون اشتراك",
  trial: "تجريبي",
  active: "نشط",
  past_due: "متأخر الدفع",
  canceled: "ملغي",
  cancelled: "ملغي",
  expired: "منتهي الصلاحية",
};

const INVOICE_TYPE_LABELS: Record<string, string> = {
  subscription: "اشتراك",
  upgrade: "ترقية خطة",
  downgrade: "تخفيض خطة",
  renewal: "تجديد اشتراك",
  credit_note: "إشعار دائن",
  manual: "يدوي",
};

const INVOICE_STATUS_LABELS: Record<string, string> = {
  Paid: "مدفوعة",
  Pending: "معلقة",
  Failed: "فشلت",
  Cancelled: "ملغاة",
  Overdue: "متأخرة",
  Refunded: "مسترجعة",
  Credit: "رصيد دائن",
};

const BILLING_CYCLE_LABELS: Record<string, string> = {
  month: "شهرياً",
  monthly: "شهرياً",
  year: "سنوياً",
  yearly: "سنوياً",
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
          <Title level={3}>الفواتير والاشتراكات</Title>
          <Text type="secondary">إدارة خطة اشتراكك، وسجل الفواتير، والمحفظة المالية</Text>
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
        message.success("تم الاشتراك بنجاح!");
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
        request.discountReason = "خصم يدوي مطبق من قبل المسؤول";
      }
      if (waiveFee) request.waiveUpgradeFee = true;

      if (changeType === "downgrade") {
        request.refundToWallet = true;
        const net = proratedInfo?.netAmount ?? 0;
        const credit = proratedInfo?.currentPlanCredit ?? 0;
        const charge = proratedInfo?.newPlanCharge ?? 0;
        if (net < 0) request.customRefundAmount = Math.abs(net);
        request.refundReason = `تخفيض الخطة: ${currentPlan?.displayName ?? "غير محدد"} \u2192 ${selectedPlan.displayName} (رصيد $${credit.toFixed(2)} - تكلفة $${charge.toFixed(2)} = صافي $${net.toFixed(2)})`;
      }

      const result: PlanChangeResult = await (changeType === "upgrade"
        ? upgradeMutation.mutateAsync(request as unknown as UpgradeSubscriptionRequest)
        : downgradeMutation.mutateAsync(request as unknown as DowngradeSubscriptionRequest));

      const net = proratedInfo?.netAmount ?? 0;
      if (net > 0) {
        message.success(`تمت ${changeType === "upgrade" ? "ترقية الخطة" : "تخفيض الخطة"} إلى "${selectedPlan.displayName}" بنجاح! تم خصم $${net.toFixed(2)}.`);
      } else if (net < 0) {
        message.success(`تمت ${changeType === "upgrade" ? "ترقية الخطة" : "تخفيض الخطة"} إلى "${selectedPlan.displayName}" بنجاح! تم إضافة $${Math.abs(net).toFixed(2)} إلى رصيد المحفظة.`);
      } else {
        message.success(`تمت ${changeType === "upgrade" ? "الترقية" : "التخفيض"} إلى "${selectedPlan.displayName}" بنجاح!`);
      }

      setChangePlanModalVisible(false);
      setSelectedPlan(null);
      setChangeType(null);
      setCustomDiscount(0);
      setWaiveFee(false);
      setProratedInfo(null);
    } catch (err) {
      message.error(`فشلت عملية ${changeType === "upgrade" ? "الترقية" : changeType === "downgrade" ? "التخفيض" : "إنشاء الاشتراك"}: ${err instanceof Error ? err.message : "حدث خطأ غير معروف"}`);
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
      message.success("تم تطبيق التخصيص بنجاح");
    } catch {
      message.error("فشل تطبيق التخصيص");
    }
  };

  const handleRenew = async () => {
    if (!tenantId) return;
    try {
      await renewMutation.mutateAsync({ tenantId });
      setRenewModalVisible(false);
      message.success("تم تجديد الاشتراك بنجاح");
    } catch {
      message.error("فشل تجديد الاشتراك");
    }
  };

  const handleCancelSubscription = async () => {
    if (!tenantId) return;
    try {
      await cancelSubMutation.mutateAsync({ tenantId, immediate: cancelImmediate });
      setCancelModalVisible(false);
      message.success("تم إلغاء الاشتراك بنجاح");
    } catch {
      message.error("فشل إلغاء الاشتراك");
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

  const invoiceColumns: ColumnsType<InvoiceDto> = [
    { title: "رقم الفاتورة", key: "id", width: 120, render: (_: any, record: InvoiceDto) => (<Text code style={{ fontSize: 12 }}>{record.id.slice(0, 8)}...</Text>) },
    { title: "النوع", dataIndex: "invoiceType", key: "invoiceType", width: 120, render: (type: string) => {
      return <Tag style={{ borderRadius: 4 }}>{INVOICE_TYPE_LABELS[type] || type}</Tag>;
    }},
    { title: "الوصف", key: "description", render: (_: any, record: InvoiceDto) => (<Text>{record.oldPlanName ? `${record.oldPlanName} \u2192 ` : ""}{record.newPlanName}</Text>) },
    { title: "المبلغ", dataIndex: "totalAmount", key: "totalAmount", render: (amount: number, record: InvoiceDto) => {
      const isCredit = record.invoiceType === "credit_note" || amount < 0;
      return <Text strong type={isCredit ? "success" : undefined}>{isCredit ? "-" : "+"}${Math.abs(amount).toFixed(2)} {record.currency}</Text>;
    }},
    { title: "الحالة", dataIndex: "status", key: "status", render: (status: string) => (<Tag color={invoiceStatusColorMap[status] || "default"} style={{ borderRadius: 4 }}>{INVOICE_STATUS_LABELS[status] || status}</Tag>) },
    { title: "التاريخ", dataIndex: "createdAt", key: "createdAt", render: (date: string) => dayjs(date).format("YYYY/MM/DD") },
    { title: "الإجراءات", key: "actions", width: 120, render: (_: any, record: InvoiceDto) => (
      <Space size="small">
        <Tooltip title="عرض التفاصيل"><Button type="text" size="small" icon={<FileTextOutlined />} onClick={() => { setSelectedInvoice(record); setInvoiceDetailVisible(true); }} /></Tooltip>
        <Tooltip title="تحميل ملف PDF"><Button type="text" size="small" icon={<DownloadOutlined />} onClick={() => handleDownloadInvoice(record)} /></Tooltip>
      </Space>
    )},
  ];

  const creditNoteColumns: ColumnsType<CreditNoteDto> = [
    { title: "المعرف", dataIndex: "id", key: "id", render: (id: string) => <Text code>{id.slice(0, 8)}...</Text> },
    { title: "المبلغ", dataIndex: "amount", key: "amount", render: (amount: number) => <Text strong type="success">-${Math.abs(amount).toFixed(2)}</Text> },
    { title: "السبب", dataIndex: "reason", key: "reason" },
    { title: "الحالة", dataIndex: "status", key: "status", render: (s: string) => (
      <Tag color={s === "Issued" ? "blue" : s === "Applied" ? "green" : "default"} style={{ borderRadius: 4 }}>
        {s === "Issued" ? "تم الإصدار" : s === "Applied" ? "تم التطبيق" : s}
      </Tag>
    ) },
    { title: "التاريخ", dataIndex: "createdAt", key: "createdAt", render: (d: string) => dayjs(d).format("YYYY/MM/DD") },
  ];

  const tabItems = [
    {
      key: "invoices",
      label: (<Space><FileTextOutlined />الفواتير</Space>),
      children: (
        <Table columns={invoiceColumns} dataSource={invoices} rowKey="id" loading={invoicesLoading}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} من أصل ${total}` }}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="لا توجد فواتير حتى الآن" /> }}
          scroll={{ x: 800 }} size="middle" />
      ),
    },
    {
      key: "wallet",
      label: (<Space><WalletOutlined />المحفظة</Space>),
      children: (
        <div>
          <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={8}>
              <WalletCardView wallet={wallet} isLoading={walletLoading} onTopUp={() => setTopUpModalVisible(true)} />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <AnimatedCard><Statistic title="إجمالي المعاملات" value={walletTransactions.length} prefix={<HistoryOutlined />} /></AnimatedCard>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <AnimatedCard>
                <Statistic title="الأرصدة المضافة النشطة" value={walletTransactions.filter((t) => t.type === "credit" && t.status === "completed").length}
                  prefix={<DollarOutlined />} valueStyle={{ color: "var(--success)" }} />
              </AnimatedCard>
            </Col>
          </Row>
          <WalletTransactionTable transactions={walletTransactions} isLoading={txLoading} />
          <div style={{ marginTop: 24 }}>
            <Title level={5}><HistoryOutlined /> سجل طلبات شحن الرصيد</Title>
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
      label: (<Space><GiftOutlined />إشعارات الدائن</Space>),
      children: (
        <Table columns={creditNoteColumns} dataSource={creditNotes} rowKey="id" loading={creditNotesLoading}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} من أصل ${total}` }}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="لا توجد إشعارات دائن صادرة" /> }}
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
        <Title level={3}>الفواتير والاشتراكات</Title>
        <Text type="secondary">إدارة خطة اشتراكك، وسجل الفواتير، والمحفظة المالية</Text>
      </div>

      {hasNoSubscription && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
          <Card style={{ borderRadius: 16, textAlign: "center", padding: "40px 24px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff" }}>
            <RocketOutlined style={{ fontSize: 56, marginBottom: 12, opacity: 0.9 }} />
            <Title level={2} style={{ color: "#fff", margin: "0 0 8px" }}>ابدأ باختيار خطة اشتراك</Title>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, display: "block", marginBottom: 4 }}>
              ليس لديك اشتراك نشط حالياً.
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, display: "block" }}>
              اختر خطة مناسبة من الخيارات أدناه لفتح جميع الميزات والبدء في بناء مشاريعك.
            </Text>
          </Card>
        </motion.div>
      )}

      {isExpiringSoon && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
          <Alert type="warning" message="الاشتراك ينتهي قريباً"
            description={`ينتهي اشتراكك في ${dayjs(subscription.currentPeriodEnd).format("YYYY/MM/DD")}. يرجى التجديد الآن لتجنب انقطاع الخدمة.`}
            showIcon closable
            action={<Button size="small" type="primary" onClick={() => setRenewModalVisible(true)}>تجديد الآن</Button>} />
        </motion.div>
      )}

      {isExpired && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
          <Alert type="error" message="انتهت صلاحية الاشتراك"
            description="لقد انتهت صلاحية اشتراكك. يرجى تجديد الخطة لاستعادة الوصول إلى كافة الميزات."
            showIcon closable
            action={<Button size="small" type="primary" danger onClick={() => setRenewModalVisible(true)}>تجديد الاشتراك</Button>} />
        </motion.div>
      )}

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <AnimatedCard data-tour="billing-current"
            title={<Space><CreditCardOutlined style={{ color: "var(--primary)" }} />الاشتراك الحالي</Space>}
            extra={subscription ? <Tag color={statusColorMap[subscription?.status] || "default"} style={{ borderRadius: 6, padding: "2px 12px" }}>{STATUS_LABELS[subscription?.status] || subscription?.status?.toUpperCase() || "غير معروف"}</Tag>
              : <Tag color="default" style={{ borderRadius: 6 }}>لا يوجد اشتراك</Tag>}
          >
            {subscription ? (
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="الخطة"><Text strong>{currentPlan?.displayName || subscription?.planName || "غير محدد"}</Text></Descriptions.Item>
                <Descriptions.Item label="السعر">
                  <Text strong style={{ fontSize: 16, color: "var(--primary)" }}>${currentPlan?.price?.toFixed(2) || "0.00"}</Text>
                  <Text type="secondary"> /{BILLING_CYCLE_LABELS[currentPlan?.billingCycle || "month"] || currentPlan?.billingCycle || "شهرياً"}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="الحالة">{subscription?.status === "active" ? <Text type="success">نشط</Text> : <Text type="warning">{STATUS_LABELS[subscription?.status] || subscription?.status}</Text>}</Descriptions.Item>
                <Descriptions.Item label="بداية الفترة">{subscription?.startDate && dayjs(subscription.startDate).format("YYYY/MM/DD")}</Descriptions.Item>
                <Descriptions.Item label="نهاية الفترة">{subscription?.currentPeriodEnd && dayjs(subscription.currentPeriodEnd).format("YYYY/MM/DD")}</Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Space direction="vertical" align="center"><Text type="secondary">لا يوجد اشتراك نشط</Text><Text type="secondary" style={{ fontSize: 12 }}>اختر خطة أدناه للبدء</Text></Space>} />
            )}

            {subscription && subscription.status === "active" && (
              <div style={{ marginTop: 16 }}>
                <Space wrap>
                  <Popconfirm title="إلغاء الاشتراك" description="هل أنت متأكد من رغبتك في إلغاء الاشتراك؟ يمكنك الاختيار بين الإلغاء الفوري أو مع نهاية الفترة الحالية."
                    okText="نعم، متابعة" cancelText="تراجع"
                    onConfirm={() => setCancelModalVisible(true)}>
                    <Button danger icon={<StopOutlined />}>إلغاء الاشتراك</Button>
                  </Popconfirm>
                </Space>
              </div>
            )}

            {subscription?.overrides && subscription.overrides.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ borderTop: "1px solid var(--border-light)", margin: "12px 0", height: 0 }} />
                <Text strong style={{ fontSize: 13 }}><KeyOutlined style={{ marginRight: 4 }} />الاستثناءات والتخصيصات النشطة ({subscription.overrides.length})</Text>
                <List size="small" dataSource={subscription.overrides}
                  renderItem={(ovr) => (
                    <List.Item style={{ padding: "4px 0" }}>
                      <Space>
                        <Tag color="purple" style={{ borderRadius: 4 }}>{ovr.overrideType.replace("_", " ")}</Tag>
                        <Text style={{ fontSize: 12 }}>{ovr.capabilityCode}: {ovr.overrideValue}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{ovr.reason}</Text>
                        {ovr.expiresAt && <Text type="secondary" style={{ fontSize: 11 }}>ينتهي في: {dayjs(ovr.expiresAt).format("YYYY/MM/DD")}</Text>}
                      </Space>
                    </List.Item>
                  )} />
              </div>
            )}
          </AnimatedCard>
        </Col>

        <Col xs={24} lg={12}>
          <AnimatedCard title={<Space><CheckCircleOutlined style={{ color: "var(--success)" }} />مميزات الخطة</Space>} index={1}>
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
              <Empty description={subscription ? "لا توجد تفاصيل للميزات متاحة" : "اشترك في إحدى الخطط لعرض الميزات المتاحة"} />
            )}

            {wallet && (
              <>
                <div style={{ borderTop: "1px solid var(--border-light)", margin: "16px 0", height: 0 }} />
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  style={{ padding: 16, background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                  <Space>
                    <WalletOutlined style={{ fontSize: 22, color: "#fff" }} />
                    <div>
                      <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>رصيد المحفظة</Text>
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
        title={<Space><ThunderboltOutlined style={{ color: "var(--primary)" }} />الخطط المتاحة</Space>}
        style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === subscription?.planId;
            const isNewSubscription = hasNoSubscription;
            const isUpgrade = !isCurrentPlan && !isNewSubscription && plan.price > (currentPlan?.price || 0);
            const isFreePlan = plan.price === 0;
            const actionLabel = isNewSubscription || isFreePlan ? "اشتراك" : isUpgrade ? "ترقية الخطة" : "تخفيض الخطة";
            const actionIcon = isNewSubscription || isFreePlan ? <CheckCircleOutlined /> : isUpgrade ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
            const planKey = plan.name?.toLowerCase() || "default";
            const gradient = PLAN_GRADIENTS[planKey] || "var(--gradient-primary)";

            return (
              <Col xs={24} sm={8} key={plan.id}>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: plans.indexOf(plan) * 0.04 }}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }} style={{ height: "100%" }}>
                  <div style={{ borderRadius: 16, border: isCurrentPlan ? "2px solid var(--primary)" : "1px solid var(--border)", height: "100%", position: "relative", overflow: "hidden", background: "var(--bg-card)" }}>
                    {isCurrentPlan && <div style={{ position: "absolute", top: 12, right: 12 }}><Tag color="blue" style={{ borderRadius: 4, fontSize: 10 }}>الخطة الحالية</Tag></div>}
                    <div style={{ padding: "24px 20px 16px" }}>
                      <div style={{ textAlign: "center", marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, margin: "0 auto 12px" }}>
                          {PLAN_ICONS[planKey] || <StarOutlined />}
                        </div>
                        <Title level={4} style={{ margin: 0 }}>{plan.displayName || plan.name}</Title>
                        <div style={{ margin: "12px 0" }}>
                          <span className="gradient-text" style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em" }}>${plan.price}</span>
                          <Text type="secondary" style={{ fontSize: 14 }}>/{BILLING_CYCLE_LABELS[plan.billingCycle] || plan.billingCycle || "شهرياً"}</Text>
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
                        <Button disabled style={{ borderRadius: 8, width: "100%" }}>الخطة الحالية</Button>
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

      <AnimatedCard title={<Space><HistoryOutlined />سجل الفواتير والمحفظة</Space>}>
        <Tabs items={tabItems} />
      </AnimatedCard>

      <Modal title={<Space>{changeType === "upgrade" ? <ArrowUpOutlined style={{ color: "var(--success)" }} /> : changeType === "downgrade" ? <ArrowDownOutlined style={{ color: "var(--warning)" }} /> : <CheckCircleOutlined style={{ color: "var(--primary)" }} />}{changeType === "upgrade" ? "ترقية الخطة" : changeType === "downgrade" ? "تخفيض الخطة" : "اشتراك جديد"}</Space>}
        open={changePlanModalVisible}
        onCancel={() => { setChangePlanModalVisible(false); setSelectedPlan(null); setChangeType(null); }}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => { setChangePlanModalVisible(false); setSelectedPlan(null); setChangeType(null); }}>إلغاء</Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmChange}
            loading={upgradeMutation.isPending || downgradeMutation.isPending || createSubscriptionMutation.isPending}>
            {changeType === "new" ? "اشتراك" : `تأكيد ${changeType === "upgrade" ? "الترقية" : "التخفيض"}`}
          </Button>,
        ]}>
        <div>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="الخطة الحالية"><Text strong>{currentPlan?.displayName || "لا يوجد اشتراك نشط"}</Text></Descriptions.Item>
            {currentPlan && <Descriptions.Item label="السعر الحالي">${currentPlan?.price?.toFixed(2) || "0.00"}/{BILLING_CYCLE_LABELS[currentPlan?.billingCycle || "month"] || currentPlan?.billingCycle || "شهرياً"}</Descriptions.Item>}
            <Descriptions.Item label="الخطة الجديدة"><Text strong>{selectedPlan?.displayName || "غير محدد"}</Text></Descriptions.Item>
            <Descriptions.Item label="السعر الجديد">${selectedPlan?.price?.toFixed(2) || "0.00"}/{BILLING_CYCLE_LABELS[selectedPlan?.billingCycle || "month"] || selectedPlan?.billingCycle || "شهرياً"}</Descriptions.Item>
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
                <Text strong style={{ fontSize: 13 }}><SwapOutlined style={{ marginRight: 4 }} />تفاصيل احتساب الفاتورة النسبية</Text>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", margin: "4px 0 12px" }}>متبقي {remaining} من أصل {total} يوماً في دورة الفوترة</div>
                <div style={{ padding: 12, background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border-light)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <Text>رصيد الخطة الحالية ({remaining} يوماً غير مستخدم)</Text>
                    <Text type="success" strong>+${credit.toFixed(2)}</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <Text>تكلفة الخطة الجديدة ({remaining} يوماً متبقية)</Text>
                    <Text type="danger" strong>-${charge.toFixed(2)}</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--border-light)", marginTop: 4 }}>
                    <Text strong>{isNetPositive ? "المبلغ الصافي المستحق" : isNetNegative ? "المبلغ الصافي المسترد للمحفظة" : "المبلغ الصافي"}</Text>
                    <Text strong style={{ color: isNetPositive ? "var(--error)" : isNetNegative ? "var(--success)" : "var(--text-secondary)", fontSize: 16 }}>
                      {net === 0 ? "$0.00" : `${isNetPositive ? "-" : "+"}$${Math.abs(net).toFixed(2)}`}
                    </Text>
                  </div>
                </div>
                <Alert type={net === 0 ? "info" : isNetPositive ? "info" : "success"}
                  message={net === 0 ? "لا يتطلب دفع أي مبلغ إضافي." : isNetPositive ? `سيتم خصم $${net.toFixed(2)} فوراً وتحديث خطتك.` : `سيتم إضافة $${Math.abs(net).toFixed(2)} كرصيد في محفظتك وتحديث خطتك.`}
                  style={{ marginTop: 12, borderRadius: 8 }} showIcon />
              </div>
            );
          })()}

          {proratedLoading && (
            <div style={{ textAlign: "center", padding: 16 }}><Spin size="small" /><Text type="secondary" style={{ marginRight: 8 }}>جاري حساب السعر النسبي...</Text></div>
          )}

          {!proratedInfo && changeType !== "new" && !proratedLoading && (
            <Alert type="info" message="أنت على وشك تغيير خطة اشتراكك." style={{ marginTop: 16, borderRadius: 8 }} showIcon />
          )}
        </div>
      </Modal>

      <Modal title={<Space><PlusOutlined />استثناءات وتخصيص الاشتراك</Space>} open={overrideModalVisible}
        onCancel={() => { setOverrideModalVisible(false); overrideForm.resetFields(); }}
        onOk={() => overrideForm.submit()} confirmLoading={applyOverrideMutation.isPending} width={500}
        okText="تطبيق التخصيص" cancelText="إلغاء">
        <Form form={overrideForm} layout="vertical" onFinish={handleApplyOverride} initialValues={{ overrideType: "capability_override" }}>
          <Form.Item name="overrideType" label="نوع التخصيص" rules={[{ required: true, message: "يرجى اختيار نوع التخصيص" }]}>
            <Select onChange={(v) => setOverrideType(v)}>
              <Select.Option value="capability_override">تخصيص الإمكانيات والميزات</Select.Option>
              <Select.Option value="date_extension">تمديد التاريخ</Select.Option>
              <Select.Option value="custom_discount">خصم مخصص</Select.Option>
              <Select.Option value="fee_waiver">إعفاء من الرسوم</Select.Option>
            </Select>
          </Form.Item>
          {overrideType === "capability_override" && (
            <>
              <Form.Item name="capabilityCode" label="رمز الإمكانية / الميزة" rules={[{ required: true, message: "أدخل رمز الميزة (مثال: STORAGE_GB, MAX_API_CALLS)" }]}>
                <Input placeholder="مثال: STORAGE_GB" />
              </Form.Item>
              <Form.Item name="overrideValue" label="القيمة المخصصة" rules={[{ required: true, message: "أدخل القيمة الجديدة" }]}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}
          {overrideType === "date_extension" && (
            <Form.Item name="newExpiryDate" label="تاريخ الانتهاء الجديد" rules={[{ required: true, message: "حدد تاريخ الانتهاء الجديد" }]}>
              <Select>
                <Select.Option value={dayjs().add(7, "day").toISOString()}>+7 أيام</Select.Option>
                <Select.Option value={dayjs().add(14, "day").toISOString()}>+14 يوماً</Select.Option>
                <Select.Option value={dayjs().add(30, "day").toISOString()}>+30 يوماً (شهر واحد)</Select.Option>
                <Select.Option value={dayjs().add(60, "day").toISOString()}>+60 يوماً (شهران)</Select.Option>
                <Select.Option value={dayjs().add(90, "day").toISOString()}>+90 يوماً (3 أشهر)</Select.Option>
                <Select.Option value={dayjs().add(180, "day").toISOString()}>+180 يوماً (6 أشهر)</Select.Option>
                <Select.Option value={dayjs().add(365, "day").toISOString()}>+365 يوماً (سنة واحدة)</Select.Option>
              </Select>
            </Form.Item>
          )}
          {overrideType === "custom_discount" && (
            <>
              <Form.Item name="discountPercent" label="نسبة الخصم (%)"><InputNumber min={0} max={100} style={{ width: "100%" }} /></Form.Item>
              <Form.Item name="discountAmount" label="مبلغ الخصم الثابت ($)"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
            </>
          )}
          {overrideType === "fee_waiver" && (
            <Alert type="info" message="إعفاء من الرسوم" description="سيتم إلغاء أي رسوم مستحقة للفترة الفوترية الحالية." showIcon style={{ marginBottom: 16 }} />
          )}
          <Form.Item name="reason" label="السبب" rules={[{ required: true, message: "يرجى تقديم سبب تطبيق هذا التخصيص" }]}>
            <Input.TextArea rows={2} placeholder="ما هو سبب تطبيق هذا التخصيص؟" />
          </Form.Item>
          <Form.Item name="expiresAt" label="انتهاء صلاحية التخصيص (اختياري)">
            <Select allowClear placeholder="حدد مدة الانتهاء" onChange={(v) => overrideForm.setFieldsValue({ expiresAt: v })}>
              <Select.Option value={dayjs().add(7, "day").toISOString()}>7 أيام</Select.Option>
              <Select.Option value={dayjs().add(30, "day").toISOString()}>30 يوماً</Select.Option>
              <Select.Option value={dayjs().add(90, "day").toISOString()}>90 يوماً</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="تجديد الاشتراك" open={renewModalVisible} onCancel={() => setRenewModalVisible(false)}
        onOk={handleRenew} confirmLoading={renewMutation.isPending}
        okText="تأكيد التجديد" cancelText="إلغاء">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Alert type="info" message="تجديد الاشتراك"
            description={subscription ? `تنتهي فترتك الحالية في ${dayjs(subscription.currentPeriodEnd).format("YYYY/MM/DD")}. التجديد سيمدد اشتراكك لدورة فوترة إضافية.` : "لقد انتهت صلاحية اشتراكك. قم بالتجديد لاستعادة الوصول."}
            showIcon />
          {currentPlan && (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="الخطة">{currentPlan.displayName}</Descriptions.Item>
              <Descriptions.Item label="السعر">${currentPlan.price.toFixed(2)} / {BILLING_CYCLE_LABELS[currentPlan.billingCycle] || currentPlan.billingCycle || "شهرياً"}</Descriptions.Item>
            </Descriptions>
          )}
        </Space>
      </Modal>

      <Modal title="إلغاء الاشتراك" open={cancelModalVisible} onCancel={() => setCancelModalVisible(false)}
        onOk={handleCancelSubscription} confirmLoading={cancelSubMutation.isPending}
        okButtonProps={{ danger: true }} okText="تأكيد الإلغاء" cancelText="تراجع">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Alert type="warning" message="إلغاء الاشتراك" description="سيؤدي إلغاء الاشتراك إلى التأثير على وصول المنشأة إلى ميزات الخطة المتقدمة." showIcon />
          <div style={{ padding: "12px 0" }}>
            <Text strong>نوع الإلغاء:</Text>
            <div style={{ marginTop: 8 }}>
              <Select value={cancelImmediate ? "immediate" : "end_of_period"}
                onChange={(v) => setCancelImmediate(v === "immediate")} style={{ width: "100%" }}>
                <Select.Option value="end_of_period">مع نهاية الفترة الحالية - استمرار الوصول حتى {subscription ? dayjs(subscription.currentPeriodEnd).format("YYYY/MM/DD") : "نهاية الفترة"}</Select.Option>
                <Select.Option value="immediate">إلغاء فوري - إيقاف الصلاحيات الآن</Select.Option>
              </Select>
            </div>
          </div>
          {cancelImmediate && <Alert type="error" message="الإلغاء الفوري سيوقف صلاحيات الوصول مباشرة." showIcon />}
          {subscription?.overrides && subscription.overrides.length > 0 && (
            <Alert type="info" message={`سيتم أيضاً إزالة (${subscription.overrides.length}) من الاستثناءات والتخصيصات النشطة.`} showIcon />
          )}
        </Space>
      </Modal>

      <Modal title={<Space><FileTextOutlined />تفاصيل الفاتورة</Space>}
        open={invoiceDetailVisible} onCancel={() => { setInvoiceDetailVisible(false); setSelectedInvoice(null); }}
        width={600}
        footer={selectedInvoice ? [<Button key="download" type="primary" icon={<FilePdfOutlined />} onClick={() => handleDownloadInvoice(selectedInvoice)}>تحميل PDF</Button>] : []}>
        {selectedInvoice && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="رقم الفاتورة" span={2}><Text code>{selectedInvoice.id}</Text></Descriptions.Item>
            <Descriptions.Item label="النوع"><Tag>{INVOICE_TYPE_LABELS[selectedInvoice.invoiceType] || selectedInvoice.invoiceType}</Tag></Descriptions.Item>
            <Descriptions.Item label="الحالة"><Tag color={invoiceStatusColorMap[selectedInvoice.status] || "default"}>{INVOICE_STATUS_LABELS[selectedInvoice.status] || selectedInvoice.status}</Tag></Descriptions.Item>
            <Descriptions.Item label="من خطة">{selectedInvoice.oldPlanName || "غير محدد"}</Descriptions.Item>
            <Descriptions.Item label="إلى خطة">{selectedInvoice.newPlanName}</Descriptions.Item>
            <Descriptions.Item label="المجموع الفرعي">${selectedInvoice.amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="الضريبة">${selectedInvoice.taxAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="الخصم">${selectedInvoice.discountAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="الإجمالي" span={2}><Text strong style={{ fontSize: 16, color: "var(--primary)" }}>${selectedInvoice.totalAmount.toFixed(2)} {selectedInvoice.currency}</Text></Descriptions.Item>
            <Descriptions.Item label="تاريخ الإنشاء">{dayjs(selectedInvoice.createdAt).format("YYYY/MM/DD HH:mm")}</Descriptions.Item>
            <Descriptions.Item label="تاريخ الدفع">{selectedInvoice.paidAt ? dayjs(selectedInvoice.paidAt).format("YYYY/MM/DD HH:mm") : "-"}</Descriptions.Item>
            {selectedInvoice.description && <Descriptions.Item label="الوصف" span={2}>{selectedInvoice.description}</Descriptions.Item>}
          </Descriptions>
        )}
      </Modal>
    </PageTransition>
  );
}
