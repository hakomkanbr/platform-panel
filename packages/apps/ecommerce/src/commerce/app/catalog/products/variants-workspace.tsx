"use client";

import React, { useState, useMemo } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Typography,
  Steps,
  Tag,
  Badge,
  Card,
  Divider,
} from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, PlusOutlined, ArrowRightOutlined, SettingOutlined } from "@ant-design/icons";
import { EmptyState, DrawerForm } from "@repo/ui";
import { formatCurrency, getCurrencyInfo } from "@repo/utils";
import { useTranslations } from "@repo/localization";
import { enumLabel, enumOptions } from "../../../types/enums";
import type { ProductOption, ProductOptionReadModel, Variant } from "../../../types/catalog";
import {
  useAddProductOptionValue,
  useDeleteProductDetail,
  useProductOptions,
  useProductVariants,
  useSaveProductDetail,
  useGenerateProductVariants,
  useDeleteProductOptionValue,
  useProduct,
} from "../../../hooks/useProducts";
import { useStores } from "../../../hooks/useStores";
import { productsApi } from "../../../api/catalog/products";
import { getApiErrorMessage } from "../../../api/http";

const { Text, Title } = Typography;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "option";
}

function CartesianProduct(arrays: any[][]): any[][] {
  if (arrays.length === 0) return [];
  return arrays.reduce(
    (acc, curr) => acc.flatMap((c: any) => curr.map((n: any) => [].concat(c, n))),
    [[]]
  );
}

