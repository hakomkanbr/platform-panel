import React from 'react';
import { Select, Tag } from 'antd';
import { TagsOutlined, PlusOutlined } from '@ant-design/icons';
import { FieldProps, commonFieldStyles } from './index';

const ListField: React.FC<FieldProps> = ({ field, options }) => {
  const tagRender = (props: any) => {
    const { label, value, closable, onClose } = props;
    return (
      <Tag
        color="blue"
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
          borderRadius: '6px',
          padding: '2px 8px',
          fontSize: '12px'
        }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <Select
      mode="tags"
      style={{
        width: '100%',
        minHeight: '42px',
        ...commonFieldStyles
      }}
      placeholder={options.placeholder || "Type and press Enter to add items"}
      tokenSeparators={[',']}
      defaultValue={options.defaultValue}
      options={options.predefinedOptions 
        ? options.predefinedOptions.map((opt: string) => ({ 
            label: opt, 
            value: opt,
            icon: <TagsOutlined />
          })) 
        : []
      }
      tagRender={tagRender}
      suffixIcon={<PlusOutlined style={{ color: '#40a9ff' }} />}
      className="custom-list-field"
      dropdownStyle={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    />
  );
};

export default ListField;