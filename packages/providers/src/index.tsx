"use client";

import React from "react";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { modernTheme, globalStyles } from "@repo/theme";

export interface S2SProviderProps {
  children: React.ReactNode;
}

export function S2SProvider({ children }: S2SProviderProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <ConfigProvider theme={modernTheme}>
        <AntdRegistry>{children}</AntdRegistry>
      </ConfigProvider>
    </>
  );
}

export default S2SProvider;
