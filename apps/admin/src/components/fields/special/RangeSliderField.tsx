import React from 'react';
import { Slider } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

// Controlled so Form can manage value and prefill
const RangeSliderField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {
  const min = options.minValue || 0;
  const max = options.maxValue || 100;
  const step = options.step || 1;

  return (
    <Slider
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange as any}
    />
  );
};

export default RangeSliderField;