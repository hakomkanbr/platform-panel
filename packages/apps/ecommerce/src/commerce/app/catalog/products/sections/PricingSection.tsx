import React, { useEffect } from "react";
import { Form, Row, Col, InputNumber, Card, Typography, Statistic, Divider, Select } from "antd";
import { useTranslations } from "@repo/localization";
import { useQueryClient } from "@tanstack/react-query";
import { SUPPORTED_CURRENCIES, getCurrencyInfo } from "@repo/utils";
import { useProductWorkspace } from "../ProductWorkspaceContext";
import type { ProductDetail } from "../../../../types/catalog";
import { productPricesApi } from "../../../../api/pricing/product-prices";
import { usePriceLists } from "../../../../hooks/usePriceLists";

const { Text } = Typography;

export function PricingSection({ product }: { product?: ProductDetail }) {
  const t = useTranslations();
  const [form] = Form.useForm();
  const { productId, markSectionDirty, registerSaveHandler } = useProductWorkspace();
  const queryClient = useQueryClient();
  const priceLists = usePriceLists({ pageSize: 100 });

  const initialCurrency = (product?.pricing?.currencyId && !product.pricing.currencyId.includes("-"))
    ? product.pricing.currencyId
    : (product?.currency ?? "SAR");
  const watchedCurrency = Form.useWatch("currencyId", form);
  const currentCurrency = watchedCurrency || initialCurrency;
  const currencyInfo = getCurrencyInfo(currentCurrency);
  const currencyPrefix = currencyInfo?.symbol ?? currentCurrency;

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        price: product.pricing?.price ?? product.price ?? undefined,
        compareAtPrice: product.pricing?.compareAtPrice ?? product.compareAtPrice ?? undefined,
        cost: product.pricing?.costPrice ?? product.cost ?? undefined,
        currencyId: initialCurrency,
        priceListId: (product?.pricing as unknown as { priceListId?: string })?.priceListId ?? undefined,
      });
    }
  }, [product, form, initialCurrency]);

  useEffect(() => {
    registerSaveHandler("pricing", async () => {
      const values = await form.validateFields();
      if (!productId) return;

      const priceValue = values.price !== undefined && values.price !== null ? Number(values.price) : 0;
      if (priceValue <= 0) {
        return;
      }

      const saveCurrency = (values.currencyId as string) || currentCurrency;

      let existingPriceId = product?.pricing?.priceId;
      let effectiveFrom = product?.pricing?.effectiveFrom
        ? new Date(product.pricing.effectiveFrom).toISOString()
        : new Date().toISOString();
      let effectiveTo = product?.pricing?.effectiveTo
        ? new Date(product.pricing.effectiveTo).toISOString()
        : null;

      if (!existingPriceId) {
        try {
          const prices = await productPricesApi.getByProduct(productId);
          const found = prices?.find(p => !p.variantId && p.status !== 3);
          if (found) {
            existingPriceId = found.id;
            effectiveFrom = found.effectiveFrom ? new Date(found.effectiveFrom).toISOString() : effectiveFrom;
            effectiveTo = found.effectiveTo ? new Date(found.effectiveTo).toISOString() : effectiveTo;
          }
        } catch {
          // ignore error
        }
      }

      if (existingPriceId) {
        await productPricesApi.update(existingPriceId, {
          baseAmount: priceValue,
          compareAtAmount: values.compareAtPrice !== undefined && values.compareAtPrice !== null && values.compareAtPrice !== "" ? Number(values.compareAtPrice) : null,
          costAmount: values.cost !== undefined && values.cost !== null && values.cost !== "" ? Number(values.cost) : null,
          minAmount: null,
          maxAmount: null,
          effectiveFrom,
          effectiveTo,
        });
      } else {
        await productPricesApi.create({
          productId,
          priceListId: values.priceListId as string | undefined,
          currencyId: saveCurrency,
          baseAmount: priceValue,
          compareAtAmount: values.compareAtPrice !== undefined && values.compareAtPrice !== null && values.compareAtPrice !== "" ? Number(values.compareAtPrice) : null,
          costAmount: values.cost !== undefined && values.cost !== null && values.cost !== "" ? Number(values.cost) : null,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["catalog", "product", undefined, productId] });
      queryClient.invalidateQueries({ queryKey: ["pricing", "product-prices"] });
    });
  }, [registerSaveHandler, form, productId, product, queryClient, currentCurrency]);

  const price = Form.useWatch("price", form) || 0;
  const cost = Form.useWatch("cost", form) || 0;

  const profit = Math.max(0, price - cost);
  const margin = price > 0 ? (profit / price) * 100 : 0;

  return (
    <Card 
      title={t("catalog.products.create.pricing") || "Pricing"}
      style={{ borderRadius: 16, border: "1px solid var(--border-light)", marginBottom: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => markSectionDirty("pricing")}
        validateTrigger={["onBlur", "onSubmit"]}
      >
        <Row gutter={16}>
          <Col xs={24} sm={14}>
            <Form.Item name="priceListId" label={t("pricing.productPrices.priceListColumn") || "قائمة الأسعار"}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder={t("pricing.productPrices.selectPriceList") || "اختر قائمة الأسعار (اختياري)"}
                loading={priceLists.isLoading}
                options={(priceLists.data?.data ?? []).map((pl) => ({ value: pl.id, label: pl.name }))}
                onChange={(plId) => {
                  if (plId) {
                    const pl = (priceLists.data?.data ?? []).find(p => p.id === plId);
                    if (pl?.currencyId && !pl.currencyId.includes("-")) {
                      form.setFieldValue("currencyId", pl.currencyId);
                    }
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={10}>
            <Form.Item name="currencyId" label={t("pricing.priceLists.currency") || "العملة"}>
              <Select
                showSearch
                optionFilterProp="label"
                placeholder={t("pricing.priceLists.currency") || "اختر العملة"}
                options={SUPPORTED_CURRENCIES.map((c) => ({
                  value: c.code,
                  label: `${c.flag} ${c.code} — ${c.nameAr} (${c.nameEn})`,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="price" label={t("catalog.products.create.price") || "Selling Price"}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" prefix={currencyPrefix} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="compareAtPrice" label={t("catalog.products.create.compareAtPrice") || "Compare-at Price"} extra={t("catalog.products.create.helpers.compareAtPrice") || "Shows customers the original price before discount."}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" prefix={currencyPrefix} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="cost" label={t("catalog.products.create.cost") || "Cost"} extra={t("catalog.products.create.helpers.cost") || "The amount you paid to purchase or manufacture this product."}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" prefix={currencyPrefix} />
            </Form.Item>
          </Col>
        </Row>
        
        {(price > 0 || cost > 0) && (
          <>
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={16}>
              <Col xs={12} sm={8}>
                <Statistic title={t("catalog.products.workspace.profit") || t("catalog.products.create.profit") || "Profit"} value={profit} precision={2} prefix={currencyPrefix} />
              </Col>
              <Col xs={12} sm={8}>
                <Statistic title={t("catalog.products.workspace.margin") || t("catalog.products.create.margin") || "Margin"} value={margin} precision={2} suffix="%" />
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Card>
  );
}
