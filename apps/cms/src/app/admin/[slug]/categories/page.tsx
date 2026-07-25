import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EBreadcrumb from "@/components/elements/breadcrumb";
import CategoriesView from "@/components/views/categories";
import { IModule } from "@/types/page";
import { HomeOutlined } from "@ant-design/icons";

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
  const modules: IModule[] = json?.data || [];
  return modules.find((m: any) => m.slug === slug || String(m.id) === slug) || null;
}

export default async function CategoriesPage({
  params
}: {
  params: { slug: string }
}) {
  const model = await fetchModuleBySlug(params.slug);
  if (!model) redirect("/admin/contents");
  return (
    <>
      <EBreadcrumb items={[
            {
                title: <span>
                    <HomeOutlined style={{ marginRight: 5 }} />
                    Home
                </span>,
            },
            {
                title: <span>
                    {model.name}
                </span>
            },
            {
                title: <span>
                    Categories
                </span>
            }
         
        ]}/>
      <CategoriesView model={model} params={{ slug: decodeURI(params.slug) }} />
    </>
  );
}
