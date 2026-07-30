// types/sidebar.ts

export interface ISidebarItem {
    key: string;
    label: string;
    icon?: any;
    type?: any;
    path?: string;
    roles?: string[];
    children?: ISidebarItem[];
    badge?: number | null;
    disabled?: boolean;
}
