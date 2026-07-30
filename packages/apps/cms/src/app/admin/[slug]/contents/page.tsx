import api from "@/api/api-context";
import api_points from "@/api/points";
import EBreadcrumb from "@/components/elements/breadcrumb";
import ContentsView from "@/components/views/contents";
import deCodeUrlObj from "@/helper/decodeUrl";
import { IField, IModule } from "@/types/page";
import { HomeOutlined } from "@ant-design/icons";

export default async function ContentsPage({
  params
}: {
  params: { slug: string }
}) {
  const model : IModule = (await api.get(api_points.module.getOne + `?id=${params.slug}`)).data;
  const moduleInput : IField[] = model.fields;
  // const moduleInput : IField[] = (await api.get(`/admin/field/by-module/` + module.id)).data;
  const fields = moduleInput.map(item => ({ ...item , fieldType: item.fieldType.toLowerCase() }));
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
