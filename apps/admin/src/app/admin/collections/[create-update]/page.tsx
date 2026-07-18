import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import WriteError from "@/components/elements/error-message/error-message";
import CollectionCreateUpdateView from "@/components/views/collections/create-update";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import route_paths from "@/helper/route_paths";
import enumCreateUpdate from "@/abstracts/create-update";
import deCodeUrlObj from "@/helper/decodeUrl";
import SelectSitePage from "../../select-site/page";

export default async function CollectionCreateUpdatePage({
  params,
  searchParams
}: {
  params: { "create-update": string }
  searchParams: { id: number }
}) {
 const site: any = await getCookie(SiteSlug);
  if (!site) return <SelectSitePage/>;

  const isCreate = params["create-update"] === "create";
  const title = isCreate ? "Create Collection" : "Update Collection";

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
          title: <Link href={route_paths.collections}>
            Collections
          </Link>
        },
        {
          title: <span>
            {title}
          </span>
        }
      ]} />
      <CollectionCreateUpdateView params={{ ...deCodeUrlObj(params), ...deCodeUrlObj(searchParams) }} />
    </>
  );
}