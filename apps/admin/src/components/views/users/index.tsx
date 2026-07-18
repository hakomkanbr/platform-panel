import api_points from "@/api/points";
import ECard from "@/components/elements/card";
import ETable from "@/components/elements/table";
import columns from "./columns";
import route_paths from "@/helper/route_paths";
import EButton from "@/components/elements/button";
import Link from "next/link";
import enumCreateUpdate from "@/abstracts/create-update";
import ConfirmUserEmail from "./confirm-email";

export default async function UsersView({
  params
}: {
  params: { slug: string }
}) {
  return (
    <>
      <ECard title="Users" extra={<>
        <Link style={{ margin: "0 2px" }} href={`${route_paths.users}/${enumCreateUpdate.create}`}>
          <EButton type="default">Create User</EButton>
        </Link>
      </>}>
        <ETable columns={columns}
          url={api_points.users.getAll}
        />
        <ConfirmUserEmail/>
      </ECard>
    </>
  );
}
