# أمثلة على الاستخدام

## 1. إضافة نوع حقل جديد

### إنشاء مكون الخيارات
```tsx
// SelectFieldOptions.tsx
import React from 'react';
import { Form, Input, Switch, Select } from 'antd';
import { BaseFieldOptionsProps } from './BaseFieldOptions';

const { Option } = Select;

const SelectFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      <Form.Item name="required" label="حقل مطلوب" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="options" label="الخيارات المتاحة">
        <Select mode="tags" placeholder="أدخل الخيارات">
          {/* سيتم ملؤها ديناميكياً */}
        </Select>
      </Form.Item>
      
      <Form.Item name="multiple" label="اختيار متعدد" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item name="defaultValue" label="القيمة الافتراضية">
        <Input placeholder="اختياري" />
      </Form.Item>
    </>
  );
};

export default SelectFieldOptions;
```

### إضافة التكوين
```tsx
// في fieldTypesConfig.ts
{
  value: 'Select',
  label: 'Select',
  arabicLabel: 'قائمة اختيار',
  color: 'purple',
  description: 'قائمة منسدلة للاختيار من عدة خيارات'
}
```

### تحديث الموجه
```tsx
// في FieldOptionsRenderer.tsx
case 'Select':
  return <SelectFieldOptions fieldType={fieldType} form={form} />;
```

## 2. تخصيص خيارات حقل موجود

```tsx
// تخصيص TextFieldOptions
const CustomTextFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <>
      {/* الخيارات الأساسية */}
      <Form.Item name="required" label="حقل مطلوب" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      {/* خيارات مخصصة */}
      <Form.Item name="pattern" label="نمط التحقق (Regex)">
        <Input placeholder="^[a-zA-Z]+$" />
      </Form.Item>
      
      <Form.Item name="errorMessage" label="رسالة الخطأ المخصصة">
        <Input placeholder="يرجى إدخال نص صحيح" />
      </Form.Item>
    </>
  );
};
```

## 3. استخدام المعاينة

```tsx
// في المكون الرئيسي
<FieldPreview 
  fieldType="Text"
  fieldName="اسم المستخدم"
  options={{
    required: true,
    minLength: 3,
    maxLength: 50
  }}
/>
```

## 4. التحقق من صحة البيانات

```tsx
// إضافة قواعد التحقق المخصصة
<Form.Item 
  name="customField" 
  label="حقل مخصص"
  rules={[
    { required: true, message: 'هذا الحقل مطلوب' },
    { min: 3, message: 'يجب أن يكون الطول 3 أحرف على الأقل' },
    { 
      validator: (_, value) => {
        if (value && value.includes('test')) {
          return Promise.reject('لا يمكن أن يحتوي على كلمة test');
        }
        return Promise.resolve();
      }
    }
  ]}
>
  <Input />
</Form.Item>
```

## 5. حفظ واسترجاع البيانات

```tsx
// في onFinish
const onFinish = async (values: any) => {
  const { name, fieldSlug, fieldType, ...optionsData } = values;
  
  // تنظيف البيانات حسب نوع الحقل
  if (fieldType === 'Select' && optionsData.options) {
    optionsData.options = optionsData.options.map((opt: string) => opt.trim());
  }
  
  const payload = {
    name,
    fieldSlug,
    fieldType,
    moduleId,
    options: optionsData
  };
  
  // حفظ البيانات
  await createField(payload);
};
```

## 6. التكامل مع النظام الموجود

```tsx
// استخدام الحقول في النماذج
const renderFieldByType = (field: IField) => {
  switch (field.fieldType) {
    case 'Text':
      return (
        <Input 
          placeholder={field.options?.placeholder}
          maxLength={field.options?.maxLength}
          required={field.options?.required}
        />
      );
    
    case 'Select':
      return (
        <Select 
          mode={field.options?.multiple ? 'multiple' : undefined}
          options={field.options?.options?.map((opt: string) => ({
            label: opt,
            value: opt
          }))}
        />
      );
    
    default:
      return <Input />;
  }
};
```

## نصائح مهمة

1. **استخدم TypeScript**: تأكد من تعريف الأنواع بشكل صحيح
2. **اتبع نمط التسمية**: استخدم `[FieldType]FieldOptions.tsx`
3. **أضف التحقق من الصحة**: استخدم `rules` في Form.Item
4. **اختبر التكامل**: تأكد من أن البيانات تُحفظ وتُسترجع بشكل صحيح
5. **وثق التغييرات**: أضف تعليقات وتوثيق للمكونات الجديدة