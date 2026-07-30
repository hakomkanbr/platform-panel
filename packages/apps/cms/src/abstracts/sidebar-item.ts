// types/sidebar.ts
import { ReactNode } from 'react';

export interface ISidebarItem {
    key: string;
    label: string;
    icon?: ReactNode;
    path?: string;
    roles?: string[];       // قائمة الأدوار المسموح لهم
    children?: ISidebarItem[];
    badge?: number | null;
}
