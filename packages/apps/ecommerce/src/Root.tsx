'use client';

import React from 'react';
import DashboardPage from './app/page';
import type { ProjectId } from '@repo/shared-types';

interface EcommerceAppRootProps {
  projectId: ProjectId;
}

export default function EcommerceAppRoot({ projectId }: EcommerceAppRootProps) {
  return <>{projectId}</>;
}
