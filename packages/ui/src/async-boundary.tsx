"use client";

import React from "react";
import { Alert, Button, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { EmptyState } from "./empty-state";

export interface AsyncBoundaryProps {
  loading?: boolean;
  error?: Error | null;
  retry?: () => void;
  skeleton?: React.ReactNode;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
  children: React.ReactNode;
}

export function AsyncBoundary({
  loading,
  error,
  retry,
  skeleton,
  empty,
  emptyTitle,
  emptyDescription,
  emptyAction,
  children,
}: AsyncBoundaryProps): React.ReactNode {
  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Something went wrong"
        description={error.message || "Failed to load data."}
        action={
          retry ? (
            <Button size="small" icon={<ReloadOutlined />} onClick={retry}>
              Retry
            </Button>
          ) : undefined
        }
      />
    );
  }

  if (loading) {
    return skeleton ?? (
      <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (empty) {
    return (
      <EmptyState title={emptyTitle ?? "Nothing here yet"} description={emptyDescription} action={emptyAction} />
    );
  }

  return <>{children}</>;
}
