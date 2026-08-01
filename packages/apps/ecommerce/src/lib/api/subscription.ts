import { apiGet } from "./client";

export interface SubscriptionSnapshot {
  subscriptionId: string;
  tenantId: string;
  status: string;
  planName: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
  expiresAt: string | null;
  isActive: boolean;
}

export async function fetchSubscriptionAccess(): Promise<SubscriptionSnapshot> {
  return apiGet<SubscriptionSnapshot>("/Admin/Subscription/access");
}
