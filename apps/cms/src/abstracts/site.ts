import { IRoleType } from "./user/user";

interface ISite {
  "id": number,
  "slug": string,
  "link": string,
  "description": string,
  "name": string,
  "published" : boolean,
  "role": IRoleType | undefined
}
export default ISite;