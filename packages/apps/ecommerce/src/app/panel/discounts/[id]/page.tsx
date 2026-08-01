"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditDiscountPage() {
  const router = useRouter();
  const params = useParams();
  useEffect(() => { router.replace(`/panel/discounts?edit=${params.id}`); }, [router, params.id]);
  return null;
}
