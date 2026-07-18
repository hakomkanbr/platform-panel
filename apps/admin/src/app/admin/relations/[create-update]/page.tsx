import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import WriteError from "@/components/elements/error-message/error-message";
import RelationCreateUpdateView from "@/components/views/relations/create-update";
import { HomeOutlined, ShareAltOutlined } from "@ant-design/icons";
import Link from "next/link";
import route_paths from "@/helper/route_paths";
import enumCreateUpdate from "@/abstracts/create-update";
import deCodeUrlObj from "@/helper/decodeUrl";
import { mWebsiteRequired } from "@/abstracts/error-types";

export default async function RelationCreateUpdatePage({
  params,
  searchParams
}: {
  params: { "create-update": string }
  searchParams: { id: number }
}) {
  const site: any = await getCookie(SiteSlug);
  if (!site) {
    return <WriteError style={{
      marginTop: 15
    }} errors={mWebsiteRequired} />
  }

  const isCreate = params["create-update"] === "create";
  const title = isCreate ? "Create Relation" : "Update Relation";

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
          title: <Link href={route_paths.relations}>
            <ShareAltOutlined style={{ marginRight: 5 }} />
            Relations
          </Link>
        },
        {
          title: <span>
            {title}
          </span>
        }
      ]} />
      <RelationCreateUpdateView params={{ ...deCodeUrlObj(params), ...deCodeUrlObj(searchParams) }} />
    </>
  );
}