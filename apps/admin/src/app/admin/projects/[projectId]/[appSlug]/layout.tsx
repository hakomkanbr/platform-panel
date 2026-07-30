


interface Props {
    children: React.ReactNode;
}


export default async function AppLayout({ children }: Props) {

    return <>
        {children}
    </>
    // switch (params.appSlug) {
    //     case "cms":
    //         return <CmsApp projectSlug={params.projectSlug} />;

    //     default:
    //         notFound();
    // }
}