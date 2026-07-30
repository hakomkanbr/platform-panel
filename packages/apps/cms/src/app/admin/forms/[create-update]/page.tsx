import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import WriteError from "@/components/elements/error-message/error-message";
import FormCreateUpdateView from "@/components/views/forms/create-update";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import route_paths from "@/helper/route_paths";
import SelectSitePage from "../../select-site/page";

export default async function FormCreateUpdatePage({
  params,
  searchParams
}: {
  params: { "create-update": string }
  searchParams: { id?: string }
}) {
 const site: any = await getCookie(SiteSlug);
  if (!site) return <SelectSitePage/>;

  const isEdit = params["create-update"] === "edit";
  const pageTitle = isEdit ? "Edit Form" : "Create Form";

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
          title: <Link href={route_paths.forms}>
            Forms
          </Link>
        },
        {
          title: <span>
            {pageTitle}
          </span>
        }
      ]} />
      <FormCreateUpdateView 
        params={params} 
        searchParams={searchParams}
      />
    </>
  );
}