import type { EnFieldType } from "./module-input";

export interface IInput {
    id:number,
    text:string,
    inputType : EnFieldType
};

export interface IContent {
  "title": string,
  "slug": string,
  "date": string,
  "published": boolean,
  "categoryId": number,
  "inputs": IInput[]
};
