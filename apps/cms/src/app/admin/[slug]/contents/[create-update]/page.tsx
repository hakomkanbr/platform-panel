import enumCreateUpdate from "@/abstracts/create-update";
import EBreadcrumb from "@/components/elements/breadcrumb";
import CreateUpdateContentView from "@/components/views/contents/create-update";
import deCodeUrlObj from "@/helper/decodeUrl";
import { HomeOutlined, FileTextOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import './page.css';
import { IModule } from "@/types/page";
import api from "@/api/api-context";
import api_points from "@/api/points";

export default async function ContentsPage({
  params,
  searchParams
}: {
  params: { slug: string, "create-update": string }
  searchParams: { id: number }
}) {
  const model : IModule = (await api.get(api_points.module.getOne + `?id=${params.slug}`)).data;
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