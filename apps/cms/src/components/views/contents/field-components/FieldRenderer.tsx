import React from 'react';
import { Form } from 'antd';
import { EnFieldType } from "@/abstracts/modules/module-input";
import { IField } from "@/types/page";
import {
  TextField,
  TextAreaField,
  NumberField,
  MoneyField,
  PercentageField,
  ImageField,
  GalleryField,
  LinkField,
  ListField,
  EditorField,
  SlugField,
  EmailField,
  PhoneField,
  PasswordField,
  UrlField,
  SelectField,
  RadioField,
  CheckboxField,
  DateField,
  TimeField,
  DateTimeField,
  FileField,
  ColorField,
  RangeSliderField,
  BooleanField,
  HtmlField,
  VideoField
} from '@/components/fields';
import { fieldContainerStyles } from './index';
import GridLayout from './GridLayout';
import './FieldComponents.css';
import { Color } from 'antd/es/color-picker';

interface FieldRendererProps {
  field: IField;
  index: number;
  slugfields: IField[]
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, index, slugfields }) => {
  // Parse field options from settings
  const options = field.settings ? JSON.parse(field.settings) : {};
  const isRequired = options.required !== undefined ? options.required : false;



  // Render the appropriate field component
  const renderFieldComponent = () => {
    const fieldProps = { field, options };

    console.info("field => ", field);

    // تحديد الحقل المرتبط بناءً على إعدادات الحقل أو البحث في حقول slug المتاحة
    if (options.relatedFieldSlug && slugfields && slugfields.length > 0) {
      // البحث عن الحقل المطابق في قائمة slug fields
      const targetSlugField = slugfields.find(slugField =>
        slugField.fieldSlug === options.relatedFieldSlug ||
        slugField.name.toLowerCase().includes('slug')
      );

      if (targetSlugField) {
        options.relatedFieldSlug = targetSlugField.fieldSlug;
        console.info(`Found target slug field: ${targetSlugField.name} (${targetSlugField.fieldSlug})`);
      } else {
        console.warn(`Target slug field not found for: ${options.relatedFieldSlug}`);
      }
    } else if (slugfields && slugfields.length > 0 && field.fieldType === EnFieldType.text) {
      // إذا لم يتم تحديد relatedFieldSlug، استخدم أول حقل slug متاح للحقول النصية فقط
      options.relatedFieldSlug = slugfields[0].fieldSlug;
      console.info(`Auto-assigned slug field: ${slugfields[0].name} (${slugfields[0].fieldSlug}) for text field: ${field.name}`);
    }

    console.info(`Final relatedFieldSlug for ${field.name}:`, options.relatedFieldSlug);

    switch (field.fieldType) {
      case EnFieldType.text:
        return <TextField {...fieldProps} />;
      case EnFieldType.slug:
        return <SlugField {...fieldProps} />;
      case EnFieldType.textArea:
        return <TextAreaField {...fieldProps} />;
      case EnFieldType.email:
        return <EmailField {...fieldProps} />;
      case EnFieldType.number:
        return <NumberField {...fieldProps} />;
      case EnFieldType.moneyFormat:
        return <MoneyField {...fieldProps} />;
      case EnFieldType.percentage:
        return <PercentageField {...fieldProps} />;
      case EnFieldType.image:
        return <ImageField {...fieldProps} />;
      case EnFieldType.gallary:
        return <GalleryField {...fieldProps} />;
      case EnFieldType.link:
        return <LinkField {...fieldProps} />;
      case EnFieldType.list:
        return <ListField {...fieldProps} />;
      case EnFieldType.editor:
        return <EditorField {...fieldProps} />;

      // Additional field types
      case EnFieldType.phone:
        return <PhoneField {...fieldProps} />;
      case EnFieldType.password:
        return <PasswordField {...fieldProps} />;
      case EnFieldType.url:
        return <UrlField {...fieldProps} />;
      case EnFieldType.select:
        return <SelectField {...fieldProps} />;
      case EnFieldType.radio:
        return <RadioField {...fieldProps} />;
      case EnFieldType.checkboxes:
        return <CheckboxField {...fieldProps} />;
      case EnFieldType.date:
        return <DateField {...fieldProps} />;
      case EnFieldType.time:
        return <TimeField {...fieldProps} />;
      case EnFieldType.dateTime:
        return <DateTimeField {...fieldProps} />;
      case EnFieldType.file:
        return <FileField {...fieldProps} />;
      case EnFieldType.color:
        return <ColorField {...fieldProps} />;
      case EnFieldType.rangeSlider:
        return <RangeSliderField {...fieldProps} />;
      case EnFieldType.boolean:
        return <BooleanField {...fieldProps} />;
      case EnFieldType.html:
        return <HtmlField {...fieldProps} />;
      case EnFieldType.video:
        return <VideoField {...fieldProps} />;

      default:
        return <TextField {...fieldProps} />;
    }
  };

  // Generate validation rules
  const getValidationRules = () => {
    const rules: any[] = [];

    // Required validation
    if (isRequired || field.fieldType == EnFieldType.slug) {
      rules.push({
        required: true,
        message: `${field.name} is required`
      });
    }

    // Length validations for text fields
    if ([EnFieldType.text, EnFieldType.textArea].includes(field.fieldType as EnFieldType)) {
      if (options.minLength) {
        rules.push({
          min: options.minLength,
          message: `${field.name} must be at least ${options.minLength} characters`
        });
      }
      if (options.maxLength) {
        rules.push({
          max: options.maxLength,
          message: `${field.name} must not exceed ${options.maxLength} characters`
        });
      }
    }

    // Number validations
    if ([EnFieldType.number, EnFieldType.moneyFormat, EnFieldType.percentage].includes(field.fieldType as EnFieldType)) {
      if (options.minValue !== undefined) {
        rules.push({
          type: 'number',
          min: options.minValue,
          message: `${field.name} must be at least ${options.minValue}`
        });
      }
      if (options.maxValue !== undefined) {
        rules.push({
          type: 'number',
          max: options.maxValue,
          message: `${field.name} must not exceed ${options.maxValue}`
        });
      }
    }

    // URL validation for link and url fields
    if ([EnFieldType.link, EnFieldType.url].includes(field.fieldType as EnFieldType)) {
      rules.push({
        type: 'url',
        message: 'Please enter a valid URL'
      });
    }

    // Email validation
    if (field.fieldType === EnFieldType.email) {
      rules.push({
        type: 'email',
        message: 'Please enter a valid email address'
      });
    }

    // Phone validation (basic pattern)
    if (field.fieldType === EnFieldType.phone) {
      rules.push({
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        message: 'Please enter a valid phone number'
      });
    }

    // Password validation
    if (field.fieldType === EnFieldType.password) {
      if (options.minLength) {
        rules.push({
          min: options.minLength,
          message: `Password must be at least ${options.minLength} characters`
        });
      }
    }

    // Date validations
    if ([EnFieldType.date, EnFieldType.time, EnFieldType.dateTime].includes(field.fieldType as EnFieldType)) {
      if (options.minDate) {
        rules.push({
          type: 'object',
          message: 'Please select a valid date'
        });
      }
    }

    return rules;
  };

  return (
    <GridLayout field={field} index={index}>
      <Form.Item
        name={field.fieldSlug}
        label={field.name}
        rules={getValidationRules()}
        help={options.helpText}
        className="field-form-item"
        initialValue={options.defaultValue}
        style={fieldContainerStyles}
        extra={options.description}
      >
        {renderFieldComponent()}
      </Form.Item>
    </GridLayout>
  );
};

export default FieldRenderer;