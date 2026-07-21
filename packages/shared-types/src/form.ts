import { EnFieldType } from "./module-input";
import { IField, IModuleFieldValue } from "./page";


export interface Form {
  id?: number;
  name: string;
  description?: string;
  siteId: number;
  isActive: boolean;
  fields: IField[];
  createdAt?: string;
  updatedAt?: string;
  submissionsCount?: number;
}

export interface FormSubmission {
  id: number;
  formId: number;
  formName: string;
  submittedAt: string;
  fieldValues: IFormSubmissionField[];
  ipAddress?: string;
  userAgent?: string;
  status?: SubmissionStatus;
}

export interface FormSubmissionDetail extends FormSubmission {
  form: Form;
  metadata?: {
    browserInfo?: string;
    deviceInfo?: string;
    referrer?: string;
  };
}

export type SubmissionStatus = 'new' | 'read' | 'processed' | 'archived';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'number';
  value?: string | number;
  message?: string;
}

export interface FormStats {
  totalForms: number;
  activeForms: number;
  totalSubmissions: number;
  todaysSubmissions: number;
  weekSubmissions: number;
  monthSubmissions: number;
}

export interface FormListingParams {
  search?: string;
  siteId?: number;
  isActive?: boolean;
  createdFrom?: string;
  createdTo?: string;
  pageSize?: number;
  currentPage?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IFormSubmissionField {
  "id": number,
  "formSubmissionId": number,
  "formFieldId": number,
  "fieldName": string,
  "fieldType": string,
  "value": string
}

export interface FormSubmissionListingParams {
  search?: string;
  formId?: number;
  siteId?: number;
  status?: SubmissionStatus;
  submittedFrom?: string;
  submittedTo?: string;
  pageSize?: number;
  currentPage?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}
