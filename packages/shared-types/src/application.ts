import { ComponentType } from "react";

export interface ApplicationDefinition {
    id: string;
    name: string;
    description?: string;

    icon?: ComponentType;

    component: ComponentType<any>;

    sidebar: SidebarItem[];

    routes: ApplicationRoute[];
}

export interface SidebarItem {
    key: string;

    title: string;

    href: string;

    icon?: ComponentType;
}

export interface ApplicationRoute {
    path: string;

    title: string;
}