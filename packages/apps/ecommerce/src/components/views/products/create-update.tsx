import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Card, Col, Layout, Menu, message, Row, Space, Typography, Button, Spin,
} from "antd";
import {
  FaBoxOpen, FaCheckCircle, FaLayerGroup, FaCogs, FaPercent, FaEye,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import generateRows from "./helper/generateRows";
import makeCombinations from "./helper/makeCombinations";
import formatMoney from "@/lib/formatMoney";
import PublishPanel from "./create-update-sections/publish-panel";
import ProductSetup from "./create-update-sections/ProductSetup";
import MatrixPanel from "./create-update-sections/MatrixPanel";
import DiscountsPanel from "./create-update-sections/DiscountsPanel";
import InventoryPanel from "./create-update-sections/InventoryPanel";
import type { InventoryAllocation } from "./create-update-sections/InventoryPanel";
import PreviewPanel from "./create-update-sections/PreviewPanel";
import { productsApi } from "@/lib/api/products";
import { inventoryApi } from "@/lib/api/inventory";
import slug from "@/lib/slug";
import { categoriesApi } from "@/lib/api/categories";
import { brandsApi } from "@/lib/api/brands";
import type {
  ProductSetupData, VariantType, VariantRow, ProductImages,
  DiscountRuleDto, SpecialDiscountDto, DiscountRuleForm,
  ProductDetail, Brand, Category, PaginatedList,
} from "@/types";

const { Sider, Content } = Layout;
const { Text } = Typography;

const INITIAL_PRODUCT: ProductSetupData = {
  name: "",
  categoryId: null,
  category: null,
  brandId: null,
  vatRate: 0,
  not: "",
  minQty: 1,
  startQty: 1,
  unit: 0,
  stepQty: 1,
  basePrice: 0,
  properties: [{ key: "", value: "" }],
  globalDiscountIds: [],
  description: "",
  image: "",
};

const INITIAL_SPECIAL: SpecialDiscountDto = {
  active: true,
  title: "Special Campaign",
  type: "percent",
  value: 3,
  combine: true,
  maxTotalRate: 12,
  useRange: false,
  from: "",
  to: "",
};

function CreateUpdateView({ editId }: { editId?: string }) {
  const router = useRouter();
  const [tab, setTab] = useState("setup");
  const [product, setProduct] = useState<ProductSetupData>(INITIAL_PRODUCT);
  const [types, setTypes] = useState<VariantType[]>([]);
  const [valueImages, setValueImages] = useState<Record<string, string>>({});
  const [effects, setEffects] = useState<Record<string, number>>({});
  const [rows, setRows] = useState<VariantRow[]>(() => generateRows([]));
  const [discounts, setDiscounts] = useState<DiscountRuleForm[]>([]);
  const [specialDiscount, setSpecialDiscount] = useState<SpecialDiscountDto>(INITIAL_SPECIAL);
  const [inventoryData, setInventoryData] = useState<Record<string, InventoryAllocation>>({});
  const [productImages, setProductImages] = useState<ProductImages[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  const isEditMode = Boolean(editId);

  useEffect(() => {
    categoriesApi.list().then((data: Category[]) => setCategories(data)).catch(() => {});
    brandsApi.list().then((data: PaginatedList<Brand>) => setBrands(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!editId) return;
    setLoading(true);
    productsApi.getById(editId)
      .then((data: ProductDetail) => {
        setProduct({
          name: data.title || "",
          categoryId: data.category?.id ? Number(data.category.id) : null,
          category: data.category?.name || "",
          brandId: data.brand?.id ? Number(data.brand.id) : null,
          vatRate: data.price?.taxRate || 0,
          not: data.note || "",
          minQty: data.configuration?.minQty ?? 1,
          startQty: data.configuration?.startQty ?? 1,
          unit: data.unit ?? 0,
          stepQty: data.configuration?.stepQty ?? 1,
          basePrice: data.price?.basePrice || 0,
          properties: data.properties?.length ? data.properties : [{ key: "", value: "" }],
          globalDiscountIds: data.configuration?.globalDiscountIds || [],
          description: data.description || "",
          image: data.image || "",
        });
        setTypes((data.configuration?.types || []) as VariantType[]);
        setEffects(data.configuration?.effects || {});
        setDiscounts((data.configuration?.discountRules || []).map((r) => ({
          ...r,
          minQuantity: null,
          maxQuantity: null,
        })));
        if (data.configuration?.specialDiscount) {
          setSpecialDiscount(data.configuration.specialDiscount);
        }
        setProductImages(data.images || []);
        if (data.configuration?.generatedRows?.length) {
          setRows(data.configuration.generatedRows.map((r) => ({
            attrs: r.attrs || {},
            sku: r.sku || "",
            overridePrice: r.overridePrice != null && Number(r.overridePrice) > 0 ? String(r.overridePrice) : "",
            stock: Boolean(r.stock),
            active: r.active !== false,
            imagee: r.imagee ?? null,
            images: r.images || [],
            dynamicDiscountRate: r.dynamicDiscountRate || 0,
          })));
        }
      })
      .catch((e: any) => message.error("Failed to load product: " + (e?.message || "Unknown error")))
      .finally(() => setLoading(false));
  }, [editId]);

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      const effectsPayload: Record<string, number> = {};
      Object.entries(effects).forEach(([key, val]) => { effectsPayload[key] = Number(val ?? 0); });

      const generatedRows = rows.map((row) => ({
        attrs: row.attrs,
        sku: row.sku,
        overridePrice: row.overridePrice ? String(row.overridePrice) : null,
        stock: Boolean(row.stock),
        active: Boolean(row.active),
        imagee: row.imagee ?? null,
        images: row.images ?? [],
        dynamicDiscountRate: 0,
      }));

      const discountsPayload = discounts.map((d) => ({
        id: Number(d.id ?? 0),
        scope: String(d.scope ?? ""),
        target: String(d.target ?? ""),
        useRange: Boolean(d.useRange),
        from: d.from || null,
        to: d.to || null,
        rate: Number(d.rate ?? 0),
        active: Boolean(d.active),
      }));

      const payload: any = {
        categoryId: product.categoryId ?? categories[0]?.id ?? 1,
        brandId: product.brandId ?? null,
        code: generatedRows[0]?.sku ?? slug(product.name),
        title: product.name,
        slug: slug(product.name),
        isPublishable: true,
        inStock: rows.some((r) => r.active && r.stock),
        summary: "",
        description: product.description ?? "",
        unit: product.unit ?? 0,
        not: product.not ?? "",
        image: product.image ?? "",
        price: {
          basePrice: Number(product.basePrice ?? 0),
          taxRate: Number(product.vatRate ?? 0),
          dynamicDiscountRate: 0,
        },
        properties: product.properties?.map((p) => ({ key: p.key, value: p.value })) ?? [],
        images: productImages.map((img, i) => ({
          url: img.url,
          altText: img.altText,
          sortOrder: i,
          isPrimary: i === 0,
        })),
        configuration: {
          minQty: Number(product.minQty ?? 0),
          startQty: Number(product.startQty ?? 0),
          stepQty: Number(product.stepQty ?? 0),
          types: types.map((t) => ({
            id: String(t.id),
            name: String(t.name),
            display: String(t.display),
            values: t.values.map(String),
          })),
          effects: effectsPayload,
          discounts: discountsPayload,
          specialDiscount: {
            active: Boolean(specialDiscount.active),
            title: String(specialDiscount.title ?? ""),
            type: String(specialDiscount.type ?? "percent"),
            value: Number(specialDiscount.value ?? 0),
            combine: Boolean(specialDiscount.combine),
            maxTotalRate: Number(specialDiscount.maxTotalRate ?? 0),
            useRange: specialDiscount.useRange !== false,
            from: specialDiscount.from || null,
            to: specialDiscount.to || null,
          },
          generatedRows,
        },
        globalDiscountIds: product.globalDiscountIds ?? "",
      };

      let productId: string | number | null = null;

      if (isEditMode) {
        await productsApi.update({ ...payload, id: editId });
        productId = editId;
      } else {
        productId = await productsApi.create(payload);
      }

      const inventoryEntries = Object.entries(inventoryData).filter(
        ([_, v]) => v.quantity > 0
      );
      if (inventoryEntries.length > 0) {
        await Promise.all(
          inventoryEntries.map(([key, val]) => {
            const [whId, rowIdx] = key.split(":");
            const dto: any = {
              productId: Number(productId),
              warehouseId: Number(whId),
              quantityOnHand: val.quantity,
              lowStockThreshold: val.threshold,
            };
            if (rowIdx !== undefined) {
              const comboRow = rows[Number(rowIdx)];
              if (comboRow?.id) dto.combinationRowId = Number(comboRow.id);
            }
            return inventoryApi.create(dto);
          })
        );
      }

      message.success(isEditMode ? "Product updated!" : "Product published!");
      router.push("/panel/products");
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? err?.message ?? "Error saving product");
    } finally {
      setPublishing(false);
    }
  }, [product, types, effects, rows, discounts, specialDiscount, inventoryData, productImages, isEditMode, editId, categories, router]);

  const generate = useCallback(() => {
    const count = makeCombinations(types).length;
    if (count > 150 && !window.confirm(`${count} combinations will be generated. Continue?`)) return;
    setRows((old) => generateRows(types, old));
    setTab("matrix");
  }, [types]);

  const menuItems = [
    { key: "setup", icon: <FaCogs />, label: "1. Setup" },
    { key: "matrix", icon: <FaLayerGroup />, label: "2. Variants" },
    { key: "discount", icon: <FaPercent />, label: "3. Discounts" },
    { key: "inventory", icon: <FaBoxOpen />, label: "4. Inventory" },
    { key: "preview", icon: <FaEye />, label: "5. Preview" },
    { key: "publish", icon: <FaCheckCircle />, label: "6. Publish" },
  ];

  const tabProgress = ["setup", "matrix", "discount", "inventory", "preview", "publish"];

  return (
    <Layout style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <Sider width={220} style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border-light)", paddingTop: 16 }}
        breakpoint="lg" collapsedWidth="0">
        <div style={{ padding: "0 16px 16px" }}>
          <Text style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
            {isEditMode ? "Edit Product" : "New Product"}
          </Text>
        </div>
        <Menu mode="inline" selectedKeys={[tab]} onClick={(event) => setTab(event.key)} items={menuItems} />
      </Sider>
      <Content style={{ padding: 24 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" />
            <div style={{ marginTop: 16, color: "var(--text-secondary)" }}>Loading product data...</div>
          </div>
        ) : (
          <>
            {tab === "setup" && (
              <ProductSetup
                product={product} setProduct={setProduct}
                types={types} setTypes={setTypes}
                generate={generate} rowsCount={rows.length}
                valueImages={valueImages} setValueImages={setValueImages}
                effects={effects} setEffects={setEffects}
                categories={categories} brands={brands}
                productImages={productImages} setProductImages={setProductImages}
              />
            )}
            {tab === "matrix" && (
              <MatrixPanel
                product={product} types={types} rows={rows} setRows={setRows}
                generate={generate} effects={effects}
              />
            )}
            {tab === "discount" && (
              <DiscountsPanel
                product={product} discounts={discounts} setDiscounts={setDiscounts}
                specialDiscount={specialDiscount} setSpecialDiscount={setSpecialDiscount}
              />
            )}
            {tab === "inventory" && (
              <InventoryPanel
                rows={rows}
                inventoryData={inventoryData}
                onChange={setInventoryData}
              />
            )}
            {tab === "preview" && (
              <PreviewPanel
                product={product} types={types} rows={rows}
                discounts={discounts} effects={effects} specialDiscount={specialDiscount}
              />
            )}
            {tab === "publish" && (
              <PublishPanel
                product={product} types={types} rows={rows}
                discounts={discounts} effects={effects}
                specialDiscount={specialDiscount} productImages={productImages}
                inventoryData={inventoryData}
                onPublish={handlePublish} publishing={publishing}
              />
            )}
            <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
              <Button disabled={tabProgress.indexOf(tab) === 0}
                onClick={() => setTab(tabProgress[tabProgress.indexOf(tab) - 1])}>
                Previous
              </Button>
              <Button type="primary"
                disabled={tabProgress.indexOf(tab) === tabProgress.length - 1}
                onClick={() => setTab(tabProgress[tabProgress.indexOf(tab) + 1])}>
                Next
              </Button>
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
}

export default CreateUpdateView;
