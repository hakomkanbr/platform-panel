import enumCreateUpdate from "@/abstracts/create-update";
import EBreadcrumb from "@/components/elements/breadcrumb";
import CreateUpdateWebSiteView from "@/components/views/web-sites/create-update";
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
            WebSites
          </span>
        },
        {
          title: <span>
            {params["create-update"] == enumCreateUpdate.create ? "Create " : "Edit " } WebSite
          </span>
        }
      ]} />
      <CreateUpdateWebSiteView params={{ ...deCodeUrlObj(params), ...deCodeUrlObj(searchParams) }} />
    </>
  );
}
