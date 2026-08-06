import { Form, Select, Input, Switch, Space, Typography } from "antd";
import { LANGUAGES, LANGUAGE_FLAGS } from "@repo/shared-types";
import { useEffect, useMemo } from "react";
import type { LanguageFormData } from "./types";

const { Text } = Typography;

interface LanguageFormProps {
  formData: LanguageFormData;
  onChange: <K extends keyof LanguageFormData>(key: K, value: LanguageFormData[K]) => void;
  editMode?: boolean;
}

export default function LanguageForm({ formData, onChange, editMode }: LanguageFormProps) {
  const languageOptions = useMemo(
    () =>
      LANGUAGES.map((lang) => ({
        value: lang.code,
        label: (
          <Space>
            <span>{LANGUAGE_FLAGS[lang.code] || "🏳️"}</span>
            <span>{lang.name}</span>
            <Text type="secondary">({lang.nativeName})</Text>
          </Space>
        ),
      })),
    []
  );

  const handleCodeChange = (code: string) => {
    const lang = LANGUAGES.find((l) => l.code === code);
    if (lang) {
      onChange("code", code);
      onChange("name", lang.name);
      onChange("nativeName", lang.nativeName);
      onChange("flag", LANGUAGE_FLAGS[code] || "🏳️");
      onChange("rtl", lang.rtl === 1);
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Text strong style={{ display: "block", marginBottom: 4 }}>
          Language <span style={{ color: "#ff4d4f" }}>*</span>
        </Text>
        <Select
          showSearch
          value={formData.code || undefined}
          onChange={handleCodeChange}
          placeholder="Select a language"
          options={languageOptions}
          style={{ width: "100%" }}
          size="large"
          filterOption={(input, option) =>
            (option?.label as any)?.props?.children?.[2]?.props?.children
              ?.toLowerCase()
              ?.includes(input.toLowerCase()) ?? false
          }
          disabled={editMode}
        />
      </div>

      <div>
        <Text strong style={{ display: "block", marginBottom: 4 }}>
          Native Name
        </Text>
        <Input
          value={formData.nativeName}
          onChange={(e) => onChange("nativeName", e.target.value)}
          placeholder="e.g., العربية"
          size="large"
          style={{ borderRadius: 6 }}
          disabled
        />
      </div>

      <div>
        <Text strong style={{ display: "block", marginBottom: 4 }}>
          Code
        </Text>
        <Input
          value={formData.code}
          placeholder="e.g., ar"
          size="large"
          style={{ borderRadius: 6, fontFamily: "monospace" }}
          disabled
        />
      </div>

      <div>
        <Space>
          <Switch
            checked={formData.rtl}
            onChange={(checked) => onChange("rtl", checked)}
          />
          <Text strong>Right-to-Left (RTL)</Text>
        </Space>
      </div>
    </Space>
  );
}
