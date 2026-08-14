"use client";

import React, { useState } from "react";
import { Tabs } from "antd";
import {
  ShoppingOutlined,
  KeyOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
import type { ProjectDetailDto } from "@repo/shared-types";
import type { StoreDto } from "@/api/store-settings";
import { useTranslations } from "@repo/localization";
import EcommerceTab from "./tabs/ecommerce-tab";
import ApiKeysTab from "./tabs/api-keys-tab";
import LanguagesTab from "./tabs/languages-tab";

const SETTINGS_TABS = ["ecommerce", "api-keys", "languages"] as const;
export type StoreSettingsTabKey = (typeof SETTINGS_TABS)[number];

interface StoreSettingsTabsProps {
  project: ProjectDetailDto;
  store?: StoreDto | null;
}

export default function StoreSettingsTabs({ project, store }: StoreSettingsTabsProps) {
  const t = useTranslations();
  const [activeKey, setActiveKey] = useState<StoreSettingsTabKey>("ecommerce");

  const items = [
    {
      key: "ecommerce" as const,
      label: (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <ShoppingOutlined />
          <bdi>{t("settings.tabs.ecommerce")}</bdi>
        </span>
      ),
      children: <EcommerceTab project={project} store={store} />,
    },
    {
      key: "api-keys" as const,
      label: (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <KeyOutlined />
          <bdi>{t("settings.tabs.apiKeys")}</bdi>
        </span>
      ),
      children: <ApiKeysTab project={project} />,
    },
    {
      key: "languages" as const,
      label: (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <TranslationOutlined />
          <bdi>{t("settings.tabs.languages")}</bdi>
        </span>
      ),
      children: <LanguagesTab project={project} />,
    },
  ];

  return (
    <Tabs
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key as StoreSettingsTabKey)}
      tabPosition="top"
      items={items}
      size="large"
      tabBarGutter={20}
      tabBarStyle={{
        marginBottom: 20,
        borderBottom: "2px solid #f1f5f9",
      }}
      animated={{ inkBar: true, tabPane: true }}
    />
  );
}