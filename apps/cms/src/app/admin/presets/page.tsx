import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import PresetsView from "@/components/views/presets";
import { HomeOutlined, ThunderboltOutlined } from "@ant-design/icons";
import SelectSitePage from "../select-project/page";

export default async function PresetsPage({
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
            title: (
              <span>
                <ThunderboltOutlined style={{ marginRight: 5 }} />
                Presets
              </span>
            ),
          },
        ]}
      />
      <PresetsView />
    </>
  );
}
