import enumCreateUpdate from "@/abstracts/create-update";
import EBreadcrumb from "@/components/elements/breadcrumb";
import CreateUpdateUsersView from "@/components/views/users/create-update";
import deCodeUrlObj from "@/helper/decodeUrl";
import { getTokenPayload } from "@/helper/session";
import { HomeOutlined } from "@ant-design/icons";
import { cookies } from "next/headers";

export default async function ModuleEditPage({
  params,
  searchParams
}: {
  params: { slug: string, "create-update": string }
  searchParams: { id: number }
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("AuthToken")?.value;

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const user: any = await getTokenPayload(token);
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
        },
        {
          title: <span>
            {params["create-update"] == enumCreateUpdate.create ? "Create " : "Edit " } User
          </span>
        }
      ]} />
      <CreateUpdateUsersView user={user.token} params={{ ...deCodeUrlObj(params), ...deCodeUrlObj(searchParams) }} />
    </>
  );
}
