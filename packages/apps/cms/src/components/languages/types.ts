import type {
  ProjectLanguageDto,
  CreateProjectLanguageRequest,
  UpdateProjectLanguageRequest,
  ReorderLanguagesRequest,
} from "@repo/shared-types";

export type {
  ProjectLanguageDto,
  CreateProjectLanguageRequest,
  UpdateProjectLanguageRequest,
  ReorderLanguagesRequest,
};

export interface LanguageFormData {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}
