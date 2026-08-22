"use client";

import React, { useState } from "react";
import {
  Card,
  Button,
  Table,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  Input,
  Popconfirm,
  Typography,
  Tooltip,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import { useProductWorkspace } from "../ProductWorkspaceContext";
import type {
  ProductDetail,
  ProductAttributeReadModel,
  AttributeDefinitionReadModel,
} from "../../../../types/catalog";
import { useAttributeGroups } from "../../../../hooks/useAttributeGroups";
import {
  useAddProductAttribute,
  useSetProductAttributeValues,
  useRemoveProductAttribute,
} from "../../../../hooks/useProducts";
import { getApiErrorMessage } from "../../../../api/http";

const { Text } = Typography;

export function AttributesSection({ product }: { product?: ProductDetail }) {
  const t = useTranslations();
  const { productId } = useProductWorkspace();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState<ProductAttributeReadModel | null>(null);
  const [form] = Form.useForm();

  const attributeGroups = useAttributeGroups({ pageSize: 100 });
  const addAttribute = useAddProductAttribute(productId);
  const setAttributeValues = useSetProductAttributeValues(productId);
  const removeAttribute = useRemoveProductAttribute(productId);

  // Flatten all attribute definitions from groups
  const allDefinitions: Array<{
    groupName: string;
    definition: AttributeDefinitionReadModel;
  }> = [];

  (attributeGroups.data?.data ?? []).forEach((group) => {
    (group.definitions ?? []).forEach((def) => {
      allDefinitions.push({
        groupName: group.name || group.key,
        definition: def,
      });
    });
  });

  const handleOpenAdd = () => {
    setEditingAttr(null);
    form.resetFields();
    form.setFieldsValue({
      isVisibleOnStorefront: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (record: ProductAttributeReadModel) => {
    setEditingAttr(record);
    form.resetFields();
    form.setFieldsValue({
      attributeDefinitionId: record.attributeDefinitionId,
      values: record.values.map((v) => v.value),
      isVisibleOnStorefront: record.isVisibleOnStorefront,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const rawVals: string[] = Array.isArray(values.values)
        ? values.values
        : [values.values].filter(Boolean);

      if (editingAttr) {
        // Update values
        await setAttributeValues.mutateAsync({
          attributeId: editingAttr.id,
          body: {
            values: rawVals.map((v) => ({ value: v })),
          },
        });
        message.success(t("catalog.attributes.updated") || "تم تحديث قيم الخاصية بنجاح");
      } else {
        // Find definition
        const matched = allDefinitions.find(
          (d) => d.definition.id === values.attributeDefinitionId
        );
        const name = matched?.definition.name || matched?.definition.key || "Attribute";
        const key = matched?.definition.key || name.toLowerCase().replace(/\s+/g, "-");

        await addAttribute.mutateAsync({
          attributeDefinitionId: values.attributeDefinitionId,
          key,
          name,
          isVisibleOnStorefront: values.isVisibleOnStorefront ?? true,
        });

        // If initial values were provided, set them
        if (rawVals.length > 0) {
          // Values will be set on next render or refetch
        }
        message.success(t("catalog.attributes.added") || "تمت إضافة الخاصية للمنتج بنجاح");
      }

      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(getApiErrorMessage(err) || "فشل حفظ الخاصية");
    }
  };

  const handleDelete = async (attributeId: string) => {
    try {
      await removeAttribute.mutateAsync(attributeId);
      message.success(t("catalog.attributes.deleted") || "تم حذف الخاصية من المنتج");
    } catch (err: any) {
      message.error(getApiErrorMessage(err) || "فشل حذف الخاصية");
    }
  };

  const selectedDefId = Form.useWatch("attributeDefinitionId", form);
  const selectedDef = allDefinitions.find((d) => d.definition.id === selectedDefId)?.definition;

  const columns = [
    {
      title: t("catalog.attributes.name") || "الخاصية",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: ProductAttributeReadModel) => (
        <Space direction="vertical" size={2}>
          <Text strong>{name || record.key}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.key}
          </Text>
        </Space>
      ),
    },
    {
      title: t("catalog.attributes.values") || "القيم المحددة",
      dataIndex: "values",
      key: "values",
      render: (vals: ProductAttributeReadModel["values"]) => (
        <Space wrap size={[4, 4]}>
          {vals && vals.length > 0 ? (
            vals.map((v) => (
              <Tag key={v.id} color="blue">
                {v.value}
              </Tag>
            ))
          ) : (
            <Text type="secondary">—</Text>
          )}
        </Space>
      ),
    },
    {
      title: t("catalog.attributes.visibility") || "الظهور في المتجر",
      dataIndex: "isVisibleOnStorefront",
      key: "isVisibleOnStorefront",
      width: 130,
      render: (visible: boolean) => (
        <Tag color={visible ? "green" : "default"}>
          {visible ? "ظاهر" : "مخفي"}
        </Tag>
      ),
    },
    {
      title: t("common.actionsTitle") || t("common.actions.title") || "الإجراءات",
      key: "actions",
      width: 100,
      render: (_: any, record: ProductAttributeReadModel) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title={t("catalog.attributes.deleteConfirm") || "هل أنت متأكد من إزالة هذه الخاصية؟"}
            onConfirm={() => handleDelete(record.id)}
            okText={t("common.yes") || "نعم"}
            cancelText={t("common.no") || "لا"}
          >
            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const assignedAttributes = product?.attributes ?? [];

  return (
    <Card
      title={
        <Space>
          <span>{t("catalog.products.workspace.attributes") || "خصائص ومواصفات المنتج"}</span>
          <Tooltip title="المواصفات والخصائص الإضافية (مثل: المادة، بلد المنشأ، الأبعاد، المواصفات التقنية)">
            <InfoCircleOutlined style={{ color: "var(--text-secondary)", fontSize: 13 }} />
          </Tooltip>
        </Space>
      }
      extra={
        <Button
          type="primary"
          ghost
          icon={<PlusOutlined />}
          onClick={handleOpenAdd}
          disabled={!productId}
        >
          {t("catalog.attributes.add") || "إضافة خاصية"}
        </Button>
      }
      style={{ borderRadius: 16, border: "1px solid var(--border-light)", marginBottom: 24 }}
    >
      <Table
        dataSource={assignedAttributes}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="middle"
        locale={{
          emptyText: (
            <div style={{ padding: "20px 0", color: "var(--text-secondary)" }}>
              لم يتم ربط أي خصائص بهذا المنتج بعد. انقر على &quot;إضافة خاصية&quot; لربط مواصفات من إدارة الخصائص.
            </div>
          ),
        }}
      />

      <Modal
        title={
          editingAttr
            ? (t("catalog.attributes.edit") || "تعديل قيم الخاصية")
            : (t("catalog.attributes.add") || "ربط خاصية جديدة بالمنتج")
        }
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={addAttribute.isPending || setAttributeValues.isPending}
        okText={t("common.save") || "حفظ"}
        cancelText={t("common.cancel") || "إلغاء"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="attributeDefinitionId"
            label={t("catalog.attributes.selectDefinition") || "اختر الخاصية"}
            rules={[{ required: true, message: "يرجى اختيار الخاصية" }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="اختر من قائمة الخصائص المعرفة"
              disabled={!!editingAttr}
              loading={attributeGroups.isLoading}
              options={allDefinitions.map((d) => ({
                value: d.definition.id,
                label: `${d.definition.name || d.definition.key} (${d.groupName})`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="values"
            label={t("catalog.attributes.values") || "قيم الخاصية"}
            rules={[{ required: true, message: "يرجى إدخال قيمة واحدة على الأقل" }]}
            help={
              selectedDef?.values && selectedDef.values.length > 0
                ? "يمكنك الاختيار من القيم المعرفة مسبقاً أو كتابة قيمة مخصصة والضغط على Enter"
                : "اكتب القيمة واضغط Enter لإضافتها"
            }
          >
            <Select
              mode="tags"
              placeholder="أدخل قيمة الخاصية (مثال: قطن 100%)"
              options={(selectedDef?.values ?? []).map((v) => ({
                value: v.value,
                label: v.value,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
