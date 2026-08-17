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
  ShopOutlined,
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
    labelKey: "common.nav.dashboard",
    path: "/admin",
    icon: <HomeOutlined />,
  },
  {
    key: "projects",
    label: "Projects",
    labelKey: "common.nav.projects",
    path: "/admin/projects",
    icon: <FolderOutlined />,
  },
  {
    key: "marketplace",
    label: "Marketplace",
    labelKey: "common.nav.marketplace",
    path: "/admin/marketplace",
    icon: <ShopOutlined />,
  },
  {
    key: "billing",
    label: "Billing",
    labelKey: "common.nav.billing",
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
    labelKey: "common.nav.catalog",
    path: "/admin/catalog",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "products",
        label: "Products",
        labelKey: "common.nav.products",
        path: "/admin/catalog/products",
        icon: <ShoppingOutlined />,
      },
      {
        key: "categories",
        label: "Categories",
        labelKey: "common.nav.categories",
        path: "/admin/catalog/categories",
        icon: <UnorderedListOutlined />,
      },
      {
        key: "brands",
        label: "Brands",
        labelKey: "common.nav.brands",
        path: "/admin/catalog/brands",
        icon: <CrownOutlined />,
      },
      {
        key: "tags",
        label: "Tags",
        labelKey: "common.nav.tags",
        path: "/admin/catalog/tags",
        icon: <TagOutlined />,
      },
      {
        key: "attributes",
        label: "Attributes",
        labelKey: "common.nav.attributes",
        path: "/admin/catalog/attributes",
        icon: <ControlOutlined />,
      },
    ],
  },
  {
    key: "pricing",
    label: "Pricing",
    labelKey: "common.nav.pricing",
    path: "/admin/pricing",
    icon: <TagsOutlined />,
    children: [
      {
        key: "price-lists",
        label: "Price Lists",
        labelKey: "common.nav.priceLists",
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
    label: "Orders",
    labelKey: "common.nav.orders",
    path: "/admin/orders",
    icon: <ShoppingCartOutlined />,
    disabled: false,
    children: [
      {
        key: "orders-list",
        label: "Orders",
        labelKey: "common.nav.ordersList",
        path: "/admin/orders",
        icon: <ShoppingCartOutlined />,
        disabled: false,
      },
      {
        key: "returns",
        label: (
          <>
            Returns <SoonBadge />
          </>
        ),
        labelKey: "common.nav.returns",
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
        labelKey: "common.nav.draftOrders",
        path: "/admin/orders/draft-orders",
        icon: <FileTextOutlined />,
        disabled: true,
      },
    ],
  },
  {
    key: "customers",
    label: "Customers",
    labelKey: "common.nav.customers",
    path: "/admin/customers",
    icon: <ContactsOutlined />,
    disabled: false,
    children: [
      {
        key: "customers-list",
        label: "Customers",
        labelKey: "common.nav.customersList",
        path: "/admin/customers",
        icon: <IdcardOutlined />,
        disabled: false,
      },
      {
        key: "groups",
        label: (
          <>
            Groups <SoonBadge />
          </>
        ),
        labelKey: "common.nav.groups",
        path: "/admin/customers/groups",
        icon: <TeamOutlined />,
        disabled: true,
      },
      {
        key: "addresses",
        label: "Addresses",
        labelKey: "common.nav.addresses",
        path: "/admin/customers/addresses",
        icon: <EnvironmentOutlined />,
        disabled: false,
      },
    ],
  },
  // {
  //   key: "content",
  //   label: (
  //     <>
  //       Content <SoonBadge />
  //     </>
  //   ),
  //   path: "/admin/content",
  //   icon: <FileTextOutlined />,
  //   disabled: true,
  //   children: [
  //     {
  //       key: "pages",
  //       label: (
  //         <>
  //           Pages <SoonBadge />
  //         </>
  //       ),
  //       path: "/admin/content/pages",
  //       icon: <FileTextOutlined />,
  //       disabled: true,
  //     },
  //     {
  //       key: "menus",
  //       label: (
  //         <>
  //           Menus <SoonBadge />
  //         </>
  //       ),
  //       path: "/admin/content/menus",
  //       icon: <MenuOutlined />,
  //       disabled: true,
  //     },
  //     {
  //       key: "themes",
  //       label: (
  //         <>
  //           Themes <SoonBadge />
  //         </>
  //       ),
  //       path: "/admin/content/themes",
  //       icon: <SkinOutlined />,
  //       disabled: true,
  //     },
  //     {
  //       key: "media",
  //       label: (
  //         <>
  //           Media <SoonBadge />
  //         </>
  //       ),
  //       path: "/admin/content/media",
  //       icon: <PictureOutlined />,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   key: "analytics",
  //   label: (
  //     <>
  //       Analytics <SoonBadge />
  //     </>
  //   ),
  //   path: "/admin/analytics",
  //   icon: <BarChartOutlined />,
  //   disabled: true,
  //   children: [
  //     {
  //       key: "sales",
  //       label: (
  //         <>
  //           Sales <SoonBadge />
  //         </>
  //       ),
  //       path: "/admin/analytics/sales",
  //       icon: <LineChartOutlined />,
  //       disabled: true,
  //     },
  //     {
  //       key: "visitors",
  //       label: (
  //         <>
  //           Visitors <SoonBadge />
  //         </>
  //       ),
  //       path: "/admin/analytics/visitors",
  //       icon: <EyeOutlined />,
  //       disabled: true,
  //     },
  //     {
  //       key: "reports",
  //       label: (
  //         <>
  //           Reports <SoonBadge />
  //         </>
  //       ),
  //       path: "/admin/analytics/reports",
  //       icon: <BarChartOutlined />,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   key: "integrations",
  //   label: (
  //     <>
  //       Integrations <SoonBadge />
  //     </>
  //   ),
  //   path: "/admin/integrations",
  //   icon: <ApiOutlined />,
  //   disabled: true,
  //   children: [
  //     {
  //       key: "payments",
  //       label: (
  //         <>
  //           Payments <SoonBadge />
  //         </>
  //       ),
  //       path: "/admin/integrations/payments",
  //       icon: <PayCircleOutlined />,
  //       disabled: true,
  //     },
  //     {
  //       key: "shipping",
  //       label: (
  //         <>
  //           Shipping <SoonBadge />
  //         </>
  //       ),
  //       path: "/admin/integrations/shipping",
  //       icon: <RocketOutlined />,
  //       disabled: true,
  //     },
  //     {
  //       key: "email",
  //       label: (
  //         <>
  //           Email <SoonBadge />
  //         </>
  //       ),
  //       path: "/admin/integrations/email",
  //       icon: <MailOutlined />,
  //       disabled: true,
  //     },
  //     {
  //       key: "sms",
  //       label: (
  //         <>
  //           SMS <SoonBadge />
  //         </>
  //       ),
  //       path: "/admin/integrations/sms",
  //       icon: <MessageOutlined />,
  //       disabled: true,
  //     },
  //   ],
  // },
  {
    key: "settings",
    label: "Settings",
    labelKey: "common.nav.settings",
    path: "/admin/setting",
    icon: <SettingOutlined />,
  },
];
