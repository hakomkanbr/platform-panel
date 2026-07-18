import api_points from "@/api/points";
import ECard from "@/components/elements/card";
import ETable from "@/components/elements/table";
import route_paths from "@/helper/route_paths";
import EButton from "@/components/elements/button";
import Link from "next/link";
import enumCreateUpdate from "@/abstracts/create-update";
import columns from "./columns";

export default async function WebSitesView({
  params
}: {
  params: { slug: string }
}) {
  return (
    <>
      <ECard title="WebSites" extra={<>
        <Link style={{ margin: "0 2px" }} href={`${route_paths.webSites}/${enumCreateUpdate.create}`}>
          <EButton type="default">Create WebSite</EButton>
        </Link>
      </>}>
        <ETable columns={columns}
          url={api_points.webSite.getAll}
        />
      </ECard>
    </>
  );
}
