import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import MenuCreateUpdateView from "@/components/views/menus/create-update";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import route_paths from "@/helper/route_paths";
import enumCreateUpdate from "@/abstracts/create-update";
import deCodeUrlObj from "@/helper/decodeUrl";
import SelectSitePage from "../../select-project/page";

export default async function MenuCreateUpdatePage({
  params,
  searchParams,
}: {
  params: { "create-update": string };
  searchParams: { id: number };
}) {


  const isCreate = params["create-update"] === "create";
  const title = isCreate ? "Create Menu" : "Update Menu";

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
            title: <Link href={route_paths.menus}>Menus</Link>,
          },
          {
            title: <span>{title}</span>,
          },
        ]}
      />
      <MenuCreateUpdateView
        params={{ ...deCodeUrlObj(params), ...deCodeUrlObj(searchParams) }}
      />
    </>
  );
}
