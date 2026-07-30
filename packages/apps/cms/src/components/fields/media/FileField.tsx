import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FieldProps } from '@/components/views/contents/field-components';

const FileField: React.FC<FieldProps> = ({ field, options }) => {
  return (
    <Upload>
      <Button icon={<UploadOutlined />}>
        {field.placeholder || 'Click to Upload'}
      </Button>
    </Upload>
  );
};

export default FileField;