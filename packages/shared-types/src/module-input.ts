
export enum EnFieldType {
  // Basic text fields
  text = "text",
  textArea = "textarea",
  slug = "slug",
  
  // Number fields
  number = "number",
  moneyFormat = "moneyFormat",
  percentage = "percentage",
  
  // Media fields
  image = "image",
  gallary = "images",
  file = "file",
  
  // Selection fields
  select = "select",
  radio = "radio",
  checkboxes = "checkboxes",
  list = "list",
  
  // Date/Time fields
  date = "date",
  time = "time",
  dateTime = "dateTime",
  
  // Special input fields
  email = "email",
  phone = "phone",
  password = "password",
  url = "url",
  color = "color",
  
  // Advanced fields
  editor = "editor",
  link = "link",
  rangeSlider = "rangeSlider",
  
  // Additional fields for forms
  boolean = "boolean",
  html = "html",
  video = "video",
}

export interface FieldTypeConfig {
  label: string;
  value: EnFieldType;
  category: 'basic' | 'number' | 'media' | 'selection' | 'datetime' | 'special' | 'advanced';
  description?: string;
  requiresOptions?: boolean;
  supportedInForms?: boolean;
  supportedInModules?: boolean;
}

export const fieldTypes: FieldTypeConfig[] = [
  // Basic text fields
  { 
    label: "Text Input", 
    value: EnFieldType.text, 
    category: 'basic',
    description: "Single line text input",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Textarea", 
    value: EnFieldType.textArea, 
    category: 'basic',
    description: "Multi-line text input",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Slug", 
    value: EnFieldType.slug, 
    category: 'basic',
    description: "URL-friendly text field",
    supportedInForms: false,
    supportedInModules: true
  },
  
  // Number fields
  { 
    label: "Number", 
    value: EnFieldType.number, 
    category: 'number',
    description: "Numeric input with validation",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Money Format", 
    value: EnFieldType.moneyFormat, 
    category: 'number',
    description: "Currency formatted number",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Percentage", 
    value: EnFieldType.percentage, 
    category: 'number',
    description: "Percentage value input",
    supportedInForms: true,
    supportedInModules: true
  },
  
  // Media fields
  { 
    label: "Image", 
    value: EnFieldType.image, 
    category: 'media',
    description: "Single image upload",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Gallery", 
    value: EnFieldType.gallary, 
    category: 'media',
    description: "Multiple images upload",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "File Upload", 
    value: EnFieldType.file, 
    category: 'media',
    description: "File upload field",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Video", 
    value: EnFieldType.video, 
    category: 'media',
    description: "Video file upload",
    supportedInForms: true,
    supportedInModules: true
  },
  
  // Selection fields
  { 
    label: "Radio Buttons", 
    value: EnFieldType.radio, 
    category: 'selection',
    description: "Single choice radio buttons",
    requiresOptions: true,
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Checkboxes", 
    value: EnFieldType.checkboxes, 
    category: 'selection',
    description: "Multiple choice checkboxes",
    requiresOptions: true,
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "List", 
    value: EnFieldType.list, 
    category: 'selection',
    description: "Dynamic list of items",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Boolean", 
    value: EnFieldType.boolean, 
    category: 'selection',
    description: "True/False toggle",
    supportedInForms: true,
    supportedInModules: true
  },
  
  // Date/Time fields
  { 
    label: "Date", 
    value: EnFieldType.date, 
    category: 'datetime',
    description: "Date picker",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Time", 
    value: EnFieldType.time, 
    category: 'datetime',
    description: "Time picker",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Date & Time", 
    value: EnFieldType.dateTime, 
    category: 'datetime',
    description: "Date and time picker",
    supportedInForms: true,
    supportedInModules: true
  },
  
  // Special input fields
  { 
    label: "Email", 
    value: EnFieldType.email, 
    category: 'special',
    description: "Email address input with validation",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Phone", 
    value: EnFieldType.phone, 
    category: 'special',
    description: "Phone number input",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Password", 
    value: EnFieldType.password, 
    category: 'special',
    description: "Password input field",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "URL", 
    value: EnFieldType.url, 
    category: 'special',
    description: "URL input with validation",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Color Picker", 
    value: EnFieldType.color, 
    category: 'special',
    description: "Color selection input",
    supportedInForms: true,
    supportedInModules: true
  },
  
  // Advanced fields
  { 
    label: "Rich Text Editor", 
    value: EnFieldType.editor, 
    category: 'advanced',
    description: "WYSIWYG text editor",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Link", 
    value: EnFieldType.link, 
    category: 'advanced',
    description: "Link with title and URL",
    supportedInForms: true,
    supportedInModules: true
  },
  { 
    label: "Range Slider", 
    value: EnFieldType.rangeSlider, 
    category: 'advanced',
    description: "Numeric range slider",
    supportedInForms: true,
    supportedInModules: true
  },
  // { 
  //   label: "HTML", 
  //   value: EnFieldType.html, 
  //   category: 'advanced',
  //   description: "Raw HTML input",
  //   supportedInForms: true,
  //   supportedInModules: true
  // },
];

// Helper functions
export const getFieldTypesForForms = (): FieldTypeConfig[] => {
  return fieldTypes.filter(type => type.supportedInForms);
};

export const getFieldTypesForModules = (): FieldTypeConfig[] => {
  return fieldTypes.filter(type => type.supportedInModules);
};

export const getFieldTypesByCategory = (category: string): FieldTypeConfig[] => {
  return fieldTypes.filter(type => type.category === category);
};

export const getFieldTypeConfig = (value: EnFieldType): FieldTypeConfig | undefined => {
  return fieldTypes.find(type => type.value === value);
};

export const requiresOptions = (fieldType: EnFieldType): boolean => {
  const config = getFieldTypeConfig(fieldType);
  return config?.requiresOptions || false;
};
