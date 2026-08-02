import EBreadcrumb from "@/components/elements/breadcrumb";
import ProjectOverview from "@/components/views/settings/project-overview";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";

export default function SettingPage() {
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
            title: (
              <span>
                <SettingOutlined style={{ marginRight: 5 }} />
                Settings
              </span>
            ),
          },
        ]}
      />
      <ProjectOverview />
    </>
  );
}