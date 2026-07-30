# Unified Field System

This document describes the unified field system that consolidates field types between Forms and Modules in the headless CMS.

## Overview

The unified field system provides a consistent way to define and use field types across both Forms and Modules, eliminating code duplication and ensuring consistency.

## Field Types

### Basic Text Fields
- **text**: Single line text input
- **textArea**: Multi-line text input  
- **slug**: URL-friendly text field (Modules only)

### Number Fields
- **number**: Numeric input with validation
- **moneyFormat**: Currency formatted number (Modules only)
- **percentage**: Percentage value input (Modules only)

### Media Fields
- **image**: Single image upload (Modules only)
- **gallary**: Multiple images upload (Modules only)
- **file**: File upload field
- **video**: Video file upload (Modules only)

### Selection Fields
- **select**: Dropdown selection (Forms only)
- **radio**: Single choice radio buttons (Forms only)
- **checkboxes**: Multiple choice checkboxes (Forms only)
- **list**: Dynamic list of items (Modules only)
- **boolean**: True/False toggle (Modules only)

### Date/Time Fields
- **date**: Date picker
- **time**: Time picker (Forms only)
- **dateTime**: Date and time picker (Forms only)

### Special Input Fields
- **email**: Email address input with validation
- **phone**: Phone number input (Forms only)
- **password**: Password input field (Forms only)
- **url**: URL input with validation (Forms only)
- **color**: Color selection input (Forms only)

### Advanced Fields
- **editor**: WYSIWYG text editor (Modules only)
- **link**: Link with title and URL (Modules only)
- **rangeSlider**: Numeric range slider (Forms only)
- **html**: Raw HTML input (Modules only)

## Usage

### In Forms
```typescript
import { getFieldTypesForForms, FORM_FIELD_TYPES } from "@/utils/field-utils";

// Get all field types supported in forms
const formFields = getFieldTypesForForms();
// or use the constant
const formFields = FORM_FIELD_TYPES;
```

### In Modules
```typescript
import { getFieldTypesForModules, MODULE_FIELD_TYPES } from "@/utils/field-utils";

// Get all field types supported in modules
const moduleFields = getFieldTypesForModules();
// or use the constant
const moduleFields = MODULE_FIELD_TYPES;
```

### Field Validation
```typescript
import { fieldRequiresOptions, getDefaultValidationRules } from "@/utils/field-utils";

// Check if field requires options
const needsOptions = fieldRequiresOptions(EnFieldType.select); // true

// Get default validation rules
const rules = getDefaultValidationRules(EnFieldType.email, true);
```

### Field Categorization
```typescript
import { 
  isMediaField, 
  isTextBasedField, 
  isNumberField,
  FIELD_TYPE_GROUPS 
} from "@/utils/field-utils";

// Check field category
const isMedia = isMediaField(EnFieldType.image); // true
const isText = isTextBasedField(EnFieldType.text); // true

// Get grouped field types
const basicFields = FIELD_TYPE_GROUPS.basic;
const mediaFields = MODULE_FIELD_TYPE_GROUPS.media;
```

## Configuration

Each field type has the following configuration:

```typescript
interface FieldTypeConfig {
  label: string;                    // Display label
  value: EnFieldType;              // Enum value
  category: string;                // Category for grouping
  description?: string;            // Field description
  requiresOptions?: boolean;       // Whether field needs options
  supportedInForms?: boolean;      // Supported in forms
  supportedInModules?: boolean;    // Supported in modules
}
```

## Migration Notes

- All enum values are now lowercase (e.g., `"text"` instead of `"Text"`)
- Field compatibility is explicitly defined via `supportedInForms` and `supportedInModules`
- Use utility functions instead of hardcoded field type checks
- The old `fieldTypes` array is replaced with categorized configurations

## Best Practices

1. **Use utility functions**: Instead of hardcoding field type checks, use the provided utility functions
2. **Check compatibility**: Always verify if a field type is supported in your context using `isFieldSupportedInForms()` or `isFieldSupportedInModules()`
3. **Use constants**: Use `FORM_FIELD_TYPES` and `MODULE_FIELD_TYPES` constants instead of calling functions repeatedly
4. **Leverage categorization**: Use field categories for better UI organization and validation logic