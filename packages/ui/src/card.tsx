"use client";

import React from 'react';
import { Card as AntCard } from 'antd';
import type { CardProps as AntCardProps } from 'antd';

export interface CardProps extends AntCardProps {
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <AntCard className={`s2s-card ${className || ''}`} {...props}>
      {children}
    </AntCard>
  );
};