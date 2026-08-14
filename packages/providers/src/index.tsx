"use client";

import React from "react";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { modernTheme, globalStyles } from "@repo/theme";
import { StoreProvider } from "@repo/store";
import { AuthProvider } from "@repo/auth";
import { QueryProvider } from "@repo/ui";
import { useDirection } from "@repo/localization";

export interface S2SProviderProps {
  children: React.ReactNode;
  includeStore?: boolean;
  includeAuth?: boolean;
  includeQuery?: boolean;
  direction?: "rtl" | "ltr";
}

export function S2SProvider({
  children,
  includeAuth = true,
  includeQuery = true,
  direction: propDirection,
}: S2SProviderProps) {
  let hookDirection: "rtl" | "ltr" = "rtl";
  try {
    hookDirection = useDirection();
  } catch {
    hookDirection = "rtl";
  }
  const direction = propDirection || hookDirection;
  let content = children;

  if (includeQuery) {
    content = <QueryProvider>{content}</QueryProvider>;
  }
  if (includeAuth) {
    content = <AuthProvider>{content}</AuthProvider>;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <ConfigProvider theme={modernTheme} direction={direction}>
        <AntdRegistry>
          <StoreProvider>{content}</StoreProvider>
        </AntdRegistry>
      </ConfigProvider>
    </>
  );
}

export default S2SProvider;
