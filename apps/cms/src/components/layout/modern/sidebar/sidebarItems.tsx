// utils/sidebarItems.tsx
import { DashboardOutlined, GlobalOutlined, FileTextOutlined, AppstoreOutlined, DatabaseOutlined, LinkOutlined, FormOutlined, FolderOutlined, UserOutlined, SettingOutlined, CrownOutlined } from '@ant-design/icons';
import { IRoleType } from '@/abstracts/user/user';
import { IoNavigateOutline } from 'react-icons/io5';
import { ISidebarItem } from '@/abstracts/sidebar-item';

export const getSidebarItems = (userRole: IRoleType, modules: any[] = []): ISidebarItem[] => {
    const baseItems: ISidebarItem[] = [
        { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined />, path: '/admin', roles: [IRoleType.SuperAdmin, IRoleType.Admin, IRoleType.User] },
        { key: 'web-sites', label: 'Websites', icon: <GlobalOutlined />, path: '/admin/web-sites', roles: [IRoleType.SuperAdmin, IRoleType.Admin] },
        { key: 'pages', label: 'Pages', icon: <FileTextOutlined />, path: '/admin/pages', roles: [IRoleType.SuperAdmin, IRoleType.Admin, IRoleType.Editor] },
        { key: 'navigations', label: 'Navigations', icon: <IoNavigateOutline />, path: '/admin/navigations', roles: [IRoleType.SuperAdmin, IRoleType.Admin, IRoleType.Editor] },
        { key: 'modules', label: 'Modules', icon: <AppstoreOutlined />, path: '/admin/modules', roles: [IRoleType.SuperAdmin, IRoleType.Admin] },
        { key: 'collections', label: 'Collections', icon: <DatabaseOutlined />, path: '/admin/collections', roles: [IRoleType.SuperAdmin, IRoleType.Admin, IRoleType.Editor] },
        { key: 'relations', label: 'Relations', icon: <LinkOutlined />, path: '/admin/relations', roles: [IRoleType.SuperAdmin, IRoleType.Admin] },
        { key: 'forms', label: 'Forms', icon: <FormOutlined />, path: '/admin/forms', roles: [IRoleType.SuperAdmin, IRoleType.Admin, IRoleType.FormManager, IRoleType.Editor] },
    ];

    if (modules.length > 0) {
        const moduleItems: ISidebarItem[] = modules.map((m: any) => ({
            key: `module-${m.id}`,
            label: m.name,
            icon: <FolderOutlined />,
            path: `/admin/${m.id}/contents`,
            roles: [IRoleType.SuperAdmin, IRoleType.Admin, IRoleType.Editor],
        }));

        baseItems.push({
            key: 'sections',
            label: 'Content Sections',
            icon: <FolderOutlined />,
            children: moduleItems,
            roles: [IRoleType.SuperAdmin, IRoleType.Admin, IRoleType.Editor],
        });
    }

    baseItems.push(
        { key: 'users', label: 'Users', icon: <UserOutlined />, path: '/admin/users', roles: [IRoleType.SuperAdmin, IRoleType.Admin] },
        { key: 'settings', label: 'Settings', icon: <SettingOutlined />, path: '/admin/setting', roles: [IRoleType.SuperAdmin, IRoleType.Admin, IRoleType.Editor] }
    );

    const filterByRole = (items: ISidebarItem[]): ISidebarItem[] => {
        return items
            .filter(item => !item.roles || item.roles.includes(userRole))
            .map(item => ({
                ...item,
                children: item.children ? filterByRole(item.children) : undefined
            }));
    };

    return filterByRole(baseItems);
};
