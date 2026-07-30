import React from 'react';
import { Switch } from 'antd';
import { FieldProps } from '@/components/views/contents/field-components';

// Controlled Switch so Form can manage value and prefill
const BooleanField: React.FC<FieldProps> = ({ field, options, value, onChange }) => {

  console.info("value bool => ", value);

  return (
    <Switch
      checked={!!value}
      onChange={onChange as any}
      checkedChildren="Yes"
      unCheckedChildren="No"
    />
  );
};

export default BooleanField;