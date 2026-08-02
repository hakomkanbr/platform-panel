import {
  AccountBookOutlined,
  ApiOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  ContactsOutlined,
  ControlOutlined,
  CreditCardOutlined,
  CrownOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FileTextOutlined,
  FolderOutlined,
  HomeOutlined,
  IdcardOutlined,
  LineChartOutlined,
  MailOutlined,
  MenuOutlined,
  MessageOutlined,
  PayCircleOutlined,
  PercentageOutlined,
  PictureOutlined,
  RocketOutlined,
  RollbackOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SkinOutlined,
  TagOutlined,
  TagsOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";

import type { NavigationItem } from "./types";

const SoonBadge = () => (
  <Tag
    style={{
      marginInlineStart: 6,
      fontSize: 10,
      lineHeight: "16px",
      borderRadius: 999,
    }}
    color="orange"
  >
    Soon
  </Tag>
);

export const platformNavigation: NavigationItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/admin",
    icon: <HomeOutlined />,
  },
  {
    key: "projects",
    label: "Projects",
    path: "/admin/projects",
    icon: <FolderOutlined />,
  },
  {
    key: "billing",
    label: "Billing",
    path: "/admin/billing",
    icon: <CreditCardOutlined />,
  },
  {
    key: "team",
    label: (
      <>
        Team <SoonBadge />
      </>
    ),
    path: "/admin/users",
    disabled: true,
    icon: <UserOutlined />,
  },
  {
    key: "catalog",
    label: "Catalog",
    path: "/admin/catalog",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "products",
        label: "Products",
        path: "/admin/catalog/products",
        icon: <ShoppingOutlined />,
      },
      {
        key: "categories",
        label: "Categories",
        path: "/admin/catalog/categories",
        icon: <UnorderedListOutlined />,
      },
      {
        key: "brands",
        label: "Brands",
        path: "/admin/catalog/brands",
        icon: <CrownOutlined />,
      },
      {
        key: "tags",
        label: "Tags",
        path: "/admin/catalog/tags",
        icon: <TagOutlined />,
      },
      {
        key: "attributes",
        label: "Attributes",
        path: "/admin/catalog/attributes",
        icon: <ControlOutlined />,
      },
    ],
  },
  {
    key: "pricing",
    label: "Pricing",
    path: "/admin/pricing",
    icon: <TagsOutlined />,
    children: [
      {
        key: "price-lists",
        label: "Price Lists",
        path: "/admin/pricing/price-lists",
        icon: <DollarOutlined />,
      },
      {
        key: "discounts",
        label: (
          <>
            Discounts <SoonBadge />
          </>
        ),
        path: "/admin/pricing/discounts",
        icon: <PercentageOutlined />,
        disabled: true,
      },
      {
        key: "taxes",
        label: (
          <>
            Taxes <SoonBadge />
          </>
        ),
        path: "/admin/pricing/taxes",
        icon: <AccountBookOutlined />,
        disabled: true,
      },
    ],
  },
  {
    key: "orders",
    label: (
      <>
        Orders <SoonBadge />
      </>
    ),
    path: "/admin/orders",
    icon: <ShoppingCartOutlined />,
    disabled: true,
    children: [
      {
        key: "orders-list",
        label: (
          <>
            Orders <SoonBadge />
          </>
        ),
        path: "/admin/orders",
        icon: <ShoppingCartOutlined />,
        disabled: true,
      },
      {
        key: "returns",
        label: (
          <>
            Returns <SoonBadge />
          </>
        ),
        path: "/admin/orders/returns",
        icon: <RollbackOutlined />,
        disabled: true,
      },
      {
        key: "draft-orders",
        label: (
          <>
            Draft Orders <SoonBadge />
          </>
        ),
        path: "/admin/orders/draft-orders",
        icon: <FileTextOutlined />,
        disabled: true,
      },
    ],
  },
  {
    key: "customers",
    label: (
      <>
        Customers <SoonBadge />
      </>
    ),
    path: "/admin/customers",
    icon: <ContactsOutlined />,
    disabled: true,
    children: [
      {
        key: "customers-list",
        label: (
          <>
            Customers <SoonBadge />
          </>
        ),
        path: "/admin/customers",
        icon: <IdcardOutlined />,
        disabled: true,
      },
      {
        key: "groups",
        label: (
          <>
            Groups <SoonBadge />
          </>
        ),
        path: "/admin/customers/groups",
        icon: <TeamOutlined />,
        disabled: true,
      },
      {
        key: "addresses",
        label: (
          <>
            Addresses <SoonBadge />
          </>
        ),
        path: "/admin/customers/addresses",
        icon: <EnvironmentOutlined />,
        disabled: true,
      },
    ],
  },
  {
    key: "content",
    label: (
      <>
        Content <SoonBadge />
      </>
    ),
    path: "/admin/content",
    icon: <FileTextOutlined />,
    disabled: true,
    children: [
      {
        key: "pages",
        label: (
          <>
            Pages <SoonBadge />
          </>
        ),
        path: "/admin/content/pages",
        icon: <FileTextOutlined />,
        disabled: true,
      },
      {
        key: "menus",
        label: (
          <>
            Menus <SoonBadge />
          </>
        ),
        path: "/admin/content/menus",
        icon: <MenuOutlined />,
        disabled: true,
      },
      {
        key: "themes",
        label: (
          <>
            Themes <SoonBadge />
          </>
        ),
        path: "/admin/content/themes",
        icon: <SkinOutlined />,
        disabled: true,
      },
      {
        key: "media",
        label: (
          <>
            Media <SoonBadge />
          </>
        ),
        path: "/admin/content/media",
        icon: <PictureOutlined />,
        disabled: true,
      },
    ],
  },
  {
    key: "analytics",
    label: (
      <>
        Analytics <SoonBadge />
      </>
    ),
    path: "/admin/analytics",
    icon: <BarChartOutlined />,
    disabled: true,
    children: [
      {
        key: "sales",
        label: (
          <>
            Sales <SoonBadge />
          </>
        ),
        path: "/admin/analytics/sales",
        icon: <LineChartOutlined />,
        disabled: true,
      },
      {
        key: "visitors",
        label: (
          <>
            Visitors <SoonBadge />
          </>
        ),
        path: "/admin/analytics/visitors",
        icon: <EyeOutlined />,
        disabled: true,
      },
      {
        key: "reports",
        label: (
          <>
            Reports <SoonBadge />
          </>
        ),
        path: "/admin/analytics/reports",
        icon: <BarChartOutlined />,
        disabled: true,
      },
    ],
  },
  {
    key: "integrations",
    label: (
      <>
        Integrations <SoonBadge />
      </>
    ),
    path: "/admin/integrations",
    icon: <ApiOutlined />,
    disabled: true,
    children: [
      {
        key: "payments",
        label: (
          <>
            Payments <SoonBadge />
          </>
        ),
        path: "/admin/integrations/payments",
        icon: <PayCircleOutlined />,
        disabled: true,
      },
      {
        key: "shipping",
        label: (
          <>
            Shipping <SoonBadge />
          </>
        ),
        path: "/admin/integrations/shipping",
        icon: <RocketOutlined />,
        disabled: true,
      },
      {
        key: "email",
        label: (
          <>
            Email <SoonBadge />
          </>
        ),
        path: "/admin/integrations/email",
        icon: <MailOutlined />,
        disabled: true,
      },
      {
        key: "sms",
        label: (
          <>
            SMS <SoonBadge />
          </>
        ),
        path: "/admin/integrations/sms",
        icon: <MessageOutlined />,
        disabled: true,
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    path: "/admin/setting",
    icon: <SettingOutlined />,
  },
];
