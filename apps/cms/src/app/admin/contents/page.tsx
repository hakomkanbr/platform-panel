import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import ContentsOverview from "@/components/views/contents/overview";
import { HomeOutlined, FileTextOutlined } from "@ant-design/icons";
import SelectSitePage from "../select-project/page";

export default async function ContentsPage({
  params,
}: {
  params: { slug: string };
}) {
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
            title: (
              <span>
                <FileTextOutlined style={{ marginRight: 5 }} />
                Contents
              </span>
            ),
          },
        ]}
      />
      <ContentsOverview />
    </>
  );
}
