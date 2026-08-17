"use client";

import React from "react";
import type { ProjectId } from "@repo/shared-types";
import { CommerceProvider } from "../context/CommerceContext";
import { CustomersApp } from "../app/customers/CustomersApp";

export interface CustomersRootProps {
  projectId?: ProjectId;
}

export function CustomersRoot({ projectId }: CustomersRootProps) {
  return (
    <CommerceProvider projectId={projectId}>
      <CustomersApp />
    </CommerceProvider>
  );
}
