import React from 'react';
import { Form } from 'antd';

export interface BaseFieldOptionsProps {
  fieldType: string;
  form: any;
  children?: React.ReactNode;
}

export interface FieldOption {
  name: string;
  label: string;
  component: React.ReactNode;
  rules?: any[];
}

export const BaseFieldOptions: React.FC<BaseFieldOptionsProps> = ({ children }) => {
  return <>{children}</>;
};

export default BaseFieldOptions;