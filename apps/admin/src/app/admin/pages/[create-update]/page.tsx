import enumCreateUpdate from "@/abstracts/create-update";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import CreateUpdatePageView from "@/components/views/pages/create-update";
import deCodeUrlObj from "@/helper/decodeUrl";
import { HomeOutlined } from "@ant-design/icons";
import SelectSitePage from "../../select-site/page";
import { SiteSlug } from "@/abstracts/siteSlug";

export default async function PageEditPage({
  params,
  searchParams
}: {
  params: { slug: string, "create-update": string }
  searchParams: { id: number }
}) {
  const site: any = await getCookie(SiteSlug);
  if (!site) return <SelectSitePage />;
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
            Pages
          </span>
        },
        {
          title: <span>
            {params["create-update"] == enumCreateUpdate.create ? "Create " : "Edit "} Page
          </span>
        }
      ]} />
      <CreateUpdatePageView />
    </>
  );
}
