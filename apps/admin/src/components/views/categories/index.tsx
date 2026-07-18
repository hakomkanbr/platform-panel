import api_points from "@/api/points";
import ECard from "@/components/elements/card";
import ETable from "@/components/elements/table";
import CategoryCreateUpdateView from "./create-update";
import columns from "./columns";
import { IModule } from "@/types/page";

export default async function CategoriesView({
  params,
  model
}: {
  params: { slug: string },
  model: IModule
}) {
  return (
    <>
      <ECard title="Categories" extra={<>
        <CategoryCreateUpdateView model={model} params={params} />
      </>}>
        <ETable columns={columns}
          url={api_points.category.getAll}
          payload={{
            moduleId: model.id
          }}
        />
      </ECard>
    </>
  );
}
