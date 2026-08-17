"use client";

import React from "react";
import type { ProjectId } from "@repo/shared-types";
import { CommerceProvider } from "../context/CommerceContext";
import { OrdersApp } from "../app/orders/OrdersApp";

export interface OrdersRootProps {
  projectId?: ProjectId;
}

export function OrdersRoot({ projectId }: OrdersRootProps) {
  return (
    <CommerceProvider projectId={projectId}>
      <OrdersApp />
    </CommerceProvider>
  );
}
