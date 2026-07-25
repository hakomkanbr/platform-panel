import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import WriteError from "@/components/elements/error-message/error-message";
import ThemesView from "@/components/views/themes";
import { HomeOutlined } from "@ant-design/icons";
import SelectSitePage from "../select-project/page";

export default async function ThemesPage({
  params,
}: {
  params: { slug: string };
}) {

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
            title: <span>Themes</span>,
          },
        ]}
      />
      <ThemesView params={params} />
    </>
  );
}
