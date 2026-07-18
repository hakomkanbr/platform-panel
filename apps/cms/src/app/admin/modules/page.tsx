import { mWebsiteRequired } from "@/abstracts/error-types";
import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import WriteError from "@/components/elements/error-message/error-message";
import ModulesView from "@/components/views/modules";
import { HomeOutlined } from "@ant-design/icons";

export default async function ModulesPage({
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
            Modules
          </span>
        }

      ]} />
      <ModulesView params={params} />
    </>
  );
}
