import { EnFieldType, getFieldTypesForModules, FieldTypeConfig as BaseFieldTypeConfig } from '@/abstracts/modules/module-input';

export interface ModuleFieldTypeConfig extends BaseFieldTypeConfig {
  color: string;
  icon?: string;
}

// Color mapping for different field categories
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'basic': 'blue',
    'number': 'green', 
    'media': 'magenta',
    'selection': 'purple',
    'datetime': 'gold',
    'special': 'lime',
    'advanced': 'orange'
  };
  return colorMap[category] || 'default';
};

// Get field types available for modules with color configuration
export const getModuleFieldTypes = (): ModuleFieldTypeConfig[] => {
  return getFieldTypesForModules().map(fieldType => ({
    ...fieldType,
    color: getCategoryColor(fieldType.category)
  }));
};

export const getFieldTypeConfig = (value: string): ModuleFieldTypeConfig | undefined => {
  return getModuleFieldTypes().find(config => config.value === value);
};

export const getFieldTypeLabel = (value: string): string => {
  const config = getFieldTypeConfig(value);
  return config?.label || value;
};

export const getFieldTypeColor = (value: string): string => {
  const config = getFieldTypeConfig(value);
  return config?.color || 'default';
};

// For backward compatibility
export const FIELD_TYPES_CONFIG = getModuleFieldTypes();