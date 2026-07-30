import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import WriteError from "@/components/elements/error-message/error-message";
import CollectionsView from "@/components/views/collections";
import { HomeOutlined } from "@ant-design/icons";
import SelectSitePage from "../select-site/page";

export default async function CollectionsPage({
  params
}: {
  params: { slug: string }
}) {
  const site: any = await getCookie(SiteSlug);
  if (!site) return <SelectSitePage/>;
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
            Collections
          </span>
        }

      ]} />
      <CollectionsView params={params} />
    </>
  );
}