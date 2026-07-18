import React from 'react';
import Editor from "@/components/elements/editor/editor";
import { FieldProps } from '@/components/views/contents/field-components';

const EditorField: React.FC<FieldProps> = ({ field, options }) => {
  return (
    <div 
      style={{
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
      className="custom-editor-field"
    >
      <Editor />
      {options.helpText && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fafafa',
          borderTop: '1px solid #f0f0f0',
          fontSize: '12px',
          color: '#8c8c8c'
        }}>
          {options.helpText}
        </div>
      )}
    </div>
  );
};

export default EditorField;