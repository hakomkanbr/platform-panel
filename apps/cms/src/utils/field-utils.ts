import { 
  EnFieldType, 
  FieldTypeConfig, 
  getFieldTypesForForms, 
  getFieldTypesForModules,
  getFieldTypeConfig,
  requiresOptions
} from "@/abstracts/modules/module-input";

/**
 * Utility functions for working with unified field types
 */

// Field validation helpers
export const isMediaField = (fieldType: EnFieldType): boolean => {
  return [EnFieldType.image, EnFieldType.gallary, EnFieldType.file, EnFieldType.video].includes(fieldType);
};

export const isTextBasedField = (fieldType: EnFieldType): boolean => {
  return [EnFieldType.text, EnFieldType.textArea, EnFieldType.slug, EnFieldType.email, EnFieldType.url, EnFieldType.phone].includes(fieldType);
};

export const isNumberField = (fieldType: EnFieldType): boolean => {
  return [EnFieldType.number, EnFieldType.moneyFormat, EnFieldType.percentage].includes(fieldType);
};

export const isSelectionField = (fieldType: EnFieldType): boolean => {
  return [EnFieldType.select, EnFieldType.radio, EnFieldType.checkboxes, EnFieldType.list, EnFieldType.boolean].includes(fieldType);
};

export const isDateTimeField = (fieldType: EnFieldType): boolean => {
  return [EnFieldType.date, EnFieldType.time, EnFieldType.dateTime].includes(fieldType);
};

export const isAdvancedField = (fieldType: EnFieldType): boolean => {
  return [EnFieldType.editor, EnFieldType.link, EnFieldType.html].includes(fieldType);
};

// Field compatibility helpers
export const isFieldSupportedInForms = (fieldType: EnFieldType): boolean => {
  const config = getFieldTypeConfig(fieldType);
  return config?.supportedInForms || false;
};

export const isFieldSupportedInModules = (fieldType: EnFieldType): boolean => {
  const config = getFieldTypeConfig(fieldType);
  return config?.supportedInModules || false;
};

// Field configuration helpers
export const getFieldTypeLabel = (fieldType: EnFieldType): string => {
  const config = getFieldTypeConfig(fieldType);
  return config?.label || fieldType;
};

export const getFieldTypeDescription = (fieldType: EnFieldType): string => {
  const config = getFieldTypeConfig(fieldType);
  return config?.description || '';
};

export const getFieldTypeCategory = (fieldType: EnFieldType): string => {
  const config = getFieldTypeConfig(fieldType);
  return config?.category || 'basic';
};

// Field options helpers
export const fieldRequiresOptions = (fieldType: EnFieldType): boolean => {
  return requiresOptions(fieldType);
};

export const parseFieldOptions = (settings: string | null): Array<{label: string, value: string}> => {
  if (!settings) return [];
  
  try {
    // Try to parse as JSON first (for complex options)
    const parsed = JSON.parse(settings);
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        label: typeof item === 'string' ? item : item.label || item.value,
        value: typeof item === 'string' ? item : item.value
      }));
    }
  } catch {
    // Fall back to line-separated options
    return settings.split('\n')
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0)
      .map(opt => ({ label: opt, value: opt }));
  }
  
  return [];
};

// Field validation helpers
export const getDefaultValidationRules = (fieldType: EnFieldType, isRequired: boolean = false) => {
  const rules: any[] = [];
  
  if (isRequired) {
    rules.push({
      required: true,
      message: 'This field is required'
    });
  }
  
  switch (fieldType) {
    case EnFieldType.email:
      rules.push({
        type: 'email',
        message: 'Please enter a valid email address'
      });
      break;
      
    case EnFieldType.url:
      rules.push({
        type: 'url',
        message: 'Please enter a valid URL'
      });
      break;
      
    case EnFieldType.number:
    case EnFieldType.moneyFormat:
    case EnFieldType.percentage:
      rules.push({
        type: 'number',
        message: 'Please enter a valid number'
      });
      break;
  }
  
  return rules;
};

// Export commonly used field type arrays for easy access
export const FORM_FIELD_TYPES = getFieldTypesForForms();
export const MODULE_FIELD_TYPES = getFieldTypesForModules();

// Field type groups for UI organization
export const FIELD_TYPE_GROUPS = {
  basic: getFieldTypesForForms().filter(f => f.category === 'basic'),
  number: getFieldTypesForForms().filter(f => f.category === 'number'),
  selection: getFieldTypesForForms().filter(f => f.category === 'selection'),
  datetime: getFieldTypesForForms().filter(f => f.category === 'datetime'),
  special: getFieldTypesForForms().filter(f => f.category === 'special'),
  advanced: getFieldTypesForForms().filter(f => f.category === 'advanced'),
};

export const MODULE_FIELD_TYPE_GROUPS = {
  basic: getFieldTypesForModules().filter(f => f.category === 'basic'),
  number: getFieldTypesForModules().filter(f => f.category === 'number'),
  media: getFieldTypesForModules().filter(f => f.category === 'media'),
  selection: getFieldTypesForModules().filter(f => f.category === 'selection'),
  datetime: getFieldTypesForModules().filter(f => f.category === 'datetime'),
  special: getFieldTypesForModules().filter(f => f.category === 'special'),
  advanced: getFieldTypesForModules().filter(f => f.category === 'advanced'),
};