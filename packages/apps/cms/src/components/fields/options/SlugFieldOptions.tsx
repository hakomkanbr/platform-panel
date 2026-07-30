import React from 'react';
import { BaseFieldOptionsProps } from './BaseFieldOptions';
import {
  FieldOptionsContainer,
  StyledFieldItem,
  StyledInput,
  StyledSwitch,
} from './StyledFieldOptions';

const SlugFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <FieldOptionsContainer>
      <StyledFieldItem rules={[{ required: true }]} name="relatedFieldSlug" label="related Field Slug" span={12}>
        <StyledInput placeholder="Required" />
      </StyledFieldItem>
    </FieldOptionsContainer>
  );
};

export default SlugFieldOptions;