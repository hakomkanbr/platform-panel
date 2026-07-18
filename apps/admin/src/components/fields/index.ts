// Central Fields System - Main Export
// This file exports all field components and their options

// Basic Field Components
export * from './basic';

// Number Field Components
export * from './number';

// Media Field Components
export * from './media';

// Selection Field Components
export * from './selection';

// DateTime Field Components
export * from './datetime';

// Special Field Components
export * from './special';

// Advanced Field Components
export * from './advanced';

// Core Components
export * from './core';

// Field Options Components (for field configuration)
export * from './options';

// Field configuration
export * from './core/fieldTypesConfig';

// Legacy compatibility - re-export from contents field-components
export type { FieldProps } from '../views/contents/field-components';
export { commonFieldStyles, fieldContainerStyles } from '../views/contents/field-components';