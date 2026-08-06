"use client";
import React from "react";
import { ConfigProvider, App, theme } from "antd";
import { AuthProvider } from "@/contexts/AuthContext";
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body style={{ margin: 0 }}>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              colorPrimary: "#f97316",
              borderRadius: 8,
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            },
          }}
        >
          <App>
            <AuthProvider>{children}</AuthProvider>
          </App>
        </ConfigProvider>
      </body>
    </html>
  );
}
