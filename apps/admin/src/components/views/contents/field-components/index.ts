// Field Components Exports
export { default as TextField } from './TextField';
export { default as TextAreaField } from './TextAreaField';
export { default as NumberField } from './NumberField';
export { default as MoneyField } from './MoneyField';
export { default as PercentageField } from './PercentageField';
export { default as ImageField } from './ImageField';
export { default as GalleryField } from './GalleryField';
export { default as LinkField } from './LinkField';
export { default as ListField } from './ListField';
export { default as EditorField } from './EditorField';

// Layout Components
export { default as FieldRenderer } from './FieldRenderer';
export { default as GridLayout, FieldsGridContainer } from './GridLayout';

// Types
export interface FieldProps {
  field: any;
  options: any;
  value?: any;
  onChange?: (e: any) => void;
}

// Common styles
export const commonFieldStyles = {
  borderRadius: '8px',
  border: '1px solid #e8e8e8',
  transition: 'all 0.3s ease',
  fontSize: '14px'
};

export const fieldContainerStyles = {
  marginBottom: '24px'
};