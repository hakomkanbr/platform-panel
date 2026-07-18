"use client";;
import { IModule } from '@/types/page';
import React from 'react';

const EmptyLayout: React.FC<{ children: React.ReactNode; modules: IModule[] }> = ({ children, modules }) => {

  return (
    <>
      {children}
    </>
  );
};

export default EmptyLayout;