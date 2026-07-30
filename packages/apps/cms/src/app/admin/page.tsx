'use client';

import { ProjectId } from "@repo/shared-types";

export default function HomePage({ projectId }: { projectId: ProjectId }) {
  return (
    <div className="s2s-stagger" style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 32 }}>
      <h1>project id {"=>"} <small>{projectId}</small></h1>
    </div>
  );
}
