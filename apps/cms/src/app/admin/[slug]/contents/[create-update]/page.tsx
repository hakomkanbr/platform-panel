import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import enumCreateUpdate from "@/abstracts/create-update";
import EBreadcrumb from "@/components/elements/breadcrumb";
import CreateUpdateContentView from "@/components/views/contents/create-update";
import deCodeUrlObj from "@/helper/decodeUrl";
import { HomeOutlined, FileTextOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import './page.css';
import { IModule } from "@/types/page";

async function fetchModuleBySlug(slug: string): Promise<IModule | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5010";
  const res = await fetch(`${baseUrl}/api/v1/cms/modules`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  const modules: any[] = json?.data || [];
  const model = modules.find((m: any) => m.slug === slug || String(m.id) === slug) || null;
  if (!model) return null;
  const fieldsRes = await fetch(`${baseUrl}/api/v1/cms/modules/${model.id}/fields`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (fieldsRes.ok) {
    const fieldsJson = await fieldsRes.json();
    const fieldTypeNames = ["text","number","textarea","slug","list","money","percentage","link","editor","boolean","moneyFormat","image","images","file","video","date","time","dateTime","email","phone","password","select","radio","checkboxes","url","color","rangeSlider"];
    model.fields = (fieldsJson?.data || []).map((item: any) => ({ ...item, fieldType: typeof item.fieldType === "number" ? fieldTypeNames[item.fieldType] || "text" : String(item.fieldType).toLowerCase() }));
  } else {
    model.fields = [];
  }
  return model as IModule;
}

export default async function ContentsCreateUpdatePage({
  params,
  searchParams
}: {
  params: { slug: string, "create-update": string }
  searchParams: { id: number }
}) {
  const model = await fetchModuleBySlug(params.slug);
  if (!model) redirect("/admin/contents");
  const isCreate = params["create-update"] === enumCreateUpdate.create;
  
  return (
    <>
      <EBreadcrumb 
        items={[
          {
            title: "Dashboard",
            href: "/admin",
            icon: <HomeOutlined />
          },
          {
            title: model.name,
            href: `/admin/${params["slug"]}`,
            icon: <FileTextOutlined />
          },
          {
            title: "Contents",
            href: `/admin/${model.id}/contents`,
            icon: <FileTextOutlined />
          },
          {
            title: isCreate ? "Create Content" : "Edit Content",
            icon: isCreate ? <PlusOutlined /> : <EditOutlined />
          }
        ]} 
        showBackground={true}
        size="default"
      />
      <CreateUpdateContentView
        model={model}
        params={{ 
          ...deCodeUrlObj(params), 
          ...deCodeUrlObj(searchParams) 
        }} 
      />
    </>
  );
}