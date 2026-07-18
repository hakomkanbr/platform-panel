import { EnFieldType } from "@/abstracts/modules/module-input";
import { FormValidationRule } from "@/types/form";
import { IField } from "@/types/page";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class FormValidationUtil {
  static validateForm(fields: IField[]): ValidationResult {
    const errors: string[] = [];

    console.info("fields => ", fields);

    // Check if form has at least one field
    if (fields.length === 0) {
      errors.push('Form must have at least one field');
    }

    // Validate each field
    fields.forEach((field, index) => {
      const fieldErrors = this.validateField(field, index);
      errors.push(...fieldErrors);
    });

    // Check for duplicate field names
    const fieldNames = fields.map(f => f.fieldSlug);
    const duplicateNames = fieldNames.filter((name, index) =>
      fieldNames.indexOf(name) !== index
    );

    if (duplicateNames.length > 0) {
      errors.push(`Duplicate field names found: ${[...duplicateNames].join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateField(field: IField, index: number): string[] {
    const errors: string[] = [];
    const fieldLabel = field.name || `Field ${index + 1}`;

    // Required validations
    if (!field.fieldSlug || field.fieldSlug.trim() === '') {
      errors.push(`${fieldLabel}: Field name is required`);
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.fieldSlug)) {
      errors.push(`${fieldLabel}: Field name must start with a letter or underscore and contain only letters, numbers, and underscores`);
    }

    if (!field.name || field.name.trim() === '') {
      errors.push(`${fieldLabel}: Field label is required`);
    }

    if (!field.fieldType) {
      errors.push(`${fieldLabel}: Field type is required`);
    }

    // Type-specific validations
    if (this.requiresOptions(field.fieldType)) {
      if (!field.settings || field.settings.trim() === '') {
        errors.push(`${fieldLabel}: Options are required for ${field.fieldType} fields`);
      } else {
        const options = field.settings.split('\n').filter(opt => opt.trim() !== '');
        if (options.length < 2) {
          errors.push(`${fieldLabel}: At least 2 options are required for ${field.fieldType} fields`);
        }
      }
    }

    return errors;
  }

  static validateValidationRules(validationString: string, fieldLabel: string): string[] {
    const errors: string[] = [];

    try {
      const rules = this.parseValidationRules(validationString);

      rules.forEach(rule => {
        switch (rule.type) {
          case 'min':
            if (typeof rule.value !== 'number' || rule.value < 0) {
              errors.push(`${fieldLabel}: Invalid min value`);
            }
            break;
          case 'max':
            if (typeof rule.value !== 'number' || rule.value < 0) {
              errors.push(`${fieldLabel}: Invalid max value`);
            }
            break;
          case 'pattern':
            if (typeof rule.value !== 'string') {
              errors.push(`${fieldLabel}: Pattern must be a string`);
            } else {
              try {
                new RegExp(rule.value);
              } catch {
                errors.push(`${fieldLabel}: Invalid regex pattern`);
              }
            }
            break;
        }
      });
    } catch (error) {
      errors.push(`${fieldLabel}: Invalid validation rules format`);
    }

    return errors;
  }

  static parseValidationRules(validationString: string): FormValidationRule[] {
    const rules: FormValidationRule[] = [];

    if (!validationString.trim()) return rules;

    const ruleParts = validationString.split(',').map(part => part.trim());

    ruleParts.forEach(rulePart => {
      if (rulePart === 'required') {
        rules.push({ type: 'required' });
      } else if (rulePart === 'email') {
        rules.push({ type: 'email' });
      } else if (rulePart === 'url') {
        rules.push({ type: 'url' });
      } else if (rulePart === 'number') {
        rules.push({ type: 'number' });
      } else if (rulePart.startsWith('min:')) {
        const value = parseInt(rulePart.split(':')[1]);
        if (!isNaN(value)) {
          rules.push({ type: 'min', value });
        }
      } else if (rulePart.startsWith('max:')) {
        const value = parseInt(rulePart.split(':')[1]);
        if (!isNaN(value)) {
          rules.push({ type: 'max', value });
        }
      } else if (rulePart.startsWith('pattern:')) {
        const pattern = rulePart.substring(8); // Remove 'pattern:'
        rules.push({ type: 'pattern', value: pattern });
      }
    });

    return rules;
  }

  static requiresOptions(fieldType: string): boolean {
    return ['select', 'radio', 'checkbox'].includes(fieldType);
  }

  static generateValidationMessage(rule: FormValidationRule, fieldLabel: string): string {
    switch (rule.type) {
      case 'required':
        return `${fieldLabel} is required`;
      case 'email':
        return `${fieldLabel} must be a valid email address`;
      case 'url':
        return `${fieldLabel} must be a valid URL`;
      case 'number':
        return `${fieldLabel} must be a number`;
      case 'min':
        return `${fieldLabel} must be at least ${rule.value} characters`;
      case 'max':
        return `${fieldLabel} must not exceed ${rule.value} characters`;
      case 'pattern':
        return rule.message || `${fieldLabel} format is invalid`;
      default:
        return `${fieldLabel} is invalid`;
    }
  }

  // static validateSubmissionData(
  //   submissionData: Record<string, any>,
  //   fields: IField[]
  // ): ValidationResult {
  //   const errors: string[] = [];

  //   fields.forEach(field => {
  //     const value = submissionData[field.fieldSlug];

  //     // Check required fields
  //     if (field.required && (value === undefined || value === null || value === '')) {
  //       errors.push(`${field.name} is required`);
  //       return;
  //     }

  //     // Skip validation if field is empty and not required
  //     if (!value && !field.required) return;

  //     // Validate based on field type
  //     const typeErrors = this.validateFieldValue(value, field);
  //     errors.push(...typeErrors);

  //     // Validate custom rules
  //     if (field.validation) {
  //       const rules = this.parseValidationRules(field.validation);
  //       rules.forEach(rule => {
  //         if (!this.validateRule(value, rule)) {
  //           errors.push(this.generateValidationMessage(rule, field.name));
  //         }
  //       });
  //     }
  //   });

  //   return {
  //     isValid: errors.length === 0,
  //     errors
  //   };
  // }

  private static validateFieldValue(value: any, field: IField): string[] {
    const errors: string[] = [];

    switch (field.fieldType) {
      case EnFieldType.email:
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field.name} must be a valid email address`);
        }
        break;
      case EnFieldType.url:
        try {
          new URL(value);
        } catch {
          errors.push(`${field.name} must be a valid URL`);
        }
        break;
      case EnFieldType.number:
        if (isNaN(Number(value))) {
          errors.push(`${field.name} must be a number`);
        }
        break;
      case EnFieldType.phone:
        if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
          errors.push(`${field.name} must be a valid phone number`);
        }
        break;
    }

    return errors;
  }

  private static validateRule(value: any, rule: FormValidationRule): boolean {
    switch (rule.type) {
      case 'required':
        return value !== undefined && value !== null && value !== '';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      case 'number':
        return !isNaN(Number(value));
      case 'min':
        return String(value).length >= (rule.value as number);
      case 'max':
        return String(value).length <= (rule.value as number);
      case 'pattern':
        return new RegExp(rule.value as string).test(value);
      default:
        return true;
    }
  }
}