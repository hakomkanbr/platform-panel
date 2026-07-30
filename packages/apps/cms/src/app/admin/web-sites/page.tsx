import EBreadcrumb from "@/components/elements/breadcrumb";
import WebSitesView from "@/components/views/web-sites";
import { HomeOutlined } from "@ant-design/icons";

export default function WebSitePage({
  params
}: {
  params: { slug: string }
}) {
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
            WebSite
          </span>
        }

      ]} />
      <WebSitesView params={params} />
    </>
  );
}
