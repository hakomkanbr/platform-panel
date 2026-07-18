"use client";

import { useEffect } from "react";
import { useAuth } from "@repo/auth";
import { Alert, Spin } from "antd";
import { useRouter } from "next/navigation";

export function AuthInitGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    console.info("isLoading : ", isLoading);
    console.info("isAuthenticated : ", isAuthenticated);

    if (!isLoading && !isAuthenticated) {
      // Redirect to Platform Dashboard login with SSO redirect back
      const callbackUrl = encodeURIComponent("http://localhost:3001/auth/sso");
      window.location.href = `http://localhost:3000/auth/login?redirect=${callbackUrl}`;
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Alert type="error" message="Authentication required" />;
  }

  return <>{children}</>;
}
