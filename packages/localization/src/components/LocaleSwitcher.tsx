"use client";

import { Button, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useLocalization } from "../context/localizationContext";
import { SUPPORTED_LOCALES } from "../constants/languages";
import type { Locale } from "../types";

/** Native names shown in the menu (not translated, language-invariant). */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  tr: "Türkçe",
};

/**
 * Header control that lets the user switch the active UI locale. Uses the
 * localization context so every translated component re-renders automatically.
 */
export function LocaleSwitcher() {
  const { locale, change } = useLocalization();

  const items: MenuProps["items"] = SUPPORTED_LOCALES.map((code) => ({
    key: code,
    label: LOCALE_LABELS[code],
  }));

  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: [locale],
        onClick: ({ key }) => change(key as Locale),
      }}
      placement="bottomRight"
    >
      <Button
        type="text"
        icon={<GlobalOutlined style={{ fontSize: 16, color: "#6B7280" }} />}
        style={{
          display: "flex",
          alignItems: "center",
          height: 36,
          color: "#1F2937",
        }}
      >
        {LOCALE_LABELS[locale] ?? "Language"}
      </Button>
    </Dropdown>
  );
}