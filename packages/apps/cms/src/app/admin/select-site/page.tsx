import { redirect } from "next/navigation";

export default function SelectSitePage() {
  redirect("/admin/select-site");
  return null;
}
