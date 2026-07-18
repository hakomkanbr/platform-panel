import React from 'react';
import { IField } from "@/types/page";
import FieldRenderer from './field-components/FieldRenderer';
import SmartGridLayout from './field-components/SmartGridLayout';
import './field-components/FieldComponents.css';
import './field-components/SmartGrid.css';
import { EnFieldType } from '@/abstracts/modules/module-input';

interface FeedInputsProps {
  fields: IField[] | undefined;
}

const FeedInputs: React.FC<FeedInputsProps> = ({ fields }) => {
  if (!fields || fields.length === 0) {
    return (
      <div className="no-fields-container">
        <div className="no-fields-content">
          <div className="no-fields-icon">📝</div>
          <h3 className="no-fields-title">No Fields Available</h3>
          <p className="no-fields-description">
            Please add some fields to this module to start collecting data.
          </p>
          <div className="no-fields-suggestion">
            <span>💡 Tip: Go to module settings to add fields</span>
          </div>
        </div>
      </div>
    );
  }

  // Get all slug fields for reference
  const slugFields = fields.filter(i => i.fieldType == EnFieldType.slug);

  // Render all field components
  const fieldComponents = fields.map((field: IField, index: number) => (
    <FieldRenderer
      key={field.id || `field-${index}`}
      field={field}
      slugfields={slugFields}
      index={index}
    />
  ));

  return (
    <div className="feed-inputs-container">
      <SmartGridLayout fields={fields}>
        {fieldComponents}
      </SmartGridLayout>
    </div>
  );
};

export default FeedInputs;