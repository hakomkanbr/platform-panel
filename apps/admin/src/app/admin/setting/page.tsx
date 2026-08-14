"use client";

import EBreadcrumb from "@/components/elements/breadcrumb";
import ProjectOverview from "@/components/views/settings/project-overview";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { useTranslations } from "@repo/localization";

export default function SettingPage() {
  const t = useTranslations();

  return (
    <>
      <EBreadcrumb
        items={[
          {
            title: (
              <span>
                <HomeOutlined style={{ marginRight: 5 }} />
                {t("settings.breadcrumb.home")}
              </span>
            ),
          },
          {
            title: (
              <span>
                <SettingOutlined style={{ marginRight: 5 }} />
                {t("common.nav.settings")}
              </span>
            ),
          },
        ]}
      />
      <ProjectOverview />
    </>
  );
}