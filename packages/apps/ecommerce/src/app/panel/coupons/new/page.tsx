"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewCouponPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/panel/coupons?new=true"); }, [router]);
  return null;
}
