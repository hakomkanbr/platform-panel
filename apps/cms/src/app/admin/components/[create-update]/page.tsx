import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import ComponentCreateUpdateView from "@/components/views/components/create-update";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import route_paths from "@/helper/route_paths";
import enumCreateUpdate from "@/abstracts/create-update";
import deCodeUrlObj from "@/helper/decodeUrl";
import SelectSitePage from "../../select-project/page";

export default async function ComponentCreateUpdatePage({
  params,
  searchParams,
}: {
  params: { "create-update": string };
  searchParams: { id: number };
}) {


  const isCreate = params["create-update"] === "create";
  const title = isCreate ? "Create Component" : "Update Component";

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
            title: <Link href={route_paths.components}>Components</Link>,
          },
          {
            title: <span>{title}</span>,
          },
        ]}
      />
      <ComponentCreateUpdateView
        params={{ ...deCodeUrlObj(params), ...deCodeUrlObj(searchParams) }}
      />
    </>
  );
}