export function ProductVariantsWorkspace({
  productId,
  languageCode = "en-US",
  languageId = "4f7d8a31-2d4e-4b9c-a8f6-9e1d73c5b4a2"
}: { 
  productId: string;
  languageCode?: string;
  languageId?: string;
}) {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);

  const stores = useStores();
  const storeCurrency = stores.data?.data?.[0]?.settings?.currencyCode || "TRY";

  const { data: product } = useProduct(productId);
  const currentCurrency = (product?.pricing?.currencyId && !product.pricing.currencyId.includes("-"))
    ? product.pricing.currencyId
    : (product?.currency && !product.currency.includes("-") ? product.currency : storeCurrency);
  const currencyPrefix = getCurrencyInfo(currentCurrency)?.symbol ?? currentCurrency;

  // Options Hooks
  const { data: optionsData, isLoading: isLoadingOptions } = useProductOptions(productId);
  const saveOption = useSaveProductDetail("options", productId);
  const removeOption = useDeleteProductDetail("options", productId);
  const addOptionValue = useAddProductOptionValue(productId);
  const deleteOptionValue = useDeleteProductOptionValue(productId);

  // Variants Hooks
  const { data: variantsData, isLoading: isLoadingVariants } = useProductVariants(productId);
  const saveVariant = useSaveProductDetail("variants", productId);
  const removeVariant = useDeleteProductDetail("variants", productId);
  const generateVariants = useGenerateProductVariants(productId);

  const [optionForm] = Form.useForm();
  const [optionDrawerOpen, setOptionDrawerOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ProductOption | null>(null);

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isRecreating, setIsRecreating] = useState(false);

  const options = (optionsData ?? []) as ProductOptionReadModel[];
  const variants = (variantsData ?? []) as Variant[];

  // ----------------------------------------------------
  // STEP 1: OPTIONS
  // ----------------------------------------------------
  const openOptionCreate = () => {
    setEditingOption(null);
    optionForm.resetFields();
    setOptionDrawerOpen(true);
  };

  const openOptionEdit = (option: ProductOptionReadModel) => {
    setEditingOption(option as unknown as ProductOption);
    const translation = option.translations?.find(tr => tr.cultureCode === languageCode)
      ?? option.translations?.[0];
    optionForm.setFieldsValue({
      name: translation?.name ?? option.code,
      inputType: option.inputType,
      isRequired: option.isRequired,
      values: option.values?.map(v => ({
        id: v.id,
        value: v.translations?.find(tr => tr.cultureCode === languageCode)?.name ?? v.value,
      })) ?? [],
    });
    setOptionDrawerOpen(true);
  };

  const onOptionFinish = async (values: Record<string, unknown>) => {
    try {
      const name = String(values.name ?? "").trim();
      const inputValues = (values.values as { value?: string }[] | undefined)
        ?.map((v) => String(v.value ?? "").trim())
        .filter(Boolean) ?? [];
      const optionCode = slugify(name);

      if (editingOption) {
        await saveOption.mutateAsync({
          entityId: editingOption.id as string,
          body: {
            code: optionCode,
            name,
            inputType: values.inputType,
            isRequired: values.isRequired ?? false,
            languageId,
            cultureCode: languageCode,
            displayOrder: 0,
          },
        });

        // Handle value additions and deletions
        const currentValues = editingOption.values || [];
        const existingValuesStr = currentValues.map(v => v.value).map(s => s?.toLowerCase());
        
        for (let i = 0; i < inputValues.length; i++) {
           const valLower = inputValues[i].toLowerCase();
           if (!existingValuesStr.includes(valLower)) {
             // It's a new value
             await addOptionValue.mutateAsync({
               optionId: editingOption.id as string,
               body: { languageId, cultureCode: languageCode, value: inputValues[i], name: inputValues[i], displayOrder: i },
             });
           }
        }
        
        // Remove values that were deleted
        for (const existing of currentValues) {
          const valName = existing.value;
          if (valName && !inputValues.some(iv => iv.toLowerCase() === valName.toLowerCase())) {
            if (existing.id) {
              await deleteOptionValue.mutateAsync({ optionId: editingOption.id as string, valueId: existing.id as string });
            }
          }
        }
      } else {
        await saveOption.mutateAsync({
          body: {
            code: optionCode,
            name,
            inputType: values.inputType,
            isRequired: values.isRequired ?? false,
            languageId,
            cultureCode: languageCode,
            displayOrder: 0,
          },
        });

        if (inputValues.length > 0) {
          const freshOptions = await productsApi.getOptions(productId);
          const created = freshOptions.find((o) => o.code === optionCode || o.translations?.some(tr => tr.name === name)) ?? freshOptions[freshOptions.length - 1];
          const optionId = created?.id;
          if (optionId) {
            for (let i = 0; i < inputValues.length; i++) {
              await addOptionValue.mutateAsync({
                optionId,
                body: { languageId, cultureCode: languageCode, value: inputValues[i], name: inputValues[i], displayOrder: i },
              });
            }
          }
        }
      }

      message.success(editingOption ? t("catalog.products.tabs.options.updated") : t("catalog.products.tabs.options.created"));
      setOptionDrawerOpen(false);
      setEditingOption(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  // ----------------------------------------------------
  // STEP 2: PREVIEW MATRIX
  // ----------------------------------------------------
  const matrix = useMemo(() => {
    if (options.length === 0) return [];
    
    // Each option yields an array of its values
    const optionValuesArray = options.map(opt => {
      if (!opt.values || opt.values.length === 0) return [];
      return opt.values.map(val => ({
        optionId: opt.id,
        optionCode: opt.code,
        valueId: val.id,
        value: val.translations?.find(tr => tr.cultureCode === languageCode)?.name ?? val.value
      }));
    }).filter(arr => arr.length > 0);

    if (optionValuesArray.length !== options.length) return []; // Some options have no values
    
    const combinations = CartesianProduct(optionValuesArray);
    
    return combinations.map((combo: any[], index) => {
      // Check if this combo already exists in the variants
      const exists = variants.some(v => {
        // v.values should match combo precisely
        if (!v.values || v.values.length !== combo.length) return false;
        // Simple check: do all combo values exist in variant values
        const comboValueStrings = combo.map(c => c.value.toLowerCase());
        const variantValueStrings = v.values.map(vv => (vv.value || "").toLowerCase());
        return comboValueStrings.every(cv => variantValueStrings.includes(cv));
      });

      return {
        key: `combo_${index}`,
        title: combo.map(c => c.value).join(" / "),
        combo,
        status: exists ? "Existing" : "Missing"
      };
    });
  }, [options, variants, languageCode]);

  const handleGenerate = async () => {
    try {
      await generateVariants.mutateAsync();
      message.success(t("catalog.products.variants.generatedSuccess") || "Missing variants generated successfully");
      setCurrentStep(2); // Move to Table
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedRowKeys.map((id) => removeVariant.mutateAsync(id as string)));
      message.success(t("catalog.products.variants.bulkDeleted") || "Selected variants deleted successfully");
      setSelectedRowKeys([]);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleRecreateAll = async () => {
    setIsRecreating(true);
    try {
      if (variants.length > 0) {
        await Promise.all(variants.map(v => removeVariant.mutateAsync(v.id as string)));
      }
      await generateVariants.mutateAsync();
      message.success(t("catalog.products.variants.recreated") || "Variants re-created successfully");
      setCurrentStep(2);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    } finally {
      setIsRecreating(false);
    }
  };

  // ----------------------------------------------------
  // STEP 3: VARIANTS TABLE
  // ----------------------------------------------------
  const filteredVariants = useMemo(() => {
    let result = variants;
    if (searchText) {
      result = result.filter(v => 
        (v.name || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (v.sku || "").toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      // Assuming variants don't have explicit status in types yet, mock filter
      // result = result.filter(v => v.status === statusFilter);
    }
    return result;
  }, [variants, searchText, statusFilter]);

  const expandedRowRender = (record: Variant) => {
    return (
      <div style={{ padding: '16px 24px', background: 'var(--bg-subtle, #f8fafc)', borderRadius: 8, margin: '8px 0', border: '1px solid var(--border-light)' }}>
        <Form 
          layout="vertical"
          initialValues={{
            sku: record.sku,
            barcode: record.barcode,
            price: record.price,
            stock: record.stock,
            trackInventory: true,
            status: 'active',
            weight: undefined, // mock fields for complete UX
            dimensions: undefined,
            taxCode: undefined,
            shippingClass: undefined
          }}
          onFinish={async (values) => {
            try {
              await saveVariant.mutateAsync({ 
                entityId: record.id as string, 
                body: {
                  ...values,
                  // ensure these aren't wiped
                  name: record.name,
                  code: record.code,
                  values: record.values
                } 
              });
              message.success(t("catalog.products.variants.saved") || "Variant updated");
            } catch (e) {
              message.error(getApiErrorMessage(e));
            }
          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="sku" label={t("catalog.products.variants.sku") || "SKU"}>
                <Input placeholder="e.g. TSHIRT-RED-S" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="barcode" label={t("catalog.products.variants.barcode") || "Barcode"}>
                <Input placeholder="UPC/GTIN" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="price" label={t("catalog.products.variants.priceOverride") || "Price Override"}>
                <InputNumber prefix={currencyPrefix} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="status" label={t("catalog.products.variants.status") || "Status"}>
                <Select options={[{ value: 'active', label: 'Active' }, { value: 'draft', label: 'Draft' }]} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item name="trackInventory" label={t("catalog.products.variants.trackInventory") || "Track Inventory"} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="stock" label={t("catalog.products.variants.quantity") || "Quantity"}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="weight" label={t("catalog.products.variants.weight") || "Weight (kg)"}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="taxCode" label={t("catalog.products.variants.taxCode") || "Tax Code"}>
                <Input placeholder="Tax Code" />
              </Form.Item>
            </Col>

            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                {t("common.save") || "Save"}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  const optionColumns: TableColumnsType<ProductOptionReadModel> = [
    {
      title: t("catalog.products.options.name") || "Option Name",
      key: "name",
      width: '30%',
      render: (_, record) => {
        const translation = record.translations?.find(tr => tr.cultureCode === languageCode)
          ?? record.translations?.[0];
        return <Text strong>{translation?.name ?? record.code}</Text>;
      },
    },
    {
      title: t("catalog.products.options.values") || "Values",
      dataIndex: "values",
      render: (vals: ProductOptionReadModel['values']) => (
        <Space wrap>
          {vals && vals.length > 0
            ? vals.map(v => {
                const vTranslation = v.translations?.find(tr => tr.cultureCode === languageCode) ?? v.translations?.[0];
                return <Tag key={v.id as string} color="blue">{vTranslation?.name ?? v.value}</Tag>;
              })
            : <Text type="secondary" style={{ fontSize: 12 }}>{t("common.none") || "None"}</Text>
          }
        </Space>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<SettingOutlined />} onClick={() => openOptionEdit(record)} />
          <Popconfirm title={t("common.confirmDelete") || "Are you sure?"} onConfirm={() => removeOption.mutateAsync(record.id as string)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dynamicOptionColumns: TableColumnsType<any> = options.map((opt) => {
    const translation = opt.translations?.find(tr => tr.cultureCode === languageCode) ?? opt.translations?.[0];
    const optionName = translation?.name ?? opt.code;
    return {
      title: optionName,
      key: `opt_${opt.id}`,
      render: (_, r) => {
        // Find if this variant has an optionValue for this option
        const optVal = r.optionValues?.find((ov: any) => ov.optionId === opt.id);
        if (optVal) {
          // Look up the string value from the options array
          const valueObj = opt.values?.find(v => v.id === optVal.optionValueId);
          if (valueObj) {
            const valTrans = valueObj.translations?.find(tr => tr.cultureCode === languageCode) ?? valueObj.translations?.[0];
            return <Text>{valTrans?.name ?? valueObj.value}</Text>;
          }
        }
        
        // Fallback for when data might be mapped differently
        const optName = opt.translations?.find(tr => tr.cultureCode === languageCode)?.name ?? opt.translations?.[0]?.name;
        let fallbackVal = r.values?.find((v: any) => v.optionId === opt.id || (v.optionName && (v.optionName === optName || v.optionName === opt.code)));
        return <Text>{fallbackVal ? fallbackVal.value : "-"}</Text>;
      }
    };
  });

  const variantColumns: TableColumnsType<Variant> = [
    {
      title: t("catalog.products.variants.image") || "Image",
      key: "image",
      width: 70,
      render: () => (
        <div style={{ width: 40, height: 40, borderRadius: 6, border: '1px dashed #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <Text type="secondary" style={{ fontSize: 10 }}>Img</Text>
        </div>
      )
    },
    {
      title: t("catalog.products.variants.name") || "Variant",
      key: "name",
      render: (_, r) => (
        <div style={{ fontWeight: 600 }}>{r.name || r.code || (r.id ? r.id.slice(0, 8) : "-")}</div>
      ),
    },
    ...dynamicOptionColumns,
    { title: t("catalog.products.variants.sku") || "SKU", dataIndex: "sku", render: (v) => v || <Text type="secondary">-</Text> },
    { title: t("catalog.products.variants.price") || "Price", dataIndex: "price", render: (v) => v ? formatCurrency(v) : <Text type="secondary">{t("common.inherited") || "Inherited"}</Text> },
    { title: t("catalog.products.variants.inventory") || "Inventory", dataIndex: "stock", render: (v) => v ?? <Text type="secondary">-</Text> },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, r) => (
        <Popconfirm title={t("common.confirmDelete") || "Are you sure?"} onConfirm={() => removeVariant.mutateAsync(r.id)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const dynamicMatrixOptionColumns: TableColumnsType<any> = options.map((opt) => {
    const translation = opt.translations?.find(tr => tr.cultureCode === languageCode) ?? opt.translations?.[0];
    const optionName = translation?.name ?? opt.code;
    return {
      title: optionName,
      key: `matrix_opt_${opt.id}`,
      render: (_, r) => {
        const val = r.combo?.find((c: any) => c.optionId === opt.id);
        return <Text>{val ? val.value : "-"}</Text>;
      }
    };
  });

  const matrixColumns: TableColumnsType<any> = [
    { title: t("catalog.products.matrix.variant") || "Variant Combination", dataIndex: "title" },
    ...dynamicMatrixOptionColumns,
    { 
      title: t("catalog.products.matrix.status") || "Status", 
      dataIndex: "status", 
      render: (status) => (
        <Badge 
          status={status === "Existing" ? "success" : "warning"} 
          text={status === "Existing" ? t("catalog.products.matrix.existing") || "Existing" : t("catalog.products.matrix.missing") || "Missing / New"} 
        />
      ) 
    }
  ];

  const missingCount = matrix.filter(m => m.status === "Missing").length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Steps
        current={currentStep}
        onChange={setCurrentStep}
        items={[
          { title: t("catalog.products.wizard.step1") || "1. Options", description: t("catalog.products.wizard.step1Desc") || "Define properties" },
          { title: t("catalog.products.wizard.step2") || "2. Preview Matrix", description: t("catalog.products.wizard.step2Desc") || "Live calculations" },
          { title: t("catalog.products.wizard.step3") || "3. Variants", description: t("catalog.products.wizard.step3Desc") || "Manage variants" },
        ]}
        style={{ marginBottom: 24 }}
      />

      {currentStep === 0 && (
        <Card title={t("catalog.products.options.title") || "What makes this product different?"} extra={<Button type="primary" icon={<PlusOutlined />} onClick={openOptionCreate}>{t("catalog.products.options.add") || "Add Option"}</Button>}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            {t("catalog.products.options.description") || "Add options like Size or Color. Each option can have multiple values."}
          </Text>
          <Table<ProductOptionReadModel>
            rowKey={(r) => r.id as string ?? r.code}
            columns={optionColumns}
            dataSource={options}
            loading={isLoadingOptions}
            pagination={false}
            locale={{ emptyText: <EmptyState title={t("catalog.products.options.emptyTitle") || "No Options"} description={t("catalog.products.options.emptyDesc") || "Add your first option to get started."} /> }}
          />
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={() => setCurrentStep(1)}>
              {t("common.next") || "Next"} <ArrowRightOutlined />
            </Button>
          </div>
        </Card>
      )}

      {currentStep === 1 && (
        <Card title={t("catalog.products.matrix.title") || "Live Matrix Calculation"}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary">
              {t("catalog.products.matrix.description") || "Preview of all potential variant combinations based on your options."}
            </Text>
            <Space>
              <Tag color="green">{matrix.filter(m => m.status === 'Existing').length} {t("catalog.products.matrix.existingCount") || "Existing"}</Tag>
              <Tag color="orange">{missingCount} {t("catalog.products.matrix.missingCount") || "Missing"}</Tag>
            </Space>
          </div>

          <Table
            rowKey="key"
            columns={matrixColumns}
            dataSource={matrix}
            pagination={false}
            size="small"
            scroll={{ y: 400 }}
          />

          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => setCurrentStep(0)}>{t("common.back") || "Back"}</Button>
            <Space>
              <Button onClick={() => setCurrentStep(2)}>{t("common.skip") || "Skip to Variants"}</Button>
              <Popconfirm 
                title={t("catalog.products.matrix.recreateConfirmTitle") || "Re-create all variants?"}
                description={t("catalog.products.matrix.recreateConfirmDesc") || "This will delete all existing variants and generate fresh ones. Are you sure?"}
                onConfirm={handleRecreateAll}
                okText={t("common.yes") || "Yes"}
                cancelText={t("common.no") || "No"}
              >
                <Button danger loading={isRecreating}>
                  {t("catalog.products.matrix.recreateAll") || "Re-create All Variants"}
                </Button>
              </Popconfirm>
              <Button type="primary" onClick={handleGenerate} disabled={missingCount === 0} loading={generateVariants.isPending}>
                {t("catalog.products.matrix.generate") || "Generate Missing Variants"}
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {currentStep === 2 && (
        <Card title={t("catalog.products.variants.title") || "Manage Variants"}>
          <div style={{ marginBottom: 16, display: 'flex', gap: 16, justifyContent: 'space-between' }}>
            <Space>
              <Input.Search 
                placeholder={t("common.search") || "Search by name or SKU..."}
                allowClear
                onSearch={setSearchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
              <Select 
                value={statusFilter} 
                onChange={setStatusFilter}
                options={[{ value: 'all', label: t("common.all") || "All Statuses" }, { value: 'active', label: t("common.active") || "Active" }]} 
                style={{ width: 140 }}
              />
            </Space>
            <Space>
              <Button onClick={() => setCurrentStep(1)}>{t("catalog.products.variants.backToMatrix") || "Back to Matrix"}</Button>
              {selectedRowKeys.length > 0 && (
                <Button danger loading={isBulkDeleting} onClick={handleBulkDelete}>
                  {t("common.delete") || "Delete"} ({selectedRowKeys.length})
                </Button>
              )}
              <Button type="primary">{t("catalog.products.variants.bulkEdit") || "Bulk Edit"}</Button>
            </Space>
          </div>
          <Table<Variant>
            rowSelection={{
              selectedRowKeys,
              onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
            }}
            rowKey="id"
            columns={variantColumns}
            dataSource={filteredVariants}
            loading={isLoadingVariants}
            pagination={{ pageSize: 20 }}
            expandable={{
              expandedRowRender,
              expandedRowKeys,
              onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as React.Key[]),
            }}
            locale={{ emptyText: <EmptyState title={t("catalog.products.variants.emptyTitle") || "No Variants"} description={t("catalog.products.variants.emptyDesc") || "Go back to generate variants."} /> }}
          />
        </Card>
      )}

      <DrawerForm
        open={optionDrawerOpen}
        onClose={() => setOptionDrawerOpen(false)}
        title={editingOption ? t("catalog.products.options.edit") || "Edit Option" : t("catalog.products.options.new") || "New Option"}
        width={520}
        form={optionForm}
        loading={saveOption.isPending}
        onFinish={onOptionFinish}
        submitLabel={editingOption ? t("common.save") || "Save Changes" : t("common.create") || "Create Option"}
      >
        <Form form={optionForm} layout="vertical" onFinish={onOptionFinish} initialValues={{ inputType: 2 }}>
          <Form.Item name="name" label={t("catalog.products.options.optionName") || "Option Name (e.g. Size)"} rules={[{ required: true }]}>
            <Input placeholder="Size" />
          </Form.Item>
          <Form.Item name="inputType" label={t("catalog.products.options.inputType") || "Input Type"}>
            <Select options={enumOptions("optionInputType", t)} />
          </Form.Item>
          <Form.Item label={t("catalog.products.options.values") || "Values"}>
            <Form.List name="values">
              {(fields, { add, remove: removeField }) => (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {fields.map((field) => (
                    <Space.Compact key={field.key} style={{ width: "100%" }}>
                      <Form.Item name={[field.name, "value"]} noStyle rules={[{ required: true }]}>
                        <Input placeholder={t("catalog.products.options.valuePlaceholder") || "Value (e.g. Small)"} />
                      </Form.Item>
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeField(field.name)} />
                    </Space.Compact>
                  ))}
                  <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ value: "" })} block>
                    {t("catalog.products.options.addValue") || "Add Value"}
                  </Button>
                </Space>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </DrawerForm>
    </div>
  );
}
