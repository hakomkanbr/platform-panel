# Field Components System

A comprehensive, modular field rendering system with beautiful designs and responsive grid layout.

## 🏗️ Architecture

```
field-components/
├── index.ts                 # Main exports
├── FieldRenderer.tsx        # Main field renderer
├── GridLayout.tsx          # Responsive grid system
├── FieldComponents.css     # Custom styles
├── README.md              # Documentation
└── components/
    ├── TextField.tsx
    ├── TextAreaField.tsx
    ├── NumberField.tsx
    ├── MoneyField.tsx
    ├── PercentageField.tsx
    ├── ImageField.tsx
    ├── GalleryField.tsx
    ├── LinkField.tsx
    ├── ListField.tsx
    └── EditorField.tsx
```

## 🎨 Features

### ✨ Beautiful Design
- Modern, clean interface with rounded corners
- Smooth hover and focus animations
- Consistent color scheme and spacing
- Custom icons for each field type
- Professional shadows and transitions

### 📱 Responsive Grid System
- **Mobile (xs)**: Full width for all fields
- **Small Tablets (sm)**: Optimized for touch
- **Medium Screens (md)**: Smart 2-column layout
- **Large Screens (lg)**: Efficient 3-column layout
- **Ultra Wide (xxl)**: Maximum 4-column layout

### 🔧 Field-Specific Grid Logic
- **Editor**: Always full width (24/24)
- **TextArea**: Full width on mobile, 2/3 on desktop
- **Images/Gallery**: Compact grid layout
- **Text/Number**: Flexible responsive columns
- **Links**: Medium width for better UX
- **Lists**: Adaptive width based on content

## 🎯 Field Types & Options

### TextField
```typescript
options: {
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  helpText?: string;
}
```

### TextAreaField
```typescript
options: {
  rows?: number;
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  helpText?: string;
  showCount?: boolean;
}
```

### NumberField
```typescript
options: {
  minValue?: number;
  maxValue?: number;
  step?: number;
  defaultValue?: number;
  placeholder?: string;
}
```

### MoneyField
```typescript
options: {
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  placeholder?: string;
}
```

### PercentageField
```typescript
options: {
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  placeholder?: string;
}
```

### ImageField
```typescript
options: {
  maxFiles?: number;
  allowedFormats?: string[];
  helpText?: string;
}
```

### GalleryField
```typescript
options: {
  maxImages?: number;
  allowedFormats?: string[];
  helpText?: string;
}
```

### LinkField
```typescript
options: {
  defaultValue?: string;
  placeholder?: string;
  helpText?: string;
}
```

### ListField
```typescript
options: {
  predefinedOptions?: string[];
  defaultValue?: string[];
  placeholder?: string;
  helpText?: string;
}
```

### EditorField
```typescript
options: {
  helpText?: string;
  toolbar?: string[];
}
```

## 🚀 Usage

### Basic Usage
```tsx
import FeedInputs from './inputs';

const MyForm = () => {
  const fields = [
    {
      id: 1,
      name: 'Full Name',
      fieldSlug: 'full_name',
      fieldType: EnFieldType.text,
      required: true,
      settings: JSON.stringify({
        placeholder: 'Enter your full name',
        minLength: 2,
        maxLength: 50,
        helpText: 'Please enter your complete name'
      })
    }
  ];

  return <FeedInputs fields={fields} />;
};
```

### Advanced Grid Customization
```tsx
import { FieldRenderer, FieldsGridContainer } from './field-components';

const CustomForm = () => {
  return (
    <FieldsGridContainer>
      {fields.map((field, index) => (
        <FieldRenderer key={field.id} field={field} index={index} />
      ))}
    </FieldsGridContainer>
  );
};
```

## 🎨 Styling

### CSS Classes
- `.field-form-item` - Form item container
- `.field-grid-item` - Grid item wrapper
- `.fields-grid-container` - Main grid container
- `.custom-[field-type]-field` - Field-specific styles

### Customization
```css
/* Override field styles */
.custom-text-field {
  border-radius: 12px !important;
}

/* Custom grid spacing */
.field-grid-item {
  padding: 0 16px !important;
}
```

## 📱 Responsive Breakpoints

| Screen Size | Breakpoint | Typical Layout |
|-------------|------------|----------------|
| Mobile      | xs (0-576px) | 1 column |
| Small Tablet| sm (576-768px) | 1-2 columns |
| Medium      | md (768-992px) | 2-3 columns |
| Large       | lg (992-1200px) | 3-4 columns |
| Extra Large | xl (1200-1600px) | 3-4 columns |
| Ultra Wide  | xxl (1600px+) | 4-6 columns |

## 🔧 Validation

Automatic validation based on field options:
- **Required fields**: Based on `required` flag
- **Text length**: `minLength` and `maxLength`
- **Number ranges**: `minValue` and `maxValue`
- **URL format**: Automatic for link fields
- **File types**: Based on `allowedFormats`

## 🎯 Best Practices

1. **Field Ordering**: Place important fields first
2. **Grid Layout**: Use appropriate field types for better layout
3. **Validation**: Always provide clear error messages
4. **Help Text**: Use `helpText` for complex fields
5. **Mobile First**: Test on mobile devices first
6. **Performance**: Use `key` props for dynamic lists

## 🚀 Performance

- **Lazy Loading**: Components load only when needed
- **Memoization**: Prevents unnecessary re-renders
- **CSS-in-JS**: Optimized styling system
- **Grid Optimization**: Efficient responsive calculations

## 🔄 Migration Guide

### From Old inputs.tsx
```tsx
// Old way
if (input.fieldType == EnFieldType.text) {
  return <Input placeholder={input.placeholder} />;
}

// New way
<FeedInputs fields={fields} />
```

The new system automatically handles all field types with proper styling and validation.