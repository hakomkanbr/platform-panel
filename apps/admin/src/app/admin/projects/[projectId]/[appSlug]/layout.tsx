import { registry } from "@/lib/app-registry";
import { notFound } from "next/navigation";
import AppShellUpdater from "./AppShellUpdater";

interface Props {
    params: {
        projectId: string;
        appSlug: string;
    };
    children: React.ReactNode;
}

export default async function AppLayout({ params, children }: Props) {
    const app = registry.get(params.appSlug);

    if (!app) {
        notFound();
    }

    return (
        <AppShellUpdater app={app}>
            {children}
        </AppShellUpdater>
    );
}
