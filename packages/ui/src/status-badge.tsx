"use client";

import React from 'react';

export type BadgeStatus = 'active' | 'pending' | 'inactive' | 'draft' | 'info';

export interface StatusBadgeProps {
  status: BadgeStatus | string;
  label?: string;
  className?: string;
}

const statusMap: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'active' },
  published: { label: 'Published', className: 'active' },
  live: { label: 'Live', className: 'active' },
  success: { label: 'Success', className: 'active' },
  pending: { label: 'Pending', className: 'pending' },
  waiting: { label: 'Waiting', className: 'pending' },
  processing: { label: 'Processing', className: 'pending' },
  inactive: { label: 'Inactive', className: 'inactive' },
  disabled: { label: 'Disabled', className: 'inactive' },
  error: { label: 'Error', className: 'inactive' },
  failed: { label: 'Failed', className: 'inactive' },
  draft: { label: 'Draft', className: 'draft' },
  info: { label: 'Info', className: 'info' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const config = statusMap[status.toLowerCase()] || { label: status, className: 'draft' };
  return (
    <span className={`s2s-badge ${config.className}`}>
      {label || config.label}
    </span>
  );
};