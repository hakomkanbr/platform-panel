"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Table, Typography } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useDebouncedValue } from "@repo/hooks";
import { TableSkeleton } from "./skeleton-loader";
import { EmptyState } from "./empty-state";

const { Text } = Typography;

export interface DataTableProps<T extends object> {
  columns: TableColumnsType<T>;
  dataSource: T[];
  rowKey: keyof T | ((record: T) => React.Key);
  loading?: boolean;
  error?: Error | null;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  searchValue?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  toolbar?: React.ReactNode;
  filters?: React.ReactNode;
  rowSelection?: NonNullable<TableProps<T>["rowSelection"]>;
  bulkActions?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
  onRowClick?: (record: T) => void;
  onRefresh?: () => void;
  scroll?: { x?: number | string };
  showPagination?: boolean;
  className?: string;
}

export function DataTable<T extends object>({
  columns,
  dataSource,
  rowKey,
  loading,
  error,
  total,
  page,
  pageSize,
  onPageChange,
  searchable,
  searchPlaceholder,
  onSearch,
  searchValue,
  title,
  subtitle,
  toolbar,
  filters,
  rowSelection,
  bulkActions,
  emptyTitle,
  emptyDescription,
  emptyAction,
  onRowClick,
  onRefresh,
  scroll,
  showPagination = true,
  className,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");
  const searchTerm = searchValue !== undefined ? searchValue : internalSearch;
  const debounced = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    if (onSearch) onSearch(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const selectedCount = rowSelection?.selectedRowKeys?.length ?? 0;

  const paginationConfig: TablePaginationConfig | false = useMemo(() => {
    if (!showPagination) return false;
    return {
      current: page ?? 1,
      pageSize: pageSize ?? 10,
      total: total ?? dataSource.length,
      showSizeChanger: true,
      showTotal: (t) => `${t} total`,
      onChange: (p, ps) => onPageChange?.(p, ps),
    };
  }, [showPagination, page, pageSize, total, dataSource.length, onPageChange]);

  const renderTable = () => {
    if (loading && dataSource.length === 0) {
      return <TableSkeleton rows={8} />;
    }

    if (error) {
      return (
        <div style={{ padding: "16px 0" }}>
          <Alert
            type="error"
            showIcon
            message="Failed to load data"
            description={error.message || "Something went wrong while fetching data."}
            action={
              onRefresh ? (
                <Button size="small" icon={<ReloadOutlined />} onClick={onRefresh}>
                  Retry
                </Button>
              ) : undefined
            }
          />
        </div>
      );
    }

    return (
      <Table<T>
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={loading}
        rowSelection={rowSelection}
        pagination={paginationConfig}
        scroll={scroll ?? { x: true }}
        size="middle"
        className={className}
        onRow={
          onRowClick
            ? (record) => ({
                onClick: () => onRowClick(record),
                style: { cursor: "pointer" },
              })
            : undefined
        }
        locale={{
          emptyText:
            loading ? null : (
              <div style={{ padding: "32px 0" }}>
                <EmptyState
                  title={emptyTitle ?? "Nothing here yet"}
                  description={emptyDescription}
                  action={emptyAction}
                />
              </div>
            ),
        }}
      />
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {(title || searchable || toolbar || onRefresh) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {title ? (
            <div>
              <Text strong style={{ fontSize: 16, color: "var(--text-primary)" }}>
                {title}
              </Text>
              {subtitle && (
                <div>
                  <Text type="secondary" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {subtitle}
                  </Text>
                </div>
              )}
            </div>
          ) : (
            <div />
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {searchable && (
              <Input
                allowClear
                prefix={<SearchOutlined style={{ color: "var(--text-secondary)" }} />}
                placeholder={searchPlaceholder ?? "Search..."}
                value={searchTerm}
                onChange={(e) => {
                  setInternalSearch(e.target.value);
                  onSearch?.(e.target.value);
                }}
                style={{ width: 240 }}
              />
            )}
            {onRefresh && (
              <Button icon={<ReloadOutlined />} onClick={onRefresh}>
                Refresh
              </Button>
            )}
            {toolbar}
          </div>
        </div>
      )}

      {filters}

      {selectedCount > 0 && bulkActions && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "8px 16px",
            borderRadius: 12,
            border: "1px solid var(--primary-border, rgba(247,147,30,0.3))",
            background: "rgba(247,147,30,0.08)",
          }}
        >
          <Text strong style={{ color: "var(--text-primary)" }}>
            {selectedCount} selected
          </Text>
          <div style={{ display: "flex", gap: 8 }}>{bulkActions}</div>
        </div>
      )}

      {renderTable()}
    </div>
  );
}
