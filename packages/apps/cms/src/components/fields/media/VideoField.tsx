import React from 'react';
import { Upload, Button } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import { FieldProps } from '@/components/views/contents/field-components';

const VideoField: React.FC<FieldProps> = ({ field, options }) => {
  return (
    <Upload
      accept="video/*"
      listType="picture"
    >
      <Button icon={<VideoCameraOutlined />}>
        {field.placeholder || 'Upload Video'}
      </Button>
    </Upload>
  );
};

export default VideoField;