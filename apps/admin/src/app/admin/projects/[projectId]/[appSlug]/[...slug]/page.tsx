import { registry } from "@/lib/app-registry";
import { notFound } from "next/navigation";

interface Props {
    params: {
        projectId: string;
        appSlug: string;
        slug: string[];
    };
}

export default async function CatchAllPage({ params }: Props) {
    const app = registry.get(params.appSlug);

    if (!app) {
        notFound();
    }

    const Root = app.Root;
    return (
        <Root
            projectId={params.projectId}
        />
    );
}
