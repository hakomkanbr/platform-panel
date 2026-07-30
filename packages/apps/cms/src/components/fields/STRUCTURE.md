# Fields Structure

تم تنظيم مجلد الحقول إلى مجلدات فرعية لتسهيل القراءة والصيانة:

## 📁 basic/
الحقول النصية الأساسية:
- `TextField.tsx` - حقل النص العادي
- `TextAreaField.tsx` - حقل النص متعدد الأسطر
- `SlugField.tsx` - حقل Short link
- `EmailField.tsx` - حقل البريد الإلكتروني
- `PasswordField.tsx` - حقل كلمة المرور
- `PhoneField.tsx` - حقل رقم الهاتف
- `UrlField.tsx` - حقل الرابط
- `LinkField.tsx` - حقل الرابط المتقدم

## 📁 number/
الحقول الرقمية:
- `NumberField.tsx` - حقل الرقم
- `MoneyField.tsx` - حقل المبلغ المالي
- `PercentageField.tsx` - حقل النسبة المئوية

## 📁 media/
حقول الوسائط:
- `ImageField.tsx` - حقل الصورة
- `GalleryField.tsx` - حقل معرض الصور
- `FileField.tsx` - حقل الملف
- `VideoField.tsx` - حقل الفيديو

## 📁 selection/
حقول الاختيار:
- `SelectField.tsx` - قائمة منسدلة
- `RadioField.tsx` - أزرار الاختيار
- `CheckboxField.tsx` - مربعات الاختيار

## 📁 datetime/
حقول التاريخ والوقت:
- `DateField.tsx` - حقل التاريخ
- `TimeField.tsx` - حقل الوقت
- `DateTimeField.tsx` - حقل التاريخ والوقت

## 📁 special/
الحقول الخاصة:
- `ColorField.tsx` - حقل اللون
- `RangeSliderField.tsx` - شريط التمرير
- `BooleanField.tsx` - حقل منطقي (صح/خطأ)

## 📁 advanced/
الحقول المتقدمة:
- `EditorField.tsx` - محرر النصوص المتقدم
- `HtmlField.tsx` - حقل HTML
- `ListField.tsx` - حقل القائمة

## 📁 options/
ملفات خيارات الحقول:
- جميع ملفات `*FieldOptions.tsx`
- `BaseFieldOptions.tsx` - الخيارات الأساسية

## 📁 core/
الملفات الأساسية:
- `FieldPreview.tsx` - معاينة الحقل
- `FieldOptionsRenderer.tsx` - عارض خيارات الحقل
- `fieldTypesConfig.ts` - إعدادات أنواع الحقول

## 🔄 الاستيراد
يمكن استيراد الحقول من الملف الرئيسي:
```typescript
import { TextField, NumberField, ImageField } from '@/components/fields';
```

أو من المجلدات الفرعية مباشرة:
```typescript
import { TextField } from '@/components/fields/basic';
import { NumberField } from '@/components/fields/number';
```