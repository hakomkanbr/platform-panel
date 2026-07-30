"use client";

import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import { FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import CreateUpdatePageView from './create-update';
import ModulePreview from './ModulePreview';
import { IPageBlock } from '@/types/page';

const { TabPane } = Tabs;

interface PageManagerProps {
  isEdit?: boolean;
  pageId?: number;
}

const PageManager: React.FC<PageManagerProps> = ({ isEdit = false, pageId }) => {
  const [selectedModules, setSelectedModules] = useState<IPageBlock[]>([]);
  const [activeTab, setActiveTab] = useState('form');

  const handleModulesChange = (modules: IPageBlock[]) => {
    setSelectedModules(modules);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        size="large"
      >
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              {isEdit ? 'Edit Page' : 'إنشاء صفحة'}
            </span>
          }
          key="form"
        >
          <CreateUpdatePageView />
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <EyeOutlined />
              معاينة الوحدات ({selectedModules.length})
            </span>
          }
          key="preview"
        >
          <ModulePreview modules={selectedModules} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PageManager;