"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { fetchSubscriptionAccess, SubscriptionSnapshot } from "@/lib/api/subscription";

interface SubscriptionContextValue {
  snapshot: SubscriptionSnapshot | null;
  isLoading: boolean;
  error: string | null;
  planName: string;
  hasFeature: (code: string) => boolean;
  hasCapability: (code: string) => boolean;
  getLimit: (code: string) => number;
}

const defaultSnapshot: SubscriptionSnapshot = {
  subscriptionId: "", tenantId: "", status: "none", planName: "unknown",
  features: {}, limits: {}, expiresAt: null, isActive: false,
};

const SubscriptionContext = createContext<SubscriptionContextValue>({
  snapshot: null, isLoading: true, error: null, planName: "unknown",
  hasFeature: () => false, hasCapability: () => false, getLimit: () => 0,
});

export function useSubscription() { return useContext(SubscriptionContext); }

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<SubscriptionSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        const data = await fetchSubscriptionAccess();
        setSnapshot(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load subscription");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const planName = snapshot?.planName || "unknown";

  const hasFeature = (code: string) => snapshot?.features?.[code] === true;

  const hasCapability = (code: string) => {
    if (!snapshot) return false;
    if (snapshot.limits?.[code] !== undefined) return snapshot.limits[code] > 0;
    if (snapshot.features?.[code] !== undefined) return snapshot.features[code];
    return false;
  };

  const getLimit = (code: string) => snapshot?.limits?.[code] ?? 0;

  return (
    <SubscriptionContext.Provider value={{ snapshot, isLoading, error, planName, hasFeature, hasCapability, getLimit }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
