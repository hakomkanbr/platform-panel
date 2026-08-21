"use client";

import React from "react";
import { EBreadcrumb, PageHeader } from "@repo/ui";

export interface CommerceBreadcrumb {
  title: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

export interface CommerceShellProps {
  title: string;
  description?: string;
  breadcrumbs?: CommerceBreadcrumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  contentPadding?: number;
}

export const CommerceShell: React.FC<CommerceShellProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  contentPadding = 24,
}) => {
  return (
    <div style={{ padding: `${contentPadding}px 32px` }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <EBreadcrumb items={breadcrumbs} showBackground={false} />
        </div>
      )}
      <PageHeader title={title} description={description} extra={actions} />
      <div style={{ marginTop: 24 }}>{children}</div>
    </div>
  );
};
