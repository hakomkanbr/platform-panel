import { CmsNavigation } from "./navigation";
import { CmsRoutes } from "./routes";
import HomePage from "./app/admin/page";

export const CmsApplication = {
    id: "cms",

    name: "CMS",

    version: "1.0.0",

    navigation: CmsNavigation,

    routes: CmsRoutes,

    Root: HomePage,
};