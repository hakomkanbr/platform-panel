# Field Types System

هذا النظام يوفر مكونات منفصلة لكل نوع من أنواع الحقول، مما يجعل إدارة وتخصيص خيارات كل حقل أسهل وأكثر تنظيماً.

## البنية

```
field-types/
├── BaseFieldOptions.tsx          # المكون الأساسي والواجهات
├── FieldOptionsRenderer.tsx      # مكون التوجيه الرئيسي
├── TextFieldOptions.tsx          # خيارات حقل النص
├── NumberFieldOptions.tsx        # خيارات حقل الرقم
├── ImageFieldOptions.tsx         # خيارات حقل الصورة
├── GalleryFieldOptions.tsx       # خيارات حقل المعرض
├── RichTextFieldOptions.tsx      # خيارات حقل النص المنسق
├── BooleanFieldOptions.tsx       # خيارات حقل القيمة المنطقية
├── DateFieldOptions.tsx          # خيارات حقل التاريخ
├── EmailFieldOptions.tsx         # خيارات حقل البريد الإلكتروني
├── FileFieldOptions.tsx          # خيارات حقل الملف
├── VideoFieldOptions.tsx         # خيارات حقل الفيديو
├── HtmlFieldOptions.tsx          # خيارات حقل HTML
├── index.ts                      # ملف التصدير
└── README.md                     # هذا الملف
```

## كيفية إضافة نوع حقل جديد

### 1. إنشاء مكون جديد

أنشئ ملف جديد مثل `CustomFieldOptions.tsx`:

```tsx
import React from 'react';
import { Form, Input, Switch } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const CustomFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="required" label="حقل مطلوب" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="customOption" label="خيار مخصص">
        <Input placeholder="أدخل القيمة" />
      </Form.Item>
      
      {/* أضف المزيد من الخيارات حسب الحاجة */}
    </>
  );
};

export default CustomFieldOptions;
```

### 2. إضافة التصدير في index.ts

```tsx
export { default as CustomFieldOptions } from './CustomFieldOptions';
```

### 3. تحديث FieldOptionsRenderer.tsx

أضف الحالة الجديدة في switch statement:

```tsx
import { CustomFieldOptions } from './index';

// في دالة renderFieldOptions
case 'Custom':
  return <CustomFieldOptions fieldType={fieldType} form={form} />;
```

### 4. إضافة الخيار في AddOrEditFieldModal.tsx

أضف Option جديد في Select:

```tsx
<Option value="Custom">Custom Field</Option>
```

## الخيارات المتاحة لكل نوع حقل

### Text Field
- `minLength`: الحد الأدنى للطول
- `maxLength`: الحد الأقصى للطول
- `defaultValue`: القيمة الافتراضية
- `required`: حقل مطلوب
- `placeholder`: النص التوضيحي

### Number Field
- `minValue`: الحد الأدنى للقيمة
- `maxValue`: الحد الأقصى للقيمة
- `defaultValue`: القيمة الافتراضية
- `required`: حقل مطلوب
- `step`: خطوة الزيادة
- `precision`: عدد الخانات العشرية

### Image Field
- `required`: حقل مطلوب
- `maxFileSize`: الحد الأقصى لحجم الملف
- `allowedFormats`: صيغ الملفات المسموحة
- `maxWidth`: العرض الأقصى
- `maxHeight`: الارتفاع الأقصى
- `helpText`: نص المساعدة

### Gallery Field
- `required`: حقل مطلوب
- `minImages`: الحد الأدنى للصور
- `maxImages`: الحد الأقصى للصور
- `maxFileSize`: الحد الأقصى لحجم كل صورة
- `allowedFormats`: صيغ الملفات المسموحة
- `sortable`: قابل للترتيب
- `helpText`: نص المساعدة

## نصائح للتطوير

1. **استخدم BaseFieldOptionsProps**: تأكد من أن كل مكون يستخدم هذه الواجهة
2. **اتبع نمط التسمية**: استخدم `[FieldType]FieldOptions.tsx`
3. **أضف التحقق من الصحة**: استخدم `rules` في Form.Item عند الحاجة
4. **استخدم الترجمة**: أضف النصوص باللغة العربية كما هو موضح في الأمثلة
5. **اختبر التكامل**: تأكد من أن الخيارات تُحفظ وتُسترجع بشكل صحيح

## مثال على الاستخدام

```tsx
// في AddOrEditFieldModal.tsx
<FieldOptionsRenderer fieldType={fieldType} form={form} />
```

هذا المكون سيعرض تلقائياً الخيارات المناسبة بناءً على نوع الحقل المحدد.