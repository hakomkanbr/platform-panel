import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import PagesView from "@/components/views/pages";
import { HomeOutlined } from "@ant-design/icons";
import SelectSitePage from "../select-site/page";

export default async function ModulesPage({
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
            Pages
          </span>
        }

      ]} />
      <PagesView />
    </>
  );
}
