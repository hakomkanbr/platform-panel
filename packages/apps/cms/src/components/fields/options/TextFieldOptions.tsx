import React from 'react';
import { BaseFieldOptionsProps } from './BaseFieldOptions';
import { 
  FieldOptionsContainer, 
  StyledFieldItem, 
  StyledInput, 
  StyledInputNumber, 
  StyledSwitch 
} from './StyledFieldOptions';

const TextFieldOptions: React.FC<BaseFieldOptionsProps> = ({ form }) => {
  return (
    <FieldOptionsContainer>
      <StyledFieldItem name="minLength" label="Minimum Length" span={12}>
        <StyledInputNumber min={0} placeholder="Optional" />
      </StyledFieldItem>
      
      <StyledFieldItem name="maxLength" label="Maximum Length" span={12}>
        <StyledInputNumber min={0} placeholder="Optional" />
      </StyledFieldItem>
      
      <StyledFieldItem name="defaultValue" label="Default Value">
        <StyledInput placeholder="Optional" />
      </StyledFieldItem>
      
      <StyledFieldItem name="placeholder" label="Placeholder Text">
        <StyledInput placeholder="Enter placeholder text" />
      </StyledFieldItem>
      
      <StyledFieldItem name="required" label="Required Field" valuePropName="checked">
        <StyledSwitch label="Make this field mandatory" />
      </StyledFieldItem>
    </FieldOptionsContainer>
  );
};

export default TextFieldOptions;