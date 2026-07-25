"use client";

import { useRouter } from "next/navigation";
import { SelectProjectPage } from "@repo/shell";
import { setCookie } from "@/app/actions/set-cookie";
import { useDispatch } from "react-redux";
import { setSiteId, setSiteSlug } from "@/lib/redux-toolkit/slice/site-slice";
import { useProjects } from "@/hooks/useApps";
import { useTenantId } from "@/hooks/useTenantId";

export default function SelectSitePageWrapper() {
  const router = useRouter();
  const dispatch = useDispatch();
  const tenantId = useTenantId();
  const { data: projects = [], isLoading } = useProjects(tenantId);

  const quickProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
  }));

  const handleSelectProject = (project: { id: string; name: string; slug?: string }) => {
    setCookie("site", project.slug || project.id);
    setCookie("siteId", project.id);
    dispatch(setSiteSlug(project.slug || project.id));
    dispatch(setSiteId(Number(project.id)));

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || "/admin";
    setTimeout(() => {
      router.push(next);
    }, 500);
  };

  return (
    <SelectProjectPage
      projects={quickProjects}
      loading={isLoading}
      title="Site Selection"
      subtitle="Select a site to access its tools and manage your content"
      onSelectProject={handleSelectProject}
    />
  );
}
