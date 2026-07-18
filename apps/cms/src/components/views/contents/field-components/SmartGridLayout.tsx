import React from 'react';
import { Row, Col } from 'antd';
import { EnFieldType } from "@/abstracts/modules/module-input";
import { IField } from "@/types/page";
import GridLayout, { FieldsGridContainer } from './GridLayout';

interface SmartGridLayoutProps {
  fields: IField[];
  children: React.ReactNode[];
}

interface FieldCategory {
  primary: IField[];      // Text, Number, etc. - Top priority
  secondary: IField[];    // TextArea, List, Link - Medium priority  
  media: IField[];        // Image, Gallery - Visual content
  rich: IField[];         // Editor - Full width content
}

const SmartGridLayout: React.FC<SmartGridLayoutProps> = ({ fields, children }) => {
  // Categorize fields by type and importance
  const categorizeFields = (fields: IField[]): FieldCategory => {
    const categories: FieldCategory = {
      primary: [],
      secondary: [],
      media: [],
      rich: []
    };

    fields.forEach(field => {
      switch (field.fieldType as EnFieldType) {
        case EnFieldType.text:
        case EnFieldType.number:
        case EnFieldType.moneyFormat:
        case EnFieldType.percentage:
          categories.primary.push(field);
          break;

        case EnFieldType.textArea:
        case EnFieldType.list:
        case EnFieldType.link:
          categories.secondary.push(field);
          break;

        case EnFieldType.image:
        case EnFieldType.gallary:
          categories.media.push(field);
          break;

        case EnFieldType.editor:
          categories.rich.push(field);
          break;

        default:
          categories.primary.push(field);
      }
    });

    return categories;
  };

  const categories = categorizeFields(fields);

  // Create field index mapping
  const fieldIndexMap = new Map<number, number>();
  fields.forEach((field, index) => {
    fieldIndexMap.set(field.id, index);
  });

  const getChildByFieldId = (fieldId: number) => {
    const index = fieldIndexMap.get(fieldId);
    return index !== undefined ? children[index] : null;
  };

  const renderFieldGroup = (
    groupFields: IField[],
    groupName: string,
    containerClass: string,
    itemClass: string
  ) => {
    if (groupFields.length === 0) return null;

    return (
      <div className={`field-group ${containerClass}`} key={groupName}>
        <FieldsGridContainer>
          {groupFields.map((field) => {
            const child = getChildByFieldId(field.id);
            if (!child) return null;
            return child;
          })}
        </FieldsGridContainer>
      </div>
    );
  };

  return (
    <div className="smart-grid-container">
      {/* Primary Fields - Top Section */}
      {renderFieldGroup(
        categories.primary,
        'primary',
        '',
        'primary-field-item'
      )}

      {/* Secondary Fields - Middle Section */}
      {renderFieldGroup(
        categories.secondary,
        'secondary',
        'secondary-fields-section',
        'secondary-field-item'
      )}

      {/* Media Fields - Visual Section */}
      {renderFieldGroup(
        categories.media,
        'media',
        'media-fields-section',
        'media-field-item'
      )}

      {/* Rich Content Fields - Bottom Section */}
      {renderFieldGroup(
        categories.rich,
        'rich',
        'rich-fields-section',
        'rich-field-item'
      )}
    </div>
  );
};

export default SmartGridLayout;