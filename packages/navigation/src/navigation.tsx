import {
    FolderOutlined,
    HomeOutlined,
    CreditCardOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";

import type { NavigationItem } from "./types";

export const platformNavigation: NavigationItem[] = [

    {

        key: "dashboard",

        label: "Dashboard",

        path: "/admin",

        icon: <HomeOutlined />

    },

    {

        key: "projects",

        label: "Projects",

        path: "/admin/projects",

        icon: <FolderOutlined />

    },

    {

        key: "billing",

        label: "Billing",

        path: "/admin/billing",

        icon: <CreditCardOutlined />

    },

    {

        key: "team",

        label: "Team (soon)",

        path: "/admin/users",
        disabled: true,

        icon: <UserOutlined />

    }

];