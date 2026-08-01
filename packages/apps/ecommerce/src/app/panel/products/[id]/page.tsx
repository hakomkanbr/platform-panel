"use client";
import { useParams } from "next/navigation";
import CreateUpdateView from "../../../../components/views/products/create-update";

export default function EditProductPage() {
  const params = useParams();
  return <CreateUpdateView editId={params.id as string} />;
}
