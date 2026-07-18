import { mWebsiteRequired } from "@/abstracts/error-types";
import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import WriteError from "@/components/elements/error-message/error-message";
import NavigationsView from "@/components/views/navigations";
import { HomeOutlined } from "@ant-design/icons";

export default async function NavigationsPage({
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
            Navigations
          </span>
        }

      ]} />
      <NavigationsView params={params} />
    </>
  );
}