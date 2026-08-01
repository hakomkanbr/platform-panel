"use client";
import React from "react";
import { useParams } from "next/navigation";
import CategoryForm from "../CategoryForm";

export default function EditCategoryPage() {
  const params = useParams();
  const id = Number(params.id);
  return <CategoryForm id={id} />;
}
