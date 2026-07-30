// Module Fields - Exports only fields supported in modules
// This file acts as a bridge between the central field system and module components

// Re-export module-compatible fields from central fields
export { 
  TextField,
  TextAreaField,
  SlugField,
  NumberField,
  MoneyField,
  PercentageField,
  ImageField,
  GalleryField,
  EditorField,
  LinkField,
  ListField
} from '@/components/fields';

// Re-export field options for module configuration
export {
  TextFieldOptions,
  TextAreaFieldOptions,
  SlugFieldOptions,
  NumberFieldOptions,
  ImageFieldOptions,
  GalleryFieldOptions,
  RichTextFieldOptions,
  BooleanFieldOptions,
  DateFieldOptions,
  EmailFieldOptions,
  FileFieldOptions,
  VideoFieldOptions,
  HtmlFieldOptions,
  BaseFieldOptions,
  FieldOptionsRenderer,
  FieldPreview
} from '@/components/fields';

// Re-export types and utilities
export type {
  BaseFieldOptionsProps,
  FieldOption
} from '@/components/fields';