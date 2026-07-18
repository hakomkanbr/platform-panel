import { JWTPayload } from "jose";

export interface IUser {
    token: IUserProps
}

export interface IUserProps extends JWTPayload {
    username: string,
    email: string,
    userId: string,
    siteSlug: string,
    siteId: string,
    role: IRoleType | null,
    image?: string,
}

export const ROLE = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export enum IRoleType {
    SuperAdmin = "SuperAdmin",
    Admin = "Admin",
    User = "User",
    Editor = "Editor",
    Contributor = "Contributor",
    Viewer = "Viewer",
    FormManager = "FormManager",
    MediaManager = "MediaManager",
    CategoryManager = "CategoryManager",
}

