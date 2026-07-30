import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import SettingView from "@/components/views/settings";
import { HomeOutlined } from "@ant-design/icons";

export default async function SettingPage({
  params
}:{
  params: {slug:string}
}) {
  const siteSlug = await getCookie(SiteSlug);
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
                    Setting
                </span>
            }
         
      ]}/>
      <SettingView siteSlug={siteSlug} />
    </>
  );
}
