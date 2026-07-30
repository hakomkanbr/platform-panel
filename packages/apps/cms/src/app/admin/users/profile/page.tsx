import EBreadcrumb from "@/components/elements/breadcrumb";
import UserProfileView from "@/components/views/users/profile";
import deCodeUrlObj from "@/helper/decodeUrl";
import { HomeOutlined } from "@ant-design/icons";

export default async function ModuleEditPage({
  params,
  searchParams
}: {
  params: { slug: string, "create-update": string }
  searchParams: { id: number }
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
            Profile
          </span>
        }
      ]} />
      <UserProfileView params={{ ...deCodeUrlObj(params), ...deCodeUrlObj(searchParams) }} />
    </>
  );
}
