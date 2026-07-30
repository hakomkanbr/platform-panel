import {
    FolderOutlined,
    HomeOutlined,
    CreditCardOutlined,
    SettingOutlined,
} from "@ant-design/icons";

import type { NavigationItem } from "./types";

export const platformNavigation: NavigationItem[] = [

    {

        key: "dashboard",

        label: "Dashboard",

        path: "/admin",

        icon: <HomeOutlined/>

    },

    {

        key: "projects",

        label: "Projects",

        path: "/admin/projects",

        icon: <FolderOutlined/>

    },

    {

        key: "billing",

        label: "Billing",

        path: "/admin/billing",

        icon: <CreditCardOutlined/>

    },

    {

        key: "settings",

        label: "Settings",

        path: "/admin/settings",

        icon: <SettingOutlined/>

    }

];