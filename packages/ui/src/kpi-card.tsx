"use client";

import React from 'react';
import { Typography, Spin } from 'antd';

const { Text } = Typography;

export interface KPICardProps {
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, trend, icon, loading, className, onClick }) => (
  <div
    className={`s2s-kpi-card ${className || ''}`}
    onClick={onClick}
    style={{
      background: 'var(--bg-card)',
      borderRadius: 16,
      border: '1px solid var(--border)',
      padding: 24,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow 0.2s ease',
    }}
    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.04)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
  >
    {loading ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Spin size="small" />
        <div style={{ height: 20, background: 'var(--border-light)', borderRadius: 6, width: '60%' }} />
        <div style={{ height: 32, background: 'var(--border-light)', borderRadius: 8, width: '40%' }} />
      </div>
    ) : (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </Text>
          {icon && (
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: 18 }}>
              {icon}
            </div>
          )}
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 4 }}>
          {value}
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: trend.direction === 'up' ? 'var(--success)' : 'var(--error)', fontSize: 12 }}>
              {trend.direction === 'up' ? '\u25B2' : '\u25BC'}
            </span>
            <Text style={{ fontSize: 13, fontWeight: 500, color: trend.direction === 'up' ? 'var(--success)' : 'var(--error)' }}>
              {trend.value}
            </Text>
          </div>
        )}
      </>
    )}
  </div>
);