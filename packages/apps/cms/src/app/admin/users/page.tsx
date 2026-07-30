import EBreadcrumb from "@/components/elements/breadcrumb";
import UsersView from "@/components/views/users";
import { HomeOutlined } from "@ant-design/icons";

export default function ModulesPage({
  params
}: {
  params: { slug: string }
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
            Users
          </span>
        }

      ]} />
      <UsersView params={params} />
    </>
  );
}
