"use client";

import React from 'react';
import { Card, Tag, Descriptions, Empty } from 'antd';
import { IPageBlock } from '@/types/page';

interface ModulePreviewProps {
  modules: IPageBlock[];
}

const ModulePreview: React.FC<ModulePreviewProps> = ({ modules }) => {
  if (modules.length === 0) {
    return (
      <Card title="معاينة الوحدات">
        <Empty description="لم يتم اختيار أي وحدات بعد" />
      </Card>
    );
  }

  return (
    <Card title="معاينة Selected units">
      {modules.map((module, index) => (
        <Card
          key={module.id}
          size="small"
          style={{ marginBottom: 16 }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>#{index + 1}</span>
              <span>{module.moduleName}</span>
              {module.isSingleton && (
                <Tag color="blue">Singleton</Tag>
              )}
            </div>
          }
        >
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="اسم الوحدة">
              {module.moduleName}
            </Descriptions.Item>
            <Descriptions.Item label="الرمز المختصر">
              {module.moduleSlug}
            </Descriptions.Item>
            <Descriptions.Item label="الترتيب">
              {module.order + 1}
            </Descriptions.Item>
            {module.isSingleton && module.fieldValues && (
              <Descriptions.Item label="القيم المكونة">
                <div style={{ maxHeight: 100, overflow: 'auto' }}>
                  {Object.keys(module.fieldValues).length > 0 ? (
                    <pre style={{ fontSize: '12px', margin: 0 }}>
                      {JSON.stringify(module.fieldValues, null, 2)}
                    </pre>
                  ) : (
                    <span style={{ color: '#999' }}>لم يتم تكوين القيم بعد</span>
                  )}
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      ))}
    </Card>
  );
};

export default ModulePreview;