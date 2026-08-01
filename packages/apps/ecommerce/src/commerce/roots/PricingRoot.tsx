"use client";

import React from "react";
import type { ProjectId } from "@repo/shared-types";
import { CommerceProvider } from "../context/CommerceContext";
import { PricingApp } from "../app/pricing/PricingApp";

export interface CommerceRootProps {
  projectId?: ProjectId;
}

export function PricingRoot({ projectId }: CommerceRootProps) {
  return (
    <CommerceProvider projectId={projectId}>
      <PricingApp />
    </CommerceProvider>
  );
}
