import { mWebsiteRequired } from "@/abstracts/error-types";
import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import WriteError from "@/components/elements/error-message/error-message";
import RelationsView from "@/components/views/relations";
import { HomeOutlined, ShareAltOutlined } from "@ant-design/icons";

export default async function RelationsPage({
  params
}: {
  params: { slug: string }
}) {
  const site: any = await getCookie(SiteSlug);
  if (!site) {
    return <WriteError style={{
      marginTop: 15
    }} errors={mWebsiteRequired} />
  }
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
            <ShareAltOutlined style={{ marginRight: 5 }} />
            Relations
          </span>
        }

      ]} />
      <RelationsView params={params} />
    </>
  );
}