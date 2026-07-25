import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import TagsView from "@/components/views/tags";
import { HomeOutlined } from "@ant-design/icons";
import SelectSitePage from "../select-project/page";

export default async function TagsPage() {
  const site: any = await getCookie(SiteSlug);
  if (!site) return <SelectSitePage />;
  return (
    <>
      <EBreadcrumb
        items={[
          {
            title: (
              <span>
                <HomeOutlined style={{ marginRight: 5 }} />
                Home
              </span>
            ),
          },
          {
            title: <span>Tags</span>,
          },
        ]}
      />
      <TagsView />
    </>
  );
}
