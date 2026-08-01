"use client";
import React from "react";
import { useParams } from "next/navigation";
import BrandForm from "../BrandForm";

export default function EditBrandPage() {
  const params = useParams();
  const id = Number(params.id);
  return <BrandForm id={id} />;
}
