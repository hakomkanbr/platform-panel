import React from 'react';
import { Input } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

interface ColorFieldProps extends FieldProps {
  value?: string;
  onChange?: (value: string) => void;
}

// Function to convert color to hex format
const convertToHex = (color: string): string => {
  if (!color) return '#000000';
  
  // If already hex format, return as is
  if (color.startsWith('#')) {
    return color.length === 7 ? color : '#000000';
  }
  
  // If rgb format, convert to hex
  if (color.startsWith('rgb')) {
    const rgbMatch = color.match(/\d+/g);
    if (rgbMatch && rgbMatch.length >= 3) {
      const r = parseInt(rgbMatch[0]).toString(16).padStart(2, '0');
      const g = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
      const b = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
  }
  
  // Default fallback
  return '#000000';
};

const ColorField: React.FC<ColorFieldProps> = ({ field, options, value, onChange }) => {
  const hexValue = convertToHex(value || '');
  console.info(`ColorField ${field.fieldSlug} received value:`, value, 'converted to hex:', hexValue);
  
  return (
    <Input
      type="color"
      value={hexValue}
      onChange={(e: any) => {
        console.info(`ColorField ${field.fieldSlug} onChange:`, e?.target?.value);
        onChange?.(e?.target?.value);
      }}
      placeholder={field.placeholder || 'Select color'}
      style={{ width: '60px', height: '40px' }}
    />
  );
};

export default ColorField;