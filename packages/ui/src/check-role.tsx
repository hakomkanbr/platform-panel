"use client";
import React from "react";

export function CheckRole({
  allowRoles = [],
  userRole,
  children
}: {
  allowRoles: string[],
  userRole?: string,
  children: React.ReactNode
}) {
  if (!userRole) return null;
  if (allowRoles.includes(userRole)) {
    return <>{children}</>;
  }
  return null;
}
