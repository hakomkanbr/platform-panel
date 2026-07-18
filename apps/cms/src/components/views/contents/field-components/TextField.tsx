import React, { useCallback } from 'react';
import { Form, Input } from 'antd';
import { FieldProps, commonFieldStyles } from './index';
import { generateSlugFromTitle } from '@/utils/pageValidation';

const TextField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  const form = Form.useFormInstance();

  // useCallback دائمًا هنا
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (onChange) onChange(e);

    if (options.relatedFieldSlug && form) {
      const generatedSlug = generateSlugFromTitle(inputValue);
      setTimeout(() => {
        form.setFieldsValue({ [options.relatedFieldSlug]: generatedSlug });
        form.setFields([{ name: options.relatedFieldSlug, value: generatedSlug }]);
      }, 0);
    }
  }, [form, options.relatedFieldSlug, onChange]);

  // التحقق من وجود form بعد تعريف handleChange
  if (!form) {
    console.error("Form instance not found in TextField");
    return null;
  }

  return (
    <Input
      value={value}
      placeholder={options.placeholder || field.placeholder || `Enter ${field.name.toLowerCase()}`}
      minLength={options.minLength}
      maxLength={options.maxLength}
      onChange={handleChange}
      style={{
        ...commonFieldStyles,
        height: '42px',
        padding: '8px 16px'
      }}
      className="custom-text-field"
    />
  );
};

export default TextField;