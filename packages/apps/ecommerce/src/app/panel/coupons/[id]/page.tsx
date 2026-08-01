"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  useEffect(() => { router.replace(`/panel/coupons?edit=${params.id}`); }, [router, params.id]);
  return null;
}
