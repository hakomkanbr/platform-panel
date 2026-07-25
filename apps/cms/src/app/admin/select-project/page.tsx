"use client";

import { useRouter } from "next/navigation";
import { SelectProjectPage } from "@repo/shell";
import { setCookie } from "@/app/actions/set-cookie";
import { useDispatch } from "react-redux";
<<<<<<< HEAD
import { setSiteId, setSiteSlug } from "@repo/store";
import { useProjects, useTenantId } from "@repo/hooks";
=======
import { setSiteId, setSiteSlug } from "@/lib/redux-toolkit/slice/site-slice";
import { useProjects } from "@/hooks/useApps";
import { useTenantId } from "@/hooks/useTenantId";
>>>>>>> f333b542ae586d1c9082c2e5125fedc036a2dd75

const PROJECT_ID_COOKIE = "ProjectId";
const PROJECT_NAME_COOKIE = "ProjectName";

export default function SelectProjectPageWrapper() {
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
    setCookie(PROJECT_ID_COOKIE, project.id);
    setCookie(PROJECT_NAME_COOKIE, project.name);

    // Also set legacy site cookies for backward compat
    if (project.slug) {
      setCookie("site", project.slug);
      setCookie("siteId", project.id);
      dispatch(setSiteSlug(project.slug));
    }
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
      title="Content Management Hub"
      subtitle="Select a project to access powerful content management tools and streamline your workflow"
      onSelectProject={handleSelectProject}
    />
  );
}
