"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewDiscountPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/panel/discounts?new=true"); }, [router]);
  return null;
}
