export interface IPage {
  id?: number;
  title: string,
  slug: string,
  languageSlug: string,
  published: boolean,
  blocks: IPageBlock[]
}

export interface FieldValue {
  fieldId?: number;
  blockId: number;
  languageSlug: string;
  value: string;
}

export interface IField {
  id: number;
  fieldSlug: string;
  name: string;
  order: number,
  moduleId: number,
  fieldType: string,
  settings?: string,
}


export interface IPageBlock {
  id?: number;
  uid: string;
  moduleId: number;
  moduleName: string;
  moduleSlug: string;
  isSingleton: boolean;
  order: number;
  fields: IField[];
  fieldValues: Record<string, string>
}

export interface IModule {
  id: number;
  name: string;
  slug: string;
  published: boolean;
  isSingleton: boolean;
  fields: IField[];
}


export interface IModuleFieldValue {
  inputId: number;
  inputName: string;
  value: any;
}