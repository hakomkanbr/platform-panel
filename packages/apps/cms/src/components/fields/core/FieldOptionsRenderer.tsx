import React from 'react';
import { EnFieldType } from '@/abstracts/modules/module-input';
import {
  TextFieldOptions,
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
  BaseFieldOptionsProps,
  TextAreaFieldOptions,
  SlugFieldOptions
} from '../options';

interface FieldOptionsRendererProps extends BaseFieldOptionsProps {
  fieldType: string;
}

const FieldOptionsRenderer: React.FC<FieldOptionsRendererProps> = ({ fieldType, form }) => {
  const renderFieldOptions = () => {
    switch (fieldType) {
      case EnFieldType.text:
        return <TextFieldOptions fieldType={fieldType} form={form} />;
      case EnFieldType.textArea:
        return <TextAreaFieldOptions fieldType={fieldType} form={form} />;
      case EnFieldType.number:
        return <NumberFieldOptions fieldType={fieldType} form={form} />;
      case EnFieldType.image:
        return <ImageFieldOptions fieldType={fieldType} form={form} />;
      case EnFieldType.gallary:
        return <GalleryFieldOptions fieldType={fieldType} form={form} />;
      case EnFieldType.slug:
        return <SlugFieldOptions fieldType={fieldType} form={form} />;


      case 'RichText':
        return <RichTextFieldOptions fieldType={fieldType} form={form} />;
      
      case 'Boolean':
        return <BooleanFieldOptions fieldType={fieldType} form={form} />;
      
      case 'Date':
        return <DateFieldOptions fieldType={fieldType} form={form} />;
      
      case 'Email':
        return <EmailFieldOptions fieldType={fieldType} form={form} />;
      
      case 'File':
        return <FileFieldOptions fieldType={fieldType} form={form} />;
      
      case 'Video':
        return <VideoFieldOptions fieldType={fieldType} form={form} />;
      
      case 'Html':
        return <HtmlFieldOptions fieldType={fieldType} form={form} />;
      
      default:
        return null;
    }
  };

  return <>{renderFieldOptions()}</>;
};

export default FieldOptionsRenderer;