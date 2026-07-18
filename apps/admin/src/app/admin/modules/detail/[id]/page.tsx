import EBreadcrumb from "@/components/elements/breadcrumb";
import ModuleDetailView from "@/components/views/modules/detail";
import { HomeOutlined } from "@ant-design/icons";

export default async function ModuleDetailPage({
  params
}: {
  params: Promise<{ id: number }>
}) {
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
            Modules
          </span>
        },
        {
          title: <span>
            Detail
          </span>
        }
      ]} />
      <ModuleDetailView mId={(await params).id} />
    </>
  );
}
