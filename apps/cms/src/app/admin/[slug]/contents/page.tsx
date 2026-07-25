import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EBreadcrumb from "@/components/elements/breadcrumb";
import ContentsView from "@/components/views/contents";
import { IField, IModule } from "@/types/page";
import { HomeOutlined } from "@ant-design/icons";

async function fetchApi(path: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5010";
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ContentsPage({
  params
}: {
  params: { slug: string }
}) {
  const data = await fetchApi("/api/v1/cms/modules");
  const modules: any[] = data?.data || [];
  const model = modules.find((m: any) => m.slug === params.slug);
  if (!model) {
    redirect("/admin/contents");
  }
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5010";
  const fieldsRes = await fetch(`${baseUrl}/api/v1/cms/modules/${model.id}/fields`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  const fieldsData = fieldsRes.ok ? (await fieldsRes.json())?.data || [] : [];
  const fieldTypeNames = ["text","number","textarea","slug","list","money","percentage","link","editor","boolean","moneyFormat","image","images","file","video","date","time","dateTime","email","phone","password","select","radio","checkboxes","url","color","rangeSlider"];
  const fields: IField[] = fieldsData.map((item: any) => ({ ...item, fieldType: typeof item.fieldType === "number" ? fieldTypeNames[item.fieldType] || "text" : String(item.fieldType).toLowerCase() }));
  return (
    <>
      <EBreadcrumb items={[
        {
          title: <span>
            <HomeOutlined style={{ marginRight: 5 }} />
            Home
          </span>
        },
        {
          title: <span>
            {model.name}
          </span>
        },
        {
          title: <span>
            Contents
          </span>
        }
      ]} />
      <ContentsView model={model} fields={fields} />
    </>
  );
}
