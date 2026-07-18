import React, { useEffect, useState } from 'react';
import { Upload, message, Form } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { FieldProps } from '@/components/views/contents/field-components';

const GalleryField: React.FC<FieldProps> = ({ field, options }) => {
  const form = Form.useFormInstance();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Initialize fileList from existing form value
  useEffect(() => {
    const raw = form.getFieldValue(field.fieldSlug);
    let values: string[] = [];

    if (Array.isArray(raw)) {
      values = raw as string[];
    } else if (typeof raw === 'string' && raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) values = parsed as string[];
      } catch {
        // fallback: single item string or comma-separated
        values = raw.includes(',') ? raw.split(',').map(s => s.trim()) : [raw];
      }
    }

    if (values.length > 0) {
      const initial: UploadFile[] = values.map((name, idx) => ({
        uid: `${idx}`,
        name,
        url: name, // Assume name could be a full URL; adjust if it's filename-only
        status: 'done',
      }));
      setFileList(initial);
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
      message.error('Each image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newList }) => {
    setFileList(newList);
    const names = newList.map((f) => f.response?.name ?? f.name).filter(Boolean) as string[];
    form.setFieldValue(field.fieldSlug, names);
  };

  const uploadButton = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      color: '#8c8c8c'
    }}>
      <PictureOutlined style={{ fontSize: '32px', marginBottom: '8px', color: '#722ed1' }} />
      <div style={{ fontSize: '14px', fontWeight: 500 }}>Upload Gallery</div>
      <div style={{ fontSize: '12px', marginTop: '4px' }}>
        Max {options.maxImages || 10} images
      </div>
      <div style={{ fontSize: '12px', color: '#bfbfbf' }}>
        {options.allowedFormats ? options.allowedFormats.join(', ') : 'JPG, PNG, GIF'}
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <Upload
        listType="picture-card"
        multiple
        maxCount={options.maxImages || 10}
        beforeUpload={beforeUpload}
        accept={options.allowedFormats
          ? options.allowedFormats.map((f: string) => `.${f}`).join(',')
          : 'image/*'
        }
        className="custom-gallery-upload"
        style={{ width: '100%' }}
        fileList={fileList}
        onChange={onChange}
        customRequest={() => { /* integrate upload API here if needed */ }}
      >
        {uploadButton}
      </Upload>
      <div style={{
        fontSize: '12px',
        color: '#8c8c8c',
        marginTop: '8px',
        textAlign: 'center'
      }}>
        You can upload multiple images at once
      </div>
    </div>
  );
};

export default GalleryField;