"use client";

import React from "react";
import type { ProjectId } from "@repo/shared-types";
import { CommerceProvider } from "../context/CommerceContext";
import { CatalogApp } from "../app/catalog/CatalogApp";

export interface CommerceRootProps {
  projectId?: ProjectId;
}

export function CatalogRoot({ projectId }: CommerceRootProps) {
  return (
    <CommerceProvider projectId={projectId}>
      <CatalogApp />
    </CommerceProvider>
  );
}
