"use client";

import React from "react";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { modernTheme, globalStyles } from "@repo/theme";
import { StoreProvider } from "@repo/store";
import { AuthProvider } from "@repo/auth";
import { QueryProvider } from "@repo/ui";

export interface S2SProviderProps {
  children: React.ReactNode;
  includeStore?: boolean;
  includeAuth?: boolean;
  includeQuery?: boolean;
}

export function S2SProvider({
  children,
  includeAuth = true,
  includeQuery = true,
}: S2SProviderProps) {
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
      <ConfigProvider theme={modernTheme}>
        <AntdRegistry>
          <StoreProvider>{content}</StoreProvider>
        </AntdRegistry>
      </ConfigProvider>
    </>
  );
}

export default S2SProvider;
