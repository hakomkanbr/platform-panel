import EBreadcrumb from "@/components/elements/breadcrumb";
import ComponentFields from "@/components/views/components/detail";
import { HomeOutlined } from "@ant-design/icons";

export default async function ComponentFieldsPage({
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
          title: <span>Components</span>
        },
        {
          title: <span>Fields</span>
        }
      ]} />
      <ComponentFields componentId={(await params).id} />
    </>
  );
}
