import { EnFieldType } from "../modules/module-input";

export interface IInput {
    id:number,
    text:string,
    inputType : EnFieldType
};

interface IContent{
  "title": string,
  "slug": string,
  "date": string,
  "published": boolean,
  "categoryId": number,
  "inputs": IInput[]
};
export default IContent;