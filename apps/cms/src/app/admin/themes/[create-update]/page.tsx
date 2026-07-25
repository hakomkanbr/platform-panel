import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import WriteError from "@/components/elements/error-message/error-message";
import ThemeCreateUpdateView from "@/components/views/themes/create-update";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import route_paths from "@/helper/route_paths";
import enumCreateUpdate from "@/abstracts/create-update";
import deCodeUrlObj from "@/helper/decodeUrl";
import SelectSitePage from "../../select-project/page";

export default async function ThemeCreateUpdatePage({
  params,
  searchParams,
}: {
  params: { "create-update": string };
  searchParams: { id: number };
}) {
  const site: any = await getCookie(SiteSlug);
  if (!site) return <SelectSitePage />;

  const isCreate = params["create-update"] === "create";
  const title = isCreate ? "Create Theme" : "Update Theme";

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
            title: <Link href={route_paths.themes}>Themes</Link>,
          },
          {
            title: <span>{title}</span>,
          },
        ]}
      />
      <ThemeCreateUpdateView
        params={{ ...deCodeUrlObj(params), ...deCodeUrlObj(searchParams) }}
      />
    </>
  );
}
