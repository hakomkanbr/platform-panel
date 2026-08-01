"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewCommentPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/panel/comments"); }, [router]);
  return null;
}
