import React, { useEffect, useState } from 'react';
import { Upload, message, Form } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { FieldProps } from './index';

const ImageField: React.FC<FieldProps> = ({ field, options }) => {
  const form = Form.useFormInstance();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Initialize fileList from existing form value (string file name)
  useEffect(() => {
    const value = form.getFieldValue(field.fieldSlug);
    if (typeof value === 'string' && value) {
      setFileList([
        {
          uid: '-1',
          name: value,
          url: value, // Assume value is a CDN/full URL; adjust if it's a plain filename
          status: 'done',
        },
      ]);
    }
  }, [form, field.fieldSlug]);

  const beforeUpload = (file: File) => {
    const isValidFormat = options.allowedFormats
      ? options.allowedFormats.some((format: string) => file.type.includes(format))
      : file.type.startsWith('image/');

    if (!isValidFormat) {
      message.error('Please upload a valid image format!');
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newList }) => {
    setFileList(newList);
    const first = newList[0];
    const name = first?.response?.name ?? first?.name ?? '';
    form.setFieldValue(field.fieldSlug, name);
  };

  const uploadButton = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      color: '#8c8c8c'
    }}>
      <CameraOutlined style={{ fontSize: '32px', marginBottom: '8px', color: '#40a9ff' }} />
      <div style={{ fontSize: '14px', fontWeight: 500 }}>Upload Image</div>
      <div style={{ fontSize: '12px', marginTop: '4px' }}>
        {options.allowedFormats ? options.allowedFormats.join(', ') : 'JPG, PNG, GIF'}
      </div>
    </div>
  );

  return (
    <Upload
      listType="picture-card"
      maxCount={1}
      beforeUpload={beforeUpload}
      accept={options.allowedFormats
        ? options.allowedFormats.map((f: string) => `.${f}`).join(',')
        : 'image/*'}
      style={{ width: '100%' }}
      className="custom-image-upload"
      fileList={fileList}
      onChange={onChange}
      customRequest={() => { /* let higher-level UploadImage handle upload if used; otherwise plug API here */ }}
    >
      {fileList.length >= 1 ? null : uploadButton}
    </Upload>
  );
};

export default ImageField;