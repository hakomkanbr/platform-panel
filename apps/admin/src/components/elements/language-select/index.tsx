"use client";

import ILanguage from "@/abstracts/language";
import api from "@/api/api-context";
import api_points from "@/api/points";
import { setLanguages, setSelectedLang } from "@/lib/redux-toolkit/slice/language-slice";
import { RootState } from "@/lib/redux-toolkit/store";
import { DownOutlined, GlobalOutlined, CheckOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Space, Button, Typography, Badge } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import './language-select.css';

const { Text } = Typography;

export default function LanguageSelect({
  title,
  onClick = () => { },
  singleItem,
  size = "default",
  variant = "default"
}: {
  title: string,
  singleItem: React.ReactNode
  onClick?: MenuProps['onClick']
  size?: "small" | "default" | "large"
  variant?: "default" | "compact" | "minimal"
}) {
  const { languages } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  // If no languages available, return empty
  if (languages.list.length === 0) {
    return null;
  }

  // If only one language, show it without dropdown
  if (languages.list.length === 1) {
    if (!singleItem) {
      return (
        <div className={`language-single ${variant} ${size}`}>
          <Space>
            <GlobalOutlined className="language-icon" />
            <Text className="language-text">{languages.selectedLang?.name}</Text>
          </Space>
        </div>
      );
    }
    return singleItem;
  }

  const handleLanguageChange = (e: any) => {
    const lang: ILanguage | undefined = languages.list.find(i => i.slug === e.key);
    if (lang) {
      dispatch(setSelectedLang(lang));
    }
    onClick(e);
  };

  const menuItems = languages.list.map((language) => ({
    label: (
      <div className="language-menu-item">
        <Space>
          <GlobalOutlined className="language-menu-icon" />
          <span className="language-menu-text">{language.name}</span>
          {languages.selectedLang?.slug === language.slug && (
            <CheckOutlined className="language-check-icon" />
          )}
        </Space>
      </div>
    ),
    key: language.slug,
    className: languages.selectedLang?.slug === language.slug ? 'language-menu-item-selected' : ''
  }));

  const selectedLanguageName = languages.selectedLang ? languages.selectedLang.name : title;
  const languageCount = languages.list.length;

  if (variant === "minimal") {
    return (
      <Dropdown 
        menu={{
          selectable: true,
          onClick: handleLanguageChange,
          items: menuItems,
          className: "language-dropdown-menu"
        }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Button 
          type="text" 
          className={`language-select-minimal ${size}`}
          icon={<GlobalOutlined />}
        >
          {selectedLanguageName}
        </Button>
      </Dropdown>
    );
  }

  if (variant === "compact") {
    return (
      <Dropdown 
        menu={{
          selectable: true,
          onClick: handleLanguageChange,
          items: menuItems,
          className: "language-dropdown-menu"
        }}
        trigger={['click']}
        placement="bottomLeft"
      >
        <Button 
          className={`language-select-compact ${size}`}
          size={size === "small" ? "small" : size === "large" ? "large" : "middle"}
        >
          <Space>
            <GlobalOutlined />
            <Text className="language-compact-text">{selectedLanguageName}</Text>
            <Badge count={languageCount} size="small" className="language-badge" />
            <DownOutlined className="language-arrow" />
          </Space>
        </Button>
      </Dropdown>
    );
  }

  // Default variant
  return (
    <div className={`language-select-container ${variant} ${size}`}>
      <Dropdown 
        menu={{
          selectable: true,
          onClick: handleLanguageChange,
          items: menuItems,
          className: "language-dropdown-menu"
        }}
        trigger={['click']}
        placement="bottomLeft"
      >
        <Button 
          className={`language-select-button ${size}`}
          size={size === "small" ? "small" : size === "large" ? "large" : "middle"}
        >
          <div className="language-button-content">
            <Space className="language-button-left">
              <GlobalOutlined className="language-button-icon" />
              <div className="language-button-text">
                <Text className="language-label">Language</Text>
                <Text className="language-value">{selectedLanguageName}</Text>
              </div>
            </Space>
            <div className="language-button-right">
              <Badge count={languageCount} size="small" className="language-count-badge" />
              <DownOutlined className="language-dropdown-arrow" />
            </div>
          </div>
        </Button>
      </Dropdown>
    </div>
  );
}