import { SiteSlug } from "@/abstracts/siteSlug";
import { getCookie } from "@/app/actions/set-cookie";
import EBreadcrumb from "@/components/elements/breadcrumb";
import WriteError from "@/components/elements/error-message/error-message";
import FormSubmissionsView from "@/components/views/forms/submissions";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import route_paths from "@/helper/route_paths";
import { EnumErrorType } from "@/abstracts/error-types";

export default async function FormSubmissionsPage({
  params,
  searchParams
}: {
  params: { slug: string }
  searchParams: { formId?: string }
}) {
  const site: any = await getCookie(SiteSlug);
  if (!site) {
    return <WriteError style={{
      marginTop: 15
    }} errors={{
      title: "Website Selection Required",
      description: "Website Selection Required",
      key: EnumErrorType.Error,
      coder  : "NO_CODE"
    }} />
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
          title: <Link href={route_paths.forms}>
            Forms
          </Link>
        },
        {
          title: <span>
            Submissions
          </span>
        }
      ]} />
      <FormSubmissionsView 
        params={params} 
        searchParams={searchParams}
      />
    </>
  );
}