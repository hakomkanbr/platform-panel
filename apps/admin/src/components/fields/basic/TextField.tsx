import React, { useCallback } from 'react';
import { Form, Input } from 'antd';
import { generateSlugFromTitle } from '@/utils/pageValidation';
import { FieldProps } from '@/components/views/contents/field-components';

const TextField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  const form = Form.useFormInstance();
  
  // دالة للتعامل مع تغيير القيمة
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // استدعاء onChange الأصلي إذا كان موجوداً
    if (onChange) {
      onChange(e);
    }

    // فقط إذا هناك relatedFieldSlug
    if (options.relatedFieldSlug) {
      const generatedSlug = generateSlugFromTitle(inputValue);
      
      try {
        // استخدام setTimeout للتأكد من أن التحديث يحدث بعد render
        setTimeout(() => {
          form.setFieldsValue({
            [options.relatedFieldSlug]: generatedSlug
          });
          console.info("Successfully set field value for:", options.relatedFieldSlug);
          
          // التحقق من أن القيمة تم تعيينها بالفعل
          const currentValues = form.getFieldsValue();
          console.info("Current form values after update:", currentValues);
          
          // إجبار إعادة رسم الحقل المرتبط
          form.setFields([{
            name: options.relatedFieldSlug,
            value: generatedSlug
          }]);
        }, 0);
      } catch (error) {
        console.error("Error setting field value:", error);
      }
    } else {
      console.warn("No relatedFieldSlug specified for this field");
    }
  }, [form, options.relatedFieldSlug, onChange]);

  return (
    <Input
      value={value}
      placeholder={options.placeholder || field.placeholder || `Enter ${field.name.toLowerCase()}`}
      minLength={options.minLength}
      maxLength={options.maxLength}
      onChange={handleChange}
      // defaultValue={options.defaultValue}
      style={{
        height: '42px',
        padding: '8px 16px'
      }}
      className="custom-text-field"
    />
  );
};

export default TextField;