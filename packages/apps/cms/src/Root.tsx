'use client';

import React from 'react';
import { ProjectId } from '@repo/shared-types';
import HomePage from './app/admin/page';

interface CmsAppRootProps {
  projectId: ProjectId;
}

export default function CmsAppRoot({ projectId }: CmsAppRootProps) {
  return <HomePage projectId={projectId} />;
}
