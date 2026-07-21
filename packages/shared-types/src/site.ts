import type { IRoleType } from "./user/user";

export interface ISite {
  "id": number,
  "slug": string,
  "link": string,
  "description": string,
  "name": string,
  "published" : boolean,
  "role": IRoleType | undefined
}
