import { loadApplication } from "@repo/app-registry";
import { notFound } from "next/navigation";

interface Props {
    params: {
        projectId: string;
        appSlug: string;
    };
}

export default async function Page({ params }: Props) {

    const app = loadApplication(params.appSlug);

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
