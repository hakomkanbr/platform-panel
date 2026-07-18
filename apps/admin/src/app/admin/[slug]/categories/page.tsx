import api from "@/api/api-context";
import api_points from "@/api/points";
import EBreadcrumb from "@/components/elements/breadcrumb";
import CategoriesView from "@/components/views/categories";
import { IModule } from "@/types/page";
import { HomeOutlined } from "@ant-design/icons";

export default async function CategoriesPage({
  params
}: {
  params: { slug: string }
}) {
  const model : IModule = (await api.get(api_points.module.getOne + `?id=${params.slug}`)).data;
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
